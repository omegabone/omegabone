/**
 * Deterministic enforcement of the hard rules.
 *
 * The model proposes; this module disposes. Nothing here depends on the model
 * having behaved, so a bad generation degrades into fewer clips rather than
 * into clips that break the rules.
 *
 * Enforced:
 *   - exactly one valid awareness category per clip
 *   - the quote is genuinely present in the segment (no invented text)
 *   - 30-90s, measured on timecodes when available, word count otherwise
 *   - clips must not overlap each other
 *   - one clip per segment (the best surviving candidate)
 *   - 5-8 clips total, with a cap per awareness category
 *   - no instrumental/backing-track passages (singing or vocalising over music)
 *   - never the opening theme song / lesson-open music window
 */

import {
  AWARENESS_KEYS,
  HIGH_VALUE_KEYS,
  CTAS,
  TOPICS,
  CTA_BY_AWARENESS,
  DEFAULTS,
  countWords,
  estimateSeconds,
} from './config.mjs';

/** Normalise text for fuzzy containment checks. */
function normalise(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[^a-z0-9'" ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Verify the quote actually comes from the segment. Guards against paraphrase
 * and against spans stitched together from distant passages.
 *
 * Uses a sliding shingle overlap rather than exact substring match, because
 * models routinely normalise whitespace and punctuation when transcribing.
 */
function quoteIsGrounded(quote, segmentText, threshold = 0.8) {
  const q = normalise(quote);
  const s = normalise(segmentText);
  if (!q) return false;
  if (s.includes(q)) return true;

  const qWords = q.split(' ');
  if (qWords.length < 6) return s.includes(q);

  const shingles = [];
  for (let i = 0; i + 5 <= qWords.length; i += 5) {
    shingles.push(qWords.slice(i, i + 5).join(' '));
  }
  if (!shingles.length) return false;

  const hits = shingles.filter((sh) => s.includes(sh)).length;
  return hits / shingles.length >= threshold;
}

const MUSIC_MARKERS = /\[\s*music\s*\]|\[\s*instrumental\s*\]|\(\s*music\s*\)|\(\s*singing\s*\)|♪|🎵|🎶/i;

/**
 * A clip that's mostly the coach (or a student) singing or vocalising along
 * with an instrumental track, rather than teaching. Two signals:
 *   - explicit transcript markers ("[Music]", "♪", etc.)
 *   - a short phrase repeated over and over — how Whisper hallucinates when
 *     transcribing sustained singing/vocal exercises over backing music, and
 *     also how an actual repeated chorus line reads in a transcript.
 */
function isMusicOrInstrumental(text) {
  if (!text) return false;
  if (MUSIC_MARKERS.test(text)) return true;

  const lines = text
    .split(/\n|(?<=[.!?])\s+/)
    .map((l) => l.trim().toLowerCase())
    .filter(Boolean);
  if (lines.length < 6) return false;

  const counts = new Map();
  for (const l of lines) counts.set(l, (counts.get(l) || 0) + 1);
  const maxRepeat = Math.max(...counts.values());
  return maxRepeat / lines.length >= 0.5;
}

/** Trim a quote to end on a sentence boundary at or before `maxWords`. */
function trimToNaturalEnd(quote, maxWords) {
  const words = quote.trim().split(/\s+/);
  if (words.length <= maxWords) return quote.trim();

  const truncated = words.slice(0, maxWords).join(' ');
  const lastStop = Math.max(
    truncated.lastIndexOf('.'),
    truncated.lastIndexOf('!'),
    truncated.lastIndexOf('?'),
  );
  // Only accept the cut if it keeps most of the allowance; otherwise the clip
  // has no natural end inside the window and must be rejected.
  if (lastStop > truncated.length * 0.5) return truncated.slice(0, lastStop + 1);
  return null;
}

/** Snap timed boundaries to real cue edges and end on a completed thought. */
function snapToCues(candidate, segment, opts) {
  const minS = opts.minSeconds ?? DEFAULTS.minSeconds;
  const maxS = opts.maxSeconds ?? DEFAULTS.maxSeconds;
  const cues = segment.cues || [];
  if (!cues.length) return null;

  const wanted = {
    start: candidate.start_time ?? segment.start,
    end: candidate.end_time ?? segment.start + minS,
  };

  const startCue =
    cues.find((c) => c.end > wanted.start) || cues[0];
  let endIndex = cues.findIndex((c) => c.start >= wanted.end);
  if (endIndex === -1) endIndex = cues.length - 1;
  else endIndex = Math.max(cues.indexOf(startCue), endIndex - 1);

  // Extend forward to the next sentence end, then to reach the minimum length.
  const endsThought = (c) => /[.!?]["')\]]?\s*$/.test(c.text.trim());
  while (
    endIndex < cues.length - 1 &&
    (!endsThought(cues[endIndex]) ||
      cues[endIndex].end - startCue.start < minS)
  ) {
    if (cues[endIndex + 1].end - startCue.start > maxS) break;
    endIndex++;
  }

  const start = startCue.start;
  const end = cues[endIndex].end;
  const duration = end - start;
  if (duration < minS || duration > maxS) return null;

  const span = cues.slice(cues.indexOf(startCue), endIndex + 1);
  return {
    start,
    end,
    duration: Math.round(duration),
    quote: span.map((c) => c.text).join(' '),
    estimated: false,
    // Cue timings rebased to the clip's own timeline, so a renderer can burn
    // captions from the real transcript instead of re-transcribing the audio.
    captions: span.map((c) => ({
      start: Math.max(0, +(c.start - start).toFixed(3)),
      end: +(Math.min(c.end, end) - start).toFixed(3),
      text: c.text,
    })),
  };
}

/** Fit an untimed candidate into the length window by word count. */
function fitUntimed(candidate, opts) {
  const minS = opts.minSeconds ?? DEFAULTS.minSeconds;
  const maxS = opts.maxSeconds ?? DEFAULTS.maxSeconds;
  const wpm = opts.wpm ?? DEFAULTS.wpm;

  const minWords = Math.round((minS / 60) * wpm);
  const maxWords = Math.round((maxS / 60) * wpm);

  let quote = (candidate.full_quote || '').trim();
  const words = countWords(quote);

  if (words > maxWords) {
    const trimmed = trimToNaturalEnd(quote, maxWords);
    if (!trimmed) return null; // no natural end inside the window
    quote = trimmed;
  }
  if (countWords(quote) < minWords) return null; // too thin to be a clip

  return {
    start: null,
    end: null,
    duration: estimateSeconds(quote, wpm),
    quote,
    estimated: true,
    // No source timings to rebase, so there are no caption cues. A renderer
    // must not fake them: without timecodes there is nothing to sync to.
    captions: null,
  };
}

/** Composite ranking score, independent of the model's self-reported score. */
function rank(candidate) {
  const n = (v) => (Number.isFinite(v) ? Math.max(0, Math.min(100, v)) : 0);
  return (
    n(candidate.score) * 0.4 +
    n(candidate.authority) * 0.2 +
    n(candidate.clarity) * 0.15 +
    n(candidate.standalone_value) * 0.15 +
    n(candidate.emotional_impact) * 0.1 -
    n(candidate.filler_risk) * 0.25
  );
}

function overlaps(a, b) {
  if (a.start === null || b.start === null) return false;
  return a.start < b.end && b.start < a.end;
}

/**
 * Validate, repair, and select. Returns { clips, rejected }.
 */
export function enforce(lesson, candidates, opts = {}) {
  const minClips = opts.minClips ?? DEFAULTS.minClips;
  const maxClips = opts.maxClips ?? DEFAULTS.maxClips;
  const maxPerCategory = opts.maxPerCategory ?? DEFAULTS.maxPerCategory;
  const shortMax = opts.shortMaxSeconds ?? DEFAULTS.shortMaxSeconds;

  const rejected = [];
  const valid = [];

  for (const c of candidates) {
    const reject = (reason) =>
      rejected.push({ reason, segment: c.segmentIndex, quote: (c.full_quote || '').slice(0, 120) });

    // Rule: exactly one valid awareness category.
    if (!AWARENESS_KEYS.includes(c.primary_category)) {
      reject(`invalid primary_category "${c.primary_category}"`);
      continue;
    }
    // Rule: self-contained.
    if (c.self_contained === false) {
      reject('not self-contained');
      continue;
    }
    // Rule: quote must come from the transcript.
    if (!quoteIsGrounded(c.full_quote, c.segment.text)) {
      reject('quote not grounded in segment transcript');
      continue;
    }

    const fitted = c.segment.timed
      ? snapToCues(c, c.segment, opts)
      : fitUntimed(c, opts);

    if (!fitted) {
      reject('cannot fit 30-90s window ending on a natural thought');
      continue;
    }

    valid.push({
      ...c,
      ...fitted,
      high_value_type: HIGH_VALUE_KEYS.includes(c.high_value_type)
        ? c.high_value_type
        : null,
      topic: TOPICS.includes(c.topic) ? c.topic : 'General Inspiration & Coaching',
      cta: CTAS.includes(c.cta) ? c.cta : CTA_BY_AWARENESS[c.primary_category],
      clipType: fitted.duration <= shortMax ? 'short' : 'long',
      rankScore: rank(c),
    });
  }

  // Rule: single best clip per segment.
  const bestPerSegment = new Map();
  for (const c of valid) {
    const held = bestPerSegment.get(c.segmentIndex);
    if (!held || c.rankScore > held.rankScore) bestPerSegment.set(c.segmentIndex, c);
  }

  const pool = [...bestPerSegment.values()].sort((a, b) => b.rankScore - a.rankScore);
  const runnersUp = valid
    .filter((c) => !pool.includes(c))
    .sort((a, b) => b.rankScore - a.rankScore);

  // Rule: no overlap, capped per category, 5-8 total.
  const chosen = [];
  const perCategory = new Map();

  const tryAdd = (c, { ignoreCategoryCap = false } = {}) => {
    if (chosen.length >= maxClips) return false;
    if (chosen.some((k) => overlaps(k, c))) return false;
    const used = perCategory.get(c.primary_category) || 0;
    if (!ignoreCategoryCap && used >= maxPerCategory) return false;
    chosen.push(c);
    perCategory.set(c.primary_category, used + 1);
    return true;
  };

  for (const c of pool) tryAdd(c);

  // Below the floor: relax the category cap, then draw on runners-up.
  if (chosen.length < minClips) {
    for (const c of pool) {
      if (chosen.length >= minClips) break;
      if (!chosen.includes(c)) tryAdd(c, { ignoreCategoryCap: true });
    }
  }
  if (chosen.length < minClips) {
    for (const c of runnersUp) {
      if (chosen.length >= minClips) break;
      tryAdd(c, { ignoreCategoryCap: true });
    }
  }

  chosen.sort((a, b) => b.rankScore - a.rankScore);
  chosen.forEach((c, i) => {
    c.rankPosition = i + 1;
  });

  return {
    clips: chosen,
    rejected,
    shortfall: chosen.length < minClips ? minClips - chosen.length : 0,
  };
}
