#!/bin/bash
#
# Lessons in, postable clips out. Double-click this.
#
# It asks once where your lessons live, offers to pull new ones down from a
# YouTube link, finds the clips, opens the review page so you can trim and
# approve them, renders the ones you approved, and puts the finished files in
# one folder.
#
# The videos never leave the machine. The only thing that goes out is a
# transcript, to the clip picker, and only when an API key is set.

set -u
cd "$(dirname "$0")" || exit 1

TOOLS="$(pwd)"
REPO="$(cd .. && pwd)"
CONFIG="$TOOLS/clips.config"
BATCH="$TOOLS/clip-extractor/clips-out"
READY="$REPO/clips-ready"

say() { printf '\n\033[1;32m%s\033[0m\n' "$1"; }
warn() { printf '\n\033[1;31m%s\033[0m\n' "$1"; }
step() { printf '\n\033[1m— %s\033[0m\n' "$1"; }

finish() {
  printf '\n'
  read -r -p "Press return to close this window."
  exit "${1:-0}"
}

# Strip the quotes and trailing slash Terminal adds when a folder is dragged in.
clean_path() {
  local p="$1"
  p="${p%\"}"; p="${p#\"}"
  p="${p%\'}"; p="${p#\'}"
  p="${p%/}"
  printf '%s' "$p"
}

count_files() {
  find "$1" -maxdepth 1 -type f \( $2 \) 2>/dev/null | wc -l | tr -d ' '
}

SUBS_MATCH='-iname *.srt -o -iname *.vtt'
VIDS_MATCH='-iname *.mp4 -o -iname *.mov -o -iname *.mkv -o -iname *.webm -o -iname *.m4v'

# ---------------------------------------------------------------- checks

if ! command -v node >/dev/null 2>&1; then
  warn "Node is not installed."
  echo "Get it from https://nodejs.org (the big green LTS button), then run this again."
  finish 1
fi

# An API key means Claude picks the clips instead of a keyword scorer, which is
# the difference between clips worth posting and clips that merely fit the rules.
if [ -z "${ANTHROPIC_API_KEY:-}" ]; then
  for envfile in "$REPO/.env" "$TOOLS/.env"; do
    if [ -f "$envfile" ] && grep -q '^ANTHROPIC_API_KEY=' "$envfile"; then
      ANTHROPIC_API_KEY=$(grep '^ANTHROPIC_API_KEY=' "$envfile" | head -1 | cut -d= -f2- | tr -d '"'"'"' ')
      export ANTHROPIC_API_KEY
      break
    fi
  done
fi

# ---------------------------------------------------------------- where things are

if [ -f "$CONFIG" ]; then
  # shellcheck disable=SC1090
  . "$CONFIG"
fi

if [ -z "${LESSONS:-}" ] || [ ! -d "${LESSONS:-}" ]; then
  say "Where should your lessons be kept?"
  echo "Drag a folder into this window and press return."
  echo "(Empty is fine — the next question can fill it from YouTube.)"
  printf '\n> '
  read -r REPLY_PATH
  LESSONS=$(clean_path "$REPLY_PATH")

  if [ -z "$LESSONS" ] || [ ! -d "$LESSONS" ]; then
    warn "Cannot find that folder: $LESSONS"
    finish 1
  fi
  printf 'LESSONS="%s"\n' "$LESSONS" > "$CONFIG"
  say "Saved. It will not ask again."
fi

# ---------------------------------------------------------------- 0. get lessons

step "1 of 4 — lessons"

echo "  Folder : $LESSONS"
echo "  Videos : $(count_files "$LESSONS" "$VIDS_MATCH")   Subtitles: $(count_files "$LESSONS" "$SUBS_MATCH")"
echo
echo "Paste a YouTube link to pull lessons down — a playlist link gets the whole"
echo "playlist, and anything already downloaded is skipped."
echo "Press return to use what is in the folder already."
printf '\n> '
read -r URL

