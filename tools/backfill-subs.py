#!/usr/bin/env python3
"""Backfill subtitles for every lesson video that lacks them.

Pass 1: match each video to its YouTube ID (.downloaded.txt), fetch official
        YT subs straight onto the local filename.
Pass 2: everything unmatched gets transcribed locally with whisper-cli
        (medium.en — small.en hallucinates on singing, see omegabone-clip skill).
"""
import json
import subprocess
import sys
from pathlib import Path

LESSONS = Path.home() / "Desktop/omega-clips/lessons"
DOWNLOADED = LESSONS / ".downloaded.txt"
WHISPER_MODEL = Path.home() / ".cache/whisper/ggml-medium.en.bin"

VIDEO_EXTS = {".mp4", ".mov", ".mkv", ".webm", ".m4v"}
YTDLP_COMMON = [
    "--impersonate", "chrome",
    "--retries", "5",
    "--no-overwrites",
]


def sh(cmd, **kw):
    return subprocess.run(cmd, capture_output=True, text=True, **kw)


def norm(s: str) -> str:
    return "".join(c.lower() for c in s if c.isalnum())


def main():
    videos = sorted(p for p in LESSONS.iterdir() if p.suffix.lower() in VIDEO_EXTS)

    def has_subs(v: Path) -> bool:
        return (v.parent / f"{v.stem}.srt").exists() or (v.parent / f"{v.stem}.en.srt").exists()

    todo = [v for v in videos if not has_subs(v)]
    print(f"{len(videos)} videos, {len(videos) - len(todo)} already have subs, {len(todo)} to backfill", flush=True)

    ids = [line.split()[-1] for line in DOWNLOADED.read_text().splitlines() if line.strip()]

    # id -> title
    id_title = {}
    for i, vid in enumerate(ids):
        r = sh(["yt-dlp", *YTDLP_COMMON, "--skip-download", "--print", "%(title)s", f"https://www.youtube.com/watch?v={vid}"])
        t = r.stdout.strip()
        if r.returncode == 0 and t:
            id_title[vid] = t
            print(f"[{i+1}/{len(ids)}] {vid} -> {t}", flush=True)
        else:
            print(f"[{i+1}/{len(ids)}] {vid} FAILED: {r.stderr.strip()[-120:]}", flush=True)

    # normalized title -> id
    by_title = {}
    for vid, t in id_title.items():
        by_title[norm(t)] = vid

    unmatched = []
    for v in todo:
        nid = norm(v.stem)
        # exact normalized match, then containment either way
        vid = by_title.get(nid)
        if not vid:
            for t_norm, cand in by_title.items():
                if t_norm and (t_norm in nid or nid in t_norm):
                    vid = cand
                    break
        if not vid:
            unmatched.append(v)
            print(f"MATCH-MISS: {v.name}", flush=True)
            continue
        url = f"https://www.youtube.com/watch?v={vid}"
        r = sh([
            "yt-dlp", *YTDLP_COMMON,
            "--skip-download",
            "--write-subs", "--write-auto-subs",
            "--sub-langs", "en", "--convert-subs", "srt",
            "-o", str(v.parent / f"{v.stem}.%(ext)s"),
            url,
        ])
        got = any((v.parent / f"{v.stem}{suffix}").exists() for suffix in (".en.srt", ".srt"))
        print(f"SUBS {'OK' if got else 'MISS'}: {v.name} ({vid})", flush=True)
        if not got:
            unmatched.append(v)

    print(f"\nPass 2: whisper for {len(unmatched)} video(s)", flush=True)
    for n, v in enumerate(unmatched):
        wav = LESSONS / f".tmp-{v.stem}.wav"
        if wav.exists():
            wav.unlink()
        r1 = sh(["ffmpeg", "-y", "-i", str(v), "-ar", "16000", "-ac", "1", "-c:a", "pcm_s16le", str(wav)])
        if r1.returncode != 0:
            print(f"FFMPEG FAIL: {v.name}", flush=True)
            continue
        print(f"[{n+1}/{len(unmatched)}] whisper {v.name} …", flush=True)
        r2 = sh(
            ["whisper-cli", "-m", str(WHISPER_MODEL), "-f", str(wav), "-osrt", "-of", str(v.parent / v.stem), "-np"],
            timeout=7200,
        )
        wav.unlink(missing_ok=True)
        srt_tmp = v.parent / f"{v.stem}.srt"
        srt_final = v.parent / f"{v.stem}.en.srt"
        if r2.returncode == 0 and srt_tmp.exists():
            srt_tmp.rename(srt_final)
            print(f"WHISPER OK: {v.name}", flush=True)
        else:
            print(f"WHISPER FAIL: {v.name}: {r2.stderr.strip()[-200:]}", flush=True)

    total = len(list(LESSONS.glob('*.srt')))
    print(f"\n=== BACKFILL DONE: {total} srt files present ===", flush=True)


if __name__ == "__main__":
    sys.exit(main())
