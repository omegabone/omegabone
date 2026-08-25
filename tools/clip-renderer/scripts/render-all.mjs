#!/usr/bin/env node
/**
 * Renders every clip in a clip-extractor manifest.
 *
 * Reads manifest.json, resolves each clip's source video, and shells out to the
 * Remotion CLI once per clip with that clip's props.
 */

import { parseArgs } from 'node:util';
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  readdirSync,
  copyFileSync,
  rmSync,
} from 'node:fs';
import { join, resolve, extname, basename } from 'node:path';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { brandFromTitle } from './brand-from-title.mjs';

// Short, human names for filenames — distinct from theme.ts's full "presents"
// line ("Vocal Mastery for Entrepreneurs"), which is too long for a filename.
const BRAND_FILE_NAMES = {
  vme: 'Vocal_Mastery',
  frequency: 'Frequency',
  learn2sing: 'Learn_2_Sing',
  mr33: 'MusicRoom_33',
};

/** Words only — strips punctuation rather than replacing it with underscores,
 * so "Vocal Technique & Breath" becomes "Vocal_Technique_Breath" and not
 * "Vocal_Technique_&_Breath" or "Vocal_Technique__Breath". */
function sanitizeForFilename(text) {
  return String(text || '')
    .replace(/[^\p{L}\p{N}\s]+/gu, '')
    .trim()
    .replace(/\s+/g, '_');
}

const FORMAT_IDS = ['vertical', 'horizontal'];
const FORMAT_SUFFIX = { vertical: '-vertical', horizontal: '-horizontal' };

/**
 * Which formats this run renders when the CLI pins one. --both does every
 * clip twice; --format pins one for every clip — over a per-clip manifest
 * choice too, because an explicit flag on the command line is the most
 * specific thing anyone can say.
 *
 * With neither flag, the manifest decides: its run-wide renderFormat from the
 * review page, each clip's own override, then vertical.
 */
function cliFormats() {
  if (args.both) return [...FORMAT_IDS];
  if (args.format) {
    if (!FORMAT_IDS.includes(args.format)) {
      console.error(`Unknown format "${args.format}" — use vertical or horizontal.`);
      process.exit(1);
    }
    return [args.format];
  }
  return null;
}

/**
 * Brand_Title_Student, disambiguated against every name already claimed in
 * this run: an offline-mode topic like "Vocal Technique & Breath" repeats
 * across most clips in a lesson, so the same three inputs recur constantly
 * and a bare join would have later clips overwrite earlier ones.
 */
function outputFilename(brand, topic, student, formatSuffix, claimed) {
  const base = [BRAND_FILE_NAMES[brand] || sanitizeForFilename(brand), sanitizeForFilename(topic), sanitizeForFilename(student)]
    .filter(Boolean)
    .join('_') || 'clip';

  // The suffix goes on the outside of the deduplication, so the vertical and
  // horizontal cuts of one clip can never collide with each other's names.
  let name = base + formatSuffix;
  let n = 2;
  while (claimed.has(name.toLowerCase())) {
    name = `${base}_${n}${formatSuffix}`;
    n += 1;
  }
  claimed.add(name.toLowerCase());
  return `${name}.mp4`;
}

/**
 * clip.id -> rendered filename, so the review page can find a clip's file
 * without the filename having to encode the id. Merged rather than
 * overwritten: a partial re-render (--id, or a failure) must not forget
 * where every other clip's file already is.
 */
function loadRenderIndex(outDir) {
  const path = join(outDir, 'render-index.json');
  if (!existsSync(path)) return {};
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return {};
  }
}

function saveRenderIndex(outDir, index) {
  writeFileSync(join(outDir, 'render-index.json'), `${JSON.stringify(index, null, 2)}\n`, 'utf8');
}

const { values: args } = parseArgs({
  options: {
    manifest: { type: 'string', default: '../clip-extractor/clips-out/manifest.json' },
    video: { type: 'string' },
    'video-dir': { type: 'string' },
    out: { type: 'string', default: 'out' },
    id: { type: 'string' },
    'dry-run': { type: 'boolean', default: false },
    'no-captions': { type: 'boolean', default: false },
    brand: { type: 'string' },
    format: { type: 'string' },
    both: { type: 'boolean', default: false },
    help: { type: 'boolean', default: false, short: 'h' },
  },
});

