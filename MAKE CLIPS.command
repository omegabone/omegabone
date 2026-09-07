#!/bin/bash
#
# Start here.
#
# Double-click this file. It runs the whole thing: finds the clips in your
# lessons, opens the review page in your browser, renders what you approve, and
# puts the finished files in clips-ready/.
#
# It lives at the top of the repo because that is where you look first.

cd "$(dirname "$0")/tools" || exit 1
exec "./Make clips.command" "$@"
