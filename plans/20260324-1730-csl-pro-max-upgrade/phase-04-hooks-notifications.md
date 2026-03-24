# Phase 4: Hook & Notification Enhancements

**Date**: 2026-03-24
**Priority**: 🟡 High
**Status**: ⬜ Pending
**Depends on**: None (can parallel)

## Key Insights

claudekit-engineer có Discord + Telegram notification hooks. ECC có sophisticated hook profiles (minimal/standard/strict) và lifecycle hooks (SessionStart, SessionEnd, PreCompact). CSL có 7 hook scripts nhưng thiếu notifications và lifecycle management.

## Requirements

### Functional
- Thêm Discord notification hook (rich embeds on completion)
- Thêm Telegram notification hook
- Thêm hook profiles system (minimal/standard/strict)
- Thêm modularization warning hook (files > 200 LOC)
- Thêm scout-block hook (block heavy directories)
- Thêm `.env.example` cho notification config

### Non-Functional
- Notification hooks phải optional (không crash nếu thiếu tokens)
- Hook profiles phải configurable via environment variable
- Hooks phải cross-platform (macOS + Linux)

## Related Code Files

| File | Action | Description |
|------|--------|-------------|
| `hooks/scripts/discord-notify.sh` | **CREATE** | Discord webhook notification |
| `hooks/scripts/telegram-notify.sh` | **CREATE** | Telegram bot notification |
| `hooks/scripts/scout-block.js` | **CREATE** | Block heavy directories (node_modules, .git) |
| `hooks/scripts/modularization-hook.js` | **CREATE** | Warn on files > 200 LOC |
| `hooks/hooks.json` | **MODIFY** | Add new hooks + profile system |
| `.env.example` | **CREATE** | Template for notification tokens |

## Implementation Steps

1. **Create `discord-notify.sh`** — Port from claudekit-engineer:
   - Read `DISCORD_WEBHOOK_URL` from env
   - Send rich embed with: session summary, files changed, duration
   - Graceful exit if no webhook configured
   - Trigger: Stop hook (session end)

2. **Create `telegram-notify.sh`** — Port from claudekit-engineer:
   - Read `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` from env
   - Send formatted message with session details
   - Graceful exit if no tokens

3. **Create `scout-block.js`** — Port from claudekit-engineer:
   - Block Bash commands accessing: node_modules, .git, __pycache__, dist/, .next/
   - Exit code 2 (block) when detected
   - Cross-platform (Windows paths too)

4. **Create `modularization-hook.js`** — Port from claudekit-engineer:
   - PostToolUse hook on Write|Edit
   - Check if modified file > 200 LOC
   - Non-blocking suggestion to split file
   - Async execution (don't slow down)

5. **Update `hooks.json`**:
   - Add Stop hooks for notifications
   - Add PreToolUse for scout-block
   - Add PostToolUse for modularization
   - Add profile system: `CSL_HOOK_PROFILE=minimal|standard|strict`

6. **Create `.env.example`** — Document all optional env vars

## Todo
- [ ] Create discord-notify.sh
- [ ] Create telegram-notify.sh
- [ ] Create scout-block.js
- [ ] Create modularization-hook.js
- [ ] Update hooks.json with profiles
- [ ] Create .env.example
- [ ] Test hooks

## Success Criteria
- Discord/Telegram notifications fire on session end (when configured)
- scout-block prevents accidental node_modules reads
- Modularization warnings appear for large files
- `CSL_HOOK_PROFILE=minimal` disables non-essential hooks

## Risk Assessment
- **LOW**: Notification scripts depend on external services → graceful degradation
- **LOW**: scout-block may be too aggressive → configurable exclusion list
