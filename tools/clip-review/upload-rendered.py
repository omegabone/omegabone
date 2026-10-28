#!/usr/bin/env python3
"""Uploads rendered clips to the Postiz media library. Nothing is posted or scheduled.

Called by the review page's Upload button: upload-rendered.py <state dir> <render dir> <clip id>...
Every rendered shape of each clip (render-index.json "<id>:<format>") goes up once.
Each success is written to <state dir>/uploaded.json straight away, so a stopped run
keeps what it finished; the review page hides a clip once it is listed there.
The posting run reads uploaded.json for the Postiz id/path instead of uploading again."""
import json, os, subprocess, sys
from datetime import datetime, timezone

sys.path.insert(0, os.path.expanduser("~/omega-clips/tools/posting"))
import slots

state_dir, render_dir, ids = sys.argv[1], sys.argv[2], sys.argv[3:]
KEY = slots.key()
LEDGER = os.path.join(state_dir, "uploaded.json")
index = json.load(open(os.path.join(render_dir, "render-index.json")))

try:
    ledger = json.load(open(LEDGER))
except (FileNotFoundError, json.JSONDecodeError):
    ledger = {"note": "clip id -> files uploaded to the Postiz media library (not posted). "
                      "Written by the review page's Upload button.", "uploaded": {}}

failed = 0
for n, cid in enumerate(ids, 1):
    files = [f for k, f in index.items() if k.rsplit(":", 1)[0] == cid
             and os.path.isfile(os.path.join(render_dir, f))]
    if not files:
        print(f"[{n}/{len(ids)}] {cid}: no rendered file, skipped", flush=True)
        failed += 1
        continue
    done = []
    for f in files:
        print(f"[{n}/{len(ids)}] uploading {f}", flush=True)
        out = subprocess.run(["curl", "-s", "-X", "POST", f"{slots.API}/upload", "-H", f"Authorization: {KEY}",
                              "-F", f"file=@{os.path.join(render_dir, f)};type=video/mp4"],
                             capture_output=True, text=True).stdout
        try:
            up = json.loads(out)
        except json.JSONDecodeError:
            up = {}
        if "id" not in up or "path" not in up:
            print(f"[{n}/{len(ids)}] FAILED {f}: {out[:200]}", flush=True)
            break
        done.append({"file": f, "postizId": up["id"], "path": up["path"]})
    if len(done) != len(files):
        failed += 1
        continue
    ledger["uploaded"][cid] = {"files": done, "at": datetime.now(timezone.utc).isoformat()}
    json.dump(ledger, open(LEDGER, "w"), indent=1)

print(f"Uploaded {len(ids) - failed} of {len(ids)}." + (f" {failed} failed." if failed else ""), flush=True)
sys.exit(1 if failed else 0)
