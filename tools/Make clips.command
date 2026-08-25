#!/bin/bash
#
# Playlist in, clips out. Double-click this.
#
# It asks for a YouTube playlist link the first time and nothing ever again:
# downloads the lessons, picks the best moments, renders them, and opens a
# folder of finished vertical clips ready to post.
#
# Nothing to press while it runs. Add --review to stop and choose the clips
# yourself before rendering.

set -u
cd "$(dirname "$0")" || exit 1

TOOLS="$(pwd)"
REPO="$(cd .. && pwd)"
CONFIG="$TOOLS/clips.config"
BATCH="$TOOLS/clip-extractor/clips-out"
READY="$REPO/clips-ready"
LIMIT=10

REVIEW=0
for arg in "$@"; do
  case "$arg" in
    --review) REVIEW=1 ;;
    --limit=*) LIMIT="${arg#--limit=}" ;;
  esac
done

say() { printf '\n\033[1;32m%s\033[0m\n' "$1"; }
warn() { printf '\n\033[1;31m%s\033[0m\n' "$1"; }
step() { printf '\n\033[1m— %s\033[0m\n' "$1"; }

finish() {
  printf '\n'
  read -r -p "Press return to close this window."
  exit "${1:-0}"
}

count_files() {
  find "$1" -maxdepth 1 -type f \( $2 \) 2>/dev/null | wc -l | tr -d ' '
}

SUBS_MATCH='-iname *.srt -o -iname *.vtt'
VIDS_MATCH='-iname *.mp4 -o -iname *.mov -o -iname *.mkv -o -iname *.webm -o -iname *.m4v'

if ! command -v node >/dev/null 2>&1; then
  warn "Node is not installed."
  echo "Get it from https://nodejs.org (the big green LTS button), then run this again."
  finish 1
fi

# A key is optional. With one, Claude picks the clips; without, they are picked
# by keyword. Neither path asks for anything.
if [ -z "${ANTHROPIC_API_KEY:-}" ] && [ -f "$REPO/.env" ] && grep -q '^ANTHROPIC_API_KEY=' "$REPO/.env"; then
  ANTHROPIC_API_KEY=$(grep '^ANTHROPIC_API_KEY=' "$REPO/.env" | head -1 | cut -d= -f2- | tr -d '"'"'"' ')
  export ANTHROPIC_API_KEY
fi

[ -f "$CONFIG" ] && . "$CONFIG"

# The lessons folder is not a decision worth making. It is made here.
LESSONS="${LESSONS:-$HOME/Movies/Omega Lessons}"
mkdir -p "$LESSONS"

# ---------------------------------------------------------------- the one question

if [ -z "${PLAYLIST:-}" ]; then
  say "Paste your YouTube playlist link and press return."
  echo "(This is the only thing it will ever ask you.)"
  printf '\n> '
  read -r PLAYLIST

  if [ -z "$PLAYLIST" ]; then
    warn "No link, nothing to do."
    finish 1
  fi
fi

{
  printf 'LESSONS="%s"\n' "$LESSONS"
  printf 'PLAYLIST="%s"\n' "$PLAYLIST"
} > "$CONFIG"

# ---------------------------------------------------------------- 1. lessons

step "1 of 4 — getting the lessons"

if ! command -v yt-dlp >/dev/null 2>&1; then
  echo "Installing the YouTube downloader (one time)…"
  # No prompt: being asked to install a thing is exactly the wall this run is
  # meant to remove. python3 ships with macOS, so this works without Homebrew.
  python3 -m pip install --user --quiet --upgrade yt-dlp 2>/dev/null

  # pip's --user location is often not on PATH; find the binary directly.
  if ! command -v yt-dlp >/dev/null 2>&1; then
    USER_BIN=$(python3 -c 'import site,os;print(os.path.join(site.USER_BASE,"bin"))' 2>/dev/null)
    [ -n "$USER_BIN" ] && [ -d "$USER_BIN" ] && PATH="$USER_BIN:$PATH" && export PATH
  fi
fi

if ! command -v yt-dlp >/dev/null 2>&1; then
  warn "Could not install the YouTube downloader automatically."
  echo "Run this one line, then double-click me again:"
  echo
  echo "    python3 -m pip install --user --break-system-packages yt-dlp"
  finish 1
fi

echo "Downloading into: $LESSONS"
echo "Long lessons take a while. Already-downloaded ones are skipped."
echo

