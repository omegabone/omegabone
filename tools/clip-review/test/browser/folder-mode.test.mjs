/**
 * Folder-mode tests. Run with: npm run test:browser
 *
 * These open review.html the way a reviewer does when there is no server — as
 * a file:// page — and drive its folder backend against a stand-in directory
 * handle held in memory. The real one comes from the browser's folder picker,
 * which no test can click, but everything behind it is the code under test:
 * the folder scan, reviews.json, and the copies into approved/.
 *
 * Skipped when Playwright is not installed, which is why it is not part of
 * `npm test` — this package otherwise has no dependencies at all.
 */

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const PAGE = 'file://' + fileURLToPath(new URL('../../review.html', import.meta.url));

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.log('Playwright not installed — skipping folder-mode tests.');
}

const MANIFEST = {
  lessons: [
    {
      videoTitle: 'Vocal Mastery with Brittany',
      student: 'Brittany',
      date: '21 May 2026',
      url: 'https://youtube.com/live/x',
      clips: [
        {
          id: 'brittany-21-may-1',
          rank: 1,
          topic: 'Breath and the soft palate',
          awarenessLabel: 'Solution aware',
          cta: 'Book a lesson',
          suggestedCaption: 'Lift the eyebrows',
          durationSeconds: 42,
          clipUrl: 'https://youtube.com/live/x?t=120s',
          renderable: true,
        },
      ],
    },
  ],
};

/** An in-memory stand-in for the File System Access handles the picker returns. */
const FAKE_FS = `
  window.__fs = (function () {
    function makeFile(name, data) {
      var handle = {
        kind: 'file',
        name: name,
        getFile: function () {
          return Promise.resolve(new File([handle.data], name));
        },
        createWritable: function () {
          return Promise.resolve({
            write: function (chunk) { handle.data = chunk; return Promise.resolve(); },
            close: function () { return Promise.resolve(); },
          });
        },
        data: data,
      };
      return handle;
    }

    function missing() {
      return Promise.reject(new DOMException('not found', 'NotFoundError'));
    }

    function makeDir(name) {
      var entries = new Map();
      return {
        kind: 'directory',
        name: name,
        entries: entries,
        values: function () {
          var list = Array.from(entries.values());
          var i = 0;
          return { next: function () {
            return Promise.resolve(i < list.length ? { value: list[i++], done: false } : { done: true });
          } };
        },
        getFileHandle: function (n, opts) {
          var found = entries.get(n);
          if (found && found.kind === 'file') return Promise.resolve(found);
          if (opts && opts.create) {
            var made = makeFile(n, '');
            entries.set(n, made);
            return Promise.resolve(made);
          }
          return missing();
        },
        getDirectoryHandle: function (n, opts) {
          var found = entries.get(n);
          if (found && found.kind === 'directory') return Promise.resolve(found);
          if (opts && opts.create) {
            var made = makeDir(n);
            entries.set(n, made);
            return Promise.resolve(made);
          }
          return missing();
        },
        removeEntry: function (n) {
          if (!entries.delete(n)) return missing();
          return Promise.resolve();
        },
        queryPermission: function () { return Promise.resolve('granted'); },
        requestPermission: function () { return Promise.resolve('granted'); },
      };
    }

    return { makeDir: makeDir, makeFile: makeFile };
  })();
`;

/** Contents of the fake approved/ folder, as plain data. */
const READ_APPROVED = `
  (function () {
    var dir = window.__dir.entries.get('approved');
    if (!dir) return null;
    var out = {};
    dir.entries.forEach(function (entry, name) {
      // Blobs read back as "[object File]"; that a file is there at all is the
      // assertion, and the CSV is the only entry whose text matters.
      out[name] = entry.kind === 'directory' ? '[dir]' : String(entry.data);
    });
    return out;
  })()
`;

let browser;
let page;

