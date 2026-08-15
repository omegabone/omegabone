/**
 * Claude selection pass — one call per segment.
 */

import Anthropic from '@anthropic-ai/sdk';
import {
  AWARENESS_KEYS,
  HIGH_VALUE_KEYS,
  CTAS,
  TOPICS,
  DEFAULTS,
} from './config.mjs';
import { SYSTEM_PROMPT, buildUserMessage } from './prompt.mjs';

const CANDIDATE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: [
    'full_quote',
    'why_it_hooks',
    'suggested_caption',
    'primary_category',
    'high_value_type',
    'topic',
    'cta',
    'start_time',
    'end_time',
    'self_contained',
    'authority',
    'clarity',
    'emotional_impact',
    'standalone_value',
    'filler_risk',
    'score',
  ],
  properties: {
    full_quote: {
      type: 'string',
      description: 'Verbatim transcript span for the clip, speaker labels included.',
    },
    why_it_hooks: {
      type: 'string',
      description: 'One sentence on why this works as social content.',
    },
    suggested_caption: {
      type: 'string',
      description: 'Short punchy caption in the coach’s voice. No hashtags, no emoji.',
    },
    primary_category: {
      type: 'string',
      enum: AWARENESS_KEYS,
      description: 'Exactly one core awareness category.',
    },
    high_value_type: {
      anyOf: [{ type: 'string', enum: HIGH_VALUE_KEYS }, { type: 'null' }],
      description: 'Optional secondary tag, or null when none applies strongly.',
    },
    topic: { type: 'string', enum: TOPICS },
    cta: { type: 'string', enum: CTAS },
    start_time: {
      anyOf: [{ type: 'number' }, { type: 'null' }],
      description: 'Clip start in seconds, or null when the source has no timecodes.',
    },
    end_time: {
      anyOf: [{ type: 'number' }, { type: 'null' }],
      description: 'Clip end in seconds, or null when the source has no timecodes.',
    },
    self_contained: {
      type: 'boolean',
      description: 'True only if understandable with no other context.',
    },
    authority: { type: 'integer', description: '0-100. Command and credibility.' },
    clarity: { type: 'integer', description: '0-100. Is the teaching point unmistakable.' },
    emotional_impact: { type: 'integer', description: '0-100.' },
    standalone_value: { type: 'integer', description: '0-100. Worth watching alone.' },
    filler_risk: {
      type: 'integer',
      description: '0-100. Higher means more rambling or filler. Lower is better.',
    },
    score: { type: 'integer', description: '0-100 overall. Reserve 90+ for the very best.' },
  },
};

const RESPONSE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['candidates'],
  properties: {
    candidates: {
      type: 'array',
      description: 'Best first. Empty when the segment contains no clip worth cutting.',
      items: CANDIDATE_SCHEMA,
    },
  },
};

/** Extract the JSON text block from a Messages response. */
function readJson(response) {
  const block = response.content.find((b) => b.type === 'text');
  if (!block) return { candidates: [] };
  try {
    return JSON.parse(block.text);
  } catch {
    throw new Error(`Model returned unparseable JSON: ${block.text.slice(0, 300)}`);
  }
}

function isFallbackUnsupported(err) {
  const msg = String(err?.message || '');
  return (
    err?.status === 400 &&
    /fallback|beta|unsupported|unknown|not.*allowed/i.test(msg)
  );
}

/**
 * Score a single segment. Returns an array of candidate objects, best first.
 */
export async function selectFromSegment(client, lesson, segment, opts = {}) {
  const model = opts.model ?? DEFAULTS.model;
  const effort = opts.effort ?? DEFAULTS.effort;
  const maxTokens = opts.maxTokens ?? DEFAULTS.maxTokens;

  const base = {
    model,
    max_tokens: maxTokens,
    system: SYSTEM_PROMPT,
    thinking: { type: 'adaptive' },
    output_config: {
      effort,
      format: { type: 'json_schema', schema: RESPONSE_SCHEMA },
    },
    messages: [{ role: 'user', content: buildUserMessage(lesson, segment, opts) }],
  };

  let response;
  if (opts.fallbacks === false) {
    response = await client.messages.create(base);
  } else {
    try {
      response = await client.beta.messages.create({
        ...base,
        betas: ['server-side-fallback-2026-07-01'],
        fallbacks: 'default',
      });
    } catch (err) {
      if (!isFallbackUnsupported(err)) throw err;
      // Account or endpoint does not have the fallback beta — proceed without it.
      response = await client.messages.create(base);
    }
  }

  if (response.stop_reason === 'refusal') {
    const category = response.stop_details?.category ?? 'unspecified';
    throw new Error(`Model declined segment ${segment.index} (category: ${category}).`);
  }

  const parsed = readJson(response);
  const candidates = Array.isArray(parsed.candidates) ? parsed.candidates : [];

  return candidates.map((c, i) => ({
    ...c,
    segmentIndex: segment.index,
    segmentRank: i,
    segment,
  }));
}

/** Run `worker` across `items` with bounded concurrency, preserving order. */
export async function mapWithConcurrency(items, limit, worker) {
  const results = new Array(items.length);
  let cursor = 0;

  async function run() {
    while (cursor < items.length) {
      const i = cursor++;
      results[i] = await worker(items[i], i);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, () => run()),
  );
  return results;
}

export function createClient() {
  // Resolves ANTHROPIC_API_KEY, ANTHROPIC_AUTH_TOKEN, or an `ant auth login` profile.
  return new Anthropic();
}
