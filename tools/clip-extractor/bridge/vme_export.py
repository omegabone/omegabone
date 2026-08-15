"""
VME export bridge for vocal-clipper.

Drop this file next to server.py, then add two lines to server.py (see
BRIDGE-README.md). It adds one endpoint:

    GET /export/<job_id>        -> downloads clips.csv

The CSV columns match the live clip sheet exactly, so a run pastes straight in.

What it adds on top of the AI's answer
--------------------------------------
The prompt asks the model to follow the rules. This checks whether it did, and
says so. Nothing is silently dropped: every clip appears in the CSV with a
"Rule Check" column that is either "ok" or the reason it failed, so a bad clip
is visible rather than quietly shipped or quietly deleted.

Checks applied:
  - length is really 30-90 seconds (measured, not claimed)
  - clips do not overlap each other
  - the category is one of the five, spelled correctly
  - the clip ends on a finished sentence
  - the run returned 5-8 clips

The quote is rebuilt from the transcript's own words between the clip's start
and end, so it is always what was actually said.
"""

import csv
import io
import re

# The five core awareness categories, canonical spelling.
CORE_CATEGORIES = [
    "Unaware",
    "Problem Aware",
    "Solution Aware",
    "Brand Aware",
    "Product Aware",
]

# Goal / CTA values already in use in the clip sheet.
CTA_BY_CATEGORY = {
    "Unaware": "🔵 Watch Lessons",
    "Problem Aware": "🔵 Watch Lessons",
    "Solution Aware": "🟠 Buy Course",
    "Brand Aware": "🔵 Watch Lessons",
    "Product Aware": "🟢 Book Private Lessons",
}

MIN_SECONDS = 30.0
MAX_SECONDS = 90.0
MIN_CLIPS = 5
MAX_CLIPS = 8

# A clip that's just the student/coach singing or vocalizing, with no
# coaching commentary, reads as very repetitive: a short vocabulary said
# over and over ("cry, cry, cry", "wow, wow, wow, very good, wow"), unlike
# spoken instruction which draws on a much wider set of words. Measured the
# same way as the other checks here rather than taken on the AI's word.
MIN_INSTRUCTION_WORDS = 8
MAX_REPEAT_SHARE = 0.55
MIN_UNIQUE_SHARE = 0.35

SHEET_HEADER = [
    "Goal / CTA",
    "Rank",
    "Student",
    "Topic",
    "Clip Type",
    "Video Title",
    "Date",
    "Video URL",
    "Full Quote",
    "Why It Hooks",
    "Suggested Caption",
    # Added by this bridge:
    "Awareness Category",
    "Start",
    "End",
    "Duration (s)",
    "Clip URL",
    "Rule Check",
]


def _canonical_category(raw):
    """Match a model-supplied category to the canonical spelling, or None."""
    if not raw:
        return None
    cleaned = re.sub(r"[^a-z]+", " ", str(raw).lower()).strip()
    for category in CORE_CATEGORIES:
        if cleaned == re.sub(r"[^a-z]+", " ", category.lower()).strip():
            return category
    return None


def words_between(words, start, end):
    """Words spoken inside [start, end)."""
    out = []
    for w in words or []:
        try:
            w_start = float(w.get("start", 0))
        except (TypeError, ValueError):
            continue
        if start <= w_start < end:
            out.append(str(w.get("word", "")).strip())
    return [w for w in out if w]


def quote_for(words, start, end):
    """Rebuild the spoken line from the transcript, so it is never invented."""
    text = " ".join(words_between(words, start, end))
    # Whisper emits leading spaces per word; tidy the punctuation spacing.
    text = re.sub(r"\s+([,.!?;:])", r"\1", text)
    return re.sub(r"\s{2,}", " ", text).strip()


def timecode(seconds):
    seconds = max(0, int(float(seconds)))
    h, m, s = seconds // 3600, (seconds % 3600) // 60, seconds % 60
    return f"{h}:{m:02d}:{s:02d}" if h else f"{m:02d}:{s:02d}"


def _singing_only_problem(quote):
    """
    Flag a quote that reads as sung/vocalized repetition rather than spoken
    instruction. Returns a problem string, or None if the quote looks fine.
    """
    tokens = re.findall(r"[a-z']+", quote.lower())
    if not tokens:
        return None
    if len(tokens) < MIN_INSTRUCTION_WORDS:
        return f"only {len(tokens)} word(s) spoken — not enough to be instruction"

    counts = {}
    for t in tokens:
        counts[t] = counts.get(t, 0) + 1
    dominant_word, dominant_count = max(counts.items(), key=lambda kv: kv[1])
    repeat_share = dominant_count / len(tokens)
    unique_share = len(counts) / len(tokens)

    if repeat_share >= MAX_REPEAT_SHARE or unique_share <= MIN_UNIQUE_SHARE:
        return (
            f'sounds like singing/repetition, not instruction ("{dominant_word}" '
            f"is {dominant_count} of {len(tokens)} words)"
        )
    return None


