/**
 * Segmentation.
 *
 * A "segment" is a stretch of a lesson that plausibly contains one teaching
 * beat. The rules ask for the single best clip per segment, so segmentation
 * decides how many candidate clips a lesson can yield.
 *
 * Untimed transcripts are split on speaker turns and packed to a target word
 * count. Timed transcripts are split on silence gaps, which track real beats
 * far better than word counts do.
 */

import { DEFAULTS, countWords } from './config.mjs';

/** Split prose transcript into speaker-turn units, keeping the label attached. */
function splitSpeakerTurns(transcript) {
  // A speaker label is 1-3 capitalised name words then a colon: "Omega:",
  // "Meta Muse:". Optionally preceded by a stage direction: "[They sing.] Omega:".
  //
  // The name tokens deliberately exclude '.' and whitespace. Allowing them lets
  // the pattern span a sentence boundary — "...that. Omega:" would match from
  // "that", splitting a turn mid-sentence and producing clips that open on a
  // fragment.
  const pattern =
    /(?=(?:\[[^\]]{0,120}\]\s*)?[A-Z][A-Za-z'-]{1,20}(?: [A-Z][A-Za-z'-]{1,20}){0,2}:\s)/g;
  const raw = transcript.split(pattern).map((s) => s.trim()).filter(Boolean);
  if (raw.length > 1) return raw;

  // No speaker labels — fall back to sentence groups.
  return transcript
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Pack units into segments of roughly `segmentWords` words. */
function packUnits(units, opts) {
  const target = opts.segmentWords ?? DEFAULTS.segmentWords;
  const minWords = opts.minSegmentWords ?? DEFAULTS.minSegmentWords;

  const segments = [];
  let current = [];
  let words = 0;

  for (const unit of units) {
    current.push(unit);
    words += countWords(unit);
    if (words >= target) {
      segments.push(current);
      current = [];
      words = 0;
    }
  }
  if (current.length) segments.push(current);

  // Fold a stub tail into the previous segment rather than leaving it starved.
  if (segments.length > 1) {
    const tail = segments[segments.length - 1];
    if (countWords(tail.join(' ')) < minWords) {
      segments[segments.length - 2].push(...tail);
      segments.pop();
    }
  }
  return segments;
}

/** Segment an untimed prose transcript. */
function segmentUntimed(lesson, opts) {
  const units = splitSpeakerTurns(lesson.transcript);
  const packed = packUnits(units, opts);

  return packed.map((units_, i) => ({
    index: i + 1,
    text: units_.join(' '),
    units: units_,
    timed: false,
    start: null,
    end: null,
  }));
}

/** Segment a timed transcript on silence gaps, packed toward a target length. */
function segmentTimed(lesson, opts) {
  const gapSeconds = opts.gapSeconds ?? 2.5;
  const targetSeconds = opts.segmentSeconds ?? 420;
  const cues = lesson.cues;

  const segments = [];
  let current = [];
  let startedAt = cues[0].start;

  for (let i = 0; i < cues.length; i++) {
    const cue = cues[i];
    current.push(cue);
    const next = cues[i + 1];
    const elapsed = cue.end - startedAt;
    const gapAhead = next ? next.start - cue.end : Infinity;

    // Cut once long enough AND a natural pause is available.
    if (elapsed >= targetSeconds && (gapAhead >= gapSeconds || !next)) {
      segments.push(current);
      current = [];
      if (next) startedAt = next.start;
    }
  }
  if (current.length) segments.push(current);

  return segments.map((cueGroup, i) => ({
    index: i + 1,
    text: cueGroup.map((c) => c.text).join(' '),
    units: cueGroup.map((c) => c.text),
    cues: cueGroup,
    timed: true,
    start: cueGroup[0].start,
    end: cueGroup[cueGroup.length - 1].end,
  }));
}

export function segmentLesson(lesson, opts = {}) {
  const segments = lesson.timed
    ? segmentTimed(lesson, opts)
    : segmentUntimed(lesson, opts);

  // Guarantee enough segments to reach the minimum clip count where the
  // material allows it: if a long lesson collapsed into 2 segments, re-pack
  // smaller. Short lessons legitimately yield fewer.
  const minClips = opts.minClips ?? DEFAULTS.minClips;
  const totalWords = countWords(lesson.transcript);
  if (
    !lesson.timed &&
    segments.length < minClips &&
    totalWords > minClips * (opts.minSegmentWords ?? DEFAULTS.minSegmentWords)
  ) {
    return segmentUntimed(lesson, {
      ...opts,
      segmentWords: Math.max(
        opts.minSegmentWords ?? DEFAULTS.minSegmentWords,
        Math.floor(totalWords / minClips),
      ),
    });
  }

  return segments;
}
