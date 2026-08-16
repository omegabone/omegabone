/**
 * The lesson transcript, as the trim editor needs it.
 *
 * Trimming works by clicking a word: the boundary nearer that word moves to it,
 * so clicking outside the clip lengthens it and clicking inside shortens it.
 * That needs a word list with times, in the lesson's own timeline.
 *
 * Word timings only exist when the transcriber recorded them. Whisper does with
 * `word_timestamps=True`; an SRT does not — it carries a time per cue, and a
 * cue is a whole line. Rather than refuse to trim on SRT sources, a cue is
 * spread across its words here and the result is flagged `estimated`, so the
 * page can say what the reviewer is clicking on. The video is the check: the
 * cut is judged by hearing it, not by trusting the number.
 */

import { readFileSync, existsSync } from 'node:fs';

/** Spread a cue's duration across its words, weighted by how long they are. */
export function wordsFromCue(cue) {
  const parts = String(cue.text || '').split(/\s+/).filter(Boolean);
  if (!parts.length) return [];

  const span = Math.max(0, cue.end - cue.start);
  // Weighting by length rather than splitting evenly: "the" and "articulation"
  // do not take the same time to say, and evenly split words drift audibly
  // across a long cue.
  const weights = parts.map((word) => word.length + 1);
  const total = weights.reduce((sum, w) => sum + w, 0);

  let at = cue.start;
  return parts.map((word, i) => {
    const width = (weights[i] / total) * span;
    const start = at;
    at += width;
    return { word, start, end: at, estimated: true };
  });
}

/** Every word of a lesson, in order, with times in the lesson's timeline. */
export function wordsForLesson(lesson) {
  const words = [];
  for (const cue of lesson.cues ?? []) {
    if (cue.words?.length) {
      for (const word of cue.words) words.push({ ...word, estimated: false });
    } else {
      words.push(...wordsFromCue(cue));
    }
  }
  return words;
}

/**
 * Read the extractor's transcripts file, indexed by lesson id.
 *
 * A missing file is not an error: it only means clips cannot be trimmed by
 * word in this batch, and the page says so rather than failing to open.
 */
export function loadTranscripts(path) {
  if (!path || !existsSync(path)) return new Map();

  let parsed;
  try {
    parsed = JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    console.warn(`  could not parse ${path} — clips will open without their transcript`);
    return new Map();
  }

  const byLesson = new Map();
  for (const lesson of parsed.lessons ?? []) {
    if (!lesson.id) continue;
    byLesson.set(lesson.id, {
      id: lesson.id,
      hasWords: Boolean(lesson.hasWords),
      words: wordsForLesson(lesson),
      cues: lesson.cues ?? [],
    });
  }
  return byLesson;
}

/**
 * The words a reviewer can reach for one clip: the clip itself plus the
 * context on either side that a boundary could be pulled out to.
 */
export function windowFor(transcript, start, end, context = 45) {
  if (!transcript) return [];
  const from = Math.max(0, start - context);
  const to = end + context;
  return transcript.words.filter((w) => w.end > from && w.start < to);
}

/** Cues that fall inside a trimmed window, rebased to the clip's own timeline. */
export function captionsFor(transcript, start, end) {
  if (!transcript) return [];

  return transcript.cues
    .filter((cue) => cue.end > start && cue.start < end)
    .map((cue) => ({
      // Clamped, so a cue straddling the in-point starts at 0 rather than at a
      // negative time the renderer would have to guess at.
      start: Math.max(0, cue.start - start),
      end: Math.min(end, cue.end) - start,
      text: cue.text,
    }))
    .filter((cue) => cue.end > cue.start);
}
