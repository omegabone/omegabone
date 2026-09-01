/**
 * Alternate model providers.
 *
 * Claude is the default selector (see select.mjs). Kimi, DeepSeek, ChatGPT and
 * Hermes all expose an OpenAI-compatible /chat/completions endpoint, so one
 * adapter serves them all — only the base URL, API key and model id differ.
 *
 * Model IDs move frequently. The defaults below are a starting point; override
 * with --model whenever a provider ships a newer one.
 */

import { AWARENESS_KEYS, HIGH_VALUE_KEYS, CTAS, TOPICS } from './config.mjs';
import { SYSTEM_PROMPT, buildUserMessage } from './prompt.mjs';

export const PROVIDERS = {
  claude: {
    label: 'Claude',
    native: true,
    defaultModel: 'claude-opus-5',
    envKeys: ['ANTHROPIC_API_KEY', 'ANTHROPIC_AUTH_TOKEN'],
  },
  kimi: {
    label: 'Kimi (Moonshot)',
    baseUrl: 'https://api.moonshot.ai/v1',
    defaultModel: 'kimi-k2-0905-preview',
    envKeys: ['MOONSHOT_API_KEY', 'KIMI_API_KEY'],
  },
  deepseek: {
    label: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    defaultModel: 'deepseek-chat',
    envKeys: ['DEEPSEEK_API_KEY'],
  },
  chatgpt: {
    label: 'ChatGPT (OpenAI)',
    baseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o',
    envKeys: ['OPENAI_API_KEY'],
  },
  hermes: {
    label: 'Hermes (Nous Research)',
    baseUrl: 'https://inference-api.nousresearch.com/v1',
    defaultModel: 'Hermes-4-405B',
    envKeys: ['NOUS_API_KEY', 'HERMES_API_KEY'],
  },
  openrouter: {
    label: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    defaultModel: 'nousresearch/hermes-4-405b',
    envKeys: ['OPENROUTER_API_KEY'],
  },
};

const JSON_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['candidates'],
  properties: {
    candidates: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: [
          'full_quote', 'why_it_hooks', 'suggested_caption', 'primary_category',
          'high_value_type', 'topic', 'cta', 'start_time', 'end_time',
          'self_contained', 'authority', 'clarity', 'emotional_impact',
          'standalone_value', 'filler_risk', 'score',
        ],
        properties: {
          full_quote: { type: 'string' },
          why_it_hooks: { type: 'string' },
          suggested_caption: { type: 'string' },
          primary_category: { type: 'string', enum: AWARENESS_KEYS },
          high_value_type: { type: ['string', 'null'], enum: [...HIGH_VALUE_KEYS, null] },
          topic: { type: 'string', enum: TOPICS },
          cta: { type: 'string', enum: CTAS },
          start_time: { type: ['number', 'null'] },
          end_time: { type: ['number', 'null'] },
          self_contained: { type: 'boolean' },
          authority: { type: 'integer' },
          clarity: { type: 'integer' },
          emotional_impact: { type: 'integer' },
          standalone_value: { type: 'integer' },
          filler_risk: { type: 'integer' },
          score: { type: 'integer' },
        },
      },
    },
  },
};

function resolveKey(provider) {
  for (const name of PROVIDERS[provider].envKeys) {
    if (process.env[name]) return process.env[name];
  }
  return null;
}

export function providerStatus() {
  return Object.entries(PROVIDERS).map(([key, p]) => ({
    key,
    label: p.label,
    model: p.defaultModel,
    keyPresent: Boolean(resolveKey(key)),
    envKeys: p.envKeys,
  }));
}

function stripCodeFence(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  return (fenced ? fenced[1] : text).trim();
}

/** Pull the first balanced JSON object out of a noisy completion. */
function extractJson(text) {
  const cleaned = stripCodeFence(text);
  try {
    return JSON.parse(cleaned);
  } catch {
    /* fall through */
  }
  const start = cleaned.indexOf('{');
  if (start === -1) throw new Error(`No JSON in response: ${cleaned.slice(0, 200)}`);
  let depth = 0;
  for (let i = start; i < cleaned.length; i++) {
    if (cleaned[i] === '{') depth++;
    else if (cleaned[i] === '}') {
      depth--;
      if (depth === 0) return JSON.parse(cleaned.slice(start, i + 1));
    }
  }
  throw new Error(`Unbalanced JSON in response: ${cleaned.slice(0, 200)}`);
}

async function postChat(provider, body, { timeoutMs = 180000 } = {}) {
  const cfg = PROVIDERS[provider];
  const key = resolveKey(provider);
  if (!key) {
    throw new Error(
      `No API key for ${cfg.label}. Set one of: ${cfg.envKeys.join(', ')}`,
    );
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${cfg.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${key}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) {
      const detail = await res.text();
      const err = new Error(`${cfg.label} ${res.status}: ${detail.slice(0, 400)}`);
      err.status = res.status;
      throw err;
    }
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Select candidates from one segment using an OpenAI-compatible provider.
 * Mirrors the return shape of selectFromSegment() in select.mjs.
 */
export async function selectFromSegmentOpenAICompatible(
  provider,
  lesson,
  segment,
  opts = {},
) {
  const model = opts.model || PROVIDERS[provider].defaultModel;
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    {
      role: 'user',
      content: `${buildUserMessage(lesson, segment, opts)}

Respond with a single JSON object matching this schema, and nothing else:
${JSON.stringify(JSON_SCHEMA, null, 2)}`,
    },
  ];

  const strict = {
    model,
    messages,
    max_tokens: opts.maxTokens ?? 8000,
    response_format: {
      type: 'json_schema',
      json_schema: { name: 'clip_candidates', strict: true, schema: JSON_SCHEMA },
    },
  };

  let data;
  try {
    data = await postChat(provider, strict);
  } catch (err) {
    // Providers that do not implement json_schema fall back to json_object;
    // the schema is already restated in the prompt above.
    if (err.status !== 400 && err.status !== 404 && err.status !== 422) throw err;
    data = await postChat(provider, {
      model,
      messages,
      max_tokens: opts.maxTokens ?? 8000,
      response_format: { type: 'json_object' },
    });
  }

  const text = data?.choices?.[0]?.message?.content ?? '';
  const parsed = extractJson(text);
  const candidates = Array.isArray(parsed.candidates) ? parsed.candidates : [];

  return candidates.map((c, i) => ({
    ...c,
    segmentIndex: segment.index,
    segmentRank: i,
    segment,
  }));
}