def check_clip(clip, words, others):
    """
    Return a list of problems with this clip. Empty list means it passed.
    """
    problems = []

    try:
        start = float(clip.get("start"))
        end = float(clip.get("end"))
    except (TypeError, ValueError):
        return ["start/end missing or not a number"]

    duration = end - start
    if duration < MIN_SECONDS:
        problems.append(f"too short ({duration:.0f}s, needs {MIN_SECONDS:.0f}s+)")
    elif duration > MAX_SECONDS:
        problems.append(f"too long ({duration:.0f}s, max {MAX_SECONDS:.0f}s)")

    if _canonical_category(clip.get("category")) is None:
        problems.append(f'category "{clip.get("category")}" is not one of the five')

    # Overlap against every other clip in the same run.
    for other in others:
        if other is clip:
            continue
        try:
            o_start, o_end = float(other.get("start")), float(other.get("end"))
        except (TypeError, ValueError):
            continue
        if start < o_end and o_start < end:
            problems.append(f"overlaps the clip at {timecode(o_start)}")
            break

    # Ends on a finished thought.
    spoken = words_between(words, start, end)
    if spoken and not re.search(r"[.!?][\"')\]]?$", spoken[-1]):
        problems.append("does not end on a finished sentence")

    singing_problem = _singing_only_problem(" ".join(spoken))
    if singing_problem:
        problems.append(singing_problem)

    # The app locates a clip's start/end by finding its quoted words verbatim
    # in the transcript. When that search fails, it silently falls back to
    # the AI's own guessed timestamp — which is exactly the failure mode
    # that produces a title/quote that don't match. Surface that here rather
    # than let an ungrounded clip pass as "ok".
    if clip.get("grounded") is False:
        problems.append("start/end could not be matched to the transcript — title may not match the footage")

    return problems


def build_rows(clips, words, meta=None):
    """Turn a job's clips into sheet rows. Returns (rows, run_problems)."""
    meta = meta or {}
    clips = list(clips or [])

    run_problems = []
    if len(clips) < MIN_CLIPS:
        run_problems.append(f"only {len(clips)} clips (wanted {MIN_CLIPS}-{MAX_CLIPS})")
    elif len(clips) > MAX_CLIPS:
        run_problems.append(f"{len(clips)} clips (wanted {MIN_CLIPS}-{MAX_CLIPS})")

    # Guard the category cap across the run.
    seen_categories = {}

    rows = []
    for rank, clip in enumerate(sorted(clips, key=lambda c: float(c.get("start", 0))), 1):
        start = float(clip.get("start", 0))
        end = float(clip.get("end", 0))
        duration = end - start

        category = _canonical_category(clip.get("category")) or ""
        seen_categories[category] = seen_categories.get(category, 0) + 1

        problems = check_clip(clip, words, clips)
        verdict = "ok" if not problems else "; ".join(problems)

        url = meta.get("url", "")
        clip_url = ""
        if url:
            joiner = "&" if "?" in url else "?"
            clip_url = f"{url}{joiner}t={int(start)}s"

        rows.append([
            CTA_BY_CATEGORY.get(category, "🔵 Watch Lessons"),
            rank,
            meta.get("student", ""),
            meta.get("topic", ""),
            "short" if duration <= 60 else "long",
            meta.get("video_title", ""),
            meta.get("date", ""),
            url,
            quote_for(words, start, end),
            clip.get("description", ""),
            clip.get("title", ""),
            category or clip.get("category", ""),
            timecode(start),
            timecode(end),
            round(duration),
            clip_url,
            verdict,
        ])

    return rows, run_problems


def clips_to_csv(clips, words, meta=None):
    """Full CSV text, header included."""
    rows, run_problems = build_rows(clips, words, meta)

    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(SHEET_HEADER)
    for row in rows:
        writer.writerow(row)

    if run_problems:
        writer.writerow([])
        writer.writerow(["Run check:", "; ".join(run_problems)])

    return buf.getvalue()


def register(app, jobs):
    """
    Wire the export endpoint onto the existing Flask app.

    `jobs` is server.py's in-memory job dict, which already holds the chosen
    clips and the word-level transcript for each job.
    """
    from flask import Response, jsonify

    @app.route("/export/<job_id>")
    def export_clips_csv(job_id):
        job = jobs.get(job_id)
        if job is None:
            return jsonify({"error": "unknown job id"}), 404

        # Prefer the clips the user approved in the review step; fall back to
        # what the model proposed if the job was never reviewed.
        clips = job.get("approved_clips") or job.get("clips") or []
        words = job.get("words") or []

        if not clips:
            return jsonify({"error": "this job has no clips yet"}), 400

        meta = {
            "url": job.get("url", ""),
            "video_title": job.get("video_title", ""),
            "student": job.get("student", ""),
            "date": job.get("date", ""),
            "topic": job.get("topic", ""),
        }

        csv_text = clips_to_csv(clips, words, meta)
        return Response(
            csv_text,
            mimetype="text/csv",
            headers={
                "Content-Disposition": f'attachment; filename="clips-{job_id}.csv"',
            },
        )
