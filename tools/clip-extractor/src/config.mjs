/**
 * Taxonomies and defaults for the vocal clip extractor.
 *
 * Two taxonomies are in play:
 *   1. The AWARENESS taxonomy (the selection rules) — one per clip, no overlap.
 *   2. The existing sheet taxonomy (Goal/CTA + Topic) — preserved so generated
 *      rows paste straight into the current clip sheet without remapping.
 */

/** Core awareness categories. Exactly ONE is assigned per clip. */
export const AWARENESS_CATEGORIES = {
  unaware: {
    label: 'Unaware',
    definition:
      'The student is not yet conscious of a vocal problem or an unrealized potential. ' +
      'Omega sees something the student cannot see yet.',
  },
  problem_aware: {
    label: 'Problem Aware',
    definition:
      'The student expresses or clearly demonstrates a struggle — names a frustration, ' +
      'hits a wall, or audibly fails at something they are reaching for.',
  },
  solution_aware: {
    label: 'Solution Aware',
    definition:
      'The instructor introduces or demonstrates a technique that solves a vocal problem. ' +
      'The mechanism is shown, not just named.',
  },
  brand_aware: {
    label: 'Brand Aware',
    definition:
      "Highlights the coach's personality, teaching philosophy, a trust-building moment, " +
      'or a visible transformation in the student.',
  },
  product_aware: {
    label: 'Product Aware',
    definition:
      'Shows the structure of a lesson, a before/after result, or a direct offer or CTA.',
  },
};

/** Optional secondary tag. Applied only when the clip is genuinely strong on it. */
export const HIGH_VALUE_TYPES = {
  one_line_correction: 'Short, punchy, memorable instruction.',
  emotional_unlock: 'A clear shift where the student becomes freer or more confident.',
  performance_coaching: 'Guidance on stage presence, expression, or confidence.',
  mistake_reveal: 'Identification of a vocal issue.',
  authority_clip: 'The instructor explains a concept with clarity and authority.',
  testimonial:
    'The student, in their own words, praises the coaching, the results, or the program — ' +
    'unprompted enthusiasm worth posting as social proof, not a moment of technique.',
};

/** Goal / CTA column — exact values already in use in the clip sheet. */
export const CTAS = ['🔵 Watch Lessons', '🟠 Buy Course', '🟢 Book Private Lessons'];

/** Topic column — the established theme vocabulary. Do not invent new ones. */
export const TOPICS = [
  'Vocal Technique & Breath',
  'Practice & Learning Process',
  'Transformation & Student Success Stories',
  'Sports & Athletic Metaphors',
  'General Inspiration & Coaching',
  'Audience Connection & Stage Presence',
  'Mindset & Motivation',
  'Empowerment & Confidence',
  'Mistakes, Myths & Misconceptions',
  'Overcoming Fear & Nerves',
  'The Role of the Singer / Performer Identity',
];

/**
 * Suggested CTA per awareness stage. The model may override with justification;
 * this is the fallback when it does not.
 */
export const CTA_BY_AWARENESS = {
  unaware: '🔵 Watch Lessons',
  problem_aware: '🔵 Watch Lessons',
  solution_aware: '🟠 Buy Course',
  brand_aware: '🔵 Watch Lessons',
  product_aware: '🟢 Book Private Lessons',
};

export const DEFAULTS = {
  model: 'claude-opus-5',
  effort: 'high',
  maxTokens: 16000,

  // Clip length rules. Transcripts in the library sheet carry no timecodes, so
  // duration is estimated from word count at `wpm`. Timestamped sources (SRT/VTT)
  // use real times instead.
  minSeconds: 30,
  maxSeconds: 90,
  wpm: 150,

  // Total clips returned per source video.
  minClips: 5,
  maxClips: 8,

  // One best clip per segment; ask for a few candidates so enforcement has slack.
  candidatesPerSegment: 3,

  // Cap on how many clips may share one awareness category, so a video does not
  // return eight Solution Aware clips.
  maxPerCategory: 2,

  // Target segment size when auto-segmenting an untimed transcript.
  segmentWords: 700,
  minSegmentWords: 200,

  // A clip is "short" at or below this, "long" above it (Clip Type column).
  shortMaxSeconds: 60,

  // Never clip inside this many seconds from the start of a lesson — Omega
  // Bone's sessions open on a fixed music theme before any teaching begins.
  introGuardSeconds: 60,
};

export const AWARENESS_KEYS = Object.keys(AWARENESS_CATEGORIES);
export const HIGH_VALUE_KEYS = Object.keys(HIGH_VALUE_TYPES);

/** Estimated seconds of screen time for a chunk of transcript text. */
export function estimateSeconds(text, wpm = DEFAULTS.wpm) {
  const words = countWords(text);
  return Math.round((words / wpm) * 60);
}

export function countWords(text) {
  return (text || '').trim().split(/\s+/).filter(Boolean).length;
}
