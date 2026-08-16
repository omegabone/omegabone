#!/bin/bash
#
# Lessons in, postable clips out. Double-click this.
#
# It asks once where your lessons are, then does the whole run: finds the clips,
# opens the review page so you can trim and approve them, renders the ones you
# approved, and puts the finished files in one folder.
#
# Nothing here talks to the internet except the clip picker, and only when you
# have an API key set. The videos never leave the machine.

set -u
cd "$(dirname "$0")" || exit 1

TOOLS="$(pwd)"
CONFIG="$TOOLS/clips.config"
BATCH="$TOOLS/clip-extractor/clips-out"
READY="$TOOLS/../clips-ready"

say() { printf '\n\033[1;32m%s\033[0m\n' "$1"; }
warn() { printf '\n\033[1;31m%s\033[0m\n' "$1"; }
step() { printf '\n\033[1m— %s\033[0m\n' "$1"; }

finish() {
  printf '\n'
  read -r -p "Press return to close this window."
  exit "${1:-0}"
}

# ---------------------------------------------------------------- checks

if ! command -v node >/dev/null 2>&1; then
  warn "Node is not installed."
  echo "Get it from https://nodejs.org (the big green LTS button), then run this again."
  finish 1
fi

# ---------------------------------------------------------------- where things are

if [ -f "$CONFIG" ]; then
  # shellcheck disable=SC1090
  . "$CONFIG"
fi

if [ -z "${LESSONS:-}" ] || [ ! -d "${LESSONS:-}" ]; then
  say "Where are your lesson videos?"
  echo "Drag the folder into this window and press return."
  echo "(It needs the video files and their subtitles — the .srt or .vtt files — together.)"
  printf '\n> '
  read -r LESSONS
  LESSONS="${LESSONS%\"}"; LESSONS="${LESSONS#\"}"   # drop quotes Terminal adds
  LESSONS="${LESSONS%\'}"; LESSONS="${LESSONS#\'}"
  LESSONS="${LESSONS%/}"

  if [ ! -d "$LESSONS" ]; then
    warn "Cannot find that folder: $LESSONS"
    finish 1
  fi
  printf 'LESSONS="%s"\n' "$LESSONS" > "$CONFIG"
  say "Saved. It will not ask again."
fi

SUBS=$(find "$LESSONS" -maxdepth 1 \( -iname '*.srt' -o -iname '*.vtt' \) | wc -l | tr -d ' ')
VIDS=$(find "$LESSONS" -maxdepth 1 \( -iname '*.mp4' -o -iname '*.mov' -o -iname '*.mkv' -o -iname '*.webm' -o -iname '*.m4v' \) | wc -l | tr -d ' ')

echo
echo "  Lessons folder : $LESSONS"
echo "  Videos         : $VIDS"
echo "  Subtitles      : $SUBS"

if [ "$SUBS" -eq 0 ]; then
  warn "No subtitle files in that folder."
  echo "Clips are cut from subtitle timings, so there is nothing to cut against yet."
  echo
  echo "If the lessons are on YouTube, download each one with its subtitles:"
  echo "  yt-dlp --write-auto-sub --sub-format srt --convert-subs srt -o '%(title)s.%(ext)s' <url>"
  echo
  echo "Put the videos and their .srt files in the same folder, then run this again."
  finish 1
fi

if [ "$VIDS" -eq 0 ]; then
  warn "No video files in that folder."
  echo "Clips can still be picked and reviewed, but nothing can be rendered without the video."
  echo
  read -r -p "Carry on anyway? [y/N] " ANYWAY
  case "$ANYWAY" in [Yy]*) ;; *) finish 1 ;; esac
fi

# ---------------------------------------------------------------- 1. pick the clips

step "1 of 3 — finding the clips worth posting"

SELECTOR="--offline"
if [ -n "${ANTHROPIC_API_KEY:-}" ]; then
  if [ -d "$TOOLS/clip-extractor/node_modules" ]; then
    SELECTOR=""
    echo "Using Claude to pick the clips."
  else
    echo "An API key is set but the SDK is not installed here."
    echo "Installing it (one time, about ten seconds)…"
    (cd "$TOOLS/clip-extractor" && npm install --silent) && SELECTOR=""
  fi
fi
[ -n "$SELECTOR" ] && echo "Picking clips by keyword — no API key needed."

rm -rf "$BATCH"
node "$TOOLS/clip-extractor/bin/extract-clips.mjs" \
  --transcript-dir "$LESSONS" \
  --out "$BATCH" \
  $SELECTOR || { warn "Could not read those lessons."; finish 1; }

# ---------------------------------------------------------------- 2. review

step "2 of 3 — review, trim, approve"
echo "The review page is opening in your browser."
echo
echo "  · Click a word in the transcript to move the nearer edge of the clip."
echo "  · Press A to approve, R to reject."
echo "  · Approve everything you want posted, then come back here."
echo

node "$TOOLS/clip-review/bin/review.mjs" \
  --manifest "$BATCH/manifest.json" \
  --video-dir "$LESSONS" &
REVIEW_PID=$!

sleep 2
read -r -p "Press return here when you have finished approving. "
kill "$REVIEW_PID" 2>/dev/null
wait "$REVIEW_PID" 2>/dev/null

APPROVED="$BATCH/approved-manifest.json"
COUNT=$(node -e "try{const m=require('$APPROVED');console.log(m.lessons.reduce((n,l)=>n+l.clips.length,0))}catch(e){console.log(0)}")

if [ "$COUNT" -eq 0 ]; then
  warn "Nothing was approved, so there is nothing to render."
  echo "Run this again and press A on the clips you want."
  finish 0
fi

say "$COUNT clip(s) approved."

# ---------------------------------------------------------------- 3. render

step "3 of 3 — rendering the approved clips"

if [ ! -d "$TOOLS/clip-renderer/node_modules" ]; then
  echo "First run: installing the renderer. This takes a few minutes, once."
  (cd "$TOOLS/clip-renderer" && npm install) || { warn "The renderer could not install."; finish 1; }
fi

(cd "$TOOLS/clip-renderer" && node scripts/render-all.mjs \
  --manifest "$APPROVED" \
  --video-dir "$LESSONS" \
  --out "$TOOLS/clip-renderer/out") || { warn "Rendering stopped early — anything finished is still in the folder below."; }

# ---------------------------------------------------------------- done

mkdir -p "$READY"
find "$TOOLS/clip-renderer/out" -maxdepth 1 -iname '*.mp4' -exec cp {} "$READY"/ \; 2>/dev/null
cp "$BATCH/approved/approved.csv" "$READY"/ 2>/dev/null

DONE=$(find "$READY" -maxdepth 1 -iname '*.mp4' | wc -l | tr -d ' ')
say "$DONE clip(s) ready to post."
echo "  $READY"

# Captions and notes travel with them, so posting does not mean going back
# through the tooling to find what each clip was for.
[ -f "$READY/approved.csv" ] && echo "  approved.csv has the caption and CTA for each one."

if command -v open >/dev/null 2>&1; then open "$READY"; fi
finish 0
