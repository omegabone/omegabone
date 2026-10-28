/**
 * Review state and the file moves that follow from it.
 *
 * The verdict lives in reviews.json next to the renders; the approved folder is
 * derived from it. That ordering matters — the folder can be deleted and
 * rebuilt from the file, but a folder alone cannot say why a clip was cut.
 *
 * Approving copies by default rather than moving. A review pass gets revisited,
 * and a copy means un-approving is free: the render is still where the renderer
 * put it. `--move` is there for when the approved folder is the delivery
 * folder and duplicates are not wanted.
 */

import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  copyFileSync,
  renameSync,
  rmSync,
} from 'node:fs';
import { join, extname } from 'node:path';

export const STATUSES = new Set(['pending', 'approved', 'rejected']);

/**
 * The brand a clip renders in — its caption highlight, title block and ground.
 * Kept in step with tools/clip-renderer/src/theme.ts, which is TypeScript and
 * so cannot be imported here.
 */
export const BRANDS = new Set(['vme', 'frequency', 'learn2sing', 'mr33']);

/**
 * Output shapes a clip can be rendered in — same list as the renderer's
 * FORMATS. vertical is 1080x1920 (IG/TikTok); horizontal is 1920x1080
 * (YouTube).
 */
export const FORMATS = new Set(['vertical', 'horizontal']);

const STATE_VERSION = 1;

export function statePath(renderDir) {
  return join(renderDir, 'reviews.json');
}

/** Read saved reviews. A missing or unreadable file starts an empty pass. */
export function loadReviews(renderDir) {
  const path = statePath(renderDir);
  if (!existsSync(path)) return {};

  try {
    const parsed = JSON.parse(readFileSync(path, 'utf8'));
    return parsed?.clips && typeof parsed.clips === 'object' ? parsed.clips : {};
  } catch {
    // A corrupt state file must not block the review; it is rewritten on the
    // next verdict.
    console.warn(`  could not parse ${path} — starting from an empty pass`);
    return {};
  }
}

export function saveReviews(renderDir, clips) {
  writeFileSync(
    statePath(renderDir),
    `${JSON.stringify({ version: STATE_VERSION, updatedAt: new Date().toISOString(), clips }, null, 2)}\n`,
    'utf8',
  );
}

/**
 * Apply one verdict: update the record, then make the approved folder match it.
 *
 * Returns the updated record. Throws if the status is not one we know — the
 * caller turns that into a 400 rather than writing nonsense to disk.
 */
export function applyVerdict(store, id, patch, options) {
  if (patch.status !== undefined && !STATUSES.has(patch.status)) {
    throw new Error(`unknown status: ${patch.status}`);
  }

  if (patch.brand !== undefined && patch.brand !== null && !BRANDS.has(patch.brand)) {
    throw new Error(`unknown brand: ${patch.brand}`);
  }

  // A per-clip format choice. null puts it back on the run-wide default.
  if (patch.format !== undefined && patch.format !== null && !FORMATS.has(patch.format)) {
    throw new Error(`unknown format: ${patch.format}`);
  }

  if (patch.topic !== undefined && patch.topic !== null && typeof patch.topic !== 'string') {
    throw new Error('topic must be a string');
  }

  if (patch.captions !== undefined && patch.captions !== null && !captionsShapeOk(patch.captions)) {
    throw new Error('captions must be an array of {start, end, text}');
  }

  const before = store[id] ?? { status: 'pending', feedback: '' };
  const after = {
    status: patch.status ?? before.status,
    feedback: patch.feedback ?? before.feedback,
    ...('brand' in patch ? { brand: patch.brand } : before.brand ? { brand: before.brand } : {}),
    // A written title/caption edit persists across trims; null is the
    // reviewer's own "go back to what the extractor/transcript said" — same
    // convention as the trim's start/end below.
    ...('topic' in patch ? { topic: patch.topic } : before.topic !== undefined ? { topic: before.topic } : {}),
    ...('captions' in patch ? { captions: patch.captions } : before.captions !== undefined ? { captions: before.captions } : {}),
    ...('format' in patch ? { format: patch.format } : before.format !== undefined ? { format: before.format } : {}),
    ...trimFrom(patch, before),
    updatedAt: new Date().toISOString(),
  };
  store[id] = after;

  if (after.status !== before.status) {
    syncApprovedFile(id, after.status, options);
  }
  return after;
}

