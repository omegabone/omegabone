#!/bin/bash
set -u
cd "$(dirname "$0")/../.." || exit 1

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
  node tools/clip-renderer/scripts/render-all.mjs \
    --manifest tools/clip-review/state-review-all/approved-manifest.json \
    --video-dir lessons \
    --out tools/clip-renderer/out \
    --both \
    --id "$id"
done

mkdir -p clips-ready
find tools/clip-renderer/out -maxdepth 1 -iname '*.mp4' -newer tools/clip-review/state-review-all/approved-manifest.json -exec cp {} clips-ready/ \;
echo "RENDER BATCH DONE"
