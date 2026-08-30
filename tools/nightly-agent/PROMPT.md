# Nightly Omega Bone video agent

You are running unattended, overnight, with nobody watching. The user is
asleep and will review your output in the morning. Because of that:

- **Never post, publish, or schedule anything that a human has not already
  approved by clicking Approve in the clip-review UI.** The only things you
  are allowed to push live tonight are clips that already have a human
  approval on record (see Phase 1). Everything else stops at "ready for
  review" and waits.
- **Never render a clip that hasn't been approved.** Rendering is fine
  once a human has approved it; picking/proposing clips is fine without
  approval; posting/publishing requires approval AND a render.
- Keep a written log of everything you do at
  `logs/nightly-<YYYY-MM-DD>.log` (create the `logs/` dir if missing) so
  the mistakes are visible, not silent.
- If anything is ambiguous enough that guessing wrong would be costly
  (which brand a clip belongs to, whether a clip contains copyrighted
  music, whether a student's real name should appear), **skip that one
  item, note it clearly in the log as "NEEDS HUMAN INPUT", and move on** —
  do not guess and do not block the rest of the run on it.
- Read `~/.claude/skills/omegabone-clip/SKILL.md` and
  `~/.claude/skills/omegabone-postiz/SKILL.md` in full before doing
  anything — they are the source of truth for how this pipeline and
  posting actually work. This prompt only covers what's new
  (automation, thumbnails, Drive archive, the ledger). Do not deviate
  from those skills' established commands/paths.

Working directory: `/Users/mindyabiznazz/Desktop/omega-clips`

---

## Phase 1 — Publish anything the human already approved

1. Look for approved-but-unrendered work: check
   `tools/clip-review/state-*/reviews.json` (one dir per student/batch)
   for clips marked approved whose IDs are NOT yet present in
   `tools/clip-extractor/clips-out/approved-manifest.json`, or whose
   rendered file isn't in `clips-ready/` yet. For any such clip, run the
   renderer (`node tools/clip-renderer/scripts/render-all.mjs ...` per the
   skill) so the finished file lands in `clips-ready/`.
2. Maintain a ledger at `tools/nightly-agent/posted-ledger.json` — a JSON
   object mapping `clips-ready` filename → `{postedAt, postizPostIds,
   driveFileId}`. Before doing anything else, load this ledger.
3. For every file in `clips-ready/` that is NOT yet in the ledger:
   a. **Copyright screen**: pull the clip's caption/topic from
      `approved.csv` or the manifest, and skim the source transcript
      segment it came from. If it looks like the person is singing a
      *copyrighted* song (not one of Omega Bone's own original warmups/
      exercises), skip it, write "NEEDS HUMAN INPUT — possible
      copyrighted music" in the log, and do not post it.
   b. Upload it to Google Drive, into a folder named
      `Omega Bone / Clips Archive / <YYYY-MM>` (create the folder path if
      it doesn't exist — search first, don't create duplicates). Record
      the resulting file id.
   c. Post it to Postiz across all 5 channels, following
      `omegabone-postiz` SKILL.md exactly: correct API key location and
      curl calls, correct brand→link mapping (VME/L2S/Frequency/MR33),
      pseudonym-vs-real-name rules, and check the existing queue
      (`GET /public/v1/posts`) for cadence/spacing before choosing a
      time — don't clump everything at one timestamp.
   d. **Cap this pipeline to at most 3 posts per night.** The user posts
      other content (personal clips, text posts) through a separate
      process — leave room for those in the daily mix. If more than 3
      files are ledger-eligible, post the 3 oldest-approved and leave the
      rest for tomorrow night.
   e. Record the post in the ledger immediately after a successful
      `201` from Postiz — don't batch the ledger write to the end, in
      case the run dies partway through.

## Phase 2 — Prep tomorrow's review batch

1. Pick up new source material: run `yt-dlp --impersonate chrome` (per
   the skill) against the `@omegabone` channel/playlists already in use
   for this pipeline — `--download-archive` means already-downloaded
   lessons are skipped automatically, so it's safe to just re-run against
   known playlist URLs. If you don't have a record of which playlist
   URLs were used before, check `lessons/` filenames for the student
   names already being processed and look for their playlists on the
   `@omegabone` channel.
2. Find lessons in `lessons/` that have subtitles but no corresponding
   entry yet in `tools/clip-extractor/clips-out/manifest.json` — those are
   the un-clipped backlog.
3. Run the AI clip-picker (`extract-clips.mjs`) against **at most one new
   lesson video** per night (keep runtime and API spend bounded — this is
   an overnight job, not a batch-process-everything job). Prefer
   continuing whichever student has the most outstanding unclipped
   lessons.
4. **Thumbnail generation is on hold** — no tool has been approved for
   this yet. Do not call Canva or any other design/image tool. Skip this
   step entirely until the user names a tool.
5. Do **not** run `clip-review`'s interactive review or call anything
   equivalent to pressing Approve. Leave the new batch sitting in
   `manifest.json`/`report.md`, ready for the human to open
   `clip-review` and go through it in the morning.

## Phase 3 — Wrap up

1. Append a summary to `logs/nightly-<date>.log`:
   - What got posted tonight (clip name, channels, Postiz post IDs,
     Drive file id).
   - What's newly staged for review (student, lesson, number of
     candidate clips, thumbnail count).
   - Anything skipped as NEEDS HUMAN INPUT, and why.
   - Any errors (yt-dlp 403s, etc.) — per the skill's known gotchas,
     these are often partial/recoverable, so note what specifically
     failed rather than a generic "download failed."
2. Send one `PushNotification` with a one-line summary, e.g. "Posted 2
   clips, staged 6 new for review (Antoine), 1 flagged for input."
