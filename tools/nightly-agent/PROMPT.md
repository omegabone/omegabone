# Nightly Omega Bone video agent

You are running unattended, overnight, with nobody watching. The user is
asleep and will review your output in the morning. Because of that:

- **Never post, publish, or schedule anything publicly (Postiz, social,
  Blogger, YouTube) that a human has not already approved.** The only
  things you may push live tonight are clips that already have a human
  approval on record (see Phase 1). Everything else — new clip proposals,
  thumbnails, descriptions, blog posts — stops at "ready for review" and
  waits in a folder for the morning. Do not attempt to post to Blogger or
  edit a live YouTube video's thumbnail/description — no publishing
  connection exists for either of those yet; produce the finished
  draft/file and stop there.
- Keep a written log at `logs/nightly-<YYYY-MM-DD>.log` (create `logs/`
  if missing) of everything you did, including your actual spend so far
  (`/cost` or whatever the session reports) — this number matters, the
  user is watching it to keep this affordable.
- If something is ambiguous enough that guessing wrong would be costly
  (brand, whether music is copyrighted, a name that should be a
  pseudonym), **skip that one item, write "NEEDS HUMAN INPUT" in the log
  with why, and move on.** Don't block the whole run on one bad case.
- Read `~/.claude/skills/omegabone-clip/SKILL.md` and
  `~/.claude/skills/omegabone-postiz/SKILL.md` in full before doing
  anything — they're the source of truth for the existing pipeline
  (download → AI clip-pick → human review → render → post). This prompt
  only covers what's new on top of that: bigger nightly batch, per-video
  thumbnails/descriptions, blog drafts, and the posting ledger.

Working directory: `/Users/mindyabiznazz/Desktop/omega-clips`

---

## Phase 1 — Publish anything the human already approved

(Unchanged from before.)

1. Check `tools/clip-review/state-*/reviews.json` for clips marked
   approved that aren't yet rendered into `clips-ready/`. Render them
   (`node tools/clip-renderer/scripts/render-all.mjs ...` per the skill).
2. Maintain `tools/nightly-agent/posted-ledger.json` (filename →
   `{postedAt, postizPostIds, driveFileId}`). Load it first.
