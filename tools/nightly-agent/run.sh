#!/bin/zsh
# Nightly Omega Bone video agent — launched by launchd, see
# ~/Library/LaunchAgents/com.omegabone.videoagent.plist
#
# Safety model: no blanket permission bypass. Only the specific tools this
# pipeline actually needs are allow-listed below. Anything else the agent
# tries gets denied automatically (no TTY to prompt), which fails safe.

set -uo pipefail

export PATH="/opt/homebrew/bin:/usr/local/bin:$HOME/.local/bin:$PATH"

REPO="/Users/mindyabiznazz/Desktop/omega-clips"
cd "$REPO" || exit 1

mkdir -p logs
DATE=$(date +%Y-%m-%d)
RUNLOG="logs/run-$DATE.out"

# A one-off TONIGHT.md, if present, overrides the standing PROMPT.md for
# exactly one run. The prompt itself is responsible for renaming it to
# done-<date>.md when it finishes, so it doesn't fire again tomorrow.
if [ -f tools/nightly-agent/TONIGHT.md ]; then
  PROMPT_FILE="tools/nightly-agent/TONIGHT.md"
else
  PROMPT_FILE="tools/nightly-agent/PROMPT.md"
fi

/Users/mindyabiznazz/.local/bin/claude -p "$(cat "$PROMPT_FILE")" \
  --restricted --tools "Bash,Read,Write,Edit,Glob,Grep" \
  --add-dir "$REPO" \
  --model claude-sonnet-5 \
  --max-budget-usd 130 \
  --output-format text \
  >> "$RUNLOG" 2>&1

echo "--- run finished $(date) ---" >> "$RUNLOG"
