# SkillLord Architecture

## Overview

SkillLord is a Claude Code plugin that provides intelligent skill routing, curated development workflows, and structured agent orchestration. It combines best practices from ECC and ClaudeKit into a single, modular system that scales from solo developers to full teams.

SkillLord installs as a set of markdown files into your project's `.claude/` directory. Claude Code reads these files to gain domain-specific knowledge, follow structured workflows, and respond to slash commands.

## Component Descriptions

### Agents (22)
Agents are specialized personas that Claude adopts for specific tasks. Each agent has a defined role, tools it can use, and skills it draws from. Examples: `planner`, `debugger`, `code-reviewer`, `scout`, `loop-operator`.

### Skills (55)
Skills are curated knowledge modules organized in 3 tiers. Each skill is a `SKILL.md` file containing domain expertise, patterns, anti-patterns, and decision frameworks. Skills are referenced by agents and loaded on demand.

### Commands (29)
Commands are slash commands (e.g., `/plan`, `/fix`, `/cook`) that trigger structured workflows. Each command is a markdown file defining the steps Claude should follow, which agents to invoke, and what output to produce.

### Hooks
Hooks are event-driven triggers that run automatically. Examples: pre-commit quality checks, post-install validation, auto-routing on ambiguous requests.

### Workflows
Workflows define multi-step processes that coordinate agents and skills. The primary workflow governs the standard development cycle; orchestration protocols handle multi-agent coordination.

## Intelligence Layer

### Skill Router Flow
1. User describes a task (or runs `/route`)
2. Router analyzes task keywords, context, and file types
3. Router matches against skill tags from `manifest.json`
4. Top skills are recommended with confidence scores
5. Relevant skill content is loaded into context

### Quality Gate Flow
1. User runs `/audit` or `/quality-gate`
2. Gate runs lint, type checks, test suite, and security scan
3. Results are scored against configurable thresholds
4. Pass/fail report is generated with actionable fixes
5. Blocks PR creation if critical issues are found

## Tier System

Skills are organized into 3 tiers to manage context window usage:

| Tier | Count | Loading | Purpose |
|------|-------|---------|---------|
| **Tier 1 — Core** | 15 | Always loaded | Fundamental skills needed in every session |
| **Tier 2 — On-Demand** | 25 | Loaded when matched | Specialized skills for specific domains |
| **Tier 3 — Specialty** | 15 | Loaded on request | Language/framework-specific patterns |

This prevents context bloat: only Tier 1 is always present (~15 skills). Tier 2 and 3 are loaded dynamically when the skill router detects relevance.

## Install Profiles

SkillLord offers install profiles that control which modules are copied:

| Profile | Agents | Skills | Commands | Use Case |
|---------|--------|--------|----------|----------|
| **minimal** | 5 core | Tier 1 only | 8 essential | Small scripts, quick tasks |
| **developer** | 12 | Tier 1 + select Tier 2 | 18 | Individual developers |
| **full** | All 22 | All 55 | All 29 | Teams, complex projects |

Each profile maps to a set of files copied during `npx skilllord install`.

## Extension Points

### Adding a New Agent
1. Create `agents/<agent-name>.md` with role, personality, tools, and skills
2. Register in the agent index
3. Reference from relevant commands

### Adding a New Skill
1. Create `skills/tier-N/<skill-name>/SKILL.md`
2. Add entry to `skills/manifest.json` with name, tier, tags, description
3. The skill router will automatically discover it via tags

### Adding a New Command
1. Create `commands/<command-name>.md` with frontmatter and instructions
2. Claude Code automatically registers it as a slash command
3. Add argument hints and description in YAML frontmatter

## Data Flow

```
User Request
    │
    ▼
┌─────────┐     ┌──────────────┐     ┌─────────┐
│ Command │────▶│ Skill Router │────▶│  Agent  │
│ Parser  │     │ (tag match)  │     │ (role)  │
└─────────┘     └──────────────┘     └────┬────┘
                                          │
                                          ▼
                                    ┌───────────┐
                                    │  Skills   │
                                    │ (loaded)  │
                                    └─────┬─────┘
                                          │
                                          ▼
                                    ┌───────────┐
                                    │  Output   │
                                    │ + Quality │
                                    │   Gate    │
                                    └───────────┘
```

1. **User Request**: User types a slash command or natural language request
2. **Command Parser**: Matches to a command file or passes through
3. **Skill Router**: Analyzes context and selects relevant skills from manifest
4. **Agent**: Adopts the appropriate persona with loaded skills
5. **Skills**: Domain knowledge is injected into the agent's context
6. **Output + Quality Gate**: Response is validated before delivery
