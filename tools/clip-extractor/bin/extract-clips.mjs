#!/usr/bin/env node
/**
 * Vocal clip extractor — CLI entry point.
 *
 * Reads a lesson library sheet (or a single timed transcript), finds the best
 * clip per segment under the selection rules, and writes rows that match the
 * existing clip sheet.
 */

import { parseArgs } from 'node:util';
import { resolve, join, basename, extname } from 'node:path';
import { readdirSync } from 'node:fs';
import { readLibrarySheet, readTimedTranscript } from '../src/sources.mjs';
import { segmentLesson } from '../src/segment.mjs';
import { createClient, selectFromSegment, mapWithConcurrency } from '../src/select.mjs';
import {
  PROVIDERS,
  providerStatus,
  selectFromSegmentOpenAICompatible,
} from '../src/providers.mjs';
import { selectOffline } from '../src/offline.mjs';
import { enforce } from '../src/enforce.mjs';
import { writeOutputs } from '../src/output.mjs';
import { DEFAULTS } from '../src/config.mjs';

const { values: args } = parseArgs({
  options: {
    library: { type: 'string' },
    transcript: { type: 'string' },
    'transcript-dir': { type: 'string' },
    out: { type: 'string', default: 'clips-out' },

    provider: { type: 'string', default: 'claude' },
    model: { type: 'string' },
    offline: { type: 'boolean', default: false },
    'no-fallbacks': { type: 'boolean', default: false },

    filter: { type: 'string' },
    limit: { type: 'string' },

    'min-seconds': { type: 'string' },
    'max-seconds': { type: 'string' },
    'min-clips': { type: 'string' },
    'max-clips': { type: 'string' },
    'max-per-category': { type: 'string' },
    candidates: { type: 'string' },
    wpm: { type: 'string' },
    'segment-words': { type: 'string' },
    'segment-seconds': { type: 'string' },
    'max-tokens': { type: 'string' },
    concurrency: { type: 'string', default: '3' },

    title: { type: 'string' },
    student: { type: 'string' },
    date: { type: 'string' },
    url: { type: 'string' },

    providers: { type: 'boolean', default: false },
    help: { type: 'boolean', default: false, short: 'h' },
  },
});

const HELP = `
extract-clips — find the best short-form clips in vocal lesson transcripts

Usage
  extract-clips --library <sheet.md|csv|tsv> [options]
  extract-clips --transcript <file.srt|vtt|json> --url <video url> [options]

Source
  --library <path>        Lesson library sheet exported as Markdown, CSV or TSV.
                          Needs "Video Title" and "Transcript" columns.
  --transcript <path>     A single timed transcript (.srt/.vtt/Whisper .json).
                          Gives real timecodes instead of estimates.
  --transcript-dir <dir>  A folder of timed transcripts — a whole session's
                          lessons in one pass. Student and date are read from
                          each filename.
  --title/--student/--date/--url
                          Metadata for a --transcript run.

Model
  --provider <name>       claude (default), kimi, chatgpt, hermes, openrouter
  --model <id>            Override the provider's default model.
  --max-tokens <n>        Cap the model response size (default ${DEFAULTS.maxTokens}).
                          Lower it when a pay-as-you-go balance cannot cover
                          the full reservation (OpenRouter 402).
  --offline               Skip the API entirely and use the keyword heuristic.
                          For smoke-testing the pipeline, not for real selection.
  --providers             Show provider status and which API keys are present.
  --no-fallbacks          Claude only: skip the server-side refusal fallback.

Rules
  --min-seconds <n>       Default ${DEFAULTS.minSeconds}
  --max-seconds <n>       Default ${DEFAULTS.maxSeconds}
  --min-clips <n>         Default ${DEFAULTS.minClips} per lesson
  --max-clips <n>         Default ${DEFAULTS.maxClips} per lesson
  --max-per-category <n>  Default ${DEFAULTS.maxPerCategory}
  --candidates <n>        Candidates requested per segment (default ${DEFAULTS.candidatesPerSegment})
  --wpm <n>               Speech rate for estimating untimed clip length (default ${DEFAULTS.wpm})
  --segment-words <n>     Target segment size for untimed transcripts (default ${DEFAULTS.segmentWords}).
                          Smaller segments = more candidate clips per lesson.
  --segment-seconds <n>   Target segment length for timed transcripts (default 420).

Run
  --filter <text>         Only lessons whose title or student matches.
  --limit <n>             Process at most N lessons.
  --concurrency <n>       Parallel segment calls (default 3).
  --out <dir>             Output directory (default clips-out).

Outputs
  clips.csv       Paste-ready rows in the live clip-sheet column order.
  manifest.json   Full structured record, including rejected candidates.
  report.md       Human-readable review sheet.
`;

