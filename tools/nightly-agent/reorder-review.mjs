#!/usr/bin/env node
/**
 * Normalise student names and put the review queue in priority order.
 *
 * Student names are parsed out of hand-typed filenames, so the same person
 * arrives as "Muse" / "Meta Muse" / "MetaMuse", and "Ira" also appears as
 * "Vega". The review page groups and resolves videos by that name, so the
 * aliases have to be collapsed before anything else works.
 *
 * Priority: Ira and MetaMuse first (the two whose posts are needed now),
 * then the other students, then Antoine — his queue is already scheduled
 * out to November.
 *
 *   node reorder-review.mjs --manifest <manifest.json> [--transcripts <t.json>]
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, extname } from 'node:path';

const ALIASES = new Map([
  ['muse', 'MetaMuse'],
  ['metamuse', 'MetaMuse'],
  ['meta muse', 'MetaMuse'],
  ['vega', 'Ira'],
  ['ira', 'Ira'],
]);

const PRIORITY = ['Ira', 'MetaMuse'];
const LAST = 'Antoine';

const args = process.argv.slice(2);
const get = (f) => { const i = args.indexOf(f); return i === -1 ? null : args[i + 1]; };
const manifestPath = get('--manifest');
const transcriptsPath = get('--transcripts');
const lessonsDir = get('--lessons') || 'lessons';
if (!manifestPath) { console.error('need --manifest'); process.exit(1); }

const norm = (s) => String(s ?? '').normalize('NFKD').toLowerCase().replace(/[^a-z0-9]/g, '');

/**
 * The student is more reliably read from the title than from whatever the
 * extractor's filename parse produced ("MAy2026" is a date, not a person).
 */
function studentFor(lesson) {
  const title = String(lesson.videoTitle ?? '');
  const t = title.toLowerCase();
  for (const [alias, canonical] of ALIASES) {
    if (t.includes(alias)) return canonical;
  }
  const raw = String(lesson.student ?? '').trim();
  const viaAlias = ALIASES.get(raw.toLowerCase());
  if (viaAlias) return viaAlias;
  // A "student" that is really a date means the filename had no separator.
  if (/^\d|20\d\d$/.test(raw) || !raw) {
    const m = title.match(/with\s+([A-Za-z][A-Za-z ]*?)\s*\d/);
    if (m) return m[1].trim();
  }
  return raw || 'Unknown';
}

/** Date as it appears in the filename — that's what video matching compares. */
function dateFor(lesson) {
  if (lesson.date) return lesson.date;
  const m = String(lesson.videoTitle ?? '').match(/(\d{1,2}\.?[A-Za-z]{3,5}\.?\d{4})/);
  return m ? m[1] : '';
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const videoFiles = existsSync(lessonsDir)
  ? readdirSync(lessonsDir).filter((f) => ['.mp4', '.mov', '.mkv', '.webm'].includes(extname(f).toLowerCase()))
  : [];

const missingVideo = [];
for (const lesson of manifest.lessons) {
  lesson.student = studentFor(lesson);
  lesson.date = dateFor(lesson);

  const st = norm(lesson.student), dt = norm(lesson.date);
  const both = videoFiles.find((f) => st && dt && norm(f).includes(st) && norm(f).includes(dt));
  const byStudent = videoFiles.filter((f) => st && norm(f).includes(st));
  if (!both && byStudent.length !== 1) missingVideo.push(lesson);
}

const rank = (lesson) => {
  const i = PRIORITY.indexOf(lesson.student);
  if (i !== -1) return i;                    // Ira, then MetaMuse
  if (lesson.student === LAST) return 99;    // Antoine dead last
  return 50;                                 // everyone else in between
};

manifest.lessons.sort((a, b) => rank(a) - rank(b) || String(a.date).localeCompare(String(b.date)));
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

if (transcriptsPath && existsSync(transcriptsPath)) {
  const t = JSON.parse(readFileSync(transcriptsPath, 'utf8'));
  const order = new Map(manifest.lessons.map((l, i) => [l.id, i]));
  for (const lesson of t.lessons ?? []) {
    const match = manifest.lessons.find((l) => l.id === lesson.id);
    if (match) { lesson.student = match.student; lesson.date = match.date; }
  }
  (t.lessons ?? []).sort((a, b) => (order.get(a.id) ?? 999) - (order.get(b.id) ?? 999));
  writeFileSync(transcriptsPath, JSON.stringify(t, null, 2));
}

const counts = new Map();
for (const l of manifest.lessons) {
  counts.set(l.student, (counts.get(l.student) ?? 0) + (l.clips?.length ?? 0));
}

console.log('review order (clips per student):');
const seen = new Set();
for (const l of manifest.lessons) {
  if (seen.has(l.student)) continue;
  seen.add(l.student);
  const tag = PRIORITY.includes(l.student) ? ' ← PRIORITY' : l.student === LAST ? ' ← last' : '';
  console.log(`  ${String(counts.get(l.student)).padStart(4)}  ${l.student}${tag}`);
}

if (missingVideo.length) {
  console.log(`\n${missingVideo.length} lesson(s) have NO video file — no preview until downloaded:`);
  for (const l of missingVideo) console.log(`  ${l.videoTitle}  (${l.clips?.length ?? 0} clips)`);
}
