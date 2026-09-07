# Clip Extractor

Finds the best short-form clips in vocal lesson transcripts and writes rows that
paste straight into the existing clip sheet.

It replaces the manual pass of reading a lesson, spotting the moments, and typing
them into the sheet by hand.

---

## What it does

1. Reads the lesson library sheet (85+ lessons, one transcript per row).
2. Splits each lesson into segments — one teaching beat each.
3. Asks a model for the single best clip per segment, scored against the rubric.
4. Enforces the hard rules in code, so a bad generation loses clips rather than
   producing clips that break the rules.
5. Writes `clips.csv`, `manifest.json` and `report.md`.

Step 4 is the part that matters. The model proposes; `src/enforce.mjs` disposes.

---

## Setup

```bash
cd tools/clip-extractor
npm install
```

Then set an API key for whichever model you want to select with:

```bash
export ANTHROPIC_API_KEY=...     # Claude (default)
export MOONSHOT_API_KEY=...      # Kimi
export OPENAI_API_KEY=...        # ChatGPT
export NOUS_API_KEY=...          # Hermes
export OPENROUTER_API_KEY=...    # OpenRouter (any of the above via one key)
```

Check what is wired up:

```bash
node bin/extract-clips.mjs --providers
```

---

## Getting the sheet out of Google

In the library spreadsheet: **File → Download → Comma-separated values (.csv)**.

The parser needs a `Video Title` column and a `Transcript` column; everything
else is optional and extra columns are ignored. Markdown and TSV exports work too.

---

## Running it

Dry run on a couple of lessons first — it costs one model call per segment, so a
full 85-lesson sweep is not something to fire blind:

```bash
node bin/extract-clips.mjs --library ~/Downloads/library.csv --limit 2
```

One student:

```bash
node bin/extract-clips.mjs --library ~/Downloads/library.csv --filter Brittany
```

The whole library:

```bash
node bin/extract-clips.mjs --library ~/Downloads/library.csv --out clips-2026-08
```

A different model:

```bash
node bin/extract-clips.mjs --library ~/Downloads/library.csv --provider kimi
node bin/extract-clips.mjs --library ~/Downloads/library.csv --provider hermes
node bin/extract-clips.mjs --library ~/Downloads/library.csv --provider chatgpt --model gpt-4o
```

No API calls at all, to check the plumbing:

```bash
npm run smoke
```

`--offline` uses a keyword heuristic. It is there to exercise the pipeline and
to keep the enforcement rules testable. It is not a substitute for the model —
it matches words, it cannot tell whether a thought is finished.

---

## The rules

Assigned by the model, enforced in code:

**One core awareness category per clip.** Unaware, Problem Aware, Solution Aware,
Brand Aware, Product Aware. A clip that fits two is a weaker clip; a clip that
cannot be cleanly assigned to one is dropped.

**An optional high-value tag.** One-line correction, emotional unlock,
performance coaching, mistake reveal, authority clip. Applied only when the clip
is genuinely strong on it, otherwise left blank.

**30–90 seconds, ending on a natural thought.** Never a fixed length, never a
mid-sentence cut.

**Self-contained.** A clip that opens on "so that's why you do it" is dropped.

**No overlap.** Two clips cannot claim the same footage.

**5–8 clips per lesson**, with at most 2 per awareness category so a lesson does
not come back as eight Solution Aware clips.

Anything that fails a rule is dropped and recorded in `manifest.json` under
`rejected`, with the reason. Fewer clips is the intended failure mode.

### Two rules the model does not get to decide

**Quotes must be real.** Every quote is checked back against the source
transcript before it can become a clip. Paraphrases, and quotes stitched
together from passages that were never adjacent, are rejected as ungrounded.

**Length is measured, not claimed.** Timed sources are snapped to real cue
boundaries. Untimed sources are measured by word count.

---

## About clip lengths

The library transcripts have no timecodes, so durations there are **estimated
from word count** at 150 words per minute (`--wpm` to change it). Every row
records which basis was used in the `Duration Basis` column.

For exact in/out points, run against a timed transcript instead:

```bash
node bin/extract-clips.mjs \
  --transcript lesson.srt \
  --url "https://youtube.com/live/XXXX" \
  --title "Vocal Mastery with Brittany" --student Brittany --date "21 May 2026"
```

`.srt`, `.vtt` and Whisper `.json` all work. Timed runs also emit a
`Clip URL` that deep-links to the clip's start (`?t=123s`).

---

## Outputs

| File | What it is |
|---|---|
| `clips.csv` | Paste-ready rows in the live clip-sheet column order |
| `manifest.json` | Full structured record, including every rejected candidate and why |
| `report.md` | Readable review sheet, clips grouped by lesson |
| `captions/*.srt` | Per-clip subtitles, for timed lessons |
| `transcripts.json` | Each timed lesson's own transcript, for trimming clips in the review page |

`transcripts.json` holds the whole lesson, not only the clipped parts: trimming
a clip means reaching for the words on either side of it. Word-level timings are
carried through when the transcript has them — Whisper writes them with
`word_timestamps=True` — and the review page falls back to estimating them from
subtitle lines when it does not.

`clips.csv` leads with the eleven existing sheet columns in their current order —
Goal / CTA, Rank, Student, Topic, Clip Type, Video Title, Date, Video URL, Full
Quote, Why It Hooks, Suggested Caption — then appends Awareness Category,
High-Value Type, Duration, Duration Basis, Start, End, Clip URL, Score and
Segment.

Read `report.md` before pasting anything. The tool narrows 85 lessons down to a
reviewable shortlist; it does not have final taste.

---

## Tuning

| Flag | Default | Use when |
|---|---|---|
| `--segment-words` | 700 | Lower it to get more candidate clips per lesson |
| `--max-per-category` | 2 | Raise it if one category genuinely dominates a lesson |
| `--min-clips` / `--max-clips` | 5 / 8 | Change the per-lesson quota |
| `--min-seconds` / `--max-seconds` | 30 / 90 | Change the length window |
| `--wpm` | 150 | Tune the duration estimate to actual speaking pace |
| `--candidates` | 3 | More alternates per segment, so enforcement has more slack |
| `--concurrency` | 3 | Raise for speed, lower if you hit rate limits |

Short lessons legitimately return fewer than 5 clips. When that happens the run
reports it as `under floor` rather than padding with weak clips.

---

## Editing the rubric

The prompt lives in `src/prompt.mjs` and the taxonomies in `src/config.mjs`. To
change what counts as a good clip, edit the prompt. To add a topic or a CTA,
edit the config — the model is constrained to the listed values, so new ones have
to be added there before it can use them.

---

## Tests

```bash
node --test 'test/*.test.mjs'
```

Covers the enforcement rules, including the ones the model cannot be trusted to
enforce for itself: quote grounding, category validity, length, overlap, and the
per-lesson cap.

---

## Layout

```
bin/extract-clips.mjs   CLI
src/sources.mjs         Sheet and transcript parsers
src/segment.mjs         Lesson to segments
src/prompt.mjs          The rubric
src/select.mjs          Claude selection
src/providers.mjs       Kimi / ChatGPT / Hermes / OpenRouter
src/enforce.mjs         The hard rules
src/output.mjs          CSV, JSON, Markdown writers
src/offline.mjs         Keyword heuristic for smoke tests
```
