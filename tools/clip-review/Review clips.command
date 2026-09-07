#!/bin/bash
# Double-click this to review the latest batch of clips.
#
# The first run needs to be told where the lesson videos are, once:
#   node bin/review.mjs --video-dir ~/Videos/lessons
# After that it is remembered in review.config.json and this launcher is enough.

cd "$(dirname "$0")" || exit 1

if ! command -v node >/dev/null 2>&1; then
  echo "Node is not installed, or not on this shell's PATH."
  echo "Install it from https://nodejs.org and double-click this again."
  read -r -p "Press return to close."
  exit 1
fi

node bin/review.mjs "$@"

# Hold the window open if the server stopped on an error, so the reason is
# readable rather than a Terminal window that vanishes.
status=$?
if [ $status -ne 0 ]; then
  echo
  read -r -p "Stopped. Press return to close."
fi
exit $status
