#!/usr/bin/env python3
"""
Make videos automatically from the lesson spreadsheet.

Reads the sheet, and for every row with a YouTube link, drives the
vocal-clipper app you already have running at localhost:5050:

    link  ->  download  ->  timestamps  ->  clips picked  ->  rule check  ->  video

The rule check is the only new part. When the AI proposes its clips, this
approves the ones that actually follow the rules and drops the ones that do
not, so bad clips never get rendered. Everything it dropped, and why, is
written to the report.

Nothing is changed inside the app. This only talks to it over its own API.

Usage
    python3 batch_from_sheet.py --sheet library.csv
    python3 batch_from_sheet.py --sheet library.csv --limit 2      # try 2 first
    python3 batch_from_sheet.py --sheet library.csv --filter Brittany
    python3 batch_from_sheet.py --sheet library.csv --approve-all  # skip checks
"""

import argparse
import csv
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import vme_export as V  # noqa: E402

DEFAULT_SERVER = "http://localhost:5050"

# The criteria the app already ships with as its default prompt.
DEFAULT_PROMPT = """Find and extract the single best clip per segment based on the criteria below.
Each clip must fit exactly ONE primary category (no overlap). Prioritize clarity, emotional impact, and standalone value.

Core Awareness Categories (choose ONE only)
* Unaware — The student is not yet conscious of a vocal problem or unrealized potential.
* Problem Aware — The student expresses or clearly demonstrates a struggle.
* Solution Aware — The instructor introduces or demonstrates a technique to solve a vocal problem.
* Brand Aware — Highlights the coach's personality, teaching philosophy, trust-building moments, or visible transformation.
* Product Aware — Shows the structure of a lesson, before/after results, or a direct offer or CTA.

Additional High-Value Clip Types (use if strong)
* One-line correction — Short, punchy, memorable instruction.
* Emotional unlock — A clear shift where the student becomes freer or more confident.
* Performance coaching — Guidance on stage presence, expression, or confidence.
* Mistake reveal — Identification of a vocal issue.
* Authority clip — The instructor explains a concept with clarity and authority.

Selection Criteria
* Each clip must be self-contained and understandable without full video context
* Favor moments with authority
* Avoid clips with rambling, filler, or unclear teaching points
* Each clip should be 30-90 seconds — cut at the natural end of the thought, not a fixed length
* Return 5-8 clips total"""


# --------------------------------------------------------------------------
# Sheet reading
# --------------------------------------------------------------------------

FIELD_ALIASES = {
    "video title": "video_title",
    "student": "student",
    "date": "date",
    "url": "url",
    "video url": "url",
    "category": "topic",
}


def read_sheet(path):
    """Read the library sheet (CSV or TSV) into lesson dicts."""
    delimiter = "\t" if path.lower().endswith(".tsv") else ","
    with open(path, newline="", encoding="utf-8-sig") as fh:
        rows = list(csv.reader(fh, delimiter=delimiter))

    header_index = next(
        (i for i, r in enumerate(rows) if any(c.strip().lower() == "video title" for c in r)),
        None,
    )
    if header_index is None:
        raise SystemExit(f'No "Video Title" column found in {path}')

    header = [c.strip().lower() for c in rows[header_index]]
    col = {}
    for i, name in enumerate(header):
        field = FIELD_ALIASES.get(name)
        if field and field not in col:
            col[field] = i

    if "url" not in col:
        raise SystemExit(f'No "URL" column found in {path}')

    lessons = []
    for r in rows[header_index + 1:]:
        def get(field):
            i = col.get(field)
            return (r[i].strip() if i is not None and i < len(r) else "")

        url = get("url")
        if not url or "http" not in url:
            continue
        lessons.append({
            "video_title": get("video_title"),
            "student": get("student"),
            "date": get("date"),
            "topic": get("topic"),
            "url": url,
        })
    return lessons


# --------------------------------------------------------------------------
# Talking to the app
# --------------------------------------------------------------------------

def post_json(url, payload, timeout=60):
    data = json.dumps(payload).encode()
    req = urllib.request.Request(
        url, data=data, headers={"Content-Type": "application/json"}, method="POST"
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode() or "{}")


def check_server(server):
    try:
        urllib.request.urlopen(server, timeout=10)
        return True
    except urllib.error.HTTPError:
        return True  # responded, just not with 200 on /
    except Exception:
        return False


def stream_events(server, job_id, on_event, timeout=7200):
    """
    Read the app's Server-Sent Events progress stream, calling on_event(event)
    for each. Returns when the job completes or errors.
    """
    url = f"{server}/progress/{job_id}"
    deadline = time.time() + timeout

    with urllib.request.urlopen(url, timeout=timeout) as resp:
        for raw in resp:
            if time.time() > deadline:
                raise TimeoutError("job exceeded time budget")
            line = raw.decode("utf-8", "replace").strip()
            if not line.startswith("data:"):
                continue
            body = line[5:].strip()
            if not body:
                continue
            try:
                event = json.loads(body)
            except json.JSONDecodeError:
                continue
            if on_event(event) is False:
                return


# --------------------------------------------------------------------------
# One lesson
# --------------------------------------------------------------------------

