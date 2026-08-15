# Clip Review

Watch the rendered clips, write feedback on each one, and approve the keepers
into a separate folder.

The extractor decides which moments become clips. The renderer makes the files.
This is the pass where you decide which ones actually go out.

---

## Running it

```bash
cd tools/clip-review
node bin/review.mjs --clips ../clip-renderer/out
```

It opens `http://localhost:4321`. No install step — there are no dependencies.

| Flag | Meaning |
|---|---|
| `--clips <dir>` | Folder of rendered clips (default `../clip-renderer/out`) |
| `--approved <dir>` | Where approved clips go (default `<clips>/approved`) |
| `--manifest <path>` | Extractor manifest, for each clip's topic, caption and quote (default `../clip-extractor/clips-out/manifest.json`) |
| `--port <n>` | Port to serve on (default 4321) |
| `--move` | Move approved clips instead of copying them |
| `--no-open` | Do not open a browser |

## Why it is a server and not just a page

A page opened from the filesystem cannot move a file into another folder, and
that is the part you asked for. So the page is served by a small local process
that does the file work — bound to `127.0.0.1`, no dependencies, nothing leaves
the machine.

---

## The pass

Each clip shows its video, the awareness category and topic it was cut for,
the caption that is burned into it, the quote, why the model thought it hooks,
and a link back to the source lesson at the clip's in-point.

- **Approve** copies the clip into the approved folder.
- **Reject** records the verdict and keeps the file where it is.
- **Feedback** saves as you type — there is no save button, and closing the tab
  mid-sentence does not lose the sentence.

| Key | |
|---|---|
| <kbd>J</kbd> / <kbd>K</kbd> | next / previous clip |
| <kbd>A</kbd> <kbd>R</kbd> <kbd>U</kbd> | approve / reject / undecided |
| <kbd>N</kbd> | jump to the next undecided clip |
| <kbd>Space</kbd> | play / pause |
| <kbd>F</kbd> | write feedback (<kbd>Esc</kbd> to leave the box) |
| <kbd>?</kbd> | the key list |

The page opens on **Undecided**, and a clip leaves that filter the moment you
decide on it, so a long batch is worked by pressing a key and looking at the
next one.

---

## What ends up on disk

```
out/
  brittany-21-may-2026-1.mp4     the renders, never deleted or altered
  reviews.json                   every verdict and every note
  approved/
    brittany-21-may-2026-1.mp4   the keepers
    brittany-21-may-2026-1.srt   captions travel with the clip
    approved.csv                 file, student, topic, caption, CTA, feedback
```

**`reviews.json` is the record; the folder is derived from it.** Delete the
approved folder and the next verdict rebuilds it — but a folder of files alone
cannot say why the other clips were cut, which is the part worth keeping.

**Approving copies by default.** A review pass gets revisited, so un-approving
should be free: the render stays where the renderer put it and the copy is
removed from the approved folder. Use `--move` when the approved folder *is* the
delivery folder and you do not want two copies of every clip.

`approved.csv` is rewritten on every verdict so the folder you hand off — or
upload from — carries the captions and your notes with the files, rather than a
path back into the tooling.

---

## Clips with no file, files with no clip

Both show up, because neither list is the whole truth:

- A clip in the manifest that has not been rendered yet is listed and marked
  **no file**. You can still write feedback on it and still approve it — the
  verdict is recorded, and nothing is copied until the render exists.
- An mp4 in the folder that the manifest knows nothing about is listed under
  *Unfiled renders* with no metadata. Hand-cut clips dropped into the folder are
  reviewable the same way.

Run the review against a folder with no manifest at all and it still works —
you get the videos, the feedback box and the approved folder, without the
per-clip metadata.

---

## Tests

```bash
npm test
```

They cover the two things worth being sure of: that a verdict reaches disk, and
that the approved folder always agrees with the verdicts — including that
un-approving takes the clip back out, and that no render is ever deleted.
