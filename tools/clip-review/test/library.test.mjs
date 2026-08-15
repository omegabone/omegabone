/**
 * Library and request-plumbing tests.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { buildLibrary, countStatuses, scanRenders } from '../src/library.mjs';
import { safeJoin, parseRange } from '../src/server.mjs';

const MANIFEST = {
  lessons: [
    {
      videoTitle: 'Vocal Mastery with Brittany',
      student: 'Brittany',
      date: '21 May 2026',
      url: 'https://youtube.com/live/x',
      clips: [
        {
          id: 'brittany-21-may-1',
          rank: 1,
          topic: 'Breath',
          awarenessLabel: 'Solution aware',
          suggestedCaption: 'Lift the eyebrows',
          durationSeconds: 42,
          renderable: true,
        },
        { id: 'brittany-21-may-2', rank: 2, topic: 'Palate', renderable: false },
      ],
    },
  ],
};

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'clip-library-'));
  const renderDir = join(root, 'out');
  mkdirSync(renderDir, { recursive: true });

  const manifestPath = join(root, 'manifest.json');
  writeFileSync(manifestPath, JSON.stringify(MANIFEST));
  writeFileSync(join(renderDir, 'brittany-21-may-1.mp4'), 'video');
  return { renderDir, manifestPath };
}

test('manifest metadata and rendered files are joined by clip id', () => {
  const { renderDir, manifestPath } = fixture();
  const clips = buildLibrary({ manifestPath, renderDir });

  assert.equal(clips.length, 2);
  assert.equal(clips[0].id, 'brittany-21-may-1');
  assert.equal(clips[0].rendered, true);
  assert.equal(clips[0].file, 'brittany-21-may-1.mp4');
  assert.equal(clips[0].suggestedCaption, 'Lift the eyebrows');
  assert.equal(clips[0].status, 'pending');
});

test('a manifest clip with no rendered file is listed, flagged', () => {
  const { renderDir, manifestPath } = fixture();
  const clips = buildLibrary({ manifestPath, renderDir });

  const unrendered = clips.find((c) => c.id === 'brittany-21-may-2');
  assert.equal(unrendered.rendered, false);
  assert.equal(unrendered.file, null);
});

test('a rendered file the manifest never mentions still shows up', () => {
  const { renderDir, manifestPath } = fixture();
  writeFileSync(join(renderDir, 'hand-dropped-clip.mp4'), 'video');

  const clips = buildLibrary({ manifestPath, renderDir });
  const orphan = clips.find((c) => c.id === 'hand-dropped-clip');

  assert.ok(orphan, 'orphaned render is listed');
  assert.equal(orphan.rendered, true);
  assert.equal(orphan.lesson, '');
});

test('saved reviews are attached to their clips', () => {
  const { renderDir, manifestPath } = fixture();
  const reviews = { 'brittany-21-may-1': { status: 'approved', feedback: 'ship it' } };
  const clips = buildLibrary({ manifestPath, renderDir, reviews });

  assert.equal(clips[0].status, 'approved');
  assert.equal(clips[0].feedback, 'ship it');
  assert.deepEqual(countStatuses(clips), {
    all: 2,
    pending: 1,
    approved: 1,
    rejected: 0,
    unrendered: 1,
  });
});

test('non-video files and odd names are ignored by the scan', () => {
  const { renderDir } = fixture();
  writeFileSync(join(renderDir, 'reviews.json'), '{}');
  writeFileSync(join(renderDir, 'notes.txt'), 'x');

  assert.deepEqual([...scanRenders(renderDir).keys()], ['brittany-21-may-1']);
});

test('a missing render folder is empty, not an error', () => {
  assert.equal(scanRenders('/no/such/folder').size, 0);
});

test('paths that climb out of the served folder are refused', () => {
  assert.equal(safeJoin('/srv/out', '../../etc/passwd'), null);
  assert.equal(safeJoin('/srv/out', '/etc/passwd'), null);
  assert.equal(safeJoin('/srv/out', 'clip.mp4'), '/srv/out/clip.mp4');
});

test('byte ranges are parsed the way a video scrubber sends them', () => {
  assert.deepEqual(parseRange('bytes=0-99', 1000), { start: 0, end: 99 });
  assert.deepEqual(parseRange('bytes=500-', 1000), { start: 500, end: 999 });
  assert.deepEqual(parseRange('bytes=-200', 1000), { start: 800, end: 999 });
  assert.deepEqual(parseRange('bytes=900-5000', 1000), { start: 900, end: 999 });
  assert.equal(parseRange(undefined, 1000), null);
  assert.equal(parseRange('bytes=2000-', 1000), 'unsatisfiable');
});
