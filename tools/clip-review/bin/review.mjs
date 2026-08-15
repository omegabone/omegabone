#!/usr/bin/env node
/**
 * Opens the clip review page against a folder of rendered clips.
 *
 * Usage:
 *   node bin/review.mjs --clips ../clip-renderer/out
 */

import { parseArgs } from 'node:util';
import { existsSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { spawn } from 'node:child_process';
import { createReviewServer } from '../src/server.mjs';
import { scanRenders } from '../src/library.mjs';

const { values: args } = parseArgs({
  options: {
    clips: { type: 'string', default: '../clip-renderer/out' },
    approved: { type: 'string' },
    manifest: { type: 'string', default: '../clip-extractor/clips-out/manifest.json' },
    port: { type: 'string', default: '4321' },
    move: { type: 'boolean', default: false },
    // parseArgs has no --no-<flag> negation, so the negative is the option.
    'no-open': { type: 'boolean', default: false },
    help: { type: 'boolean', default: false, short: 'h' },
  },
});

if (args.help) {
  console.log(`
review-clips — watch rendered clips, write feedback, approve into a folder

Usage
  node bin/review.mjs --clips ../clip-renderer/out

Options
  --clips <dir>      Folder of rendered clips (default ../clip-renderer/out)
  --approved <dir>   Where approved clips go (default <clips>/approved)
  --manifest <path>  Extractor manifest, for clip metadata
                     (default ../clip-extractor/clips-out/manifest.json)
  --port <n>         Port to serve on (default 4321)
  --move             Move approved clips instead of copying them
  --no-open          Do not open a browser
  -h, --help         This

Approving copies the clip into the approved folder and writes approved.csv
there with the caption, CTA and your feedback. Un-approving takes it back out.
Verdicts and feedback are saved to reviews.json in the clips folder as you go.
`);
  process.exit(0);
}

const renderDir = resolve(args.clips);
const approvedDir = args.approved ? resolve(args.approved) : join(renderDir, 'approved');
const manifestPath = resolve(args.manifest);
const port = Number(args.port);

if (!existsSync(renderDir)) {
  console.error(`Clips folder not found: ${renderDir}`);
  console.error('Render some clips first, or pass --clips.');
  process.exit(1);
}

if (approvedDir === renderDir) {
  console.error('The approved folder cannot be the clips folder.');
  process.exit(1);
}

const rendered = scanRenders(renderDir);
if (!rendered.size) {
  console.warn(`No video files in ${renderDir} yet — the page will list the manifest only.`);
}
if (!existsSync(manifestPath)) {
  console.warn(`No manifest at ${manifestPath} — clips will show without their metadata.`);
}

mkdirSync(approvedDir, { recursive: true });

const server = createReviewServer({ renderDir, approvedDir, manifestPath, move: args.move });

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is busy. Pass --port to pick another.`);
    process.exit(1);
  }
  throw err;
});

server.listen(port, '127.0.0.1', () => {
  const url = `http://localhost:${port}`;
  console.log(`
  Clips     ${renderDir} (${rendered.size} rendered)
  Approved  ${approvedDir} ${args.move ? '(moving)' : '(copying)'}
  Reviewing ${url}

  Ctrl-C to stop.
`);
  if (!args['no-open']) openBrowser(url);
});

/** Best-effort browser open; the URL is printed either way. */
function openBrowser(url) {
  const cmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
  try {
    const child = spawn(cmd, [url], { stdio: 'ignore', detached: true, shell: process.platform === 'win32' });
    child.on('error', () => {});
    child.unref();
  } catch {
    // Headless or no handler — the printed URL is the fallback.
  }
}
