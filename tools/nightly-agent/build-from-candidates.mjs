#!/usr/bin/env node
/**
 * Step 2 of the "no API key" manual clip-pick workaround. Takes one or more
 * { lessonFile, candidatesFile } pairs (lessonFile = output of
 * dump-lesson-segments.mjs; candidatesFile = an agent's own candidate
 * proposals, written by hand following ../clip-extractor/src/prompt.mjs's
 * rubric, keyed by segment index: { "1": [candidate, ...], "2": [...] }, each
 * candidate matching the schema in ../clip-extractor/src/providers.mjs
 * JSON_SCHEMA) and runs them through the real enforce()/writeOutputs() code —
 * the same code the API-backed pipeline uses. Nothing here skips a rule
 * check; only the "ask a model over HTTP" step is replaced by a human-written
 * (agent-written) candidates file.
 */
import { parseArgs } from 'node:util';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { enforce } from '../clip-extractor/src/enforce.mjs';
import { writeOutputs } from '../clip-extractor/src/output.mjs';
import { DEFAULTS } from '../clip-extractor/src/config.mjs';

const { values: args } = parseArgs({
  options: {
    manifest: { type: 'string' }, // JSON array of { lessonFile, candidatesFile }
    out: { type: 'string' },
  },
});

if (!args.manifest || !args.out) {
  console.error('Usage: build-from-candidates.mjs --manifest <pairs.json> --out <dir>');
  process.exit(1);
}

const pairs = JSON.parse(readFileSync(resolve(args.manifest), 'utf8'));
const opts = { ...DEFAULTS };
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
