# Clip Review

Watch the rendered clips, write feedback on each one, and approve the keepers
into a separate folder.

The extractor decides which moments become clips. The renderer makes the files.
This is the pass where you decide which ones actually go out.

---

## Two ways to open it

**Double-click `review.html`.** It asks which folder your clips are in, then
plays them, keeps your notes, and copies the approved ones into an `approved`
folder inside it. Chrome or Edge — Safari and Firefox have no way to let a local
page write to a folder.

**Or serve it**, which works in any browser:

```bash
cd tools/clip-review
node bin/review.mjs --clips ../clip-renderer/out
```

That opens `http://localhost:4321`. No install step — there are no dependencies.

| Flag | Meaning |
|---|---|
| `--clips <dir>` | Folder of rendered clips (default `../clip-renderer/out`) |
| `--approved <dir>` | Where approved clips go (default `<clips>/approved`) |
| `--manifest <path>` | Extractor manifest, for each clip's topic, caption and quote (default `../clip-extractor/clips-out/manifest.json`) |
| `--port <n>` | Port to serve on (default 4321) |
| `--move` | Move approved clips instead of copying them |
| `--no-open` | Do not open a browser |

**It is one file either way.** `review.html` carries the whole page, and the
server serves that same file rather than a copy of it — two files would drift
into two different tools. It notices which way it was opened: served, it talks
to the server; double-clicked, it does the same work itself through the
browser's file system access.

The differences between the two are small and worth knowing:

| | Double-clicked | Served |
|---|---|---|
| Browsers | Chrome, Edge | any |
| Metadata | `manifest.json` kept in the clips folder | any path, via `--manifest` |
| Approving | copies | copies, or moves with `--move` |
| Folder | picked once, then remembered — one click to re-grant | passed on the command line |

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

**Approving copies.** A review pass gets revisited, so un-approving should be
free: the clip stays where it was and the copy is removed from the approved
folder. `--move` is there for when the approved folder *is* the delivery folder
and you do not want two copies of every clip — it is a server-mode flag, since
a page you double-clicked should not be deleting your files.

`approved.csv` is rewritten on every verdict so the folder you hand off — or
upload from — carries the captions and your notes with the files, rather than a
path back into the tooling.

---

## Any folder of videos works

The extractor and renderer are not required. Point it at a folder of hand-cut
clips and you get the player, the feedback box and the approved folder, without
the per-clip metadata. Filenames are taken as they are — `Hook Test 02.MP4` is
listed the same as a pipeline slug.

When there *is* a manifest, both lists are shown rather than only their overlap:

- A clip in the manifest that has not been rendered yet is listed and marked
  **no file**. You can still write feedback on it and still approve it — the
  verdict is recorded, and nothing is copied until the render exists.
- A video in the folder that the manifest knows nothing about is listed under
  *Unfiled clips*.

---

## Tests

```bash
npm test          # the server and the file moves
npm run test:browser   # the page itself, opened as a local file
```

The browser tests need Playwright (`npm i -D playwright`) and skip themselves
when it is absent, which is why they are a separate script — this package
otherwise has no dependencies at all. They open `review.html` over `file://`
and drive it against a stand-in folder, covering the part that cannot be tested
any other way: that a double-clicked page really can read a folder, play a clip
out of it, and write to `approved/`.

What both suites are for is the same thing: that a verdict reaches disk, and
that the approved folder always agrees with the verdicts — including that
un-approving takes the clip back out, and that no original is ever deleted.
