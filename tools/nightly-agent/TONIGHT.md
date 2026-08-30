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

8 MetaMuse lessons and 8 Ira lessons are already downloaded locally in
`lessons/` — but **that is not her full library**. She worked with Ira for
5 months (sometimes daily, sometimes 2x/week), so there are almost
certainly many more Ira lessons on the `@omegabone` YouTube channel than
the 8 already local. Before processing Ira, find her actual playlist(s) on
the channel and run `yt-dlp --impersonate chrome` against the full
playlist URL (not just individual videos) — `--download-archive` makes
re-running safe, already-downloaded ones are skipped automatically. Do
the same sanity check for MetaMuse (8 local may also be a partial set,
just less likely given a shorter apparent working relationship — verify,
don't assume either way).

None of the 16 already-local lessons are in
`tools/clip-extractor/clips-out/manifest.json` yet based on tonight's
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

## Phase 3 — start the Frequency-funnel VME blog campaign (7 posts tonight)

The user wants drafting to start now, building a reserve pool she can
choose from and dip into on travel days — not a fixed one-per-day
schedule. Follow the full "Frequency-funnel blog campaign" section in
`PROMPT.md` exactly (sourcing from already-published shorts,
illustrate-don't-teach, CTA cadence, state file at
`tools/nightly-agent/frequency-campaign-state.json`).

Tonight is **Night 1 → Warmup pillar → posts #1-7** (global post numbers
1 through 7; only post #3 and #5 get a CTA — post 3 soft, post 5 strong,
per the cadence rule — the rest have no explicit CTA). Write up to 7
distinct posts, each built around a different published Warmup-relevant
clip if that many good matches exist; fewer is fine if they don't, per
the campaign section's own instructions.

Do this in addition to Phase 1 and Phase 2 above, not instead of them.

## Wrap up

Log Phase 1, 2, and 3 results per the usual format, note actual spend,
and send one `PushNotification`, e.g. "MetaMuse: 28 clips, Ira: 31 clips
ready to review. 7 Warmup blog drafts ready to choose from."

**Before ending the run: rename this file** —
`mv tools/nightly-agent/TONIGHT.md tools/nightly-agent/done-2026-08-30.md`
— so the standing nightly plan resumes tomorrow.
