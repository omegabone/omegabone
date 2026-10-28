#!/usr/bin/env node
/**
 * Step 1 of the "no API key" manual clip-pick workaround (see PROMPT.md /
 * TONIGHT.md Phase 2, and the omegabone-clip skill's provider section).
 *
 * Segments a single timed transcript exactly the way extract-clips.mjs would,
 * using the pipeline's own segment.mjs, and dumps { lesson, segments } to a
 * JSON file. A human-equivalent reasoner (an agent) reads that file, follows
 * the rubric in ../clip-extractor/src/prompt.mjs, and writes a candidates
 * file for build-from-candidates.mjs to run through the real enforce()/
 * writeOutputs() code.
 */
import { parseArgs } from 'node:util';
import { resolve } from 'node:path';
import { writeFileSync } from 'node:fs';
import { readTimedTranscript } from '../clip-extractor/src/sources.mjs';
import { segmentLesson } from '../clip-extractor/src/segment.mjs';
import { DEFAULTS } from '../clip-extractor/src/config.mjs';

const { values: args } = parseArgs({
  options: {
    transcript: { type: 'string' },
    title: { type: 'string' },
    student: { type: 'string' },
    date: { type: 'string' },
    url: { type: 'string', default: '' },
    out: { type: 'string' },
  },
});

if (!args.transcript || !args.out) {
  console.error('Usage: dump-lesson-segments.mjs --transcript <srt/vtt> --title <> --student <> --date <> [--url <>] --out <segments.json>');
  process.exit(1);
}

const lesson = readTimedTranscript(resolve(args.transcript), {
  videoTitle: args.title || '',
  student: args.student || '',
  date: args.date || '',
  url: args.url || '',
});

const opts = { ...DEFAULTS };
const segments = segmentLesson(lesson, opts);

writeFileSync(resolve(args.out), JSON.stringify({ lesson, segments }, null, 2), 'utf8');
console.log(`Lesson: ${lesson.videoTitle} — ${lesson.student} (${lesson.date})`);
console.log(`Wrote ${segments.length} segments to ${args.out}`);
