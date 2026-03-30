#!/bin/bash

# Telegram Notification Hook for Claude Code
# Sends message to Telegram when session completes

set -euo pipefail

load_env() {
    [[ -f "$(dirname "$0")/.env" ]] && { set -a; source "$(dirname "$0")/.env"; set +a; }
    [[ -f .claude/.env ]] && { set -a; source .claude/.env; set +a; }
}
load_env

INPUT=$(cat)
HOOK_TYPE=$(echo "$INPUT" | jq -r '.hookType // "unknown"')
PROJECT_DIR=$(echo "$INPUT" | jq -r '.projectDir // ""')
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
SESSION_ID=$(echo "$INPUT" | jq -r '.sessionId // ""')
PROJECT_NAME=$(basename "$PROJECT_DIR")
TELEGRAM_BOT_TOKEN="${TELEGRAM_BOT_TOKEN:-}"
TELEGRAM_CHAT_ID="${TELEGRAM_CHAT_ID:-}"

if [[ -z "$TELEGRAM_BOT_TOKEN" || -z "$TELEGRAM_CHAT_ID" ]]; then
    echo "⚠️  Telegram notification skipped: tokens not set" >&2
    exit 0
fi

send_telegram() {
    local message="$1"
    # Use jq to safely construct JSON payload (prevents injection from unescaped variables)
    local payload
    payload=$(jq -n \
        --arg chat_id "$TELEGRAM_CHAT_ID" \
        --arg text "$message" \
        '{chat_id: $chat_id, text: $text, parse_mode: "Markdown", disable_web_page_preview: true}')
    curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
        -H "Content-Type: application/json" \
        -d "$payload" > /dev/null
}

case "$HOOK_TYPE" in
    "Stop")
        TOTAL_TOOLS=$(echo "$INPUT" | jq '.toolsUsed | length')
        MESSAGE="🤖 *CSL Session Complete*
📅 ${TIMESTAMP}
📁 ${PROJECT_NAME}
🔧 ${TOTAL_TOOLS} operations
🆔 ${SESSION_ID:0:8}..."
        send_telegram "$MESSAGE"
        ;;
    "SubagentStop")
        SUBAGENT_TYPE=$(echo "$INPUT" | jq -r '.subagentType // "unknown"')
        MESSAGE="🎯 *CSL Subagent Complete*
📅 ${TIMESTAMP}
📁 ${PROJECT_NAME}
🔧 ${SUBAGENT_TYPE}"
        send_telegram "$MESSAGE"
        ;;
esac

echo "✅ Telegram notification sent for $HOOK_TYPE" >&2
