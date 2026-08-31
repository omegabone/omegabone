#!/usr/bin/env node
/**
 * Turn hand-picked clip ranges into the manifest shape clip-review consumes.
 *
 * The extractor normally writes this file. When its provider is unavailable
 * (no API key / no credit) the picks can come from a picks-*.json instead —
 * same output contract, so the review UI and renderer don't know the
 * difference.
 *
 *   node picks-to-manifest.mjs --picks <picks.json> --lessons <dir> --out <dir>
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const AWARENESS_LABELS = {
  unaware: 'Unaware',
  problem_aware: 'Problem Aware',
  solution_aware: 'Solution Aware',
  brand_aware: 'Brand Aware',
  product_aware: 'Product Aware',
};

const CTA_BY_AWARENESS = {
  unaware: '🟢 Follow for more',
  problem_aware: '🟢 Book a Free Session',
  solution_aware: '🟢 Book Private Lessons',
  brand_aware: '🟢 Visit omegabone.com',
  product_aware: '🟢 Book a 30-Minute Consultation',
};

const args = process.argv.slice(2);
const get = (f) => { const i = args.indexOf(f); return i === -1 ? null : args[i + 1]; };

const picksPath = get('--picks');
const lessonsDir = get('--lessons') || 'lessons';
const outDir = resolve(get('--out') || 'clips-out');
if (!picksPath) { console.error('need --picks'); process.exit(1); }

const spec = JSON.parse(readFileSync(picksPath, 'utf8'));

/** SRT timestamps are `HH:MM:SS,mmm`; the renderer wants whole seconds. */
function toSeconds(stamp) {
  const [h, m, rest] = stamp.split(':');
  const [s, ms] = rest.split(',');
  return Number(h) * 3600 + Number(m) * 60 + Number(s) + Number(ms) / 1000;
}

function parseSrt(text) {
  return text
    .trim()
    .split(/\r?\n\s*\r?\n/)
    .map((block) => {
      const lines = block.trim().split(/\r?\n/);
      const timeLine = lines.find((l) => l.includes('-->'));
      if (!timeLine) return null;
      const [from, to] = timeLine.split('-->').map((s) => s.trim());
      const text = lines
        .slice(lines.indexOf(timeLine) + 1)
        .join(' ')
        .trim();
      if (!text) return null;
      return { start: toSeconds(from), end: toSeconds(to), text };
    })
    .filter(Boolean);
}

const srtPath = join(lessonsDir, spec.lessonFile);
const cues = parseSrt(readFileSync(srtPath, 'utf8'));

const lessonId = spec.videoTitle
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const clips = spec.picks.map((p, i) => {
  // Captions are re-timed relative to the clip so the renderer can burn them in.
  const captions = cues
    .filter((c) => c.end > p.start && c.start < p.end)
    .map((c) => ({
      start: Math.max(0, Math.round(c.start - p.start)),
      end: Math.max(0, Math.round(Math.min(c.end, p.end) - p.start)),
      text: c.text,
    }));

  const duration = p.end - p.start;
  return {
    id: `${lessonId}-${i + 1}`,
    rank: i + 1,
    awarenessCategory: p.awarenessCategory,
    awarenessLabel: AWARENESS_LABELS[p.awarenessCategory] || p.awarenessCategory,
    highValueType: p.highValueType ?? null,
    topic: p.topic,
    cta: p.cta || CTA_BY_AWARENESS[p.awarenessCategory] || '🟢 Book Private Lessons',
    clipType: 'short',
    start: p.start,
    end: p.end,
    durationSeconds: duration,
    durationEstimated: false,
    clipUrl: '',
    quote: p.quote,
    whyItHooks: p.whyItHooks,
    suggestedCaption: p.suggestedCaption,
    score: p.score ?? 75,
    segment: i + 1,
    captions,
    renderable: captions.length > 0,
  };
});

const manifest = {
  generatedAt: new Date().toISOString(),
  rules: { minSeconds: 30, maxSeconds: 90, minClips: 5, maxClips: 8, maxPerCategory: 2 },
  source: { selector: 'hand-picked (picks-to-manifest)', model: 'claude-opus-5' },
  lessons: [
    {
      id: lessonId,
      videoTitle: spec.videoTitle,
      student: spec.student,
      date: spec.date,
      url: spec.url || '',
      clipCount: clips.length,
      shortfall: 0,
      clips,
      rejected: [],
    },
  ],
};

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

// clip-review reads transcripts.json to let a human drag the clip edges.
const transcripts = { [lessonId]: cues.map((c) => ({ start: c.start, end: c.end, text: c.text })) };
writeFileSync(join(outDir, 'transcripts.json'), JSON.stringify(transcripts, null, 2));

console.log(`${clips.length} clips → ${join(outDir, 'manifest.json')}`);
for (const c of clips) {
  const flag = c.renderable ? '✓' : '✗ NO CAPTIONS';
  console.log(`  ${flag} [${c.durationSeconds}s] ${c.topic}  (${c.captions.length} cues)`);
}
