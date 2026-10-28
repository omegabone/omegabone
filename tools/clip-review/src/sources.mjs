/**
 * Finding the lesson video a clip was cut from.
 *
 * Reviewing before anything is rendered means playing the lesson itself across
 * the clip's window, so the source has to be resolvable from the lesson alone.
 * The matching rule is the renderer's, deliberately — a batch that renders is a
 * batch that previews, and two different rules would mean a clip you could
 * review but not render, or the reverse.
 *
 * (tools/clip-renderer/scripts/render-all.mjs → resolveVideo)
 */

import { existsSync, readdirSync } from 'node:fs';
import { join, resolve, extname } from 'node:path';

const VIDEO_EXT = new Set(['.mp4', '.mov', '.mkv', '.webm', '.m4v']);

/** Normalise for loose filename matching. */
const norm = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '');

/**
 * Index the lesson videos a batch can be reviewed against.
 *
 * Returns a Map of lesson id to absolute path. Lessons with no match are simply
 * absent — they are still reviewable, just without a picture.
 */
export function resolveSources(lessons, { videoDir, video } = {}) {
  const found = new Map();

  if (video) {
    const path = resolve(video);
    if (existsSync(path)) for (const lesson of lessons) found.set(lesson.id, path);
    return found;
  }

  if (!videoDir) return found;
  const dir = resolve(videoDir);
  if (!existsSync(dir)) return found;

  const files = readdirSync(dir).filter((f) => VIDEO_EXT.has(extname(f).toLowerCase()));

  for (const lesson of lessons) {
    const student = norm(lesson.student);
    const date = norm(lesson.date);

    // Prefer a file naming both the student and the date; fall back to student.
    const both = files.find(
      (f) => student && date && norm(f).includes(student) && norm(f).includes(date),
    );
    if (both) {
      found.set(lesson.id, join(dir, both));
      continue;
    }

    const byStudent = files.filter((f) => student && norm(f).includes(student));
    if (byStudent.length === 1) {
      found.set(lesson.id, join(dir, byStudent[0]));
    } else if (byStudent.length > 1) {
      console.warn(
        `  ambiguous: ${byStudent.length} files match "${lesson.student}" — name them with the date to disambiguate`,
      );
    }
  }

  return found;
}