if (args.help) {
  console.log(`
render-all — render clips from a clip-extractor manifest

Usage
  node scripts/render-all.mjs --manifest <manifest.json> --video-dir <dir> [options]

Source video
  --video <file>       Use one video file for every clip (single-lesson runs).
  --video-dir <dir>    Directory of source videos, matched to lessons by
                       student and date in the filename.

Options
  --out <dir>          Output directory (default out).
  --id <clipId>        Render one clip only.
  --no-captions        Skip burned-in captions.
  --brand <name>       Force one brand for every clip. By default the brand is
                       read from each lesson's title: "Learn 2 Sing ..." renders
                       purple, "Vocal Mastery ..." renders green.
  --format <name>      vertical (1080x1920, IG/TikTok) or horizontal
                       (1920x1080, YouTube). Default vertical.
  --both               Render every clip in BOTH formats — a "-vertical" and a
                       "-horizontal" file each. Overrides --format.
  --dry-run            List what would render, without rendering.

Only clips with real timecodes can be rendered. Clips cut from an untimed
library transcript have an estimated duration and no in-point, so there is
nothing to cut against — those are listed and skipped.
`);
  process.exit(0);
}

const manifestPath = resolve(args.manifest);
if (!existsSync(manifestPath)) {
  console.error(`Manifest not found: ${manifestPath}`);
  console.error('Run the extractor first, or pass --manifest.');
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const VIDEO_EXT = new Set(['.mp4', '.mov', '.mkv', '.webm', '.m4v']);

/** Normalise a string for loose filename matching. */
const norm = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '');

/** Find a video file for a lesson by matching student and date in the name. */
function resolveVideo(lesson) {
  if (args.video) return resolve(args.video);
  if (!args['video-dir']) return null;

  const dir = resolve(args['video-dir']);
  if (!existsSync(dir)) return null;

  const files = readdirSync(dir).filter((f) => VIDEO_EXT.has(extname(f).toLowerCase()));
  const student = norm(lesson.student);
  const date = norm(lesson.date);

  // Prefer a file naming both the student and the date; fall back to student.
  const both = files.find((f) => student && date && norm(f).includes(student) && norm(f).includes(date));
  if (both) return join(dir, both);

  const byStudent = files.filter((f) => student && norm(f).includes(student));
  if (byStudent.length === 1) return join(dir, byStudent[0]);
  if (byStudent.length > 1) {
    console.warn(
      `  ambiguous: ${byStudent.length} files match "${lesson.student}" — name them with the date to disambiguate`,
    );
  }
  return null;
}

const outDir = resolve(args.out);
mkdirSync(outDir, { recursive: true });

/**
 * Remotion serves assets from its own http server and rejects both absolute
 * filesystem paths and file:// URLs, so a source video has to be reachable
 * under public/. Symlink it there (copying only if the filesystem refuses
 * links) and hand the component the relative path.
 */
const STAGE_DIR = resolve('public/sources');

function stageVideo(absPath) {
  mkdirSync(STAGE_DIR, { recursive: true });
  const name = basename(absPath);
  const target = join(STAGE_DIR, name);

  // Copy rather than symlink: Remotion's bundler copies public/ into the
  // bundle and does not follow symlinks, so a linked file 404s at render time.
  if (!existsSync(target)) copyFileSync(absPath, target);
  return `sources/${name}`;
}

const jobs = [];
const skipped = [];

