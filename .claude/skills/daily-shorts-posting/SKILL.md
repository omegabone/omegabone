---
name: daily-shorts-posting
description: Codifies Omega Bone's daily social posting cadence and pipeline for Postiz (LinkedIn, Facebook, Instagram, YouTube, TikTok). Load this whenever the task is posting, scheduling, or publishing video content for Omega Bone/omegabone — daily shorts, lesson clips, testimonials, Postiz scheduling, Vercel Blob uploads, or anything touching the Postiz posting queue. Also load it before acting on any instruction to "publish" or "post now" on this account, even if the instruction doesn't mention cadence — the single most expensive mistake on this account is burst-publishing content that was meant to go out 1x/day, and this skill exists specifically to prevent that.
---

# Daily Shorts Posting — Omega Bone / Postiz

This is Omega's actual posting policy, not a suggested default. Every number here (cadence, duration, slot count) is specific and intentional — don't round it off or "simplify" it when planning a posting run.

## The daily cadence

Three shorts go out most days, on three separate slots:

1. **Two "1–3 minute" shorts, 2x a day.** These are the longer-form lesson and technique clips — the bread-and-butter daily content.
2. **A 3rd short whenever the day's content includes Ira, Antoine, or MetaMuse.** Testimonial and MetaMuse footage isn't a replacement for one of the two standard slots — it's additive. If a testimonial/MetaMuse video exists for that day, it becomes a 3rd post, not a swap for one of the two above.
3. **One 10–15 second short featuring Omega herself, 1x a day**, posted separately from the two categories above. This is short-form and always has Omega on camera — don't confuse it with the 1–3 minute lesson clips.

So a full day is 3 posts (2 lesson clips + 1 Omega short) when there's no Ira/Antoine/MetaMuse content, or 4 when there is.

Space these across the day rather than firing them back to back — mirror the existing rhythm already in use for the 21 Day Challenge / Vocal Mastery rotation (roughly 12:00 / 16:00 / 20:00 UTC). The exact clock times matter less than the spacing: the grid on Instagram and TikTok reads as one post per day, and a burst of same-day posts wrecks that even if the total volume is "correct." See "Never burst-publish" below — this is the rule that has actually been violated before.

## Pipeline: source video → live post

1. **Upload the source video to Vercel Blob first.** Don't route through Google Drive — Drive links aren't reliably public/direct-downloadable, and Postiz's `uploadFromUrlTool` needs a URL it can fetch server-side without auth. Vercel Blob gives a clean public URL that works every time; Drive is a dead end that looks like it should work and doesn't (this cost a full session once — see the incident note below).
2. **Pass the Blob URL to Postiz's `uploadFromUrlTool`.** This returns a hosted `uploads.postiz.com/...` media URL — that's the thing to attach to a post, not the original Blob URL.
3. **Schedule with `integrationSchedulePostTool`** across the five connected channels (LinkedIn, Facebook, Instagram, YouTube, TikTok). Use `type: "schedule"` with a real future date for anything that isn't meant to go out this second — see below for what "publish now" should actually mean.
4. **TikTok AI disclosure:** only set `video_made_with_ai: true` in the TikTok settings when the video is genuinely AI-generated. It's a real compliance flag, not a default — don't set it on footage that's actually Omega, Ira, Antoine, or a real student.
5. **Log every post to the Google Sheet tracker** in the `OMEGA - Manifesto Photo Quotes` Drive folder (or whatever the current `Omega_Content_Tracker_*` sheet is) — platform, post ID, publish date/time, status. There's no cell-level Sheets edit API available through the Drive tools here, only whole-file create, so a tracker update means writing a fresh CSV/sheet, not patching one cell. When superseding an old tracker, say so plainly rather than silently overwriting — Omega prefers to delete the stale one herself once she's seen the new one is right.

## Never burst-publish content that's supposed to be paced

This is the one rule in this skill that exists because it already went wrong once, so take it seriously.

If content was designed to post 1x/day, publishing all of it "now" in one sitting — even 10 posts a few minutes apart — is a different action from running the schedule as intended, even though both technically involve "publishing." A burst lands every post within the same few-minute window instead of spread across days, and once posted there is no way to fix it from here: Postiz has no delete or reorder API, and there's no direct Instagram/TikTok API access in this setup either. Fixing a burst means the human manually deleting or archiving posts in the native apps — which cannot be undone by anyone, human or AI, once it's live.

So: when an instruction says "publish" or "publish now" on content that was scheduled for daily pacing, that instruction is ambiguous between two very different actions —
- **(a)** resume/execute the existing daily schedule (nothing changes about pacing, it just stops waiting), or
- **(b)** actually post everything immediately, right now, in one shot.

These are not the same action and only one of them is usually what's wanted. If it's not already unambiguous from context, ask which one before running it — a wrong guess here is the expensive kind of mistake, not a cheap one to redo. If the user has already been clear and explicit about wanting immediate publication, do that, but say plainly beforehand that it will collapse the daily pacing into a single burst, so it's an informed instruction rather than a surprise afterward.

## Quick reference: what "done right" looks like

- Each day's posts land at different times, not clustered in one window.
- Testimonial/MetaMuse content adds a 4th post on days it exists, rather than replacing a lesson-clip slot.
- Every attachment URL traces back to a Vercel Blob upload → Postiz media URL, never a raw Drive link.
- The AI-disclosure flag on TikTok reflects reality, not a copy-pasted default.
- The tracker sheet has one row per post with a working ID once the post confirms, not just a schedule ID that assumes success.
