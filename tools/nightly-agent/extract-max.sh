#!/bin/zsh
# Maximum-yield clip extraction.
#
# The goal is volume: every genuinely good clip is usable (YouTube Partner
# Program needs 4,000 watch hours by Jan 2027), so the per-lesson caps are
# opened right up and segments are cut small so more candidate moments get
# proposed in the first place.
#
#   ./extract-max.sh <transcript-dir> <out-dir> [extra flags...]

set -uo pipefail
export PATH="/opt/homebrew/bin:/usr/local/bin:$HOME/.local/bin:$PATH"

REPO="/Users/mindyabiznazz/omega-clips"
TRANSCRIPTS="${1:?need a transcript dir}"
OUT="${2:?need an out dir}"
shift 2

# The extractor reads whichever provider key is present. OpenRouter is the
# one wired up on this machine; without credit it 402s and yields nothing,
# which is a billing problem, not a pipeline problem.
if [ -f "$HOME/.hermes/.env" ]; then
  export OPENROUTER_API_KEY=$(grep '^OPENROUTER_API_KEY=' "$HOME/.hermes/.env" | cut -d= -f2-)
fi

cd "$REPO/tools/clip-extractor" || exit 1

# Whole-library cost at 2026-08 OpenRouter prices (~1,161 segments):
#   openai/gpt-4o-mini ~$0.81 · qwen/qwen-2.5-72b-instruct ~$0.98
#   deepseek/deepseek-chat ~$1.39 · nousresearch/hermes-4-405b ~$4.49
# Override with OB_MODEL=... ; hermes is the one proven on this footage.
MODEL="${OB_MODEL:-nousresearch/hermes-4-405b}"

node bin/extract-clips.mjs \
  --transcript-dir "$TRANSCRIPTS" \
  --out "$OUT" \
  --provider openrouter \
  --model "$MODEL" \
  --max-tokens 6000 \
  --segment-seconds 150 \
  --min-clips 1 \
  --max-clips 40 \
  --max-per-category 12 \
  --candidates 3 \
  --concurrency 3 \
  "$@"
