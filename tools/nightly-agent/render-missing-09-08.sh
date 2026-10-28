#!/bin/bash
set -u
REPO="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$REPO/tools/clip-renderer" || exit 1

IDS=(
  simon-passaggio-7
  simon-comma-2
  ira-12-may-2026-2
  ira-12-may-2026-3
  ira-12-may-2026-4
  metamuse-17-jul-2026-1
  metamuse-17-jul-2026-2
  grace-undated-1
  grace-undated-3
  pandemic-4im1XavKDns-4
)

for id in "${IDS[@]}"; do
  echo "=== rendering $id ==="
  node scripts/render-all.mjs \
    --manifest "$REPO/tools/clip-review/state-review-all/approved-manifest.json" \
    --video-dir "$REPO/lessons" \
    --out out \
    --both \
    --id "$id"
done

mkdir -p "$REPO/clips-ready"
find out -maxdepth 1 -iname '*.mp4' -newer "$REPO/tools/clip-review/state-review-all/approved-manifest.json" -exec cp {} "$REPO/clips-ready"/ \;
echo "RENDER BATCH DONE"
