#!/usr/bin/env node
/**
 * Opens the clip review page on the latest extractor batch.
 *
 * Nothing needs choosing: the batch is whatever the extractor last wrote, the
 * lesson videos are matched to it by name, and the page opens on the first clip
 * still waiting for a decision.
 */

import { parseArgs } from 'node:util';
import { existsSync, mkdirSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createReviewServer } from '../src/server.mjs';
import { loadConfig, saveConfig } from '../src/config.mjs';
import { readLessons, scanRenders } from '../src/library.mjs';
import { loadTranscripts } from '../src/transcript.mjs';
import { resolveSources } from '../src/sources.mjs';

const { values: passed } = parseArgs({
  options: {
    manifest: { type: 'string' },
    transcripts: { type: 'string' },
    'video-dir': { type: 'string' },
    video: { type: 'string' },
    clips: { type: 'string' },
    approved: { type: 'string' },
    state: { type: 'string' },
    port: { type: 'string' },
    move: { type: 'boolean', default: false },
    // parseArgs has no --no-<flag> negation, so the negative is the option.
    'no-open': { type: 'boolean', default: false },
    format: { type: 'string' },
    help: { type: 'boolean', default: false, short: 'h' },
  },
});

if (passed.help) {
  console.log(`
review-clips — watch, trim and approve the clips the extractor picked

Usage
  node bin/review.mjs --video-dir ~/Videos/lessons

Options
  --manifest <path>    Extractor batch to review
                       (default ../clip-extractor/clips-out/manifest.json)
  --transcripts <path> Timed transcripts for trimming
                       (default transcripts.json beside the manifest)
  --video-dir <dir>    Lesson videos, matched to lessons by student and date.
                       This is what a clip is previewed and trimmed against
                       before it has been rendered.
  --video <file>       One lesson video for every clip (single-lesson runs)
  --clips <dir>        Rendered clips, if any (default ../clip-renderer/out)
  --approved <dir>     Where approved renders are copied (default <clips>/approved)
  --state <dir>        Where reviews.json and approved-manifest.json are kept
                       (default beside the manifest)
  --port <n>           Port to serve on (default 4321)
  --move               Move approved renders instead of copying them
  --format <name>      Default render shape for the run: vertical (IG/TikTok
                       9:16) or horizontal (YouTube 16:9). Per-clip choices in
                       the page beat this. Saved like the other settings.
  --no-open            Do not open a browser
  -h, --help           This

Approving writes approved-manifest.json — the approved clips only, at the in
and out points you trimmed them to, with their captions re-cut to match. Render
that batch with:

  cd ../clip-renderer
  node scripts/render-all.mjs --manifest <state>/approved-manifest.json --video-dir <dir>
`);
  process.exit(0);
}

// Anything given now is remembered, so the next run — a double-click on the
// launcher — needs nothing at all.
const saved = loadConfig();

// Defaults are relative to this tool, not to wherever it was run from — the
// launcher scripts run it from their own folder, and a sibling path resolved
// against the shell's working directory lands somewhere that does not exist.
const near = (path) => fileURLToPath(new URL(path, import.meta.url));

const args = {
  manifest: near('../../clip-extractor/clips-out/manifest.json'),
  clips: near('../../clip-renderer/out'),
  rendererDir: near('../../clip-renderer'),
  port: '4321',
  ...saved,
  ...Object.fromEntries(Object.entries(passed).filter(([, v]) => v !== undefined && v !== false)),
};
const remembered = saveConfig({ ...saved, ...passed });

const manifestPath = resolve(args.manifest);
if (!existsSync(manifestPath)) {
  console.error(`No batch to review: ${manifestPath}`);
  console.error('Run the extractor first, or pass --manifest.');
  process.exit(1);
}

const stateDir = args.state ? resolve(args.state) : dirname(manifestPath);
const renderDir = args.clips ? resolve(args.clips) : dirname(manifestPath);
const approvedDir = args.approved ? resolve(args.approved) : join(renderDir, 'approved');
const transcriptsPath = args.transcripts
  ? resolve(args.transcripts)
  : join(dirname(manifestPath), 'transcripts.json');
const port = Number(args.port);

// The run-wide default render shape, remembered like the paths. A value that
// is not one of the two shapes falls back to vertical rather than refusing to
// start — the page shows what it will do either way.
const runFormat = args.format === 'horizontal' ? 'horizontal' : 'vertical';

if (approvedDir === renderDir) {
  console.error('The approved folder cannot be the clips folder.');
  process.exit(1);
}

mkdirSync(stateDir, { recursive: true });

const { lessons } = readLessons(manifestPath);
const clipCount = lessons.reduce((n, lesson) => n + lesson.clips.length, 0);
const transcripts = loadTranscripts(transcriptsPath);
const sources = resolveSources(lessons, { videoDir: args['video-dir'], video: args.video });
const rendered = scanRenders(renderDir);

if (!clipCount) {
  console.error('That batch has no clips in it.');
  process.exit(1);
}

const rendererScript = join(args.rendererDir, 'scripts', 'render-all.mjs');

const server = createReviewServer({
  manifestPath,
  transcriptsPath,
  renderDir,
  approvedDir,
  stateDir,
  videoDir: args['video-dir'],
  video: args.video,
  move: args.move,
  rendererScript: existsSync(rendererScript) ? rendererScript : null,
  rendererCwd: args.rendererDir,
  runFormat,
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is busy. Pass --port to pick another.`);
    process.exit(1);
  }
  throw err;
});

server.listen(port, '127.0.0.1', () => {
  const url = `http://localhost:${port}`;
  const withWords = [...transcripts.values()].filter((t) => t.hasWords).length;

  console.log(`
  Batch      ${clipCount} clips across ${lessons.length} lesson(s)
  Lesson video for ${sources.size} of ${lessons.length}${sources.size < lessons.length ? '   (pass --video-dir to preview the rest)' : ''}
  Transcript for ${transcripts.size} of ${lessons.length}${transcripts.size ? `   (${withWords} with real word timings)` : '   (no trimming by word)'}
  Rendered   ${rendered.size} clip file(s) in ${renderDir}
  Approved   ${stateDir}/approved-manifest.json

  Reviewing  ${url}
${remembered ? '\n  Settings remembered — next time, double-click "Review clips.command".\n' : ''}
  Ctrl-C to stop.
`);
  if (!args['no-open']) openBrowser(url);
});

/** Best-effort browser open; the URL is printed either way. */
function openBrowser(url) {
  const cmd =
    process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
  try {
    const child = spawn(cmd, [url], {
      stdio: 'ignore',
      detached: true,
      shell: process.platform === 'win32',
    });
    child.on('error', () => {});
    child.unref();
  } catch {
    // Headless or no handler — the printed URL is the fallback.
  }
}
