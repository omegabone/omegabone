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

  const before = store[id] ?? { status: 'pending', feedback: '' };
  const after = {
    status: patch.status ?? before.status,
    feedback: patch.feedback ?? before.feedback,
    updatedAt: new Date().toISOString(),
  };
  store[id] = after;

  if (after.status !== before.status) {
    syncApprovedFile(id, after.status, options);
  }
  return after;
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
