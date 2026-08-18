/**
 * Builds the review list.
 *
 * A clip is a decision, not a file. It exists as soon as the extractor picks
 * it, and reviewing it — watching it, trimming it, approving it — happens
 * before anything is rendered. A rendered file, when there is one, is an extra
 * way to view the same clip rather than the thing being reviewed.
 *
 * So three sources are merged: the extractor manifest (which clips exist and
 * where they sit in the lesson), the render directory (which of them have been
 * rendered), and the saved review (what was decided, and any trim).
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, extname, basename } from 'node:path';
// One source of truth for which product a title belongs to — the renderer's.
import { brandFromTitle } from '../../clip-renderer/scripts/brand-from-title.mjs';

/**
 * Clip ids are filename stems. The extractor's own slugs are lowercase and
 * hyphenated, but a folder of hand-cut clips is full of spaces and capitals —
 * refusing those would quietly drop exactly the files someone dragged in to be
 * reviewed. So anything that is a plain filename passes, and only the parts
 * that could climb out of the folder are refused.
 */
export const ID_PATTERN = /^(?!\.\.?$)[^/\\\0]+$/;

const VIDEO_EXT = new Set(['.mp4', '.mov', '.webm', '.m4v']);

/**
 * Rendered files in a directory, keyed by clip id.
 *
 * The renderer names files for a person, not a program — Brand_Title_Student,
 * not the clip id — so the id can no longer be read off the filename. It
 * writes render-index.json alongside the files to say which clip each one
 * is; that index is authoritative. Anything on disk but missing from the
 * index (a hand-dropped file, or a render from before the index existed)
 * still falls back to the old id.ext filename convention, so it is not
 * silently dropped from the review.
 */
export function scanRenders(dir) {
  if (!existsSync(dir)) return new Map();

  let index = {};
  const indexPath = join(dir, 'render-index.json');
  if (existsSync(indexPath)) {
    try {
      index = JSON.parse(readFileSync(indexPath, 'utf8'));
    } catch {
      index = {};
    }
  }

  const found = new Map();
  const claimed = new Set();

  for (const [id, name] of Object.entries(index)) {
    if (!ID_PATTERN.test(id) || typeof name !== 'string') continue;
    const path = join(dir, name);
    if (!existsSync(path)) continue;
    const stat = statSync(path);
    if (!stat.isFile()) continue;

    found.set(id, { file: name, bytes: stat.size, modified: stat.mtime.toISOString() });
    claimed.add(name);
  }

  for (const name of readdirSync(dir)) {
    if (claimed.has(name)) continue;
    const ext = extname(name);
    if (!VIDEO_EXT.has(ext.toLowerCase())) continue;

    // Strip the extension as it is actually spelled — stripping a lowercased
    // ".mp4" off a file named ".MP4" leaves the extension in the id.
    const id = basename(name, ext);
    if (!ID_PATTERN.test(id) || found.has(id)) continue;

    const path = join(dir, name);
    const stat = statSync(path);
    if (!stat.isFile()) continue;

    found.set(id, { file: name, bytes: stat.size, modified: stat.mtime.toISOString() });
  }

  return found;
}

/** The lessons in a manifest, with the ids the transcripts are keyed by. */
export function readLessons(path) {
  if (!path || !existsSync(path)) return { lessons: [], rules: {} };

  const manifest = JSON.parse(readFileSync(path, 'utf8'));
  return {
    rules: manifest.rules ?? {},
    lessons: (manifest.lessons ?? []).map((lesson) => ({
      id: lesson.id ?? '',
      videoTitle: lesson.videoTitle ?? '',
      student: lesson.student ?? '',
      date: lesson.date ?? '',
      url: lesson.url ?? '',
      clips: lesson.clips ?? [],
    })),
  };
}

/** Flatten a manifest into per-clip records, before any review is applied. */
export function readManifest(path) {
  const { lessons } = readLessons(path);
  const clips = [];

  for (const lesson of lessons) {
    for (const clip of lesson.clips) {
      clips.push({
        id: clip.id,
        lessonId: lesson.id,
        rank: clip.rank ?? null,
        lesson: lesson.videoTitle,
        student: lesson.student,
        date: lesson.date,
        awareness: clip.awarenessLabel ?? '',
        highValueType: clip.highValueType ? clip.highValueType.replace(/_/g, ' ') : '',
        topic: clip.topic ?? '',
        cta: clip.cta ?? '',
        clipType: clip.clipType ?? '',
        originalStart: clip.start ?? null,
        originalEnd: clip.end ?? null,
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

/** An entry for a rendered file that no manifest mentions. */
function orphan(id) {
  return {
    id,
    lessonId: '',
    rank: null,
    lesson: '',
    student: '',
    date: '',
    awareness: '',
    highValueType: '',
    topic: '',
    cta: '',
    clipType: '',
    originalStart: null,
    originalEnd: null,
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
 * Merge everything into the list the page renders. Manifest order is kept — it
 * is rank order within a lesson, which is the order worth reviewing in — with
 * orphaned renders appended.
 */
export function buildLibrary({ manifestPath, renderDir, reviews = {}, sources = new Map() }) {
  const meta = readManifest(manifestPath);
  const renders = scanRenders(renderDir);
  const seen = new Set();

  const clips = [];
  for (const entry of meta) {
    seen.add(entry.id);
    clips.push(decorate(entry, renders.get(entry.id), reviews[entry.id], sources));
  }
  for (const [id, render] of renders) {
    if (seen.has(id)) continue;
    clips.push(decorate(orphan(id), render, reviews[id], sources));
  }

  return clips;
}

function decorate(entry, render, review, sources) {
  // A trim is stored against the clip and wins over the extractor's own in and
  // out points, which stay on the record so the edit can be seen and undone.
  const start = review?.start ?? entry.originalStart;
  const end = review?.end ?? entry.originalEnd;
  const trimmed =
    start !== entry.originalStart || end !== entry.originalEnd;

  // A rewritten title/captions win over the extractor's own words, same
  // pattern as the trim above: kept on the record so the edit is visible and
  // reversible, not baked over the original.
  const topic = review?.topic ?? entry.topic;
  const topicEdited = review?.topic !== undefined && review.topic !== null;
  const captionsOverride = review?.captions ?? null;

  return {
    ...entry,
    topic,
    topicEdited,
    captionsOverride,
    start,
    end,
    durationSeconds: start === null || end === null ? null : Math.round((end - start) * 10) / 10,
    trimmed,
    file: render?.file ?? null,
    bytes: render?.bytes ?? null,
    rendered: Boolean(render),
    // Stale once trimmed: the file on disk is the old cut.
    renderStale: Boolean(render) && (trimmed || topicEdited || Boolean(captionsOverride)),
    hasSource: sources.has(entry.lessonId),
    // The reviewer's choice wins; otherwise the lesson title decides.
    brand: review?.brand ?? brandFromTitle(entry.lesson).brand,
    brandChosen: Boolean(review?.brand),
    status: review?.status ?? 'pending',
    feedback: review?.feedback ?? '',
    reviewedAt: review?.updatedAt ?? null,
  };
}

/** Tally for the filter bar. */
export function countStatuses(clips) {
  const counts = { all: clips.length, pending: 0, approved: 0, rejected: 0, unrendered: 0, trimmed: 0 };
  for (const clip of clips) {
    counts[clip.status] = (counts[clip.status] ?? 0) + 1;
    if (!clip.rendered) counts.unrendered++;
    if (clip.trimmed) counts.trimmed++;
  }
  return counts;
}
