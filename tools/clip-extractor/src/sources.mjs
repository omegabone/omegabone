/**
 * Input adapters.
 *
 * Two kinds of source are supported:
 *
 *   1. LIBRARY SHEET — the master lesson sheet exported as Markdown, CSV or TSV.
 *      Columns: Video Title | Student | Date | URL | Category | Quote |
 *               Description | Off-topic conversation | Endorsement | Transcript
 *      Transcripts here are prose with speaker labels and no timecodes.
 *
 *   2. TIMED TRANSCRIPT — .srt / .vtt / Whisper .json for a single video.
 *      Gives exact in/out points instead of estimated ones.
 */

import { readFileSync } from 'node:fs';
import { extname } from 'node:path';

/* ------------------------------------------------------------------ *
 * Library sheet
 * ------------------------------------------------------------------ */

const LIBRARY_FIELDS = {
  'video title': 'videoTitle',
  student: 'student',
  date: 'date',
  url: 'url',
  'video url': 'url',
  category: 'category',
  quote: 'quote',
  description: 'description',
  'off-topic conversation': 'offTopic',
  endorsement: 'endorsement',
  transcript: 'transcript',
};

/** Split a Markdown table row into trimmed cells. */
function splitMarkdownRow(line) {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
}

function isSeparatorRow(cells) {
  return cells.every((c) => /^:?-{1,}:?$/.test(c) || c === '');
}

/** Unescape the backslash escaping that Google's Markdown export adds. */
function unescapeMarkdown(text) {
  return (text || '').replace(/\\([\\`*_{}[\]()#+\-.!|~])/g, '$1');
}

function parseDelimited(text, delimiter) {
  // Minimal RFC4180-ish reader: handles quoted fields containing delimiters/newlines.
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
    } else if (ch === delimiter) {
      row.push(field);
      field = '';
    } else if (ch === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (ch !== '\r') {
      field += ch;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.map((r) => r.map((c) => c.trim()));
}

function parseMarkdownTable(text) {
  const rows = [];
  for (const line of text.split('\n')) {
    if (!line.trim().startsWith('|')) continue;
    const cells = splitMarkdownRow(line);
    if (isSeparatorRow(cells)) continue;
    if (!cells.some(Boolean)) continue;
    rows.push(cells.map(unescapeMarkdown));
  }
  return rows;
}

/**
 * Read a library sheet and return one record per lesson that has a transcript.
 * Header detection is by column name, so extra trailing columns are tolerated.
 */
export function readLibrarySheet(path) {
  const text = readFileSync(path, 'utf8');
  const ext = extname(path).toLowerCase();

  let rows;
  if (ext === '.csv') rows = parseDelimited(text, ',');
  else if (ext === '.tsv') rows = parseDelimited(text, '\t');
  else rows = parseMarkdownTable(text);

  const headerIndex = rows.findIndex((r) =>
    r.some((c) => c.toLowerCase() === 'video title'),
  );
  if (headerIndex === -1) {
    throw new Error(
      `No header row found in ${path}. Expected a column named "Video Title".`,
    );
  }

  const header = rows[headerIndex].map((c) => c.toLowerCase());
  const colOf = {};
  header.forEach((name, i) => {
    const field = LIBRARY_FIELDS[name];
    if (field && colOf[field] === undefined) colOf[field] = i;
  });

  if (colOf.transcript === undefined) {
    throw new Error(`No "Transcript" column found in ${path}.`);
  }

  const lessons = [];
  for (const cells of rows.slice(headerIndex + 1)) {
    const get = (field) =>
      colOf[field] === undefined ? '' : (cells[colOf[field]] || '').trim();

    const transcript = get('transcript');
    if (!transcript) continue; // muted / empty sessions

    lessons.push({
      videoTitle: get('videoTitle'),
      student: get('student'),
      date: get('date'),
      url: get('url'),
      category: get('category'),
      quote: get('quote'),
      description: get('description'),
      transcript,
      timed: false,
      cues: null,
    });
  }
  return lessons;
}

/* ------------------------------------------------------------------ *
 * Timed transcripts
 * ------------------------------------------------------------------ */

function timeToSeconds(stamp) {
  // 00:01:23,456 or 00:01:23.456 or 01:23.456
  const clean = (stamp || '').trim().replace(',', '.');
  if (!clean) return null;
  const parts = clean.split(':').map((p) => (p.trim() === '' ? NaN : Number(p)));
  if (parts.some(Number.isNaN)) return null;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0];
}

function parseSrtVtt(text) {
  const cues = [];
  const blocks = text.replace(/\r/g, '').split(/\n{2,}/);
  for (const block of blocks) {
    const lines = block.split('\n').filter((l) => l.trim());
    const timeLine = lines.find((l) => l.includes('-->'));
    if (!timeLine) continue;
    const [rawStart, rawEnd] = timeLine.split('-->');
    const start = timeToSeconds(rawStart);
    // Trim before splitting: leading whitespace makes split() yield an empty
    // first element, which would parse as 0 and flatten every cue's end time.
    const end = timeToSeconds((rawEnd || '').trim().split(/\s+/)[0]);
    if (start === null || end === null || end <= start) continue;
    const body = lines
      .slice(lines.indexOf(timeLine) + 1)
      .join(' ')
      .replace(/<[^>]+>/g, '')
      .trim();
    if (body) cues.push({ start, end, text: body });
  }
  return cues;
}

function parseWhisperJson(text) {
  const data = JSON.parse(text);
  const segments = data.segments || data.chunks || (Array.isArray(data) ? data : null);
  if (!segments) throw new Error('Unrecognised JSON transcript shape.');
  return segments
    .map((s) => ({
      start: s.start ?? s.timestamp?.[0] ?? null,
      end: s.end ?? s.timestamp?.[1] ?? null,
      text: (s.text || '').trim(),
    }))
    .filter((c) => c.start !== null && c.end !== null && c.text);
}

/** Read a timed transcript for a single video into a lesson record. */
export function readTimedTranscript(path, meta = {}) {
  const text = readFileSync(path, 'utf8');
  const ext = extname(path).toLowerCase();
  const cues = ext === '.json' ? parseWhisperJson(text) : parseSrtVtt(text);
  if (!cues.length) throw new Error(`No cues parsed from ${path}.`);

  return {
    videoTitle: meta.videoTitle || '',
    student: meta.student || '',
    date: meta.date || '',
    url: meta.url || '',
    category: meta.category || '',
    quote: '',
    description: '',
    transcript: cues.map((c) => c.text).join(' '),
    timed: true,
    cues,
  };
}
