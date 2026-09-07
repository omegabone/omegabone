# Clip Review

Watch the clips the extractor picked, trim them by clicking words, write
feedback, and approve the keepers — then render only those, at the in and out
points you settled on.

The extractor proposes clips. This is where they are decided.

---

## Running it

```bash
cd tools/clip-review
node bin/review.mjs --video-dir ~/Videos/lessons
```

The paths are remembered, so after the first run there is nothing to type:
**double-click `Review clips.command`** (`Review clips.cmd` on Windows) and the
page opens on the latest batch.

There is nothing to choose in the page either. The batch is whatever the
extractor last wrote; the lesson videos are matched to it by student and date,
the same way the renderer matches them.

| Flag | Meaning |
|---|---|
| `--video-dir <dir>` | Lesson videos. This is what a clip is played and trimmed against before it has been rendered |
| `--manifest <path>` | Batch to review (default `../clip-extractor/clips-out/manifest.json`) |
| `--transcripts <path>` | Timed transcripts (default `transcripts.json` beside the manifest) |
| `--clips <dir>` | Rendered clips, if any (default `../clip-renderer/out`) |
| `--state <dir>` | Where `reviews.json` and `approved-manifest.json` are kept (default beside the manifest) |
| `--port <n>` | Port to serve on (default 4321) |
| `--move` | Move approved *renders* instead of copying them |
| `--no-open` | Do not open a browser |

Anything passed is saved to `review.config.json`, which the launcher then uses.
Delete that file to start over; `CLIP_REVIEW_CONFIG` moves it elsewhere.

---

## Trimming by word

Under each clip is the lesson transcript around it: the words inside the clip
lit up, the words on either side dimmed.

**Click a word and the nearer edge moves to it.** A word before the in-point
pulls the clip open; a word just inside the end pulls the clip in. It is the
whole interaction — there is no dragging, and the two edges never cross.

- `[` and `]` nudge the in-point by a quarter second, with <kbd>Shift</kbd> for
  the out-point.
- The in and out boxes take a number when you know the time you want.
- The length badge turns red outside the batch's own duration rule.
- **Undo trim** puts the clip back to what the extractor chose.

<kbd>Space</kbd> plays the clip from its in-point and stops at its out-point, so
what you hear is the cut, not the lesson running on past it.

### Where the word times come from

Real ones, when the transcriber recorded them — Whisper does with
`word_timestamps=True`, and the extractor now carries them through.

Otherwise the times are estimated: a subtitle line's duration spread across its
words, weighted by how long each word is. The page says so when that is what you
are clicking on, because an estimate is a good enough handle for finding the
right word and not good enough to trust to a tenth of a second. The video is the
check — play the cut and listen to it.

---

## Which brand it renders in

Under the clip are the four products, each shown in the colour it highlights
captions with: **VME** green, **Frequency** red, **Learn 2 Sing** purple,
**Music 33** blue. Pick one and that is what the clip renders as — the caption
highlight, the title block and the ground.

Until you pick, the brand is read from the lesson title, and the page says so
rather than letting a guess look like a decision.

---

## Approving

Approving writes **`approved-manifest.json`** beside the batch: the approved
clips only, at your trimmed times, with their captions re-cut from the lesson
transcript to match the new window. That is the file the renderer takes:

```bash
cd ../clip-renderer
node scripts/render-all.mjs \
  --manifest ../clip-extractor/clips-out/approved-manifest.json \
  --video-dir ~/Videos/lessons
```

So nothing is rendered until it has been approved, and what renders is what was
approved rather than what the model first proposed.

Verdicts, feedback and trims are saved to `reviews.json` in the same folder as
you work — there is no save button, and closing the tab mid-sentence does not
lose the sentence.

| Key | |
|---|---|
| <kbd>J</kbd> / <kbd>K</kbd> | next / previous clip |
| <kbd>A</kbd> <kbd>R</kbd> <kbd>U</kbd> | approve / reject / undecided |
| <kbd>Space</kbd> | play the clip from its in-point |
| <kbd>[</kbd> <kbd>]</kbd> | nudge the in-point (<kbd>Shift</kbd> for the out-point) |
| <kbd>N</kbd> | jump to the next undecided clip |
| <kbd>F</kbd> | write feedback (<kbd>Esc</kbd> to leave the box) |
| <kbd>?</kbd> | the key list |

The page opens on **Undecided**, and a clip leaves that filter the moment you
decide on it, so a batch is worked by pressing a key and looking at the next one.

---

## Clips that were already rendered

A clip with a rendered file still plays that file when there is no lesson video
to play instead, and approving still copies it into `approved/` with its
captions and an `approved.csv` of your notes. A clip you trim after it was
rendered is flagged — the file on disk is the old cut until you render the
approved batch again.

---

## Why it is a server and not a page you open

The page reads your batch, plays lesson videos an hour long by seeking into
them, and writes the render manifest. A page opened over `file://` can do none
of those, so opening `review.html` directly shows you how to start it instead.
The launcher exists so that starting it is still a double-click.

It binds to `127.0.0.1`. Nothing is uploaded and nothing leaves the machine.

---

## Tests

```bash
npm test               # the library, the trim maths, the render manifest
npm run test:browser   # the page, driven against a real server
```

The browser tests need Playwright (`npm i -D playwright`) and skip themselves
when it is absent, which is why they are a separate script — this package
otherwise has no dependencies at all. They boot the server on a small batch and
check the handshake that only exists when both halves run: that clicking a word
moves the right edge, that the edge reaches disk, and that the render manifest
comes out at the trimmed times.
