/**
 * Builds the review list.
 *
 * Two sources, deliberately: the extractor manifest carries everything worth
 * knowing about a clip (topic, quote, why it hooks, the caption that will be
 * burned in), and the render directory carries the files that actually exist.
 * Neither alone is the truth — a manifest clip may not have been rendered yet,
 * and a stray mp4 may have been dropped in by hand. Both show up, flagged.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, extname, basename } from 'node:path';

/**
 * Clip ids are filename stems. The extractor's own slugs are lowercase and
 * hyphenated, but a folder of hand-cut clips is full of spaces and capitals —
 * refusing those would quietly drop exactly the files someone dragged in to be
 * reviewed. So anything that is a plain filename passes, and only the parts
 * that could climb out of the folder are refused.
 */
export const ID_PATTERN = /^(?!\.\.?$)[^/\\\0]+$/;

const VIDEO_EXT = new Set(['.mp4', '.mov', '.webm', '.m4v']);

/** Rendered files in a directory, keyed by clip id (the filename stem). */
export function scanRenders(dir) {
  if (!existsSync(dir)) return new Map();

  const found = new Map();
  for (const name of readdirSync(dir)) {
    const ext = extname(name);
    if (!VIDEO_EXT.has(ext.toLowerCase())) continue;

    // Strip the extension as it is actually spelled — stripping a lowercased
    // ".mp4" off a file named ".MP4" leaves the extension in the id.
    const id = basename(name, ext);
    if (!ID_PATTERN.test(id)) continue;

    const path = join(dir, name);
    const stat = statSync(path);
    if (!stat.isFile()) continue;

    found.set(id, { file: name, bytes: stat.size, modified: stat.mtime.toISOString() });
  }
  return found;
}

/** Flatten a clip-extractor manifest into per-clip records. */
export function readManifest(path) {
  if (!path || !existsSync(path)) return [];

  const manifest = JSON.parse(readFileSync(path, 'utf8'));
  const clips = [];

  for (const lesson of manifest.lessons ?? []) {
    for (const clip of lesson.clips ?? []) {
      clips.push({
        id: clip.id,
        rank: clip.rank,
        lesson: lesson.videoTitle ?? '',
        student: lesson.student ?? '',
        date: lesson.date ?? '',
        awareness: clip.awarenessLabel ?? '',
        highValueType: clip.highValueType ? clip.highValueType.replace(/_/g, ' ') : '',
        topic: clip.topic ?? '',
        cta: clip.cta ?? '',
        clipType: clip.clipType ?? '',
        durationSeconds: clip.durationSeconds ?? null,
        durationEstimated: Boolean(clip.durationEstimated),
        quote: clip.quote ?? '',
        whyItHooks: clip.whyItHooks ?? '',
        suggestedCaption: clip.suggestedCaption ?? '',
        score: clip.score ?? null,
        sourceUrl: clip.clipUrl ?? lesson.url ?? '',
        renderable: Boolean(clip.renderable),
      });
    }
  }
  return clips;
}

/** An entry for a file on disk that the manifest knows nothing about. */
function orphan(id) {
  return {
    id,
    rank: null,
    lesson: '',
    student: '',
    date: '',
    awareness: '',
    highValueType: '',
    topic: '',
    cta: '',
    clipType: '',
    durationSeconds: null,
    durationEstimated: false,
    quote: '',
    whyItHooks: '',
    suggestedCaption: '',
    score: null,
    sourceUrl: '',
    renderable: true,
  };
}

/**
 * Merge manifest metadata, rendered files and saved reviews into the list the
 * page renders. Manifest order is preserved — it is rank order within a lesson,
 * which is the order worth reviewing in — with orphaned renders appended.
 */
export function buildLibrary({ manifestPath, renderDir, reviews = {} }) {
  const meta = readManifest(manifestPath);
  const renders = scanRenders(renderDir);
  const seen = new Set();

  const clips = [];
  for (const entry of meta) {
    seen.add(entry.id);
    clips.push(decorate(entry, renders.get(entry.id), reviews[entry.id]));
  }
  for (const [id, render] of renders) {
    if (seen.has(id)) continue;
    clips.push(decorate(orphan(id), render, reviews[id]));
  }

  return clips;
}

function decorate(entry, render, review) {
  return {
    ...entry,
    file: render?.file ?? null,
    bytes: render?.bytes ?? null,
    rendered: Boolean(render),
    status: review?.status ?? 'pending',
    feedback: review?.feedback ?? '',
    reviewedAt: review?.updatedAt ?? null,
  };
}

/** Tally for the filter bar. */
export function countStatuses(clips) {
  const counts = { all: clips.length, pending: 0, approved: 0, rejected: 0, unrendered: 0 };
  for (const clip of clips) {
    counts[clip.status] = (counts[clip.status] ?? 0) + 1;
    if (!clip.rendered) counts.unrendered++;
  }
  return counts;
}
