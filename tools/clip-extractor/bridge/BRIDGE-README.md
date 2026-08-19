# Videos automatically from the spreadsheet

Runs your whole lesson sheet through the vocal-clipper app you already have,
and makes the videos without you clicking through each one.

For each row with a YouTube link:

```
link -> download -> timestamps -> clips picked -> rule check -> video
```

**Nothing inside the app changes.** This talks to it from the outside, over the
API it already has.

---

## What the rule check adds

The prompt *asks* the AI to follow your rules. This checks whether it actually
did, before anything gets rendered.

A clip is dropped if it:

- is under 30 or over 90 seconds (measured, not taken on trust)
- overlaps another clip
- has a category that isn't one of your five
- stops mid-sentence

Dropped clips are printed with the reason and never become videos. Everything
that passes gets rendered and written to the spreadsheet.

---

## Setup, once

1. Start the clipper the way you normally do (`./start.sh`).
2. Export your library sheet: **File → Download → Comma-separated values (.csv)**

That's it. Nothing to install.

---

## Running it

Try two lessons first:

```bash
python3 batch_from_sheet.py --sheet ~/Downloads/library.csv --limit 2
```

One student:

```bash
python3 batch_from_sheet.py --sheet ~/Downloads/library.csv --filter Brittany
```

Everything:

```bash
python3 batch_from_sheet.py --sheet ~/Downloads/library.csv
```

| Option | What it does |
|---|---|
| `--limit 2` | Only the first 2 lessons |
| `--filter Brittany` | Only lessons matching a name |
| `--approve-all` | Skip the rule check, render everything the AI picked |
| `--server` | If the app isn't on the usual port 5050 |
| `--out` | Where to write the spreadsheet (default `batch-out`) |

**Start with `--limit 2`.** Each lesson downloads a video and transcribes it,
so the full sheet takes hours.

---

## What you get

- **Videos** — in the clipper's normal outputs folder, same as always
- **`batch-out/clips.csv`** — one row per clip, in your sheet's column order,
  ready to paste

The CSV has one extra column, **Rule Check**, which says `ok` or the reason a
clip was flagged. Every quote is rebuilt from the transcript's own words, so it
is always what was actually said.

---

## The other file

`vme_export.py` holds the checking and spreadsheet logic. `batch_from_sheet.py`
uses it. It can also be wired into the app to add a download button, but that
means editing `server.py` — the batch script needs no changes to anything.

---

## If something goes wrong

**"Cannot reach the clipper"** — the app isn't running. Start it first.

**A lesson says FAILED** — that lesson is skipped and the rest continue. The
reason is printed.

**"nothing passed the rules"** — the AI's picks for that lesson were all bad.
Nothing is rendered. Re-run that one lesson through the app by hand to see what
it proposed, or use `--approve-all` to render regardless.
