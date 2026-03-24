---
name: continuous-learning-v2
description: Instinct-based learning system v2.1. Observes Claude Code sessions via hooks (100% reliable), creates atomic instincts with confidence scoring, and evolves them into reusable skills/commands/agents. Adds project-scoped instincts to prevent cross-project contamination.
version: 2.1.0
---

> Pairs with: codebase-onboarding, eval-harness, claude-code
> Upgrades: continuous-learning (v1 — stop-hook based, ~50-80% observation rate)

# Continuous Learning v2.1

## When to Activate

- Setting up automatic learning from Claude Code sessions
- Configuring hook-based behavior extraction
- Tuning confidence thresholds for learned behaviors
- Reviewing, exporting, or importing instinct libraries
- Evolving instincts into full skills, commands, or agents
- Managing project-scoped vs global instincts

## What's New vs v1

| Feature | v1 | v2.1 |
|---------|----|----|
| Observation trigger | Stop hook (session end, ~50-80% reliable) | PreToolUse/PostToolUse (100% reliable) |
| Analysis | Main context | Background agent (Haiku, zero overhead) |
| Granularity | Full skills | Atomic "instincts" |
| Confidence | None | 0.3–0.9 weighted |
| Storage | Global | **Project-scoped** (prevents cross-project contamination) |
| Evolution path | Direct to skill | Instincts → cluster → skill/command/agent |

## The Instinct Model

An instinct is a small, atomic learned behavior:

```yaml
id: prefer-functional-style
trigger: "when writing new functions"
confidence: 0.7
domain: code-style
scope: project                    # or: global
project_id: a1b2c3d4e5f6
---
Use functional patterns over classes when appropriate.
Evidence: observed 5 instances, user corrected class-based approach 2x.
```

**Properties:** atomic (one trigger, one action) · confidence-weighted · domain-tagged · scope-aware

## Scope Decision Guide

| Pattern Type | Scope | Examples |
|-------------|-------|---------|
| Language/framework conventions | project | "Use React hooks", "Follow Django REST patterns" |
| File structure preferences | project | "Tests in `__tests__/`", "Components in `src/components/`" |
| Code style | project | "Use functional style", "Prefer dataclasses" |
| Security practices | global | "Validate user input", "Sanitize SQL" |
| General best practices | global | "Write tests first", "Always handle errors" |
| Tool workflow preferences | global | "Grep before Edit", "Read before Write" |

Auto-promotion: when the same instinct appears in 2+ projects with confidence ≥0.8, it becomes a global instinct.

## Quick Start

### 1. Enable Observation Hooks

Add to `~/.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "*",
      "hooks": [{"type": "command", "command": "node ~/.claude/skills/continuous-learning-v2/hooks/observe.js"}]
    }],
    "PostToolUse": [{
      "matcher": "*",
      "hooks": [{"type": "command", "command": "node ~/.claude/skills/continuous-learning-v2/hooks/observe.js"}]
    }]
  }
}
```

### 2. Initialize Directories

```bash
mkdir -p ~/.claude/homunculus/{instincts/{personal,inherited},evolved/{agents,skills,commands},projects}
# Project directories are auto-created when hook first runs in a git repo
```

### 3. Use Commands

| Command | Description |
|---------|-------------|
| `/instinct-status` | Show all instincts (project + global) with confidence |
| `/evolve` | Cluster related instincts into skills/commands |
| `/promote [id]` | Promote project instinct to global scope |
| `/instinct-export` | Export instincts to file |
| `/instinct-import <file>` | Import instincts with scope control |
| `/projects` | List all known projects and instinct counts |

## Confidence Scoring

| Score | Meaning | Behavior |
|-------|---------|----------|
| 0.3 | Tentative | Suggested but not enforced |
| 0.5 | Moderate | Applied when relevant |
| 0.7 | Strong | Auto-approved for application |
| 0.9 | Near-certain | Core behavior |

Confidence **increases** when pattern is observed repeatedly or user accepts suggestions.
Confidence **decreases** when user explicitly corrects behavior.

## Project Detection

1. `CLAUDE_PROJECT_DIR` env var (highest priority)
2. `git remote get-url origin` — hashed to portable 12-char project ID
3. `git rev-parse --show-toplevel` — fallback (machine-specific)
4. Global fallback — no git context

## File Structure

```
~/.claude/homunculus/
├── projects.json               # Registry: hash → project name/path
├── instincts/personal/         # Global auto-learned instincts
└── projects/
    └── a1b2c3d4e5f6/           # Per-project (from git remote hash)
        ├── observations.jsonl
        ├── instincts/personal/ # Project-scoped instincts
        └── evolved/            # Project-scoped evolved skills/commands
```

## Why Hooks vs Skills for Observation

Skills are probabilistic — they fire ~50–80% of the time based on Claude's judgment. Hooks fire **100% of the time**, deterministically. This means every tool call is observed and no patterns are missed.