/**
 * The trim carried on a review record.
 *
 * `null` is a real value here — it means "back to the extractor's own in and
 * out points" — so it has to be distinguishable from a patch that says nothing
 * about the trim at all and should leave it alone.
 */
function trimFrom(patch, before) {
  const trim = {};
  if ('start' in patch) trim.start = coerceTime(patch.start, 'start');
  else if (before.start !== undefined) trim.start = before.start;

  if ('end' in patch) trim.end = coerceTime(patch.end, 'end');
  else if (before.end !== undefined) trim.end = before.end;

  if (trim.start !== undefined && trim.start !== null && trim.end !== undefined && trim.end !== null) {
    if (trim.end <= trim.start) throw new Error('the clip would end before it starts');
  }
  return trim;
}

function coerceTime(value, which) {
  if (value === null) return null;
  const seconds = Number(value);
  if (!Number.isFinite(seconds) || seconds < 0) throw new Error(`${which} is not a time`);
  return Math.round(seconds * 100) / 100;
}

function captionsShapeOk(value) {
  return (
    Array.isArray(value) &&
    value.every(
      (c) =>
        c && typeof c === 'object' &&
        Number.isFinite(c.start) && Number.isFinite(c.end) && c.end > c.start &&
        typeof c.text === 'string',
    )
  );
}

/**
 * Make the approved folder agree with a clip's status.
 *
 * Every step is guarded on the source existing: a clip can be approved before
 * it has been rendered, and that should record the verdict rather than crash.
 */
function syncApprovedFile(id, status, { renderDir, approvedDir, move, file }) {
  const name = file ?? `${id}.mp4`;
  const from = join(renderDir, name);
  const to = join(approvedDir, name);

  if (status === 'approved') {
    if (!existsSync(from)) return { moved: false, reason: 'not rendered' };
    mkdirSync(approvedDir, { recursive: true });
    if (move) renameSync(from, to);
    else copyFileSync(from, to);
    copySidecars(id, name, renderDir, approvedDir, move);
    return { moved: true };
  }

  // No longer approved — take it back out of the folder.
  if (!existsSync(to)) return { moved: false };
  if (move) {
    renameSync(to, from);
    copySidecars(id, name, approvedDir, renderDir, true);
  } else {
    rmSync(to, { force: true });
    removeSidecars(id, name, approvedDir);
  }
  return { moved: true };
}

/** Files that travel with a clip: its captions, and a poster if one was made. */
function sidecarNames(id, name) {
  const stem = name.slice(0, name.length - extname(name).length);
  return [`${stem}.srt`, `${id}.srt`, `${stem}.jpg`, `${stem}.png`];
}

function copySidecars(id, name, fromDir, toDir, move) {
  for (const sidecar of new Set(sidecarNames(id, name))) {
    const from = join(fromDir, sidecar);
    if (!existsSync(from)) continue;
    if (move) renameSync(from, join(toDir, sidecar));
    else copyFileSync(from, join(toDir, sidecar));
  }
}

function removeSidecars(id, name, dir) {
  for (const sidecar of new Set(sidecarNames(id, name))) {
    rmSync(join(dir, sidecar), { force: true });
  }
}

/**
 * Write the feedback alongside the approved files.
 *
 * The reviews.json is the record, but it sits in the render folder. Whoever
 * picks up the approved folder to post from wants the caption and the notes
 * with the files, not a path back into the tooling.
 */
