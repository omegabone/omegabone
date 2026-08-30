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

Same as the standing process (see `PROMPT.md`'s Phase 1): check
`tools/clip-review/state-*/reviews.json` for approved-but-unrendered
clips, render them, and run the Antoine/Ira/MetaMuse daily rotation logic
— each of the three keeps their own real every-3rd-day cadence by filling
the gap days around Antoine's already-queued schedule. Tonight this will
likely find nothing new to post yet, since Ira and MetaMuse don't have any
approved clips until she reviews tonight's batch — that's expected. This
phase runs every night regardless of the special batch below.

## Phase 2 — MetaMuse and Ira, 3 source videos each (6 total tonight)

She's capped nightly review at ~1 hour/day, which works out to **3
source videos per singer, 6 total** — not 30 clips each. This replaces
the earlier 30-clip target below; treat every "~30 proposed clips"
reference in this file as superseded by "3 videos per singer."

8 MetaMuse lessons and 8 Ira lessons are already downloaded locally in
`lessons/` — but **that is not her full library**. She worked with Ira for
5 months (sometimes daily, sometimes 2x/week), so there are almost
certainly many more Ira lessons on the `@omegabone` YouTube channel than
the 8 already local. Before processing Ira, find her actual playlist(s) on
the channel and run `yt-dlp --impersonate chrome` against the full
playlist URL (not just individual videos) — `--download-archive` makes
re-running safe, already-downloaded ones are skipped automatically.
**Same for MetaMuse** — she worked with the user for 2 months, so the 8
local lessons are very likely a partial set too. Find her full playlist
and download whatever's missing before assuming 8 is the whole library.

None of the 16 already-local lessons are in
`tools/clip-extractor/clips-out/manifest.json` yet based on tonight's
check.

For **MetaMuse** (all "Vocal Mastery with MetaMuse" — VME brand):
1. Run the AI clip-picker on exactly **3 source videos** (pick a good
   spread across her library, not just the first 3 chronologically).
   Leave everything for human review — do not approve or render.
2. For each of those 3 lessons, write the source-video description and
   design+rasterize the thumbnail exactly as the standing process
   describes (`tools/nightly-agent/video-review/<lesson-stem>/`).

For **Ira** (mixed L2S and VME — check each lesson title):
1. Same as above — exactly **3 source videos** from her full library
   (not just the original 8 that happened to be local), picking a good
   spread across her 5 months of lessons rather than the first 3
   chronologically. Leave everything for review.
2. Same description + thumbnail treatment per lesson, tagged with
   whichever brand that specific lesson actually is (don't assume all of
   Ira's lessons are one brand — her lessons split across both).

Downloading full playlists for two students who worked with her for 2-5
months may take real time and eat into tonight's budget before any
clip-picking even starts. If the ~30-clip target isn't reachable for
either singer after downloading, that's fine — log exactly how far you
got and why (still downloading vs. ran the numbers and picked fewer
good clips), rather than forcing a worse batch just to hit 30.

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