for (const lesson of manifest.lessons) {
  const video = resolveVideo(lesson);

  // The title states the product, so the brand comes from it unless overridden.
  const detected = brandFromTitle(lesson.videoTitle);
  const brand = args.brand ?? detected.brand;
  if (!args.brand && !detected.matched && lesson.clips.length) {
    console.warn(
      `  "${lesson.videoTitle || '(untitled)'}" matched no product in its title — rendering ${brand}`,
    );
  }
  for (const clip of lesson.clips) {
    if (args.id && clip.id !== args.id) continue;

    if (!clip.renderable) {
      skipped.push({ id: clip.id, reason: 'no timecodes in source transcript' });
      continue;
    }
    if (!video) {
      skipped.push({ id: clip.id, reason: `no source video found for ${lesson.student || 'lesson'}` });
      continue;
    }

    // A brand chosen in the review page beats one guessed from the title: the
    // reviewer looked at the clip, the title rule only looked at a string.
    const clipBrand = clip.brand || brand;

    // Format precedence, decided here once so the rest of the script just
    // follows it. An explicit --format/--both flag pins the whole run; then
    // the clip's own override; then the run-wide switch saved from the review
    // page ('both' renders every clip twice); then vertical.
    const pinned = cliFormats();
    const clipFormat =
      pinned ??
      clip.formatOverride ??
      (manifest.renderFormat === 'both' ? 'both' : manifest.renderFormat ?? 'vertical');
    const formats = clipFormat === 'both' ? [...FORMAT_IDS] : [clipFormat];
    for (const format of formats) {
      jobs.push({
        clip,
        lesson,
        format,
        props: {
          id: clip.id,
          videoSrc: stageVideo(video),
          startSeconds: clip.start,
          durationSeconds: clip.durationSeconds,
          awarenessLabel: clip.awarenessLabel,
          topic: clip.topic,
          student: lesson.student || '',
          suggestedCaption: clip.suggestedCaption,
          cta: clip.cta,
          captions: clip.captions ?? [],
          showCaptions: !args['no-captions'],
          brand: clipBrand,
          format,
        },
      });
    }
  }
}

console.log(`\nRenderable: ${jobs.length}   Skipped: ${skipped.length}`);
for (const s of skipped) console.log(`  skip ${s.id} — ${s.reason}`);
console.log();

if (args['dry-run']) {
  for (const j of jobs) {
    console.log(
      `  would render ${j.clip.id}  [${j.props.brand} · ${j.format}]  ${j.clip.durationSeconds}s @ ${j.clip.start}s  <- ${basename(j.props.videoSrc)}`,
    );
  }
  process.exit(0);
}

if (!jobs.length) {
  console.error('Nothing to render.');
  process.exit(1);
}

const renderIndex = loadRenderIndex(outDir);
const claimed = new Set(
  Object.values(renderIndex).map((f) => f.replace(/\.mp4$/i, '').toLowerCase()),
);

let ok = 0;
let failed = 0;

for (const [i, job] of jobs.entries()) {
  // Keyed per format: one clip can exist as a vertical and a horizontal file.
  const indexKey = `${job.clip.id}:${job.format}`;
  const priorFile = renderIndex[indexKey];
  if (priorFile) claimed.delete(priorFile.replace(/\.mp4$/i, '').toLowerCase());

  const filename = outputFilename(job.props.brand, job.clip.topic, job.lesson.student, FORMAT_SUFFIX[job.format], claimed);
  const outFile = join(outDir, filename);
  const propsFile = join(tmpdir(), `clip-props-${job.clip.id}-${job.format}-${process.pid}.json`);
  writeFileSync(propsFile, JSON.stringify(job.props), 'utf8');

  console.log(`[${i + 1}/${jobs.length}] ${filename} (${job.clip.durationSeconds}s)`);

  const res = spawnSync(
    'npx',
    ['remotion', 'render', 'src/index.ts', 'Clip', outFile, `--props=${propsFile}`, '--log=error'],
    { stdio: 'inherit', cwd: resolve(process.cwd()) },
  );

  if (res.status === 0) {
    ok++;
    renderIndex[indexKey] = filename;
    // The topic/brand/student changed since the last render — the old file
    // under the old name is stale and would otherwise sit there unlinked
    // from any clip, cluttering the folder with a name nothing points to.
    if (priorFile && priorFile !== filename) {
      try { rmSync(join(outDir, priorFile)); } catch { /* already gone */ }
    }
    saveRenderIndex(outDir, renderIndex);
  } else {
    failed++;
    claimed.delete(filename.replace(/\.mp4$/i, '').toLowerCase());
    console.error(`  failed: ${job.clip.id} (${job.format})`);
  }
}

console.log(`\nRendered ${ok} clip(s) to ${outDir}`);
if (failed) {
  console.log(`${failed} failed.`);
  process.exit(1);
}
