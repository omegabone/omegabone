#!/usr/bin/env node
/**
 * Same as build-from-candidates.mjs, but for the curated Antoine/Ira/MetaMuse
 * rotation content specifically: pins the skill's documented rubric (30-90s,
 * 5-8 clips, max 2 per category) rather than config.mjs's current DEFAULTS,
 * which were loosened (10-90s, up to 40 clips, cap 12/category) for the
 * separate "maximum yield" YouTube Partner Program watch-hours campaign.
 * Don't point this at that campaign's output — it's a different rubric on
 * purpose.
 */
import { parseArgs } from 'node:util';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { enforce } from '../clip-extractor/src/enforce.mjs';
import { writeOutputs } from '../clip-extractor/src/output.mjs';

const { values: args } = parseArgs({
  options: {
    manifest: { type: 'string' }, // JSON array of { lessonFile, candidatesFile }
    out: { type: 'string' },
  },
});

if (!args.manifest || !args.out) {
  console.error('Usage: build-rotation-batch.mjs --manifest <pairs.json> --out <dir>');
  process.exit(1);
}

const pairs = JSON.parse(readFileSync(resolve(args.manifest), 'utf8'));
const opts = {
  minSeconds: 30,
  maxSeconds: 90,
  minClips: 5,
  maxClips: 8,
  maxPerCategory: 2,
  candidatesPerSegment: 3,
  shortMaxSeconds: 60,
  introGuardSeconds: 60,
  wpm: 150,
};
const results = [];

for (const { lessonFile, candidatesFile } of pairs) {
  const { lesson, segments } = JSON.parse(readFileSync(resolve(lessonFile), 'utf8'));
  const rawCandidates = JSON.parse(readFileSync(resolve(candidatesFile), 'utf8'));
  const bySegment = new Map(segments.map((s) => [s.index, s]));

  const candidates = [];
  for (const [segIdxStr, cands] of Object.entries(rawCandidates)) {
    const segIdx = Number(segIdxStr);
    const segment = bySegment.get(segIdx);
    if (!segment) {
      console.error(`Warning: no segment ${segIdx} in ${lessonFile}, skipping its candidates`);
      continue;
    }
    (cands || []).forEach((c, i) => {
      candidates.push({ ...c, segmentIndex: segIdx, segmentRank: i, segment });
    });
  }

  const { clips, rejected, shortfall } = enforce(lesson, candidates, opts);
  console.log(
    `${lesson.videoTitle} — ${lesson.student}: ${clips.length} clips, ${rejected.length} rejected${shortfall ? `, ${shortfall} under floor` : ''}`,
  );
  for (const r of rejected) console.log(`    rejected (seg ${r.segment}): ${r.reason} — "${r.quote}"`);
  results.push({ lesson, clips, rejected, shortfall });
}

const written = writeOutputs(resolve(args.out), results, {
  ...opts,
  model: 'claude-sonnet-5 (in-agent reasoning, no clip-extractor API key configured — see nightly log)',
});

console.log(`\nWrote ${written.clipCount} clips`);
console.log(`  ${written.csv}`);
console.log(`  ${written.manifest}`);
console.log(`  ${written.report}`);