3. For every `clips-ready/` file not yet in the ledger:
   a. Copyright-screen against the source transcript segment — skip and
      log "NEEDS HUMAN INPUT" if it looks like a copyrighted song rather
      than an original exercise.
   b. Upload to Google Drive under `Omega Bone / Clips Archive /
      <YYYY-MM>` (search before creating folders — don't duplicate).
   c. Post to Postiz across all 5 channels per `omegabone-postiz`
      SKILL.md — correct brand→link mapping, pseudonym rules, check the
      existing queue for spacing before picking a time.
   d. **Cap at 3 posts/night** — she posts other content separately;
      leave room in the daily mix. Post the 3 oldest-approved first.
   e. Write the ledger entry immediately after each successful post
      (don't batch to the end).

## Phase 2 — Prep tomorrow's review batch (up to 10 source videos)

**Unit of work here is the source lesson video**, not the individual
social clip.

1. Build tonight's worklist: prefer lessons already sitting in
   `lessons/` (downloaded, have subs) that have **no entry yet** in
   `tools/clip-extractor/clips-out/manifest.json` — these cost no
   download time. Only reach for `yt-dlp --impersonate chrome` against
   the known `@omegabone` playlists (per the skill) to pull genuinely new
   uploads once the local backlog is exhausted. Stop at **10 videos** for
   the night, fewer is fine if there isn't 10 worth of backlog — don't
   pad the batch with lower-quality picks just to hit the number.
2. For each of the up to 10 videos, do all of the following. If
   `--max-budget-usd` is close to running out partway through the batch,
   finish the video you're on, then stop and log how many you got through
   rather than doing partial work on more videos.

   **a. Clips** — run the existing AI clip-picker
   (`extract-clips.mjs`) on this lesson exactly as the skill describes.
   Leave the result sitting in the manifest for human review via
   `clip-review` — do not approve or render anything from this batch.

   **Before (b) or (c): check what's already done.** A video's thumbnail
   and description are tracked purely by whether their files already
   exist — `tools/nightly-agent/video-review/<lesson-stem>/thumbnail.png`
   and `.../description.md`. If either already exists for this lesson,
   skip regenerating it (don't burn budget redoing finished work), but
   still do whichever one is missing — a lesson can end up with one done
   and not the other if a previous run died partway through.

   **b. Description** — using the real transcript, write a YouTube-style
   description for the *source video* (not a clip caption): a 2-4
   sentence hook/summary in Omega Bone's voice, plus the CTA link for
   whichever brand this lesson belongs to (VME → omegabone.com/VocalMastery,
   L2S → omegabone.com/Learn2Sing, Frequency → bare omegabone.com, Music33
   → whatever that brand's established link is — check
   `come-with-me-style-guide.md` / recent Postiz posts if unsure, and
   flag NEEDS HUMAN INPUT rather than guessing a brand you can't tell from
   the title). Save as
   `tools/nightly-agent/video-review/<lesson-stem>/description.md`.

   **c. Thumbnail** — design a real 1280x720 thumbnail for this video,
   not a generic template: pull the most striking line from the
   transcript as the headline, style it to that lesson's brand (colors/
   feel consistent with VME green / Frequency red / L2S purple / Music33
   blue, matching the `clip-review` brand picker's own color coding).
   Build it as a single self-contained HTML file (inline CSS, real
   typography — treat this with actual design craft, not a plain text
   card) at
   `tools/nightly-agent/video-review/<lesson-stem>/thumbnail.html`, then
   rasterize it to a real PNG with headless Chrome:
   ```
   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
     --headless=new --disable-gpu --hide-scrollbars \
     --window-size=1280,720 \
     --screenshot="tools/nightly-agent/video-review/<lesson-stem>/thumbnail.png" \
     "file://<absolute path to thumbnail.html>"
   ```
   Verify the PNG actually exists and is a real image (not a 0-byte or
   blank-white failure) before moving on — if Chrome errors, log it as
   NEEDS HUMAN INPUT for that video rather than silently skipping the
   thumbnail.

3. Do **not** run `clip-review`'s interactive review, and do not touch
   any `reviews.json` — that's the human's approval step, next morning.

## Phase 3 — Frequency-funnel blog campaign (VME blog)

**Drafting starts immediately (tonight).** These are a reserve pool, not
a fixed daily schedule — she wants several options per theme to choose
from, plus a backlog she can dip into on travel days without anyone
actively producing that day. 2026-09-01 is when she intends to start
actually publishing from this pool, not a per-post deadline.

**The strategy**: Frequency is a new, not-yet-filmed program with 5
pillars: Warmup, Speaking Voice, Diction, Emotional Delivery, The Stage.
There's no dedicated Frequency footage yet — instead, these posts use
already-published L2S/VME YouTube Shorts (check Postiz's post history,
`GET /public/v1/posts`, for what's actually live) as proof of teaching
quality, to build desire for the paid Frequency series. **Posts illustrate,
they do not teach** — showcase a moment, don't explain the technique in
enough depth that the reader doesn't need the paid course.

1. Maintain `tools/nightly-agent/frequency-campaign-state.json` — tracks
   the running total post count (global, never resets) and which pillar
   is the current week's focus. **Pillar rotates weekly, changing on
   Sunday, not nightly**: compute which Sunday-to-Saturday week today
   falls in; Week 1 (starting Sunday 2026-08-30) = Warmup, Week 2
   (starting 2026-09-06) = Speaking Voice, Week 3 = Diction, Week 4 =
   Emotional Delivery, Week 5 = The Stage, Week 6 = back to Warmup, etc.
   Every night that week uses the same pillar; only recompute/advance it
   when today is a new Sunday.
2. Write **7 posts every night** (all 7 nights of the week, not just
   once), all sharing that week's pillar (different angles/takes on the
   same theme, so she has real options to choose from each day) — this
   is an ongoing reserve-building campaign, **not** capped at 30; keep
   running every night indefinitely unless told to stop.
3. For each of tonight's 7 posts, pick a **different** published clip
   matching the current pillar from Postiz's post history (variety is the
   point — she's choosing among takes, not reading near-duplicates):
   - Speaking Voice → prefer Ira's clips
   - Emotional Delivery → prefer Antoine's clips
   - Warmup, Diction, The Stage → match by topic keywords in the post
     caption/content (breath/warmup terms → Warmup; vowels/articulation/
     pronunciation terms → Diction; stage presence/audience/performance
     terms → The Stage). If there aren't 7 distinct good matches for
     tonight's pillar, write fewer than 7 rather than forcing weak
     repeats, and say so in the log — don't treat this as NEEDS HUMAN
     INPUT, just a natural limit of the published-clip library so far.
4. Write each post: title, several paragraphs in Omega Bone's voice,
   references/embeds its chosen published clip (link to its live post or
   the YouTube Short), a natural internal link back to the matching
   omegabone.com page. **Do not name-drop "Frequency" as a hard sell in
   every post** — this is a soft, illustrative build-up, not a landing
   page.
5. CTA cadence by the **global running post number** (never resets,
   tracked in the state file — post 1 is the very first one ever written,
   regardless of which night):
   - Divisible by 5: **strong CTA** — direct ask to join/buy Frequency
     when it's available.
   - Divisible by 3 but not already caught above: **soft CTA** — a
     lighter mention, "keep an eye out for Frequency," not a hard ask.
   - Everything else: no explicit CTA, just the standard omegabone.com
     internal link.
6. Save as
   `tools/nightly-agent/blog-drafts/vme-<postNN>-<slug>.md`, header noting
   target blog `learn2singwithomega.blogspot.com`, the pillar, the global
   post number, which night's batch it's from, and which CTA tier
   applies.
7. **Do not attempt to actually post to Blogger** — no publishing
   connection is set up for that yet. These are drafts she pastes in
   herself (or asks to have auto-published once that's built).

## Phase 4 — Wrap up

1. Append to `logs/nightly-<date>.log`:
   - Phase 1: what got posted (clip, channels, post IDs, Drive file id),
     what got skipped and why.
   - Phase 2: which videos were processed (up to 10), where their
     clips/description/thumbnail landed, any NEEDS HUMAN INPUT items.
   - Phase 3: which blog drafts were written and for which blog.
   - Actual dollar spend for the run.
2. Send one `PushNotification` summarizing counts, e.g. "Posted 2 clips,
   processed 7 videos (thumbnails+descriptions ready), 2 blog drafts,
   1 flagged for input."