def run_lesson(server, lesson, prompt, approve_all, quiet):
    """Drive one lesson end to end. Returns a result dict."""
    result = {
        "lesson": lesson,
        "job_id": None,
        "approved": [],
        "rejected": [],
        "videos": [],
        "error": None,
    }

    try:
        started = post_json(f"{server}/process", {"url": lesson["url"], "prompt": prompt})
    except Exception as e:
        result["error"] = f"could not start job: {e}"
        return result

    job_id = started.get("job_id") or started.get("id")
    if not job_id:
        result["error"] = f"app did not return a job id: {started}"
        return result
    result["job_id"] = job_id

    state = {"words": []}

    def on_event(event):
        kind = event.get("type")
        message = event.get("message", "")

        if kind == "progress" and not quiet and message:
            print(f"      {message}")

        elif kind == "clips_ready":
            clips = event.get("clips", []) or []
            words = state["words"] or fetch_words(server, job_id)

            if approve_all:
                keep, drop = clips, []
            else:
                keep, drop = [], []
                for clip in clips:
                    problems = V.check_clip(clip, words, clips)
                    (keep if not problems else drop).append(
                        clip if not problems else {**clip, "_why": "; ".join(problems)}
                    )

            result["approved"], result["rejected"] = keep, drop
            state["words"] = words

            print(f"      AI proposed {len(clips)} clips — approving {len(keep)}, dropping {len(drop)}")
            for d in drop:
                print(f"        dropped {V.timecode(d.get('start', 0))}: {d['_why']}")

            if not keep:
                print("      nothing passed the rules — skipping render for this lesson")
                post_json(f"{server}/approve/{job_id}", {"clips": [], "renderer": "remotion"})
                return False

            post_json(f"{server}/approve/{job_id}", {"clips": keep, "renderer": "remotion"})

        elif kind == "complete":
            result["videos"] = event.get("results", []) or []
            return False

        elif kind == "error":
            result["error"] = message or "job failed"
            return False

        return True

    try:
        stream_events(server, job_id, on_event)
    except Exception as e:
        result["error"] = result["error"] or f"stream ended: {e}"

    if not state["words"]:
        state["words"] = fetch_words(server, job_id)
    result["words"] = state["words"]
    return result


def fetch_words(server, job_id):
    try:
        with urllib.request.urlopen(f"{server}/words/{job_id}", timeout=60) as resp:
            return json.loads(resp.read().decode()).get("words", [])
    except Exception:
        return []


# --------------------------------------------------------------------------

def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--sheet", required=True, help="Library sheet exported as CSV or TSV")
    ap.add_argument("--server", default=DEFAULT_SERVER)
    ap.add_argument("--out", default="batch-out")
    ap.add_argument("--limit", type=int, help="Only process the first N lessons")
    ap.add_argument("--filter", help="Only lessons whose title or student matches")
    ap.add_argument("--prompt-file", help="Use criteria from a file instead of the built-in ones")
    ap.add_argument("--approve-all", action="store_true", help="Skip the rule check and render everything")
    ap.add_argument("--quiet", action="store_true")
    args = ap.parse_args()

    prompt = DEFAULT_PROMPT
    if args.prompt_file:
        prompt = open(args.prompt_file, encoding="utf-8").read()

    if not check_server(args.server):
        raise SystemExit(
            f"Cannot reach the clipper at {args.server}.\n"
            "Start it first (./start.sh in the vocal-clipper folder), then run this again."
        )

    lessons = read_sheet(args.sheet)
    if args.filter:
        needle = args.filter.lower()
        lessons = [
            l for l in lessons
            if needle in l["video_title"].lower() or needle in l["student"].lower()
        ]
    if args.limit:
        lessons = lessons[: args.limit]

    if not lessons:
        raise SystemExit("No lessons with links matched.")

    os.makedirs(args.out, exist_ok=True)
    print(f"\n{len(lessons)} lesson(s) to process\n")

    all_rows = []
    made = 0
    failed = 0

    for i, lesson in enumerate(lessons, 1):
        label = lesson["video_title"] or lesson["url"]
        print(f"[{i}/{len(lessons)}] {label}")

        result = run_lesson(args.server, lesson, prompt, args.approve_all, args.quiet)

        if result["error"]:
            failed += 1
            print(f"      FAILED: {result['error']}\n")
            continue

        rows, _ = V.build_rows(result["approved"], result.get("words", []), lesson)
        all_rows.extend(rows)
        made += len(result["videos"])
        print(f"      done — {len(result['videos'])} video(s)\n")

    csv_path = os.path.join(args.out, "clips.csv")
    with open(csv_path, "w", newline="", encoding="utf-8") as fh:
        writer = csv.writer(fh)
        writer.writerow(V.SHEET_HEADER)
        writer.writerows(all_rows)

    print(f"Videos: {made}")
    print(f"Spreadsheet rows: {len(all_rows)} -> {csv_path}")
    if failed:
        print(f"Lessons that failed: {failed}")
    print("\nVideos are in the vocal-clipper outputs folder.\n")


if __name__ == "__main__":
    main()
