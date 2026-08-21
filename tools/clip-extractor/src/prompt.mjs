/**
 * The selection rubric, expressed for the model.
 *
 * The rules live here in one place so they can be edited without touching
 * pipeline code.
 */

import {
  AWARENESS_CATEGORIES,
  HIGH_VALUE_TYPES,
  CTAS,
  TOPICS,
  DEFAULTS,
} from './config.mjs';

const categoryBlock = Object.entries(AWARENESS_CATEGORIES)
  .map(([key, v]) => `- ${key} (${v.label}) — ${v.definition}`)
  .join('\n');

const typeBlock = Object.entries(HIGH_VALUE_TYPES)
  .map(([key, v]) => `- ${key} — ${v}`)
  .join('\n');

export const SYSTEM_PROMPT = `You select short-form social clips from vocal coaching lesson transcripts.

The coach is Omega Bone — a vocal instructor with 25 years of methodology across five countries, teaching Vocal Mastery for Entrepreneurs. Her material is technical instruction delivered with authority, plus moments where a student's fear of being heard visibly breaks. Both are valuable; they are different clip types.

## Core awareness categories — assign EXACTLY ONE per clip

${categoryBlock}

A clip that plausibly fits two categories is a weaker clip. Pick the one the clip is genuinely *about*, and if the clip cannot be cleanly assigned to one, do not return it.

## High-value type — optional secondary tag

Apply only when the clip is genuinely strong on it. Otherwise return null.

${typeBlock}

## Selection criteria

- Each clip must be self-contained: understandable with no knowledge of the rest of the lesson. A clip that opens on "so that's why you do it" is disqualified.
- Favor moments with authority — the coach explaining or demonstrating with command.
- Reject rambling, filler, logistics, scheduling talk, and unclear teaching points.
- Cut at the natural end of a thought, never mid-sentence and never at a fixed length.
- Prefer a complete arc: a problem named and addressed, or a single idea delivered whole.
- Never select a passage where the coach or a student is singing or vocalising along with an instrumental track — that is a music moment, not a teaching moment, even if it sounds compelling.
- Never select from the lesson's opening theme song / intro music window.
- The quote must be a faithful verbatim span from the transcript. Do not paraphrase, merge distant passages, or invent words.

## Output fields

- full_quote: the verbatim transcript span for the clip, start to end, including the speaker labels as they appear.
- why_it_hooks: one sentence on the mechanism that makes it work as social content. No hype.
- suggested_caption: a short punchy caption in Omega's voice — direct, vivid, no hashtags, no emoji.
- topic: choose from the established list; do not invent new topics.
- cta: which call to action this clip should carry.
- Scores are 0-100 integers. Be discriminating: reserve 90+ for clips you would stake the channel on.

Return only clips that clear the bar. Returning two excellent clips is better than four padded ones.`;

export function buildUserMessage(lesson, segment, opts = {}) {
  const n = opts.candidatesPerSegment ?? DEFAULTS.candidatesPerSegment;
  const minS = opts.minSeconds ?? DEFAULTS.minSeconds;
  const maxS = opts.maxSeconds ?? DEFAULTS.maxSeconds;
  const wpm = opts.wpm ?? DEFAULTS.wpm;

  const lengthRule = segment.timed
    ? `Each clip must run ${minS}-${maxS} seconds. Use the [MM:SS] timecodes to set start_time and end_time at real cue boundaries, ending on a completed thought.`
    : `This transcript has no timecodes. Length is measured by word count: at roughly ${wpm} words per minute, a ${minS}-${maxS} second clip is about ${Math.round(
        (minS / 60) * wpm,
      )}-${Math.round(
        (maxS / 60) * wpm,
      )} words. Size full_quote into that window and set start_time and end_time to null.`;

  const body = segment.timed
    ? segment.cues
        .map((c) => `[${formatTimecode(c.start)}] ${c.text}`)
        .join('\n')
    : segment.text;

  return `## Lesson

Title: ${lesson.videoTitle || '(untitled)'}
Student: ${lesson.student || '(unknown)'}
Date: ${lesson.date || '(unknown)'}
Lesson category: ${lesson.category || '(unspecified)'}
${lesson.description ? `Session summary: ${lesson.description}\n` : ''}
## Segment ${segment.index}

${body}

## Task

Find the best clip in this segment, then up to ${n - 1} weaker alternates in case the best one fails downstream checks. Rank them best first.

${lengthRule}

Allowed topic values: ${TOPICS.map((t) => `"${t}"`).join(', ')}
Allowed cta values: ${CTAS.map((c) => `"${c}"`).join(', ')}

If this segment contains no clip that meets the bar — it is logistics, small talk, tuning, or an incomplete thought — return an empty candidates array. That is a valid and expected answer.`;
}

export function formatTimecode(seconds) {
  if (seconds === null || seconds === undefined) return '';
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(sec).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}
