# Clip Renderer

Renders vertical (1080×1920) social clips from `clip-extractor` output using
Remotion.

The extractor decides *which* moments become clips. This renders them.

---

## Setup

```bash
cd tools/clip-renderer
npm install
```

## Preview before rendering anything

```bash
npm run studio
```

Opens Remotion Studio with the `Clip` composition and stand-in props. Edit props
in the sidebar to see layout and caption behaviour without any footage attached.

A single frame, no Studio:

```bash
npx remotion still Clip out/preview.png --frame=90
```

Use a settled frame (not `--frame=0`) — the title animates in over the first
half-second, so frame 0 is intentionally near-empty.

---

## Rendering a batch

```bash
node scripts/render-all.mjs \
  --manifest ../clip-extractor/clips-out/manifest.json \
  --video-dir ~/Videos/lessons \
  --out out
```

| Flag | Meaning |
|---|---|
| `--manifest <path>` | Extractor output to render from |
| `--video <file>` | One source video for every clip |
| `--video-dir <dir>` | Directory of sources, matched to lessons by student and date in the filename |
| `--brand <name>` | Force one brand for all clips. Omit it — the brand is read from each lesson's title (see below) |
| `--id <clipId>` | Render one clip |
| `--no-captions` | Skip burned-in captions |
| `--dry-run` | List what would render |

Name source files so the student and date are both in them —
`brittany-21-may-2026.mp4`. With only the student in the name, matching works
when that student has exactly one video in the directory and warns when
ambiguous.

### Only timed clips can be rendered

A clip needs a real in-point and real cue timings. Clips cut from the untimed
library sheet have an *estimated* duration and no in-point, so there is nothing
to cut against — the driver lists and skips them.

To render a lesson, run the extractor against a timed transcript for it:

```bash
node bin/extract-clips.mjs --transcript lesson.srt --url "https://youtube.com/live/XXXX" ...
```

---

## Render what was approved, not what was proposed

`tools/clip-review` is where clips are decided: it plays each one against the
lesson video before anything is rendered, trims it by clicking words in the
transcript, and writes `approved-manifest.json` — the approved clips at their
trimmed in and out points, captions re-cut to match.

```bash
cd ../clip-review && node bin/review.mjs --video-dir ~/Videos/lessons
```

Then render that batch instead of the extractor's:

```bash
node scripts/render-all.mjs \
  --manifest ../clip-extractor/clips-out/approved-manifest.json \
  --video-dir ~/Videos/lessons
```

Rendering the extractor's manifest directly still works, and renders everything
it proposed.

---

## Branding

Brand tokens are lifted from the site so clips match it rather than inventing a
second identity:

**The brand comes from the lesson title.** A title says which product it is, so
nothing needs to be passed per run:

| Title contains | Brand | Source | Look |
|---|---|---|---|
| "Vocal Mastery", "VME" | `vme` | `PracticePage.tsx` → `FOREST_GREEN` | Dark forest green, mint accents |
| "Learn 2 Sing", "L2S" | `learn2sing` | `PracticePage.tsx` → `LAVENDER` | Dark purple, lavender accents |
| "Frequency" | `frequency` | `FrequencyPage.tsx` → `--freq-*` | Deep red, gold and bone, EB Garamond |
| "Music 33", "M33" | `mr33` | `M33Programs.tsx` → `#1a56db` | Deep navy, blue accents |

**A brand picked in the review page beats the title.** Each clip in an approved
manifest can carry its own `brand`, chosen against the four swatches while
reviewing; the title rule only applies to clips that were never given one. The
brand is most visible in the caption highlight — the marker band and bar behind
the words — so picking it is picking what the clip reads as at a glance.

A mixed library therefore renders correctly in one pass — the Vocal Mastery
lessons come out green and the Learn 2 Sing lessons purple.

Matching is whitespace-tolerant and substring-based because library titles are
hand-typed: "Vocal  Mastery with Antoine" (double space), "Learn 2 Sing Antoine"
(no "with"), "Vocal Mastery with Brittany 19.May.2026" (trailing date) all
resolve correctly. Learn 2 Sing is checked before Vocal Mastery, so an L2S
session that mentions Vocal Mastery still renders purple.

A title matching nothing falls back to VME and warns, so it shows up rather than
silently rendering in the wrong colour. `--brand` overrides detection entirely.

If you change those palettes on the site, update `src/theme.ts` to match — they
are copied values, not imports, because the site is a separate build.

---

## The frame

- **Title block** — awareness category, topic, student. Holds for the entire
  clip and never fades, so a viewer landing mid-scroll still sees what the
  lesson is.
- **Footage** — 16:9 at full width, cut to the clip's in-point.
- **Captions** — directly beneath the footage, in brand type.
- **CTA** — at the foot, easing out over the last 12 frames.

### Captions come from the transcript

Cues are the lesson's own subtitles, rebased to each clip's timeline by the
extractor. They are not re-transcribed from audio, so "soft palate" and
"lip buzz" are spelled the way Omega says them rather than the way an
auto-transcriber guesses at them.

Highlighting is **per cue, not per word**. The source only carries cue-level
timings; splitting a cue evenly across its words looks precise but drifts
against real speech. An honest cue beats a confident wrong word.

A clip with no cues (untimed source) shows the suggested caption as one held
card instead. Never both — that would print the same sentence twice.

---

## Fonts are bundled, not fetched

`public/fonts` holds latin-subset woff2 files loaded via `delayRender`, rather
than `@remotion/google-fonts`.

Fetching at render time makes every render depend on the network, breaks behind
a proxy or offline, and can silently fall back to a system font partway through
a batch so two clips don't match.

**Inter is a stand-in.** The VME and Learn 2 Sing portals specify `system-ui`,
which resolves differently on every machine and poorly inside headless Chromium.
Inter is bundled so batches render identically. The Frequency series names real
families and gets them.

---

## Source videos are copied into `public/`

Remotion serves assets over its own http server and rejects absolute filesystem
paths and `file://` URLs alike, so `render-all.mjs` copies each source into
`public/sources/` first.

It copies rather than symlinks: the bundler copies `public/` into the bundle and
does not follow symlinks, so a linked file 404s at render time.

`public/sources/` is gitignored, and files are reused across runs. Delete it when
you are done with a batch — lesson videos are large.

---

## Layout

```
src/Root.tsx      Composition registration, duration from clip length
src/Clip.tsx      The frame
src/Captions.tsx  Cue-level captions
src/theme.ts      Brand tokens and layout constants
src/fonts.ts      Local font registration
src/schema.ts     Props (zod)
scripts/render-all.mjs   Manifest -> rendered files
```
