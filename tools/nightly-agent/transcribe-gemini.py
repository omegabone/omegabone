#!/usr/bin/env python3
"""
Transcribe a lesson video to SRT with Gemini.

Replaces the whisper-cli fallback. Whisper hallucinates badly on this footage
— sustained notes and warmup syllables send it into repeating loops — while
Gemini recognises a warmup for what it is and collapses it to a single cue,
which also keeps those stretches out of the clip picker.

Long audio is chunked: inline audio has a request-size ceiling, and base64
inflates the payload by a third, so a full hour would not fit in one call.
Each chunk is transcribed independently and its timestamps shifted back into
whole-video time.

  python3 transcribe-gemini.py <video-or-audio> [--out <file.srt>] [--force]
"""

import argparse
import base64
import json
import os
import re
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request
from pathlib import Path

MODEL = os.environ.get("OB_GEMINI_MODEL", "gemini-3.6-flash")
ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/{}:generateContent"
CHUNK_SECONDS = 900  # 15 min ≈ 3.6MB at 32kbps mono; ~4.8MB base64, safely inside the cap

PROMPT = """Transcribe this vocal-lesson audio as SRT subtitles with accurate timestamps.

Rules:
- Standard SRT: index, then HH:MM:SS,mmm --> HH:MM:SS,mmm, then the text.
- Timestamps must be relative to the START of this audio (first cue near 00:00:00,000).
- Cues of roughly 3-8 seconds.
- Transcribe SPOKEN coaching verbatim, including the student's replies.
- For sung passages or repeated warmup syllables, emit ONE cue spanning that
  whole stretch with text like [warmup exercise] or [singing] - never repeat
  the syllable over and over.
Output only the SRT, nothing else."""


def read_key() -> str:
    for path in (
        Path(__file__).resolve().parents[2] / ".env.local",
        Path.home() / "omega-clips" / ".env.local",
    ):
        if path.exists():
            for line in path.read_text().splitlines():
                if line.startswith("GEMINI_API_KEY="):
                    return line.split("=", 1)[1].strip()
    key = os.environ.get("GEMINI_API_KEY", "")
    if not key:
        sys.exit("no GEMINI_API_KEY (expected in omega-clips/.env.local)")
    return key


def duration_seconds(path: Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=nw=1:nk=1", str(path)],
        capture_output=True, text=True,
    )
    try:
        return float(out.stdout.strip())
    except ValueError:
        sys.exit(f"could not read duration of {path.name}")


def extract_audio(src: Path, start: float, length: float, dest: Path) -> None:
    subprocess.run(
        ["ffmpeg", "-hide_banner", "-loglevel", "error", "-ss", str(start), "-t", str(length),
         "-i", str(src), "-vn", "-ac", "1", "-ar", "16000", "-b:a", "32k", str(dest), "-y"],
        check=True,
    )


def transcribe_chunk(audio: Path, key: str, attempt: int = 0) -> str:
    body = {
        "contents": [{"parts": [
            {"text": PROMPT},
            {"inline_data": {"mime_type": "audio/mp3",
                             "data": base64.b64encode(audio.read_bytes()).decode()}},
        ]}]
    }
    req = urllib.request.Request(
        ENDPOINT.format(MODEL),
        data=json.dumps(body).encode(),
        headers={"x-goog-api-key": key, "Content-Type": "application/json"},
    )
    try:
        payload = json.load(urllib.request.urlopen(req, timeout=600))
    except urllib.error.HTTPError as err:
        # 429 is the free tier's rate limit; back off rather than lose the chunk.
        if err.code in (429, 503) and attempt < 4:
            wait = 20 * (attempt + 1)
            print(f"      rate limited, retrying in {wait}s", flush=True)
            time.sleep(wait)
            return transcribe_chunk(audio, key, attempt + 1)
        raise SystemExit(f"Gemini {err.code}: {err.read().decode()[:300]}")

    candidates = payload.get("candidates") or []
    if not candidates:
        return ""
    parts = candidates[0].get("content", {}).get("parts") or []
    return "".join(p.get("text", "") for p in parts)


CUE = re.compile(
    r"(\d+)\s*\n\s*(\d\d):(\d\d):(\d\d)[,.](\d{1,3})\s*-->\s*(\d\d):(\d\d):(\d\d)[,.](\d{1,3})\s*\n(.*?)(?=\n\s*\n|\Z)",
    re.S,
)


def parse_cues(srt: str, offset: float) -> list[tuple[float, float, str]]:
    cues = []
    for m in CUE.finditer(srt):
        h1, m1, s1, ms1 = (int(m.group(i)) for i in (2, 3, 4, 5))
        h2, m2, s2, ms2 = (int(m.group(i)) for i in (6, 7, 8, 9))
        start = h1 * 3600 + m1 * 60 + s1 + ms1 / 1000 + offset
        end = h2 * 3600 + m2 * 60 + s2 + ms2 / 1000 + offset
        text = " ".join(line.strip() for line in m.group(10).strip().splitlines() if line.strip())
        if text and end > start:
            cues.append((start, end, text))
    return cues


def fmt(t: float) -> str:
    ms = int(round((t - int(t)) * 1000))
    t = int(t)
    return f"{t // 3600:02d}:{t % 3600 // 60:02d}:{t % 60:02d},{ms:03d}"


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("source")
    ap.add_argument("--out")
    ap.add_argument("--force", action="store_true",
                    help="overwrite an existing transcript instead of skipping")
    args = ap.parse_args()

    src = Path(args.source).expanduser()
    if not src.exists():
        sys.exit(f"no such file: {src}")

    out = Path(args.out) if args.out else src.with_suffix("").with_suffix(".en.srt")
    if out.name == src.name:
        out = src.parent / (src.stem + ".en.srt")
    if out.exists() and not args.force:
        print(f"skip (already transcribed): {out.name}")
        return

    key = read_key()
    total = duration_seconds(src)
    chunks = max(1, int(total // CHUNK_SECONDS) + (1 if total % CHUNK_SECONDS else 0))
    print(f"{src.name}  ({total/60:.0f} min, {chunks} chunk(s))", flush=True)

    cues: list[tuple[float, float, str]] = []
    with tempfile.TemporaryDirectory() as tmp:
        for i in range(chunks):
            start = i * CHUNK_SECONDS
            length = min(CHUNK_SECONDS, total - start)
            if length <= 1:
                continue
            audio = Path(tmp) / f"chunk{i}.mp3"
            extract_audio(src, start, length, audio)
            print(f"   chunk {i+1}/{chunks} ({audio.stat().st_size/1e6:.1f}MB) …", end="", flush=True)
            srt = transcribe_chunk(audio, key)
            got = parse_cues(srt, start)
            cues.extend(got)
            print(f" {len(got)} cues", flush=True)

    if not cues:
        sys.exit("no cues produced — nothing written")

    cues.sort(key=lambda c: c[0])
    body = "\n".join(
        f"{i}\n{fmt(s)} --> {fmt(e)}\n{t}\n"
        for i, (s, e, t) in enumerate(cues, 1)
    )
    out.write_text(body, encoding="utf-8")
    spoken = sum(1 for _, _, t in cues if not t.startswith("["))
    print(f"wrote {out}  ({len(cues)} cues, {spoken} spoken)")


if __name__ == "__main__":
    main()
