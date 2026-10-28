/**
 * Trim editor tests. Run with: npm run test:browser
 *
 * These boot the real server on a small batch and drive the page in a browser,
 * because the thing worth testing only exists when both halves are running:
 * clicking a word has to move the right edge, that edge has to reach disk, and
 * the render manifest has to come out at the trimmed times. Unit tests cover
 * each half; this covers the handshake.
 *
 * Skipped when Playwright is not installed, which is why it is not part of
 * `npm test` — this package otherwise has no dependencies at all.
 */

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, copyFileSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const CLI = fileURLToPath(new URL('../../bin/review.mjs', import.meta.url));
const PAGE = fileURLToPath(new URL('../../review.html', import.meta.url));
const PORT = 4377;

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.log('Playwright not installed — skipping trim editor tests.');
}

let browser;
let page;
let server;
let batch;

/** A batch on disk: the extractor's two files, and a lesson video to match. */
function stageBatch() {
  const root = mkdtempSync(join(tmpdir(), 'clip-review-batch-'));
  const clipsOut = join(root, 'clips-out');
  const videos = join(root, 'videos');
  mkdirSync(clipsOut);
  mkdirSync(videos);

  copyFileSync(join(HERE, 'fixtures/manifest.json'), join(clipsOut, 'manifest.json'));
  copyFileSync(join(HERE, 'fixtures/transcripts.json'), join(clipsOut, 'transcripts.json'));
  // Named so the source resolver matches it to the lesson by student and date.
  copyFileSync(join(HERE, 'fixtures/clip.webm'), join(videos, 'brittany-21-may-2026.webm'));

  return { root, clipsOut, videos, manifest: join(clipsOut, 'manifest.json') };
}

function startServer(staged) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [
        CLI,
        '--manifest', staged.manifest,
        '--video-dir', staged.videos,
        '--clips', join(staged.root, 'renders'),
        '--port', String(PORT),
        '--no-open',
      ],
      {
        // Keeps the run from writing over the settings of whoever reviews on
        // this machine.
        env: { ...process.env, CLIP_REVIEW_CONFIG: join(staged.root, 'config.json') },
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    );

    let out = '';
    const timer = setTimeout(() => reject(new Error(`server did not start:\n${out}`)), 10000);

    child.stdout.on('data', (chunk) => {
      out += chunk;
      if (out.includes('Reviewing')) {
        clearTimeout(timer);
        resolve(child);
      }
    });
    child.stderr.on('data', (chunk) => {
      out += chunk;
    });
    child.on('exit', () => {
      clearTimeout(timer);
      reject(new Error(`server exited:\n${out}`));
    });
  });
}

before(async () => {
  if (!chromium) return;
  batch = stageBatch();
  server = await startServer(batch);

  browser = await chromium.launch();
  page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
  page.on('pageerror', (err) => assert.fail(`page error: ${err.message}`));

  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
});

after(async () => {
  if (browser) await browser.close();
  if (server) server.kill();
});

test('the batch opens on its own, with nothing to choose', { skip: !chromium }, async () => {
  assert.equal(await page.locator('.row').count(), 2);
  assert.equal(await page.locator('#topic').textContent(), 'Raise the eyebrows');
  assert.equal(await page.locator('#welcome').isVisible(), false, 'no folder picker');
});

test('the clip plays from the lesson video, before anything is rendered', { skip: !chromium }, async () => {
  assert.equal(await page.locator('#video').getAttribute('data-windowed'), 'true');
  assert.match(await page.locator('#video').getAttribute('src'), /^\/source\//);

  const ready = await page.locator('#video').evaluate((v) => new Promise((resolve) => {
    if (v.readyState >= 1) return resolve(v.readyState);
    v.addEventListener('loadedmetadata', () => resolve(v.readyState), { once: true });
    setTimeout(() => resolve(v.readyState), 5000);
  }));
  assert.ok(ready >= 1, `lesson video loaded (readyState ${ready})`);
});

test('the transcript shows the clip and the words around it', { skip: !chromium }, async () => {
  const all = await page.locator('.word').count();
  const inside = await page.locator('.word.in').count();

  assert.ok(all > inside, 'there is context to pull the boundary out over');
  assert.ok(inside > 0, 'the clip itself is marked');
  assert.match(await page.locator('#trim-help').textContent(), /check the cut by ear/,
    'estimated word times are declared as estimated');
});

test('clicking a word before the clip lengthens it', { skip: !chromium }, async () => {
  assert.equal(await page.locator('#start').inputValue(), '1');
  const before = await page.locator('.word.in').count();

  await page.locator('.word:not(.in)').first().click();
  await page.waitForTimeout(400);

  assert.equal(await page.locator('#start').inputValue(), '0', 'the in-point moved out to that word');
  assert.equal(await page.locator('#end').inputValue(), '3', 'the out-point stayed where it was');
  assert.ok(await page.locator('.word.in').count() > before, 'more of the transcript is in the clip');
  assert.equal(await page.locator('#reset-trim').isVisible(), true, 'the trim can be undone');
});

test('a trim that would invert the clip is refused', { skip: !chromium }, async () => {
  await page.locator('#end').fill('0.2');
  await page.locator('#end').blur();
  await page.waitForTimeout(300);

  assert.match(await page.locator('#saved').textContent(), /less than a second/);
});

test('approving writes the render manifest at the trimmed times', { skip: !chromium }, async () => {
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  await page.keyboard.press('a');
  await page.waitForTimeout(500);

  const manifestPath = join(batch.clipsOut, 'approved-manifest.json');
  assert.ok(existsSync(manifestPath), 'the renderer has a batch to read');

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const clips = manifest.lessons[0].clips;

  assert.equal(clips.length, 1, 'only the approved clip');
  assert.equal(clips[0].id, 'brittany-1');
  assert.equal(clips[0].start, 0, 'at the trimmed in-point, not the extractor’s');
  assert.equal(clips[0].trimmed, true);
  assert.ok(clips[0].captions.length >= 3, 'captions re-cut to the longer window');
  assert.equal(clips[0].renderable, true);
});

test('opened as a file instead of served, the page says how to start it', { skip: !chromium }, async () => {
  const loose = await browser.newPage();
  await loose.goto(`file://${PAGE}`);
  await loose.waitForTimeout(400);

  assert.equal(await loose.locator('#welcome').isVisible(), true);
  assert.match(await loose.locator('#welcome').innerText(), /Review clips\.command/);
  await loose.close();
});
