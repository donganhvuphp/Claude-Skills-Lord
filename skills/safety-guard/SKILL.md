---
name: safety-guard
description: Prevent destructive operations during autonomous agent runs. Three protection modes — careful (warn on dangerous commands), freeze (lock writes to a directory), guard (both combined). Essential for full-auto sessions.
---

> Pairs with: autonomous-loops, agentic-engineering, deployment-patterns

# Safety Guard

## When to Activate

- Agent running in autonomous/full-auto mode
- Working on production systems with irreversible operations
- Restricting edits to a specific directory during focused work
- Sensitive operations: migrations, deploys, permission changes, data transformations

## Three Protection Modes

### Mode 1: Careful Mode

Intercepts destructive commands before execution and warns, then asks for confirmation:

**Watched patterns:**
```
rm -rf (especially /, ~, or project root)
git push --force
git reset --hard
git checkout . (discard all changes)
DROP TABLE / DROP DATABASE
docker system prune
kubectl delete
chmod 777
sudo rm
npm publish (accidental publishes)
Any command with --no-verify
```

On detection: explains what the command does → suggests safer alternative → requires explicit confirmation.

### Mode 2: Freeze Mode

Locks all file writes to a specific directory tree:

```
activate: safety-guard freeze src/components/
```

Any Write/Edit outside `src/components/` is blocked with an explanation. Use when you want an agent focused on one area without touching unrelated code.

### Mode 3: Guard Mode (Careful + Freeze combined)

Maximum safety for autonomous agents — reads anywhere, writes only to allowed directory, destructive commands blocked everywhere:

```
activate: safety-guard guard --dir src/api/ --allow-read-all
```

### Disable

```
safety-guard off
```

## Implementation

Uses PreToolUse hooks to intercept `Bash`, `Write`, `Edit`, and `MultiEdit` tool calls. Checks command/path against active rules before allowing execution.

Hook entry (`hooks.json`):
```json
{
  "matcher": "Bash|Write|Edit",
  "hooks": [{
    "type": "command",
    "command": "node hooks/scripts/safety-guard.js"
  }]
}
```

## Activation Guide

| Scenario | Recommended Mode |
|----------|----------------|
| Reading and writing freely, just avoid disasters | Careful |
| Agent refactoring one module only | Freeze |
| Fully autonomous session on prod | Guard |
| Normal interactive session | Off |

## Logs

All blocked actions are logged to `~/.claude/safety-guard.log` for audit trail.