before(async () => {
  if (!chromium) return;
  browser = await chromium.launch();
  page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.on('pageerror', (err) => assert.fail(`page error: ${err.message}`));

  await page.goto(PAGE);
  await page.evaluate(FAKE_FS);

  // A real clip, so the player is exercised rather than mocked around.
  const video = readFileSync(new URL('./fixtures/clip.webm', import.meta.url)).toString('base64');

  await page.evaluate(
    ([manifest, videoBase64]) => {
      const bytes = Uint8Array.from(atob(videoBase64), (c) => c.charCodeAt(0));
      const dir = window.__fs.makeDir('clips');
      dir.entries.set('brittany-21-may-1.webm', window.__fs.makeFile('brittany-21-may-1.webm', new Blob([bytes])));
      dir.entries.set('brittany-21-may-1.srt', window.__fs.makeFile('brittany-21-may-1.srt', '1\\n00:00:00,000 --> 00:00:02,000\\nLift the eyebrows\\n'));
      dir.entries.set('manifest.json', window.__fs.makeFile('manifest.json', manifest));
      window.__dir = dir;
      return window.ClipReview.openFolder(dir, null);
    },
    [JSON.stringify(MANIFEST), video],
  );
  await page.waitForTimeout(200);
});

after(async () => {
  if (browser) await browser.close();
});

test('a local page can open a folder at all', { skip: !chromium }, async () => {
  const support = await page.evaluate(() => ({
    secure: window.isSecureContext,
    picker: typeof window.showDirectoryPicker === 'function',
  }));

  assert.equal(support.secure, true, 'file:// is a secure context, so the API is available');
  assert.equal(support.picker, true, 'the folder picker exists');
});

test('clips are listed from the folder, with metadata from its manifest', { skip: !chromium }, async () => {
  assert.equal(await page.locator('.row').count(), 1);
  assert.equal(await page.locator('#topic').textContent(), 'Breath and the soft palate');
  assert.match(await page.locator('#facts').innerText(), /Lift the eyebrows/);
});

test('the video plays from the folder, without a server', { skip: !chromium }, async () => {
  const ready = await page.locator('#video').evaluate((v) => new Promise((resolve) => {
    if (v.readyState >= 1) return resolve(v.readyState);
    v.addEventListener('loadedmetadata', () => resolve(v.readyState), { once: true });
    setTimeout(() => resolve(v.readyState), 5000);
  }));

  assert.ok(ready >= 1, `metadata loaded (readyState ${ready})`);
  assert.match(await page.locator('#video').evaluate((v) => v.src), /^blob:/);
});

test('approving copies the clip and its captions into approved/', { skip: !chromium }, async () => {
  await page.locator('#feedback').fill('Strong hook. Trim the first half second.');
  await page.locator('#feedback').blur();
  await page.waitForTimeout(300);
  await page.keyboard.press('a');
  await page.waitForTimeout(400);

  const approved = await page.evaluate(READ_APPROVED);
  assert.ok(approved['brittany-21-may-1.webm'], 'the clip is in approved/');
  assert.ok(approved['brittany-21-may-1.srt'], 'captions travel with it');
  assert.match(approved['approved.csv'], /Lift the eyebrows/);
  assert.match(approved['approved.csv'], /Trim the first half second/);

  const reviews = await page.evaluate(() => String(window.__dir.entries.get('reviews.json').data));
  assert.match(reviews, /"status": "approved"/);
  assert.match(reviews, /Trim the first half second/);
});

test('the source file is never removed by an approval', { skip: !chromium }, async () => {
  const present = await page.evaluate(() => window.__dir.entries.has('brittany-21-may-1.webm'));
  assert.equal(present, true);
});

test('un-approving empties the folder again', { skip: !chromium }, async () => {
  // Approving dropped the clip out of the Undecided filter it was reviewed in,
  // so this starts where a reviewer would: in the Approved list.
  await page.getByRole('button', { name: /^Approved/ }).click();
  await page.waitForTimeout(200);
  await page.keyboard.press('u');
  await page.waitForTimeout(400);

  const approved = await page.evaluate(READ_APPROVED);
  assert.deepEqual(approved, {}, 'nothing left in approved/');

  const reviews = await page.evaluate(() => String(window.__dir.entries.get('reviews.json').data));
  assert.match(reviews, /"status": "pending"/);
  assert.match(reviews, /Trim the first half second/, 'the feedback survives the undo');
});
