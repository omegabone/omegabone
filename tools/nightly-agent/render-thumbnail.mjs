#!/usr/bin/env node
/**
 * One-off thumbnail renderer for a single lesson, matching the house style
 * in make-thumbnails.mjs (same theme tokens/layout). Used when the headline
 * comes from a manual transcript read rather than the clip-extractor manifest.
 *
 *   node render-thumbnail.mjs --headline "..." --kicker "Vocal Mastery" \
 *     --student "Ira" --brand vme --out tools/nightly-agent/video-review/<stem>
 */
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const BRANDS = {
  vme: { bg: '#081812', panel: '#122d1e', accent: '#7CE8A0', ink: '#ffffff', label: 'Vocal Mastery' },
  frequency: { bg: '#33090E', panel: '#3F0D12', accent: '#C42A40', ink: '#F1F0CC', label: 'Frequency' },
  learn2sing: { bg: '#130a1e', panel: '#241636', accent: '#C9A9F0', ink: '#ffffff', label: 'Learn 2 Sing' },
  mr33: { bg: '#07142c', panel: '#0f2146', accent: '#6FA3FF', ink: '#ffffff', label: 'Music 33' },
};

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
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
const headline = get('--headline');
const kicker = get('--kicker') || 'Vocal Mastery';
const student = get('--student') || '';
const brand = get('--brand') || 'vme';
const outDir = resolve(get('--out') || '.');
if (!headline) { console.error('need --headline'); process.exit(1); }

mkdirSync(outDir, { recursive: true });
const theme = BRANDS[brand] || BRANDS.vme;
const html = page({ headline, kicker, student, theme });
writeFileSync(`${outDir}/thumbnail.html`, html);

execFileSync(CHROME, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars',
  '--use-mock-keychain', '--password-store=basic', '--no-first-run',
  '--user-data-dir=/tmp/ob-thumb-profile',
  '--force-device-scale-factor=1', '--window-size=1280,720',
  '--virtual-time-budget=3000',
  `--screenshot=${outDir}/thumbnail.png`, `file://${resolve(`${outDir}/thumbnail.html`)}`,
], { stdio: 'pipe' });

if (!existsSync(`${outDir}/thumbnail.png`)) { console.error('FAILED: no png produced'); process.exit(1); }
console.log(`OK: ${outDir}/thumbnail.png [${brand}] "${headline}"`);