yt-dlp \
  --paths "$LESSONS" \
  --output '%(title)s.%(ext)s' \
  --download-archive "$LESSONS/.downloaded.txt" \
  --no-overwrites \
  --write-subs --write-auto-subs \
  --sub-langs 'en.*' --convert-subs srt \
  --format 'bv*[height<=1080]+ba/b[height<=1080]' \
  --merge-output-format mp4 \
  "$PLAYLIST" || warn "The downloader stopped early — carrying on with what it got."

SUBS=$(count_files "$LESSONS" "$SUBS_MATCH")
VIDS=$(count_files "$LESSONS" "$VIDS_MATCH")
echo
echo "  Lessons: $VIDS video(s), $SUBS transcript(s)"

if [ "$SUBS" -eq 0 ]; then
  warn "No transcripts came down with those videos."
  echo "Clips are cut from subtitle timings, so there is nothing to cut against."
  echo "If the lessons have captions turned off on YouTube, they cannot be clipped."
  finish 1
fi

# ---------------------------------------------------------------- 2. pick

step "2 of 4 — finding the best moments"

SELECTOR="--offline"
if [ -n "${ANTHROPIC_API_KEY:-}" ]; then
  [ -d "$TOOLS/clip-extractor/node_modules" ] || (cd "$TOOLS/clip-extractor" && npm install --silent)
  [ -d "$TOOLS/clip-extractor/node_modules" ] && SELECTOR=""
fi

rm -rf "$BATCH"
node "$TOOLS/clip-extractor/bin/extract-clips.mjs" \
  --transcript-dir "$LESSONS" \
  --out "$BATCH" \
  $SELECTOR || { warn "Could not read those lessons."; finish 1; }

# ---------------------------------------------------------------- 3. choose

RENDER_MANIFEST="$BATCH/auto-manifest.json"

if [ "$REVIEW" -eq 1 ]; then
  step "3 of 4 — choose the clips yourself"
  echo
  echo "  ================================================"
  echo "   OPEN YOUR BROWSER AND GO TO:  localhost:4321"
  echo "  ================================================"
  echo
  echo "Press A to keep a clip, R to skip it. Then come back here."
  echo

  node "$TOOLS/clip-review/bin/review.mjs" \
    --manifest "$BATCH/manifest.json" --video-dir "$LESSONS" &
  REVIEW_PID=$!
  sleep 2
  read -r -p "Press return when you have finished choosing. "
  kill "$REVIEW_PID" 2>/dev/null
  wait "$REVIEW_PID" 2>/dev/null

  RENDER_MANIFEST="$BATCH/approved-manifest.json"
  COUNT=$(node -e "try{const m=require('$RENDER_MANIFEST');console.log(m.lessons.reduce((n,l)=>n+l.clips.length,0))}catch(e){console.log(0)}")
  if [ "$COUNT" -eq 0 ]; then
    warn "Nothing was chosen, so there is nothing to render."
    finish 0
  fi
else
  step "3 of 4 — taking the $LIMIT strongest"
  node "$TOOLS/pick-top.mjs" "$BATCH/manifest.json" "$RENDER_MANIFEST" "$LIMIT" \
    || { warn "Nothing renderable in that batch."; finish 1; }
fi

# ---------------------------------------------------------------- 4. render

step "4 of 4 — making the videos"

if [ ! -d "$TOOLS/clip-renderer/node_modules" ]; then
  echo "First run: setting up the renderer. A few minutes, once."
  (cd "$TOOLS/clip-renderer" && npm install) || { warn "The renderer could not install."; finish 1; }
fi

echo "About two minutes per clip. You can leave this running."
echo

(cd "$TOOLS/clip-renderer" && node scripts/render-all.mjs \
  --manifest "$RENDER_MANIFEST" \
  --video-dir "$LESSONS" \
  --out "$TOOLS/clip-renderer/out") || warn "Rendering stopped early — finished clips are still below."

mkdir -p "$READY"
find "$TOOLS/clip-renderer/out" -maxdepth 1 -iname '*.mp4' -exec cp {} "$READY"/ \; 2>/dev/null

DONE=$(count_files "$READY" "-iname *.mp4")
say "$DONE clip(s) ready to post."
echo "  $READY"
echo
echo "Watch them, post the ones you like. Run this again any time —"
echo "it only downloads lessons it has not seen before."

command -v open >/dev/null 2>&1 && open "$READY"
finish 0