if (args.help) {
  console.log(HELP);
  process.exit(0);
}

if (args.providers) {
  console.log('\nProvider status\n');
  for (const p of providerStatus()) {
    const mark = p.keyPresent ? '✓' : '·';
    console.log(
      `  ${mark} ${p.key.padEnd(11)} ${p.label.padEnd(24)} default model: ${p.model}`,
    );
    if (!p.keyPresent) console.log(`      set one of: ${p.envKeys.join(', ')}`);
  }
  console.log('\n  ✓ = API key found in the environment\n');
  process.exit(0);
}

if (!args.library && !args.transcript && !args['transcript-dir']) {
  console.error('Error: pass --library <sheet>, --transcript <file> or --transcript-dir <dir>. See --help.');
  process.exit(1);
}

if (!PROVIDERS[args.provider]) {
  console.error(
    `Error: unknown provider "${args.provider}". Options: ${Object.keys(PROVIDERS).join(', ')}`,
  );
  process.exit(1);
}

const num = (v, fallback) => (v === undefined ? fallback : Number(v));

const opts = {
  minSeconds: num(args['min-seconds'], DEFAULTS.minSeconds),
  maxSeconds: num(args['max-seconds'], DEFAULTS.maxSeconds),
  minClips: num(args['min-clips'], DEFAULTS.minClips),
  maxClips: num(args['max-clips'], DEFAULTS.maxClips),
  maxPerCategory: num(args['max-per-category'], DEFAULTS.maxPerCategory),
  candidatesPerSegment: num(args.candidates, DEFAULTS.candidatesPerSegment),
  wpm: num(args.wpm, DEFAULTS.wpm),
  segmentWords: num(args['segment-words'], DEFAULTS.segmentWords),
  segmentSeconds: num(args['segment-seconds'], 420),
  minSegmentWords: DEFAULTS.minSegmentWords,
  shortMaxSeconds: DEFAULTS.shortMaxSeconds,
  maxTokens: DEFAULTS.maxTokens,
  ...(args['max-tokens'] ? { maxTokens: num(args['max-tokens'], DEFAULTS.maxTokens) } : {}),
  effort: DEFAULTS.effort,
  model: args.model || PROVIDERS[args.provider].defaultModel,
  offline: args.offline,
  fallbacks: !args['no-fallbacks'],
};

/* ---------------------------------------------------------------- */

let lessons;
if (args.library) {
  lessons = readLibrarySheet(resolve(args.library));
} else if (args['transcript-dir']) {
  lessons = readTranscriptFolder(resolve(args['transcript-dir']));
} else {
  lessons = [
    readTimedTranscript(resolve(args.transcript), {
      videoTitle: args.title,
      student: args.student,
      date: args.date,
      url: args.url,
    }),
  ];
}

/**
 * Every timed transcript in a folder, as one batch.
 *
 * This is the shape a downloaded set of lessons already has — a video and its
 * subtitles side by side, named after the lesson — so a whole session's worth
 * can be run in one pass rather than one command per lesson.
 *
 * The filename carries what the sheet would otherwise supply: the student, and
 * a date if one is in there.
 */
