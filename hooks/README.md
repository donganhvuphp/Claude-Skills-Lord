# CSL Hook System

## Hook Types

| Type | When | Can Block? |
|------|------|-----------|
| **PreToolUse** | Before tool execution | Yes (exit 2) |
| **PostToolUse** | After tool execution | No (advisory) |
| **Stop** | After each response | No |

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Allow / success |
| 2 | Block execution (PreToolUse only) |

## Installed Hooks

### PreToolUse
- **block-no-verify.js** — Prevents `--no-verify` flag on git commands
- **scout-block.js** — Blocks access to heavy directories (node_modules, .git, dist)
- **config-protection.js** — Prevents weakening linter/formatter configs

### PostToolUse
- **quality-gate.js** — Lint + type check + test (async, 30s timeout)
- **post-edit-format.js** — Auto-format JS/TS (Biome or Prettier)
- **post-edit-typecheck.js** — TypeScript validation
- **modularization-hook.js** — Warn on files > 200 LOC

### Stop
- **check-console-log.js** — Detect console.log in modified files
- **session-end.js** — Persist session state
- **discord-notify.sh** — Discord webhook notification (optional)
- **telegram-notify.sh** — Telegram bot notification (optional)

## Configuration

### Environment Variables

Copy `hooks/.env.example` to `hooks/.env`:

```bash
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
TELEGRAM_BOT_TOKEN=123456:ABC...
TELEGRAM_CHAT_ID=-100...
CSL_HOOK_PROFILE=standard
```

### Hook Profiles

Set via `CSL_HOOK_PROFILE` environment variable:

| Profile | Hooks Active |
|---------|-------------|
| **minimal** | block-no-verify, session-end |
| **standard** (default) | + quality-gate, console-log check, notifications, scout-block |
| **strict** | + auto-format, typecheck, config-protection |

## Adding Custom Hooks

1. Create script in `hooks/scripts/your-hook.js`
2. Add entry to `hooks/hooks.json`
3. Test with `csl doctor`

### Hook Input (stdin)

Hooks receive JSON via stdin:

```json
{
  "tool_name": "Edit",
  "tool_input": {
    "file_path": "/path/to/file.ts",
    "old_string": "...",
    "new_string": "..."
  }
}
```

### Hook Output (stdout)

Non-blocking hooks can inject context:

```json
{
  "continue": true,
  "hookSpecificOutput": {
    "hookEventName": "PostToolUse",
    "additionalContext": "Your message here"
  }
}
```
