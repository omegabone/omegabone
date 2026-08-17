/**
 * Offline heuristic selector.
 *
 * This exists so the pipeline can be exercised end to end — parsing,
 * segmentation, enforcement, output — without spending API calls, and so the
 * enforcement rules can be unit-tested deterministically.
 *
 * It is a smoke-test scorer, not a substitute for the model. It matches
 * keywords; it cannot judge whether a thought is complete.
 */

import { TOPICS, CTA_BY_AWARENESS, DEFAULTS, countWords } from './config.mjs';

const SIGNALS = {
  solution_aware: [
    'raise your eyebrows', 'lip buzz', 'breath', 'support', 'soft palate',
    'vowel', 'diaphragm', 'exercise', 'try this', 'do it like', 'the way you',
  ],
  problem_aware: [
    "i can't", 'i cannot', 'struggle', 'nervous', 'scared', 'afraid',
    'i feel', 'hard for me', 'lost', 'confidence', "couldn't",
  ],
  brand_aware: [
    'i believe', 'in my years', "i've taught", 'philosophy', 'never really',
    'the truth is', 'what i do', 'my job',
  ],
  product_aware: [
    'book a session', 'book a', 'sign up', 'the course', 'lesson',
    'next class', 'cohort', 'omegabone.com', 'welcome to',
  ],
  unaware: [
    "you don't realise", "you don't realize", "you didn't know",
    "you're not aware", 'what you have', 'potential',
  ],
};

// Unprompted student praise — social proof, not a teaching moment. Checked
// separately from SIGNALS: a testimonial can land inside any awareness
// category, so it is the optional high_value_type tag, not a category of
// its own.
const TESTIMONIAL_SIGNALS = [
  'best decision', 'changed my life', 'life changing', 'life-changing',
  'so grateful', 'i love this', 'i love your', 'highly recommend',
  'recommend this', 'recommend you', 'worth every', 'best class', 'best coach',
  "i'm so glad", 'thank you so much', 'amazing experience', 'exceeded my',
  'game changer', 'game-changer', 'transformed my', "can't thank you enough",
  'best investment', 'best class i', 'so happy i', 'glad i did this',
];

const TOPIC_SIGNALS = {
  'Vocal Technique & Breath': ['breath', 'palate', 'vowel', 'buzz', 'diaphragm', 'pitch'],
  'Audience Connection & Stage Presence': ['audience', 'stage', 'perform', 'room'],
  'Overcoming Fear & Nerves': ['afraid', 'scared', 'nervous', 'fear'],
  'Sports & Athletic Metaphors': ['runner', 'athlete', 'training', 'olympic', 'muscle'],
  'Practice & Learning Process': ['practice', 'repeat', 'every day', 'exercise'],
  'Empowerment & Confidence': ['confidence', 'confident', 'own it', 'powerful'],
};

function scoreText(text, terms) {
  const lower = text.toLowerCase();
  return terms.reduce((n, t) => (lower.includes(t) ? n + 1 : n), 0);
}

function pickBest(map, text, fallback) {
  let best = fallback;
  let bestScore = 0;
  for (const [key, terms] of Object.entries(map)) {
    const s = scoreText(text, terms);
    if (s > bestScore) {
      best = key;
      bestScore = s;
    }
  }
  return { key: best, score: bestScore };
}

/** Build candidate windows from a segment's units and score them. */
export function selectOffline(lesson, segment, opts = {}) {
  const wpm = opts.wpm ?? DEFAULTS.wpm;
  const minWords = Math.round(((opts.minSeconds ?? DEFAULTS.minSeconds) / 60) * wpm);
  const maxWords = Math.round(((opts.maxSeconds ?? DEFAULTS.maxSeconds) / 60) * wpm);

  const units = segment.units || [segment.text];
  const cues = segment.timed ? segment.cues : null;
  const windows = [];

  for (let i = 0; i < units.length; i++) {
    let words = 0;
    const parts = [];
    for (let j = i; j < units.length; j++) {
      parts.push(units[j]);
      words += countWords(units[j]);
      if (words >= minWords) {
        if (words <= maxWords) {
          windows.push({
            text: parts.join(' '),
            // Carry real boundaries through when the source is timed, so the
            // enforcement pass has something to snap to other than the segment
            // start.
            start: cues ? cues[i].start : null,
            end: cues ? cues[j].end : null,
          });
        }
        break;
      }
    }
  }

  const scored = windows.map(({ text, start, end }) => {
    const cat = pickBest(SIGNALS, text, 'solution_aware');
    const topic = pickBest(TOPIC_SIGNALS, text, 'General Inspiration & Coaching');
    const testimonial = scoreText(text, TESTIMONIAL_SIGNALS);
    const base = 45 + cat.score * 8 + topic.score * 3 + testimonial * 8;
    const complete = /[.!?]["')\]]?\s*$/.test(text.trim()) ? 10 : -15;

    return {
      full_quote: text,
      why_it_hooks: testimonial > 0
        ? 'Heuristic match on testimonial signals — student praise worth posting as social proof (offline mode — not model-judged).'
        : `Heuristic match on ${cat.key.replace(/_/g, ' ')} signals (offline mode — not model-judged).`,
      suggested_caption: text.split(/(?<=[.!?])\s+/)[0].slice(0, 90),
      primary_category: cat.key,
      high_value_type: testimonial > 0 ? 'testimonial' : null,
      topic: TOPICS.includes(topic.key) ? topic.key : 'General Inspiration & Coaching',
      cta: CTA_BY_AWARENESS[cat.key],
      start_time: start,
      end_time: end,
      self_contained: true,
      authority: Math.min(100, base),
      clarity: Math.min(100, base),
      emotional_impact: Math.min(100, base - 5),
      standalone_value: Math.min(100, base + complete),
      filler_risk: complete > 0 ? 10 : 40,
      score: Math.min(100, base + complete),
      segmentIndex: segment.index,
      segment,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, opts.candidatesPerSegment ?? DEFAULTS.candidatesPerSegment);
}