function readTranscriptFolder(dir) {
  const SUBTITLES = new Set(['.srt', '.vtt', '.json']);
  const files = readdirSync(dir)
    .filter((f) => SUBTITLES.has(extname(f).toLowerCase()))
    .sort();

  if (!files.length) {
    console.error(`No .srt, .vtt or .json transcripts in ${dir}`);
    process.exit(1);
  }

  return files.map((file) => {
    const stem = basename(file, extname(file))
      // yt-dlp leaves the language on the end: "lesson.en.srt".
      .replace(/\.[a-z]{2}(-[A-Za-z]+)?$/, '');
    const dateMatch = stem.match(/\d{1,2}[-. ](?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[-. ]\d{2,4}/i);
    const date = dateMatch ? dateMatch[0] : '';

    // These lesson titles put the student's name last ("Vocal Mastery Varun",
    // "Vocal Mastery with Adri", "Vocal Mastery Live, Ameesha", "🎶 Vocal
    // Mastery with Ameesha 22.Jun.2026 🎶") — the first word is always
    // "Vocal", so take the last token instead. The date and any decorative
    // emoji/punctuation are stripped first, or the last token would be a
    // trailing 🎶 or the date rather than the name.
    const nameTokens = stem
      .replace(date, '')
      .replace(/[^\p{L}\p{N}'-]+/gu, ' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    const student = nameTokens.pop() || stem;

    return readTimedTranscript(join(dir, file), {
      videoTitle: stem.replace(/[-_]+/g, ' ').trim(),
      student,
      date,
      url: args.url || '',
    });
  });
}

if (args.filter) {
  const needle = args.filter.toLowerCase();
  lessons = lessons.filter(
    (l) =>
      l.videoTitle.toLowerCase().includes(needle) ||
      l.student.toLowerCase().includes(needle),
  );
}
if (args.limit) lessons = lessons.slice(0, Number(args.limit));

if (!lessons.length) {
  console.error('No lessons matched. Check --filter, or the sheet’s Transcript column.');
  process.exit(1);
}

const mode = args.offline ? 'offline heuristic' : `${PROVIDERS[args.provider].label} · ${opts.model}`;
console.log(`\nLessons: ${lessons.length}   Selector: ${mode}`);
console.log(
  `Rules: ${opts.minSeconds}-${opts.maxSeconds}s · ${opts.minClips}-${opts.maxClips} clips/lesson · max ${opts.maxPerCategory} per category\n`,
);

const client = args.offline || args.provider !== 'claude' ? null : await createClient();
const concurrency = Math.max(1, Number(args.concurrency));

const results = [];
let failures = 0;

for (const [i, lesson] of lessons.entries()) {
  const label = `${lesson.videoTitle || '(untitled)'} — ${lesson.student || '?'}`;
  const segments = segmentLesson(lesson, opts);
  process.stdout.write(
    `[${i + 1}/${lessons.length}] ${label}  (${segments.length} segments) … `,
  );

  let candidates = [];
  try {
    const perSegment = await mapWithConcurrency(segments, concurrency, async (segment) => {
      if (args.offline) return selectOffline(lesson, segment, opts);
      if (args.provider === 'claude') {
        return selectFromSegment(client, lesson, segment, opts);
      }
      return selectFromSegmentOpenAICompatible(args.provider, lesson, segment, opts);
    });
    candidates = perSegment.flat();
  } catch (err) {
    failures++;
    console.log(`failed: ${err.message}`);
    continue;
  }

  const { clips, rejected, shortfall } = enforce(lesson, candidates, opts);
  results.push({ lesson, clips, rejected, shortfall });

  console.log(
    `${clips.length} clips${shortfall ? ` (${shortfall} under floor)` : ''}, ${rejected.length} rejected`,
  );
}

if (!results.length) {
  console.error('\nNo lessons produced clips.');
  process.exit(1);
}

const written = writeOutputs(resolve(args.out), results, opts);

console.log(`\nWrote ${written.clipCount} clips`);
console.log(`  ${written.csv}`);
console.log(`  ${written.manifest}`);
console.log(`  ${written.report}`);
if (written.srtCount) {
  console.log(`  ${written.captions}  (${written.srtCount} caption files)`);
} else {
  console.log('  (no caption files — source has no timecodes)');
}
if (written.transcripts) {
  console.log(`  ${written.transcripts}  (for trimming clips in the review page)`);
}
if (failures) console.log(`\n${failures} lesson(s) failed — see messages above.`);
console.log();
