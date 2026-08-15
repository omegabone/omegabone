/**
 * Enforcement tests. Run with: node --test test/
 *
 * These cover the rules that must hold regardless of what the model returns.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { enforce } from '../src/enforce.mjs';
import { segmentLesson } from '../src/segment.mjs';

const SEGMENT_TEXT =
  'Omega: When you get near the top of your range your shoulders come up and your jaw locks, ' +
  'and the sound has nowhere to go except back down your throat. Raise your eyebrows, not for ' +
  'expression but for architecture, because the soft palate lifts when the eyebrows lift and ' +
  'that is the ceiling of the room. Take the breath low and do not pull the shoulders up with ' +
  'it. Lip buzz through the phrase first so the sound has to stay forward, and you will feel it ' +
  'move into the front of your face where it belongs. That is where it lives.';

const segment = { index: 1, text: SEGMENT_TEXT, units: [SEGMENT_TEXT], timed: false };
const lesson = { videoTitle: 'T', student: 'S', date: 'D', url: 'https://x/y' };

function candidate(overrides = {}) {
  return {
    full_quote: SEGMENT_TEXT,
    why_it_hooks: 'why',
    suggested_caption: 'caption',
    primary_category: 'solution_aware',
    high_value_type: null,
    topic: 'Vocal Technique & Breath',
    cta: '🟠 Buy Course',
    start_time: null,
    end_time: null,
    self_contained: true,
    authority: 90, clarity: 90, emotional_impact: 70,
    standalone_value: 85, filler_risk: 5, score: 88,
    segmentIndex: 1,
    segment,
    ...overrides,
  };
}

const opts = { minClips: 1, maxClips: 8, maxPerCategory: 2, minSeconds: 30, maxSeconds: 90, wpm: 150 };

test('accepts a well-formed candidate', () => {
  const { clips } = enforce(lesson, [candidate()], opts);
  assert.equal(clips.length, 1);
  assert.equal(clips[0].primary_category, 'solution_aware');
});

test('rejects a quote that is not in the transcript', () => {
  const { clips, rejected } = enforce(
    lesson,
    [candidate({ full_quote: 'Omega: Buy my course today, it is the best course in the world and you will love it forever and always.' })],
    opts,
  );
  assert.equal(clips.length, 0);
  assert.match(rejected[0].reason, /not grounded/);
});

test('rejects an invalid awareness category', () => {
  const { clips, rejected } = enforce(lesson, [candidate({ primary_category: 'vibes' })], opts);
  assert.equal(clips.length, 0);
  assert.match(rejected[0].reason, /invalid primary_category/);
});

test('rejects a clip that is too short to reach the floor', () => {
  // Contiguous span from the segment, so it passes grounding and is judged on
  // length alone.
  const { clips, rejected } = enforce(
    lesson,
    [candidate({ full_quote: 'That is where it lives.' })],
    opts,
  );
  assert.equal(clips.length, 0);
  assert.match(rejected[0].reason, /30-90s/);
});

test('grounding is checked before length, so fabrications read as fabrications', () => {
  // A real sentence from the segment, welded onto a speaker label that appears
  // hundreds of words earlier. This is stitching, not quoting.
  const { rejected } = enforce(
    lesson,
    [candidate({ full_quote: 'Omega: That is where it lives.' })],
    opts,
  );
  assert.match(rejected[0].reason, /not grounded/);
});

test('rejects a clip flagged as not self-contained', () => {
  const { clips, rejected } = enforce(lesson, [candidate({ self_contained: false })], opts);
  assert.equal(clips.length, 0);
  assert.match(rejected[0].reason, /self-contained/);
});

test('repairs an invalid topic and CTA rather than dropping the clip', () => {
  const { clips } = enforce(
    lesson,
    [candidate({ topic: 'Invented Topic', cta: 'Smash Subscribe' })],
    opts,
  );
  assert.equal(clips.length, 1);
  assert.equal(clips[0].topic, 'General Inspiration & Coaching');
  assert.equal(clips[0].cta, '🟠 Buy Course'); // mapped from solution_aware
});

test('keeps only the best candidate per segment', () => {
  const { clips } = enforce(
    lesson,
    [candidate({ score: 60 }), candidate({ score: 95 }), candidate({ score: 70 })],
    opts,
  );
  assert.equal(clips.length, 1);
  assert.equal(clips[0].score, 95);
});

test('never returns more than maxClips', () => {
  const many = Array.from({ length: 20 }, (_, i) =>
    candidate({ segmentIndex: i + 1, segment: { ...segment, index: i + 1 }, score: 90 - i }),
  );
  const { clips } = enforce(lesson, many, { ...opts, maxPerCategory: 99 });
  assert.equal(clips.length, 8);
  assert.deepEqual(clips.map((c) => c.rankPosition), [1, 2, 3, 4, 5, 6, 7, 8]);
});

test('caps clips per awareness category when alternatives exist', () => {
  const mixed = [
    candidate({ segmentIndex: 1, segment: { ...segment, index: 1 }, score: 99 }),
    candidate({ segmentIndex: 2, segment: { ...segment, index: 2 }, score: 98 }),
    candidate({ segmentIndex: 3, segment: { ...segment, index: 3 }, score: 97 }),
    candidate({ segmentIndex: 4, segment: { ...segment, index: 4 }, score: 96, primary_category: 'brand_aware' }),
  ];
  const { clips } = enforce(lesson, mixed, { ...opts, minClips: 1, maxPerCategory: 2 });
  const solution = clips.filter((c) => c.primary_category === 'solution_aware');
  assert.equal(solution.length, 2);
  assert.equal(clips.length, 3);
});

test('drops overlapping timed clips', () => {
  const cues = Array.from({ length: 40 }, (_, i) => ({
    start: i * 3,
    end: i * 3 + 3,
    text: `Line ${i} of the lesson continues here.`,
  }));
  cues[19].text = 'And that is the whole point of it.';
  cues[39].text = 'And that is the whole point of it.';
  const timedSegment = {
    index: 1,
    timed: true,
    cues,
    start: 0,
    end: 120,
    text: cues.map((c) => c.text).join(' '),
    units: cues.map((c) => c.text),
  };
  const mk = (start, end, score) =>
    candidate({
      segment: timedSegment,
      segmentIndex: 1,
      start_time: start,
      end_time: end,
      score,
      full_quote: cues.slice(start / 3, end / 3).map((c) => c.text).join(' '),
    });

  // Same segment, so only one survives regardless; assert it is the stronger one.
  const { clips } = enforce(lesson, [mk(0, 60, 80), mk(30, 90, 95)], opts);
  assert.equal(clips.length, 1);
  assert.equal(clips[0].estimated, false);
  assert.ok(clips[0].duration >= 30 && clips[0].duration <= 90);
});

test('segmenter does not split a speaker turn mid-sentence', () => {
  const transcript =
    'Omega: I did not realise I was doing that. Omega: Nobody does, that is why you need ears ' +
    'outside your own head. Student: That felt uncomfortable. Omega: Good, comfortable is where ' +
    'you have been living.';
  const segments = segmentLesson(
    { transcript, timed: false },
    { segmentWords: 10, minSegmentWords: 1, minClips: 1 },
  );
  for (const seg of segments) {
    for (const unit of seg.units) {
      assert.match(unit, /^(\[[^\]]*\]\s*)?[A-Z][A-Za-z'-]+( [A-Z][A-Za-z'-]+){0,2}:/);
    }
  }
});
