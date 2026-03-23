# SkillLord — Claude Code Plugin

Curated best-of-both plugin merging ECC and ClaudeKit with intelligent skill routing.

## Workflows

- Primary workflow: `./workflows/primary-workflow.md`
- Development rules: `./workflows/development-rules.md`
- Orchestration protocols: `./workflows/orchestration-protocol.md`

**IMPORTANT:** Follow development rules strictly. Research & Reuse is mandatory FIRST step before implementation.

## Agents (22)

| Agent | Role |
|-------|------|
| planner | Technical planning with mental models |
| architect | System design & scalability |
| code-reviewer | Quality assessment + confidence filtering |
| security-reviewer | OWASP vulnerability detection |
| tdd-guide | Test-driven development (RED-GREEN-REFACTOR) |
| debugger | Root cause investigation |
| build-error-resolver | Build/compile error fixing |
| e2e-runner | Playwright E2E testing |
| refactor-cleaner | Dead code cleanup |
| git-manager | Version control operations |
| docs-manager | Documentation management |
| project-manager | Progress tracking |
| ui-ux-designer | UI/UX design |
| database-admin | Database optimization |
| brainstormer | Solution ideation (YAGNI/KISS/DRY) |
| copywriter | Conversion-focused content |
| scout | Parallel codebase exploration |
| loop-operator | Autonomous workflows |
| chief-of-staff | Multi-channel coordination |
| harness-optimizer | Self-optimization |
| skill-router | Advisory skill recommendation |
| quality-gate | Output validation |

## Skills (61, 3 Tiers)

### Tier 1 — Core (always loaded)
debugging, code-review, tdd-workflow, testing, backend-development, frontend-development, web-frameworks, ui-styling, ui-ux-pro-max, react-best-practices, databases, api-design, devops, security-patterns, sequential-thinking, research

### Tier 2 — On-Demand
ai-multimodal, better-auth, payment-integration, continuous-learning, codebase-onboarding, autonomous-loops, mcp-management, frontend-patterns, backend-patterns, coding-standards, e2e-testing, deployment-patterns, docker-patterns, postgres-patterns, database-migrations, mcp-server-patterns, eval-harness, verification-loop, strategic-compact, mobile-development, claude-code, planning, problem-solving, google-adk-python, media-processing, design-system, design, brand

### Tier 3 — Specialty
python-patterns, golang-patterns, rust-patterns, kotlin-patterns, django-patterns, laravel-patterns, springboot-patterns, swiftui-patterns, pytorch-patterns, shopify, threejs, vercel-deploy, agentic-engineering, prompt-optimizer, cost-aware-llm-pipeline, banner-design, slides

## Key Commands

| Command | Description |
|---------|-------------|
| /plan | Create implementation plan |
| /code | Start coding |
| /test | Run tests |
| /fix | Fix issues (variants: fast, hard, ci, test, types, ui, logs) |
| /cook | Implement features end-to-end |
| /tdd | Test-driven development workflow |
| /debug | Deep issue analysis |
| /review | Code review |
| /route | Get skill recommendations for your task |
| /audit | Run quality checks |
| /scout | Search codebase |
| /bootstrap | Initialize new projects |
| /design | Create UI designs |
| /brainstorm | Explore solutions |
| /e2e | E2E testing |
| /build-fix | Fix build errors |
| /evolve | Iterative feature development |
| /learn | Extract patterns from session |

## Principles

- **YAGNI** — You Aren't Gonna Need It
- **KISS** — Keep It Simple, Stupid
- **DRY** — Don't Repeat Yourself
- Research & Reuse BEFORE writing new code
- TDD when possible (80%+ coverage target)
- Confidence-based code review (>80% sure before flagging)
