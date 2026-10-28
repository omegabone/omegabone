/**
 * Trimming tests. Run with: node --test test/
 *
 * Trimming is the part with real consequences: the times settled on here are
 * the times the renderer cuts at, and the captions are re-cut to match. A trim
 * that saves but does not reach the render manifest is the failure that costs
 * a whole batch.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { wordsFromCue, wordsForLesson, windowFor, captionsFor } from '../src/transcript.mjs';
import { applyVerdict, writeRenderManifest } from '../src/reviews.mjs';

const CUES = [
  { start: 100, end: 104, text: 'Before the clip entirely.' },
  { start: 120, end: 124, text: 'Raise your eyebrows.' },
  { start: 124, end: 130, text: 'The soft palate lifts with them.' },
  { start: 200, end: 204, text: 'Long after the clip.' },
];

test('a cue without word timings is spread across its words', () => {
  const words = wordsFromCue({ start: 10, end: 14, text: 'Raise your eyebrows' });

  assert.equal(words.length, 3);
  assert.equal(words[0].start, 10);
  assert.equal(Math.round(words[2].end), 14, 'the last word ends when the cue does');
  assert.ok(words.every((w) => w.estimated), 'flagged, so the page can say so');

  // Weighted by length: "eyebrows" takes longer to say than "your".
  const width = (w) => w.end - w.start;
  assert.ok(width(words[2]) > width(words[1]));
});

test('real word timings are used as they are, not re-estimated', () => {
  const words = wordsForLesson({
    cues: [
      {
        start: 120,
        end: 124,
        text: 'Raise your eyebrows.',
        words: [
          { word: 'Raise', start: 120, end: 120.9 },
          { word: 'your', start: 120.9, end: 121 },
          { word: 'eyebrows', start: 121, end: 122.4 },
        ],
      },
    ],
  });

  assert.equal(words[1].start, 120.9);
  assert.equal(words[1].estimated, false);
});

test('the clickable window reaches past the clip on both sides', () => {
  const transcript = { words: wordsForLesson({ cues: CUES }) };
  const inWindow = windowFor(transcript, 120, 130, 25);

  const texts = inWindow.map((w) => w.word).join(' ');
  assert.match(texts, /Before/, 'context before the in-point is reachable');
  assert.match(texts, /palate/, 'the clip itself is there');
  assert.equal(/Long after/.test(texts), false, 'context stops at the window');
});

test('captions are re-cut to the trimmed window and rebased to the clip', () => {
  const captions = captionsFor({ cues: CUES }, 122, 128);

  assert.equal(captions.length, 2);
  assert.equal(captions[0].start, 0, 'a cue straddling the in-point starts at zero');
  assert.equal(captions[0].end, 2, 'and keeps the rest of its length');
  assert.equal(captions[1].start, 2);
  assert.equal(captions[1].end, 6, 'a cue running past the out-point is cut there');
});

test('a trim is stored, and clearing it returns the extractor’s own times', () => {
  const store = {};
  const options = { renderDir: '/tmp', approvedDir: '/tmp/approved', move: false, file: null };

  applyVerdict(store, 'clip-1', { start: 118.5 }, options);
  assert.equal(store['clip-1'].start, 118.5);

  applyVerdict(store, 'clip-1', { feedback: 'tighter' }, options);
  assert.equal(store['clip-1'].start, 118.5, 'an unrelated edit leaves the trim alone');

  applyVerdict(store, 'clip-1', { start: null, end: null }, options);
  assert.equal(store['clip-1'].start, null, 'null means back to the original');
});

test('a trim that inverts the clip is refused', () => {
  const store = { 'clip-1': { status: 'pending', feedback: '', start: 120, end: 130 } };
  const options = { renderDir: '/tmp', approvedDir: '/tmp/approved', move: false, file: null };

  assert.throws(() => applyVerdict(store, 'clip-1', { end: 119 }, options), /before it starts/);
  assert.throws(() => applyVerdict(store, 'clip-1', { start: 'soon' }, options), /not a time/);
  assert.equal(store['clip-1'].end, 130, 'the stored trim is untouched by a refused one');
});

test('the render manifest carries approved clips at their trimmed times', () => {
  const dir = mkdtempSync(join(tmpdir(), 'clip-review-render-'));
  const path = join(dir, 'approved-manifest.json');

  const lessons = [
    { id: 'brittany-21-may', videoTitle: 'Vocal Mastery with Brittany', student: 'Brittany', date: '21 May 2026', url: 'https://x/y' },
  ];
  const transcripts = new Map([['brittany-21-may', { cues: CUES, words: [], hasWords: false }]]);

  const clips = [
    {
      id: 'a', lessonId: 'brittany-21-may', status: 'approved', start: 122, end: 128,
      durationSeconds: 6, trimmed: true, feedback: 'tighter', topic: 'Palate', rank: 1,
      awareness: 'Solution aware', highValueType: '', cta: 'Book', clipType: 'teaching',
      quote: 'q', whyItHooks: 'w', suggestedCaption: 'c', score: 90, sourceUrl: 'https://x/y?t=122s',
      durationEstimated: false,
    },
    {
      id: 'b', lessonId: 'brittany-21-may', status: 'rejected', start: 200, end: 204,
      durationSeconds: 4, trimmed: false, feedback: '', topic: 'Other', rank: 2,
      awareness: '', highValueType: '', cta: '', clipType: '', quote: '', whyItHooks: '',
      suggestedCaption: '', score: 10, sourceUrl: '', durationEstimated: false,
    },
  ];

  const result = writeRenderManifest(path, clips, { lessons, transcripts, captionsFor });
  const manifest = JSON.parse(readFileSync(path, 'utf8'));

  assert.equal(result.clips, 1);
  assert.equal(manifest.lessons[0].clips.length, 1, 'only the approved clip is rendered');

  const clip = manifest.lessons[0].clips[0];
  assert.equal(clip.start, 122, 'the trimmed in-point, not the original');
  assert.equal(clip.captions[0].start, 0, 'captions come with it, rebased');
  assert.equal(clip.renderable, true);
  assert.equal(clip.reviewNote, 'tighter');
});

test('an approved clip with no transcript is listed but marked unrenderable', () => {
  const dir = mkdtempSync(join(tmpdir(), 'clip-review-render-'));
  const path = join(dir, 'approved-manifest.json');

  writeRenderManifest(
    path,
    [{ id: 'a', lessonId: 'nope', status: 'approved', start: 10, end: 20, durationSeconds: 10, trimmed: false, feedback: '' }],
    { lessons: [{ id: 'nope', videoTitle: 'T', student: 'S', date: 'D', url: '' }], transcripts: new Map(), captionsFor },
  );

  const manifest = JSON.parse(readFileSync(path, 'utf8'));
  assert.equal(manifest.lessons[0].clips[0].renderable, false, 'listed and skipped, not silently dropped');
});
