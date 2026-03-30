#!/bin/bash

# Discord Notification Hook for Claude Code
# Sends rich embed to Discord when session completes

set -euo pipefail

# Load env: process.env > .claude/.env > hooks/.env
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
DISCORD_WEBHOOK_URL="${DISCORD_WEBHOOK_URL:-}"

if [[ -z "$DISCORD_WEBHOOK_URL" ]]; then
    echo "⚠️  Discord notification skipped: DISCORD_WEBHOOK_URL not set" >&2
    exit 0
fi

send_discord_embed() {
    local title="$1" description="$2" color="$3" fields="$4"
    # Use jq to safely construct JSON (prevents injection from unescaped variables)
    local payload
    payload=$(jq -n \
        --arg title "$title" \
        --arg desc "$description" \
        --argjson color "$color" \
        --arg ts "$(date -u +%Y-%m-%dT%H:%M:%S.000Z)" \
        --arg footer "CSL • ${PROJECT_NAME}" \
        --argjson fields "$fields" \
        '{embeds: [{title: $title, description: $desc, color: $color, timestamp: $ts, footer: {text: $footer}, fields: $fields}]}')
    curl -s -X POST "$DISCORD_WEBHOOK_URL" -H "Content-Type: application/json" -d "$payload" > /dev/null 2>&1
}

case "$HOOK_TYPE" in
    "Stop")
        TOTAL_TOOLS=$(echo "$INPUT" | jq '.toolsUsed | length')
        FIELDS=$(cat <<EOF
[
    {"name": "⏰ Time", "value": "${TIMESTAMP}", "inline": true},
    {"name": "🔧 Operations", "value": "${TOTAL_TOOLS}", "inline": true},
    {"name": "🆔 Session", "value": "\`${SESSION_ID:0:8}...\`", "inline": true}
]
EOF
)
        send_discord_embed "🤖 Session Complete" "✅ Claude Code session completed" 5763719 "$FIELDS"
        ;;
    "SubagentStop")
        SUBAGENT_TYPE=$(echo "$INPUT" | jq -r '.subagentType // "unknown"')
        FIELDS=$(cat <<EOF
[
    {"name": "⏰ Time", "value": "${TIMESTAMP}", "inline": true},
    {"name": "🔧 Agent", "value": "${SUBAGENT_TYPE}", "inline": true}
]
EOF
)
        send_discord_embed "🎯 Subagent Complete" "Agent finished task" 3447003 "$FIELDS"
        ;;
esac

echo "✅ Discord notification sent for $HOOK_TYPE" >&2
