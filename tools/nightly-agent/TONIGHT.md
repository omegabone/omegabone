# One-off override for the night of 2026-08-30

This file, if present, replaces the standing nightly plan for ONE run only.
After this run finishes, rename this file to
`tools/nightly-agent/done-2026-08-30.md` so tomorrow night falls back to
the standing `PROMPT.md` automatically.

Read `~/.claude/skills/omegabone-clip/SKILL.md` and
`~/.claude/skills/omegabone-postiz/SKILL.md` first, same ground rules as
always: never post/publish/render anything without a prior human approval
on record; log everything to `logs/nightly-2026-08-30.log`; if something's
ambiguous enough that guessing wrong is costly, skip it, log "NEEDS HUMAN
INPUT" with why, and move on rather than blocking the whole run.

Working directory: `/Users/mindyabiznazz/Desktop/omega-clips`

## Phase 1 (unchanged) — publish anything already human-approved

Same as the standing process: check `tools/clip-review/state-*/reviews.json`
for approved-but-unrendered clips, render them, and for anything in
`clips-ready/` not yet in `tools/nightly-agent/posted-ledger.json`,
copyright-screen it, archive to Drive, and post to Postiz (cap 3/night,
update the ledger immediately per post). This runs every night regardless
of the special batch below.

## Phase 2 — MetaMuse and Ira, target 30 clip candidates each

All 8 MetaMuse lessons and all 8 Ira lessons are already downloaded locally
in `lessons/` (no yt-dlp needed for these two unless a genuinely new upload
exists on their playlists — check but don't block on it). None of them are
in `tools/clip-extractor/clips-out/manifest.json` yet based on tonight's
check.

For **MetaMuse** (all "Vocal Mastery with MetaMuse" — VME brand):
1. Run the AI clip-picker across her lessons, working through them until
   you have **~30 proposed clips** in the manifest (this pipeline
   typically yields 5-8 clips/lesson, so this may not need all 8 lessons —
   stop once you're comfortably around 30, don't force extra lessons just
   to round the number). Leave everything for human review — do not
   approve or render.
2. For each MetaMuse lesson you process, write the source-video
   description and design+rasterize the thumbnail exactly as the standing
   process describes (`tools/nightly-agent/video-review/<lesson-stem>/`).

For **Ira** (mixed L2S and VME — check each lesson title):
1. Same as above — work through Ira's 8 lessons until you have **~30
   proposed clips**, leaving everything for review.
2. Same description + thumbnail treatment per lesson, tagged with
   whichever brand that specific lesson actually is (don't assume all of
   Ira's lessons are one brand — his lessons split across both).

Both singers' clips should be clearly separable in the morning — the
existing `clip-review` state-dir convention already does this
(`tools/clip-review/state-<student>/`); create
`state-metamuse` and `state-ira` if they don't exist yet, matching how
`state-antoine` already works, so she can review one singer at a time.

## Phase 3 — start the Frequency-funnel VME blog campaign (post #1 tonight)

The user wants drafting to start now so she has time to read these before
anything goes live — 2026-09-01 is the target *publish* date for post #1,
not when drafting starts. Follow the full "Frequency-funnel blog
campaign" section in `PROMPT.md` exactly (pillar rotation, sourcing from
already-published shorts, illustrate-don't-teach, CTA cadence, state
file at `tools/nightly-agent/frequency-campaign-state.json`). Tonight is
post #1 → Week 1 → **Warmup** pillar → target publish date 2026-09-01 →
no CTA (post #1 isn't divisible by 3 or 5).

Do this in addition to Phase 1 and Phase 2 above, not instead of them.

## Wrap up

Log Phase 1, 2, and 3 results per the usual format, note actual spend,
and send one `PushNotification`, e.g. "MetaMuse: 28 clips, Ira: 31 clips
ready to review. Blog post #1 (Warmup) drafted for Sept 1."

**Before ending the run: rename this file** —
`mv tools/nightly-agent/TONIGHT.md tools/nightly-agent/done-2026-08-30.md`
— so the standing nightly plan resumes tomorrow.
