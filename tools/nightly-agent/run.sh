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

ALLOWED_TOOLS=(
  Read Write Edit Glob Grep
  "Bash(yt-dlp *)" "Bash(node *)" "Bash(curl *)" "Bash(cat *)" "Bash(ls *)"
  "Bash(mkdir *)" "Bash(cp *)" "Bash(mv *)" "Bash(cd *)" "Bash(python3 *)"
  "Bash(ffmpeg *)" "Bash(whisper-cli *)" "Bash(date *)" "Bash(find *)" "Bash(echo *)"
  mcp__claude_ai_Google_Drive__create_file
  mcp__claude_ai_Google_Drive__search_files
  mcp__claude_ai_Google_Drive__get_file_metadata
  mcp__claude_ai_Canva__generate-design
  mcp__claude_ai_Canva__generate-design-structured
  mcp__claude_ai_Canva__export-design
  mcp__claude_ai_Canva__list-brand-kits
  mcp__claude_ai_Canva__get-export-formats
  PushNotification
)

/Users/mindyabiznazz/.local/bin/claude -p "$(cat tools/nightly-agent/PROMPT.md)" \
  --permission-mode acceptEdits \
  --allowedTools "${ALLOWED_TOOLS[@]}" \
  --add-dir "$REPO" \
  --model claude-sonnet-5 \
  --max-budget-usd 15 \
  --output-format text \
  >> "$RUNLOG" 2>&1

echo "--- run finished $(date) ---" >> "$RUNLOG"
