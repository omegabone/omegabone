/**
 * Writers. The CSV mirrors the existing clip sheet column order exactly, so a
 * run can be pasted straight in, with the new rule columns appended after the
 * established ones.
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { AWARENESS_CATEGORIES } from './config.mjs';
import { formatTimecode } from './prompt.mjs';

/** Column order of the live clip sheet, then the additions. */
export const CSV_HEADER = [
  'Goal / CTA',
  'Rank',
  'Student',
  'Topic',
  'Clip Type',
  'Video Title',
  'Date',
  'Video URL',
  'Full Quote',
  'Why It Hooks',
  'Suggested Caption',
  // Appended by this pipeline:
  'Awareness Category',
  'High-Value Type',
  'Duration (s)',
  'Duration Basis',
  'Start',
  'End',
  'Clip URL',
  'Score',
  'Segment',
];

function csvEscape(value) {
  const s = value === null || value === undefined ? '' : String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** YouTube deep link at the clip's start, when a start time is known. */
export function clipUrl(lesson, clip) {
  if (!lesson.url) return '';
  if (clip.start === null) return lesson.url;
  const t = Math.floor(clip.start);
  return lesson.url.includes('?')
    ? `${lesson.url}&t=${t}s`
    : `${lesson.url}?t=${t}s`;
}

export function toRow(lesson, clip) {
  return [
    clip.cta,
    clip.rankPosition,
    lesson.student,
    clip.topic,
    clip.clipType,
    lesson.videoTitle,
    lesson.date,
    lesson.url,
    clip.quote,
    clip.why_it_hooks,
    clip.suggested_caption,
    AWARENESS_CATEGORIES[clip.primary_category].label,
    clip.high_value_type ? clip.high_value_type.replace(/_/g, ' ') : '',
    clip.duration,
    clip.estimated ? 'estimated from word count' : 'measured from timecodes',
    clip.start === null ? '' : formatTimecode(clip.start),
    clip.end === null ? '' : formatTimecode(clip.end),
    clipUrl(lesson, clip),
    Math.round(clip.rankScore),
    clip.segmentIndex,
  ];
}

export function writeOutputs(outDir, results, opts = {}) {
  mkdirSync(outDir, { recursive: true });

  const rows = [];
  for (const { lesson, clips } of results) {
    for (const clip of clips) rows.push(toRow(lesson, clip));
  }

  const csv = [CSV_HEADER, ...rows]
    .map((r) => r.map(csvEscape).join(','))
    .join('\n');
  writeFileSync(join(outDir, 'clips.csv'), `${csv}\n`, 'utf8');

  const manifest = {
    generatedAt: new Date().toISOString(),
    rules: {
      minSeconds: opts.minSeconds,
      maxSeconds: opts.maxSeconds,
      minClips: opts.minClips,
      maxClips: opts.maxClips,
      maxPerCategory: opts.maxPerCategory,
      wpm: opts.wpm,
      model: opts.offline ? 'offline-heuristic' : opts.model,
    },
    lessons: results.map(({ lesson, clips, rejected, shortfall }) => ({
      videoTitle: lesson.videoTitle,
      student: lesson.student,
      date: lesson.date,
      url: lesson.url,
      clipCount: clips.length,
      shortfall,
      clips: clips.map((c) => ({
        rank: c.rankPosition,
        awarenessCategory: c.primary_category,
        highValueType: c.high_value_type,
        topic: c.topic,
        cta: c.cta,
        clipType: c.clipType,
        start: c.start,
        end: c.end,
        durationSeconds: c.duration,
        durationEstimated: c.estimated,
        clipUrl: clipUrl(lesson, c),
        quote: c.quote,
        whyItHooks: c.why_it_hooks,
        suggestedCaption: c.suggested_caption,
        score: Math.round(c.rankScore),
        segment: c.segmentIndex,
      })),
      rejected,
    })),
  };
  writeFileSync(
    join(outDir, 'manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8',
  );

  writeFileSync(join(outDir, 'report.md'), buildReport(results, opts), 'utf8');

  return {
    csv: join(outDir, 'clips.csv'),
    manifest: join(outDir, 'manifest.json'),
    report: join(outDir, 'report.md'),
    clipCount: rows.length,
  };
}

function buildReport(results, opts) {
  const total = results.reduce((n, r) => n + r.clips.length, 0);
  const lines = [
    '# Clip extraction run',
    '',
    `Generated ${new Date().toISOString()}`,
    `Lessons processed: ${results.length}`,
    `Clips selected: ${total}`,
    `Rules: ${opts.minSeconds}-${opts.maxSeconds}s, ${opts.minClips}-${opts.maxClips} per lesson, max ${opts.maxPerCategory} per awareness category`,
    '',
  ];

  for (const { lesson, clips, rejected, shortfall } of results) {
    lines.push(`## ${lesson.videoTitle || '(untitled)'} — ${lesson.student || '?'} — ${lesson.date || '?'}`);
    lines.push('');
    if (lesson.url) lines.push(`Source: ${lesson.url}`);
    lines.push(`Clips: ${clips.length}${shortfall ? ` (${shortfall} short of the floor)` : ''}`);
    lines.push('');

    for (const c of clips) {
      const label = AWARENESS_CATEGORIES[c.primary_category].label;
      const tag = c.high_value_type ? ` · ${c.high_value_type.replace(/_/g, ' ')}` : '';
      const time =
        c.start === null
          ? `~${c.duration}s (estimated)`
          : `${formatTimecode(c.start)}–${formatTimecode(c.end)} (${c.duration}s)`;

      lines.push(`### ${c.rankPosition}. ${label}${tag} — ${time}`);
      lines.push('');
      lines.push(`- **Topic:** ${c.topic}`);
      lines.push(`- **CTA:** ${c.cta}`);
      lines.push(`- **Caption:** ${c.suggested_caption}`);
      lines.push(`- **Why it hooks:** ${c.why_it_hooks}`);
      if (clipUrl(lesson, c)) lines.push(`- **Link:** ${clipUrl(lesson, c)}`);
      lines.push('');
      lines.push('> ' + c.quote.replace(/\n+/g, ' ').trim());
      lines.push('');
    }

    if (rejected.length) {
      lines.push('<details><summary>Rejected candidates</summary>');
      lines.push('');
      for (const r of rejected) {
        lines.push(`- segment ${r.segment}: ${r.reason} — "${r.quote}…"`);
      }
      lines.push('');
      lines.push('</details>');
      lines.push('');
    }
  }

  return `${lines.join('\n')}\n`;
}
