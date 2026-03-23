# Command Reference

SkillLord provides 29 slash commands organized by function.

## Core Commands

| Command | Description |
|---------|-------------|
| `/plan` | Restate requirements, assess risks, and create step-by-step implementation plan. Waits for user confirmation before touching code. |
| `/code` | Start coding and testing an existing plan. |
| `/test` | Run tests locally and analyze the summary report. |
| `/fix` | Analyze and fix issues with auto-detected complexity. Variants: `fix:fast`, `fix:hard`, `fix:ci`, `fix:test`, `fix:types`, `fix:ui`, `fix:logs`. |
| `/debug` | Deep debugging with systematic root cause analysis. |
| `/audit` | Run quality checks — lint, types, tests, security, plan completeness. |
| `/verify` | Run comprehensive verification on current codebase state. |

## Development Commands

| Command | Description |
|---------|-------------|
| `/cook` | Implement a feature end-to-end, step by step. |
| `/tdd` | Enforce test-driven development workflow. Scaffold interfaces, write tests first, then implement. 80%+ coverage target. |
| `/build-fix` | Incrementally fix build and type errors with minimal, safe changes. |
| `/refactor-clean` | Safely identify and remove dead code with test verification at every step. |
| `/e2e` | Generate and run Playwright E2E tests. Creates test journeys, captures screenshots/videos/traces. |
| `/bootstrap` | Bootstrap a new project step by step from requirements. |
| `/evolve` | Analyze instincts and suggest or generate evolved structures. |

## Planning & Analysis

| Command | Description |
|---------|-------------|
| `/brainstorm` | Explore solutions and brainstorm feature approaches. |
| `/route` | Analyze your current task and recommend the most relevant skills from the catalog. |
| `/scout` | Scout given directories to respond to user requests. Parallel codebase exploration. |
| `/ask` | Answer technical and architectural questions. |
| `/model-route` | Recommend the best model tier for the current task by complexity and budget. |
| `/quality-gate` | Run the ECC quality pipeline on demand for a file or project scope. |

## Content & Review

| Command | Description |
|---------|-------------|
| `/review` | Comprehensive security and quality review of uncommitted changes. |
| `/prompt-optimize` | Analyze a draft prompt and output an optimized, ECC-enriched version. Advisory only — does not execute. |
| `/journal` | Write journal entries based on memories and recent code changes. |

## Automation & Learning

| Command | Description |
|---------|-------------|
| `/loop-start` | Start a managed autonomous loop pattern with safety defaults. |
| `/loop-status` | Inspect active loop state, progress, and failure signals. |
| `/learn` | Extract reusable patterns from the current session. |
| `/skill-create` | Analyze local git history to extract coding patterns and generate SKILL.md files. |
| `/commit_gen` | Generate a commit message based on staged files and rename branch to match task. |
| `/watzup` | Review recent changes on current branch and provide a detailed summary. |
