/**
 * Output tests. Run with: node --test test/
 *
 * These cover what leaves the extractor for the tools downstream of it — the
 * review page trims clips against the transcript written here, so an empty or
 * mistimed transcript file breaks trimming rather than showing up as a bad
 * clip.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { writeOutputs, lessonSlug } from '../src/output.mjs';

const OPTS = { minSeconds: 30, maxSeconds: 75, minClips: 1, maxClips: 5, maxPerCategory: 2, wpm: 150 };

function clip(overrides = {}) {
  return {
    rankPosition: 1,
    primary_category: 'solution_aware',
    high_value_type: null,
    topic: 'Vocal Technique & Breath',
    cta: '🔵 Watch Lessons',
    clipType: 'teaching',
    start: 120,
    end: 162,
    duration: 42,
    estimated: false,
    quote: 'Raise your eyebrows.',
    why_it_hooks: 'why',
    suggested_caption: 'caption',
    rankScore: 88,
    segmentIndex: 1,
    captions: [{ start: 0, end: 2, text: 'Raise your eyebrows.' }],
    ...overrides,
  };
}

function timedLesson(cues) {
  return {
    videoTitle: 'Vocal Mastery with Brittany',
    student: 'Brittany',
    date: '21 May 2026',
    url: 'https://youtube.com/live/x',
    timed: true,
    cues,
  };
}

test('a timed lesson writes its whole transcript, not just the clipped part', () => {
  const out = mkdtempSync(join(tmpdir(), 'extractor-out-'));
  const lesson = timedLesson([
    { start: 100, end: 104, text: 'Before the clip.' },
    { start: 120, end: 124, text: 'Raise your eyebrows.' },
    { start: 200, end: 204, text: 'After the clip.' },
  ]);

  const written = writeOutputs(out, [{ lesson, clips: [clip()], rejected: [], shortfall: 0 }], OPTS);
  const transcripts = JSON.parse(readFileSync(written.transcripts, 'utf8'));

  assert.equal(transcripts.lessons.length, 1);
  assert.equal(transcripts.lessons[0].cues.length, 3, 'context on both sides of the clip is kept');
  assert.equal(transcripts.lessons[0].cues[0].start, 100, 'times stay in the lesson timeline');
  assert.equal(transcripts.lessons[0].hasWords, false);
});

test('word timings are carried through when the transcriber recorded them', () => {
  const out = mkdtempSync(join(tmpdir(), 'extractor-out-'));
  const lesson = timedLesson([
    {
      start: 120,
      end: 124,
      text: 'Raise your eyebrows.',
      words: [
        { word: 'Raise', start: 120, end: 120.4 },
        { word: 'your', start: 120.4, end: 120.6 },
        { word: 'eyebrows', start: 120.6, end: 121.3 },
      ],
    },
  ]);

  const written = writeOutputs(out, [{ lesson, clips: [clip()], rejected: [], shortfall: 0 }], OPTS);
  const transcripts = JSON.parse(readFileSync(written.transcripts, 'utf8'));

  assert.equal(transcripts.lessons[0].hasWords, true);
  assert.equal(transcripts.lessons[0].cues[0].words[2].word, 'eyebrows');
});

test('an untimed lesson writes no transcript, since there is nothing to trim against', () => {
  const out = mkdtempSync(join(tmpdir(), 'extractor-out-'));
  const lesson = {
    videoTitle: 'Vocal Mastery with Brittany',
    student: 'Brittany',
    date: '21 May 2026',
    timed: false,
    cues: null,
  };

  const written = writeOutputs(out, [{ lesson, clips: [clip({ start: null, end: null, captions: null })], rejected: [], shortfall: 0 }], OPTS);

  assert.equal(written.transcripts, null);
  assert.equal(existsSync(join(out, 'transcripts.json')), false);
});

test('clips and their transcript agree on which lesson they belong to', () => {
  const out = mkdtempSync(join(tmpdir(), 'extractor-out-'));
  const lesson = timedLesson([{ start: 120, end: 124, text: 'Raise your eyebrows.' }]);

  const written = writeOutputs(out, [{ lesson, clips: [clip()], rejected: [], shortfall: 0 }], OPTS);
  const manifest = JSON.parse(readFileSync(written.manifest, 'utf8'));
  const transcripts = JSON.parse(readFileSync(written.transcripts, 'utf8'));

  assert.equal(manifest.lessons[0].id, transcripts.lessons[0].id);
  assert.equal(manifest.lessons[0].id, lessonSlug(lesson));
});