if [ -n "$URL" ]; then
  if ! command -v yt-dlp >/dev/null 2>&1; then
    warn "yt-dlp is not installed — that is what downloads from YouTube."
    echo "Install it with one of:"
    echo "    brew install yt-dlp"
    echo "    python3 -m pip install --user -U yt-dlp"
    echo
    if command -v python3 >/dev/null 2>&1; then
      read -r -p "Install it now with pip? [y/N] " DOIT
      case "$DOIT" in
        [Yy]*) python3 -m pip install --user -U yt-dlp || { warn "Install failed."; finish 1; } ;;
        *) finish 1 ;;
      esac
    else
      finish 1
    fi
  fi

  say "Downloading. Long lessons take a while; it prints progress."
  # --download-archive: re-running on the same playlist only fetches what is new.
  # Subtitles are the point as much as the video — the clips are cut from them.
  yt-dlp \
    --paths "$LESSONS" \
    --output '%(title)s.%(ext)s' \
    --download-archive "$LESSONS/.downloaded.txt" \
    --no-overwrites \
    --write-subs --write-auto-subs \
    --sub-langs 'en.*' --convert-subs srt \
    --format 'bv*[height<=1080]+ba/b[height<=1080]' \
    --merge-output-format mp4 \
    "$URL" || warn "yt-dlp stopped early — carrying on with whatever it got."
fi

SUBS=$(count_files "$LESSONS" "$SUBS_MATCH")
VIDS=$(count_files "$LESSONS" "$VIDS_MATCH")
echo
echo "  Videos : $VIDS   Subtitles: $SUBS"

if [ "$SUBS" -eq 0 ]; then
  warn "No subtitle files in that folder."
  echo "Clips are cut from subtitle timings, so there is nothing to cut against yet."
  echo "Run this again and paste a YouTube link, or put the .srt files in beside the videos."
  finish 1
fi

if [ "$VIDS" -eq 0 ]; then
  warn "No video files in that folder."
  echo "Clips can be picked and reviewed, but nothing can be rendered without the video."
  read -r -p "Carry on anyway? [y/N] " ANYWAY
  case "$ANYWAY" in [Yy]*) ;; *) finish 1 ;; esac
fi

# ---------------------------------------------------------------- 2. pick

step "2 of 4 — finding the clips worth posting"

SELECTOR="--offline"
if [ -n "${ANTHROPIC_API_KEY:-}" ]; then
  if [ ! -d "$TOOLS/clip-extractor/node_modules" ]; then
    echo "Installing the clip picker (one time, a few seconds)…"
    (cd "$TOOLS/clip-extractor" && npm install --silent)
  fi
  [ -d "$TOOLS/clip-extractor/node_modules" ] && SELECTOR="" && echo "Claude is picking the clips."
fi

if [ -n "$SELECTOR" ]; then
  echo "Picking clips by keyword — no API key set."
  echo "For picks worth posting, set a key once:"
  echo "    echo 'ANTHROPIC_API_KEY=sk-ant-...' >> \"$REPO/.env\""
fi

rm -rf "$BATCH"
node "$TOOLS/clip-extractor/bin/extract-clips.mjs" \
  --transcript-dir "$LESSONS" \
  --out "$BATCH" \
  $SELECTOR || { warn "Could not read those lessons."; finish 1; }

# ---------------------------------------------------------------- 3. review

step "3 of 4 — review, trim, approve"
echo "The review page is opening in your browser."
echo
echo "  · Click a word in the transcript to move the nearer edge of the clip."
echo "  · Pick the brand under the clip — that is the caption highlight colour."
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

# ---------------------------------------------------------------- 4. render

step "4 of 4 — rendering the approved clips"

if [ ! -d "$TOOLS/clip-renderer/node_modules" ]; then
  echo "First run: installing the renderer. This takes a few minutes, once."
  (cd "$TOOLS/clip-renderer" && npm install) || { warn "The renderer could not install."; finish 1; }
fi

(cd "$TOOLS/clip-renderer" && node scripts/render-all.mjs \
  --manifest "$APPROVED" \
  --video-dir "$LESSONS" \
  --out "$TOOLS/clip-renderer/out") || warn "Rendering stopped early — anything finished is still in the folder below."

# ---------------------------------------------------------------- done

mkdir -p "$READY"
find "$TOOLS/clip-renderer/out" -maxdepth 1 -iname '*.mp4' -exec cp {} "$READY"/ \; 2>/dev/null
cp "$BATCH/approved/approved.csv" "$READY"/ 2>/dev/null

DONE=$(count_files "$READY" "-iname *.mp4")
say "$DONE clip(s) ready to post."
echo "  $READY"

# Captions and notes travel with them, so posting does not mean going back
# through the tooling to find what each clip was for.
[ -f "$READY/approved.csv" ] && echo "  approved.csv has the caption and CTA for each one."

if command -v open >/dev/null 2>&1; then open "$READY"; fi
finish 0
