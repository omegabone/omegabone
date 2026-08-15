/**
 * Verdict tests. Run with: node --test test/
 *
 * The point of these is the folder: a verdict that does not reach disk, or one
 * that leaves an un-approved clip sitting in the approved folder, is the bug
 * that matters here.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { applyVerdict, loadReviews, saveReviews, writeApprovedIndex } from '../src/reviews.mjs';

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'clip-review-'));
  const renderDir = join(root, 'out');
  const approvedDir = join(renderDir, 'approved');
  mkdirSync(renderDir, { recursive: true });
  writeFileSync(join(renderDir, 'brittany-21-may-1.mp4'), 'video');
  writeFileSync(join(renderDir, 'brittany-21-may-1.srt'), 'captions');
  return { renderDir, approvedDir, file: 'brittany-21-may-1.mp4', id: 'brittany-21-may-1' };
}

test('approving copies the clip and its captions into the approved folder', () => {
  const { renderDir, approvedDir, file, id } = fixture();
  const store = {};

  applyVerdict(store, id, { status: 'approved' }, { renderDir, approvedDir, move: false, file });

  assert.equal(store[id].status, 'approved');
  assert.ok(existsSync(join(approvedDir, file)), 'clip is in approved/');
  assert.ok(existsSync(join(approvedDir, `${id}.srt`)), 'captions travel with it');
  assert.ok(existsSync(join(renderDir, file)), 'copying leaves the render in place');
});

test('un-approving takes the clip back out of the approved folder', () => {
  const { renderDir, approvedDir, file, id } = fixture();
  const store = {};
  const opts = { renderDir, approvedDir, move: false, file };

  applyVerdict(store, id, { status: 'approved' }, opts);
  applyVerdict(store, id, { status: 'rejected' }, opts);

  assert.equal(store[id].status, 'rejected');
  assert.equal(existsSync(join(approvedDir, file)), false);
  assert.equal(existsSync(join(approvedDir, `${id}.srt`)), false);
  assert.ok(existsSync(join(renderDir, file)), 'the render itself is never deleted');
});

test('move mode moves the file out and back', () => {
  const { renderDir, approvedDir, file, id } = fixture();
  const store = {};
  const opts = { renderDir, approvedDir, move: true, file };

  applyVerdict(store, id, { status: 'approved' }, opts);
  assert.equal(existsSync(join(renderDir, file)), false, 'moved out of the render folder');
  assert.ok(existsSync(join(approvedDir, file)));

  applyVerdict(store, id, { status: 'pending' }, opts);
  assert.ok(existsSync(join(renderDir, file)), 'moved back when the verdict is withdrawn');
  assert.equal(existsSync(join(approvedDir, file)), false);
});

test('feedback survives a status change, and a status survives new feedback', () => {
  const { renderDir, approvedDir, file, id } = fixture();
  const store = {};
  const opts = { renderDir, approvedDir, move: false, file };

  applyVerdict(store, id, { feedback: 'cut the first beat' }, opts);
  applyVerdict(store, id, { status: 'approved' }, opts);
  assert.equal(store[id].feedback, 'cut the first beat');

  applyVerdict(store, id, { feedback: 'caption is too long' }, opts);
  assert.equal(store[id].status, 'approved');
});

test('a verdict on a clip with no rendered file is recorded, not thrown', () => {
  const { renderDir, approvedDir } = fixture();
  const store = {};

  applyVerdict(store, 'not-rendered-yet', { status: 'approved' }, {
    renderDir,
    approvedDir,
    move: false,
    file: null,
  });

  assert.equal(store['not-rendered-yet'].status, 'approved');
  assert.equal(existsSync(join(approvedDir, 'not-rendered-yet.mp4')), false);
});

test('an unknown status is refused rather than written', () => {
  const { renderDir, approvedDir, file, id } = fixture();
  const store = {};

  assert.throws(
    () => applyVerdict(store, id, { status: 'maybe' }, { renderDir, approvedDir, move: false, file }),
    /unknown status/,
  );
  assert.equal(store[id], undefined);
});

test('reviews round-trip through disk', () => {
  const { renderDir } = fixture();
  saveReviews(renderDir, { a: { status: 'approved', feedback: 'yes' } });

  assert.deepEqual(loadReviews(renderDir), { a: { status: 'approved', feedback: 'yes' } });
});

test('a corrupt state file starts an empty pass instead of failing', () => {
  const { renderDir } = fixture();
  writeFileSync(join(renderDir, 'reviews.json'), '{ not json');

  assert.deepEqual(loadReviews(renderDir), {});
});

test('the approved index carries feedback and quotes commas out of the CSV', () => {
  const { approvedDir } = fixture();
  const path = writeApprovedIndex(approvedDir, [
    {
      id: 'a',
      file: 'a.mp4',
      status: 'approved',
      student: 'Brittany',
      topic: 'Breath, support',
      awareness: 'Solution aware',
      suggestedCaption: 'Say "lift"',
      cta: 'Book a lesson',
      feedback: 'great',
      sourceUrl: 'https://x/y?t=12s',
    },
    { id: 'b', file: 'b.mp4', status: 'rejected', feedback: 'no' },
  ]);

  const csv = readFileSync(path, 'utf8');
  assert.match(csv, /"Breath, support"/);
  assert.match(csv, /"Say ""lift"""/);
  assert.equal(csv.includes('b.mp4'), false, 'only approved clips are listed');
});
