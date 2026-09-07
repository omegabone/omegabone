#!/usr/bin/env node
/**
 * Narrows a batch to the clips actually worth rendering.
 *
 * An unattended run cannot render everything: eight clips a lesson across a
 * playlist is hours of rendering for clips that were never going to be posted.
 * The extractor already scored them, so the highest-scoring ones across the
 * whole batch come out, spread across lessons rather than all from whichever
 * lesson happened to score well.
 *
 * Usage: node pick-top.mjs <manifest.json> <out.json> [count]
 */

import { readFileSync, writeFileSync } from 'node:fs';

const [, , inPath, outPath, rawCount = '10'] = process.argv;

if (!inPath || !outPath) {
  console.error('Usage: node pick-top.mjs <manifest.json> <out.json> [count]');
  process.exit(1);
}

const count = Math.max(1, Number(rawCount) || 10);
const manifest = JSON.parse(readFileSync(inPath, 'utf8'));

// Only clips with real timings can be rendered at all.
const all = [];
for (const lesson of manifest.lessons ?? []) {
  for (const clip of lesson.clips ?? []) {
    if (clip.renderable) all.push({ lesson, clip });
  }
}

all.sort((a, b) => (b.clip.score ?? 0) - (a.clip.score ?? 0));

/*
 * Round-robin by lesson before falling back to pure score, so a run over ten
 * lessons does not come back with ten clips from one of them. Posting the same
 * lesson ten times is not a week of content.
 */
const byLesson = new Map();
for (const entry of all) {
  if (!byLesson.has(entry.lesson.id)) byLesson.set(entry.lesson.id, []);
  byLesson.get(entry.lesson.id).push(entry);
}

const picked = [];
let anyLeft = true;
while (picked.length < count && anyLeft) {
  anyLeft = false;
  for (const queue of byLesson.values()) {
    if (!queue.length) continue;
    picked.push(queue.shift());
    anyLeft = true;
    if (picked.length >= count) break;
  }
}

const lessons = new Map();
for (const { lesson, clip } of picked) {
  if (!lessons.has(lesson.id)) lessons.set(lesson.id, { ...lesson, clips: [] });
  lessons.get(lesson.id).clips.push(clip);
}

const out = {
  generatedAt: new Date().toISOString(),
  source: 'pick-top',
  lessons: [...lessons.values()].map((lesson) => ({ ...lesson, clipCount: lesson.clips.length })),
};

writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`, 'utf8');
console.log(`${picked.length} clip(s) from ${lessons.size} lesson(s)`);