export function writeApprovedIndex(approvedDir, clips) {
  const approved = clips.filter((c) => c.status === 'approved');
  if (!approved.length) {
    rmSync(join(approvedDir, 'approved.csv'), { force: true });
    return null;
  }

  mkdirSync(approvedDir, { recursive: true });
  const header = ['File', 'Student', 'Topic', 'Awareness Category', 'Suggested Caption', 'CTA', 'Feedback', 'Source'];
  const rows = approved.map((c) => [
    c.file ?? `${c.id}.mp4`,
    c.student,
    c.topic,
    c.awareness,
    c.suggestedCaption,
    c.cta,
    c.feedback,
    c.sourceUrl,
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map(csvEscape).join(','))
    .join('\n');

  const path = join(approvedDir, 'approved.csv');
  writeFileSync(path, `${csv}\n`, 'utf8');
  return path;
}

function csvEscape(value) {
  const s = value === null || value === undefined ? '' : String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/**
 * The batch to render, written in the extractor's own manifest shape.
 *
 * This is what trimming is for. The renderer takes a manifest; this writes one
 * containing the approved clips only, at the in and out points the reviewer
 * settled on, with captions re-cut from the lesson transcript to match. So the
 * render is of what was approved, rather than of what the model first proposed.
 *
 *   node scripts/render-all.mjs --manifest <this file> --video-dir ~/Videos
 */
/** A lesson link that opens at a given second. */
function deepLink(url, start) {
  if (!url || start === null || start === undefined) return '';
  const t = Math.floor(start);
  return url.includes('?') ? `${url}&t=${t}s` : `${url}?t=${t}s`;
}

export function writeRenderManifest(path, clips, { lessons, transcripts, captionsFor, formatState }) {
  const approved = clips.filter((c) => c.status === 'approved');
  const byLesson = new Map();

  for (const clip of approved) {
    if (!byLesson.has(clip.lessonId)) byLesson.set(clip.lessonId, []);
    byLesson.get(clip.lessonId).push(clip);
  }

  const out = {
    generatedAt: new Date().toISOString(),
    source: 'clip-review',
    // The run-wide output shape from the review page, so a render started
    // outside the page (MAKE CLIPS.command) still honors what was picked
    // there. Per-clip `format` entries below beat this; a CLI --format or
    // --both flag beats everything. 'both' means render every clip twice.
    ...(formatState
      ? { renderFormat: formatState.both ? 'both' : formatState.format || 'vertical' }
      : {}),
    lessons: [],
  };

  for (const lesson of lessons) {
    const picked = byLesson.get(lesson.id);
    if (!picked?.length) continue;

    const transcript = transcripts.get(lesson.id);
    out.lessons.push({
      id: lesson.id,
      videoTitle: lesson.videoTitle,
      student: lesson.student,
      date: lesson.date,
      url: lesson.url,
      clipCount: picked.length,
      clips: picked.map((clip) => {
        // A reviewer's rewritten captions win over what the transcript says —
        // that is the entire point of being able to edit them. The override
        // is kept in the lesson's absolute timeline (same as what the review
        // page displays and edits against), so it is rebased to the clip's
        // own 0-start timeline here exactly the way captionsFor() would.
        const captions = clip.captionsOverride
          ? clip.captionsOverride
              .map((c) => ({
                start: Math.max(0, c.start - clip.start),
                end: Math.min(clip.end, c.end) - clip.start,
                text: c.text,
              }))
              .filter((c) => c.end > c.start)
          : clip.start === null || clip.end === null
            ? []
            : captionsFor(transcript, clip.start, clip.end);

        return {
          id: clip.id,
          rank: clip.rank,
          awarenessLabel: clip.awareness,
          highValueType: clip.highValueType || null,
          topic: clip.topic,
          cta: clip.cta,
          clipType: clip.clipType,
          start: clip.start,
          end: clip.end,
          durationSeconds: clip.durationSeconds,
          durationEstimated: clip.durationEstimated,
          // Follows the trim: a link that still points at the model's original
          // in-point sends you to the wrong moment once the clip has moved.
          clipUrl: deepLink(lesson.url, clip.start) || clip.sourceUrl,
          quote: clip.quote,
          whyItHooks: clip.whyItHooks,
          suggestedCaption: clip.suggestedCaption,
          score: clip.score,
          trimmed: clip.trimmed,
          reviewNote: clip.feedback,
          brand: clip.brand,
          // A per-clip choice beats the run-wide one; the renderer's own
          // --format/--both beats both of them. Absent here means "no clip
          // override", which lets the CLI flag decide.
          ...(clip.formatOverride ? { format: clip.formatOverride } : {}),
          captions,
          // The renderer needs an in-point and cues to cut against. A clip
          // approved without either is carried here but marked unrenderable,
          // so it is listed and skipped rather than silently dropped.
          renderable: Boolean(captions.length) && clip.start !== null,
        };
      }),
    });
  }

  writeFileSync(path, `${JSON.stringify(out, null, 2)}\n`, 'utf8');
  return { path, lessons: out.lessons.length, clips: approved.length };
}
