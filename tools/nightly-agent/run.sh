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

/Users/mindyabiznazz/.local/bin/claude -p "$(cat tools/nightly-agent/PROMPT.md)" \
  --restricted --tools "Bash,Read,Write,Edit,Glob,Grep" \
  --add-dir "$REPO" \
  --model claude-sonnet-5 \
  --max-budget-usd 60 \
  --output-format text \
  >> "$RUNLOG" 2>&1

echo "--- run finished $(date) ---" >> "$RUNLOG"
