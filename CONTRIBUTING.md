# Contributing to SkillLord

Thanks for your interest! This guide covers how to add agents, skills, and commands.

## Getting Started

```bash
git clone https://github.com/skilllord/skilllord.git
cd skilllord
node tests/run-all.js  # verify everything passes
```

## Agent Format

Agents are markdown files in `agents/` with YAML frontmatter:

```yaml
---
name: agent-name
description: What the agent does (one line)
tools: ["Read", "Grep", "Glob", "Bash"]
model: sonnet
---

# Agent Title

Instructions for the agent...
```

**Required fields:**
- `name` — lowercase, hyphenated
- `description` — one-line description
- `tools` — array of Claude Code tools
- `model` — one of: `opus`, `sonnet`, `haiku`

## Skill Format

Skills live in `skills/tier-{1,2,3}/skill-name/`:

```
skills/my-skill/
├── SKILL.md          # Required
├── references/       # Optional
└── scripts/          # Optional
```

**SKILL.md:**
```yaml
---
name: my-skill
description: What the skill teaches (<100 chars)
---

# Skill content...
```

After adding a skill, update `skills/manifest.json` with name, tier, path, tags, description, dependencies.

## Command Format

```yaml
---
description: What the command does (shown in / menu)
---

# Command body...
```

Variants go in subdirectories (e.g., `fix/fast.md`).

## Tier Guidelines

| Tier | Criteria | Examples |
|------|----------|---------|
| 1 | Used in most projects | debugging, testing |
| 2 | Framework/tool-specific | better-auth, docker-patterns |
| 3 | Language-specific or niche | rust-patterns, pytorch-patterns |

## Testing

```bash
node tests/run-all.js
```

## PR Checklist

- [ ] Tests pass (`node tests/run-all.js`)
- [ ] `skills/manifest.json` updated if adding skills
- [ ] CHANGELOG.md updated
- [ ] No secrets committed
- [ ] Agent frontmatter complete
