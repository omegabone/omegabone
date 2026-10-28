#!/usr/bin/env node
/**
 * Thumbnail generator — one 1280x720 PNG per lesson, straight from the
 * clip-extractor's manifest. No model calls: the headline is the lesson's
 * strongest clip hook, which the extractor already picked and scored.
 *
 *   node make-thumbnails.mjs --manifest <manifest.json> --out <dir>
 */

import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, resolve } from 'node:path';

const CHROME =
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

/** Matches tools/clip-renderer/src/theme.ts so thumbnails read as the same family. */
const BRANDS = {
  vme: { bg: '#081812', panel: '#122d1e', accent: '#7CE8A0', ink: '#ffffff', label: 'Vocal Mastery' },
  frequency: { bg: '#33090E', panel: '#3F0D12', accent: '#C42A40', ink: '#F1F0CC', label: 'Frequency' },
  learn2sing: { bg: '#130a1e', panel: '#241636', accent: '#C9A9F0', ink: '#ffffff', label: 'Learn 2 Sing' },
  mr33: { bg: '#07142c', panel: '#0f2146', accent: '#6FA3FF', ink: '#ffffff', label: 'Music 33' },
};

const RULES = [
  { brand: 'learn2sing', pattern: /learn\s*2\s*sing|\bl2s\b/i },
  { brand: 'frequency', pattern: /\bfrequency\b/i },
  { brand: 'mr33', pattern: /music\s*33|\bm(?:r)?33\b/i },
  { brand: 'vme', pattern: /vocal\s+mastery|\bvme\b/i },
];

function brandFor(title) {
  for (const r of RULES) if (r.pattern.test(String(title || ''))) return r.brand;
  return 'vme';
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * The hook is display copy, not a sentence: trailing punctuation and a
 * dangling clause read as a truncated caption at thumbnail size.
 */
function headlineFrom(clip) {
  let t = (clip.suggestedCaption || clip.topic || '').trim();
  t = t.replace(/\s+/g, ' ').replace(/[.,;:]+$/, '');
  if (t.length > 74) {
    const cut = t.slice(0, 74);
    t = cut.slice(0, cut.lastIndexOf(' ')).replace(/[.,;:—-]+$/, '');
  }
  return t;
}

function page({ headline, kicker, student, theme }) {
  const size = headline.length > 52 ? 62 : headline.length > 34 ? 74 : 88;
  return `<!doctype html><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,800&family=Inter:wght@500;700&display=swap">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:1280px;height:720px;overflow:hidden}
  body{background:${theme.bg};color:${theme.ink};
    font-family:Inter,system-ui,sans-serif;position:relative;
    display:flex;flex-direction:column;justify-content:center;
    padding:84px 92px;gap:30px}
  /* Off-centre glow keeps the flat background from reading as a slide. */
  .glow{position:absolute;width:760px;height:760px;border-radius:50%;
    right:-230px;top:-270px;pointer-events:none;
    background:radial-gradient(circle,${theme.accent}2e 0%,transparent 68%)}
  .rail{position:absolute;left:0;top:0;bottom:0;width:14px;background:${theme.accent}}
  .kicker{position:relative;font-size:23px;font-weight:700;letter-spacing:.19em;
    text-transform:uppercase;color:${theme.accent}}
  h1{position:relative;font-family:Fraunces,Georgia,serif;font-weight:800;
    font-size:${size}px;line-height:1.06;letter-spacing:-.018em;
    text-wrap:balance;max-width:15.5ch}
  .who{position:relative;display:flex;align-items:center;gap:15px;
    font-size:25px;font-weight:500;color:${theme.ink}b8}
  .dot{width:11px;height:11px;border-radius:50%;background:${theme.accent}}
</style>
<div class="rail"></div><div class="glow"></div>
<div class="kicker">${esc(kicker)}</div>
<h1>${esc(headline)}</h1>
<div class="who"><span class="dot"></span>${esc(student)} · omegabone.com</div>`;
}

const args = process.argv.slice(2);
const get = (f) => { const i = args.indexOf(f); return i === -1 ? null : args[i + 1]; };
const manifestPath = get('--manifest');
const outDir = resolve(get('--out') || 'thumbnails');
if (!manifestPath) { console.error('need --manifest'); process.exit(1); }

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
mkdirSync(outDir, { recursive: true });

let made = 0, skipped = 0, failed = 0;
for (const lesson of manifest.lessons || []) {
  const clips = (lesson.clips || []).filter((c) => c.renderable !== false);
  if (!clips.length) { console.log(`  skip (no clips): ${lesson.id}`); skipped++; continue; }

  const best = [...clips].sort((a, b) => (b.score || 0) - (a.score || 0))[0];
  const title = lesson.videoTitle || lesson.id;
  const theme = BRANDS[brandFor(title)];
  const headline = headlineFrom(best);
  if (!headline) { console.log(`  skip (no headline): ${lesson.id}`); skipped++; continue; }

  const stem = join(outDir, lesson.id);
  const html = page({ headline, kicker: theme.label, student: lesson.student || '', theme });
  writeFileSync(`${stem}.html`, html);

  try {
    execFileSync(CHROME, [
      '--headless=new', '--disable-gpu', '--hide-scrollbars',
      '--force-device-scale-factor=1', '--window-size=1280,720',
      // Fonts are remote; without a beat to fetch them Chrome shoots fallbacks.
      '--virtual-time-budget=3000',
      `--screenshot=${stem}.png`, `file://${resolve(`${stem}.html`)}`,
    ], { stdio: 'pipe' });
  } catch (err) {
    console.log(`  FAILED chrome: ${lesson.id} — ${err.message.split('\n')[0]}`);
    failed++; continue;
  }

  // A screenshot that silently produced nothing is worse than a loud failure.
  if (!existsSync(`${stem}.png`)) { console.log(`  FAILED (no png): ${lesson.id}`); failed++; continue; }
  console.log(`  ✓ ${lesson.id}.png  [${brandFor(title)}]  "${headline}"`);
  made++;
}

console.log(`\nthumbnails: ${made} made, ${skipped} skipped, ${failed} failed → ${outDir}`);
if (failed) process.exitCode = 1;
