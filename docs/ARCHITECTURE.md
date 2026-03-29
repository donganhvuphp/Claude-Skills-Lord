# SkillLord Architecture

## Overview

SkillLord is a Claude Code plugin that provides curated development workflows, structured agent orchestration, and 161 domain-specific skills. It provides a single, modular system for production development.

SkillLord installs as a set of markdown files into your project's `.claude/` directory. Claude Code reads these files to gain domain-specific knowledge, follow structured workflows, and respond to slash commands.

## Component Descriptions

### Agents (43)
Agents are specialized personas that Claude adopts for specific tasks. Each agent has a defined role, model preference, and tools it can use. Includes 29 core agents + 8 language-specific reviewers + 6 language-specific build resolvers. Examples: `planner`, `debugger`, `code-reviewer`, `scout`, `architect`, `tdd-guide`.

### Skills (161)
Skills are curated knowledge modules — each is a `SKILL.md` file containing domain expertise, patterns, anti-patterns, and decision frameworks. Skills are organized in a flat structure under `skills/<name>/SKILL.md` and cataloged in `skills/manifest.json`.

### Commands (114)
Commands are slash commands (e.g., `/plan`, `/fix`, `/cook`) that trigger structured workflows. Each command is a markdown file with YAML frontmatter defining description and argument hints. Includes core workflows, language-specific commands, multi-agent orchestration, session management, and more.

### Hooks
Hooks are event-driven triggers that run automatically. Examples: pre-commit quality checks, auto-formatting on file edits, type checking after changes, security guards during autonomous loops.

### Workflows
Workflows define multi-step processes that coordinate agents and skills. The primary workflow governs the standard development cycle; orchestration protocols handle multi-agent coordination.

## Intelligence Layer

### Quality Gate Flow
1. User runs `/audit` or `/quality-gate`
2. Gate runs lint, type checks, test suite, and security scan
3. Results are scored against configurable thresholds
4. Pass/fail report is generated with actionable fixes
5. Blocks PR creation if critical issues are found

## Installation

`csl init` installs all components (agents, commands, skills, rules, contexts, hooks, workflows, MCP configs, canvas fonts) into `.claude/`. Use `--no-fonts` to skip canvas font files (~7MB).

## Extension Points

### Adding a New Agent
1. Create `agents/<agent-name>.md` with frontmatter (`name`, `description`, `model`, `tools`)
2. Add role description and instructions in the body
3. Reference from relevant commands

### Adding a New Skill
1. Create `skills/<skill-name>/SKILL.md` with frontmatter (`name`, `description`)
2. Add domain expertise, patterns, and examples in the body (minimum 10 lines)
3. Regenerate `skills/manifest.json` to include the new skill

### Adding a New Command
1. Create `commands/<command-name>.md` with YAML frontmatter (`description`)
2. Claude Code automatically registers it as a slash command
3. For variants, use subdirectories: `commands/<name>/<variant>.md`

## Data Flow

```
User Request
    │
    ▼
┌─────────┐     ┌──────────────┐     ┌─────────┐
│ Command │────▶│   Context    │────▶│  Agent  │
│ Parser  │     │  (skills +   │     │ (role)  │
│         │     │   rules)     │     │         │
└─────────┘     └──────────────┘     └────┬────┘
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
3. **Context**: Relevant skills and rules are loaded into the agent's context
4. **Agent**: Adopts the appropriate persona with domain knowledge
5. **Output + Quality Gate**: Response is validated before delivery
