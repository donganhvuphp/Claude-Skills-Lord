# SkillLord — Claude Code Plugin

Curated best-of-both plugin merging ClaudeKit Engineer (base) + Everything Claude Code (cherry-picked) with intelligent skill routing.

## Workflows

- Primary workflow: `./workflows/primary-workflow.md`
- Development rules: `./workflows/development-rules.md`
- Orchestration protocols: `./workflows/orchestration-protocol.md`
- Documentation management: `./workflows/documentation-management.md`

**IMPORTANT:** Follow development rules strictly. Research & Reuse is mandatory FIRST step before implementation.

## Agents (44)

### Core Agents
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
| doc-updater | Documentation specialist |
| docs-lookup | Documentation researcher |
| project-manager | Progress tracking |
| ui-ux-designer | UI/UX design |
| database-admin | Database optimization |
| brainstormer | Solution ideation (YAGNI/KISS/DRY) |
| copywriter | Conversion-focused content |
| scout | Parallel codebase exploration |
| scout-external | External tool-based exploration |
| loop-operator | Autonomous workflows |
| chief-of-staff | Multi-channel coordination |
| harness-optimizer | Self-optimization |
| skill-router | Advisory skill recommendation |
| quality-gate | Output validation |
| researcher | Deep research agent |
| tester | Test execution agent |
| mcp-manager | MCP server management |
| journal-writer | Session journaling |
| database-reviewer | Database review specialist |

### Language-Specific Reviewers
| Agent | Language |
|-------|----------|
| typescript-reviewer | TypeScript |
| python-reviewer | Python |
| rust-reviewer | Rust |
| go-reviewer | Go |
| kotlin-reviewer | Kotlin |
| java-reviewer | Java |
| cpp-reviewer | C++ |
| flutter-reviewer | Flutter/Dart |

### Language-Specific Build Resolvers
| Agent | Language |
|-------|----------|
| cpp-build-resolver | C++ |
| rust-build-resolver | Rust |
| java-build-resolver | Java |
| kotlin-build-resolver | Kotlin |
| go-build-resolver | Go |
| pytorch-build-resolver | PyTorch |

## Skills (170)

All skills live in `./skills/<name>/SKILL.md` — flat structure, no tiers.

## Commands (115)

### Core Commands
| Command | Description |
|---------|-------------|
| /plan | Create implementation plan (variants: fast, hard, two, cro, ci) |
| /code | Start coding |
| /test | Run tests |
| /fix | Fix issues (variants: fast, hard, ci, test, types, ui, logs) |
| /cook | Implement features end-to-end (variants: auto, auto/fast) |
| /tdd | Test-driven development workflow |
| /debug | Deep issue analysis |
| /code-review | Code review |
| /route | Get skill recommendations for your task |
| /audit | Run quality checks |
| /scout | Search codebase (variants: ext) |
| /bootstrap | Initialize new projects (variants: auto, auto/fast) |
| /design | Create UI designs (variants: 3d, describe, fast, good, screenshot, video) |
| /brainstorm | Explore solutions |
| /e2e | E2E testing |
| /build-fix | Fix build errors |
| /evolve | Iterative feature development |
| /learn | Extract patterns from session |
| /verify | Verify implementation |
| /quality-gate | Run quality validation |

### Multi-Agent Commands (from ECC)
| Command | Description |
|---------|-------------|
| /multi-plan | Multi-agent planning |
| /multi-workflow | Multi-agent workflow |
| /multi-backend | Multi-agent backend |
| /multi-frontend | Multi-agent frontend |
| /multi-execute | Multi-agent execution |
| /orchestrate | Agent orchestration |

### Session Management (from ECC)
| Command | Description |
|---------|-------------|
| /save-session | Save current session |
| /resume-session | Resume saved session |
| /sessions | List sessions |
| /checkpoint | Create checkpoint |

### Language-Specific Commands (from ECC)
| Command | Description |
|---------|-------------|
| /cpp-build, /cpp-review, /cpp-test | C++ workflows |
| /go-build, /go-review, /go-test | Go workflows |
| /kotlin-build, /kotlin-review, /kotlin-test | Kotlin workflows |
| /rust-build, /rust-review, /rust-test | Rust workflows |
| /python-review | Python review |
| /gradle-build | Gradle build |

### Content & Design Commands (from CEK)
| Command | Description |
|---------|-------------|
| /content | Content creation (variants: fast, good, cro, enhance) |
| /docs | Documentation (variants: init, update, summarize) |
| /git | Git operations (variants: pr, cp, cm) |
| /integrate | Integrations (variants: sepay, polar) |
| /skill | Skill management (variants: add, create, fix-logs, optimize) |

## Rules (13 languages)

Language-specific coding rules in `./rules/`:
- Common (agents, coding-style, development-workflow, git-workflow, hooks, patterns, performance, security, testing)
- TypeScript, Python, Go, Rust, Java, Kotlin, C++, C#, PHP, Perl, Swift

## Contexts

Development contexts in `./contexts/`:
- `dev.md` — Development context
- `research.md` — Research context
- `review.md` — Code review context

## Statusline

Cross-platform statusline in `./scripts/statusline.js|sh|ps1`:
- Cost tracking, token count, session timer, git branch, model info
- Configured via `statusLine` in `hooks/hooks.json`

## Development Config

- `.commitlintrc.json` — conventional commit enforcement
- `.releaserc.json` — semantic release automation
- `.repomixignore` — repomix ignore patterns
- `.env.example` — API keys template (Discord, Telegram, Gemini)
- `docs/code-standards.md` — coding standards

## Principles

- **YAGNI** — You Aren't Gonna Need It
- **KISS** — Keep It Simple, Stupid
- **DRY** — Don't Repeat Yourself
- Research & Reuse BEFORE writing new code
- TDD when possible (80%+ coverage target)
- Confidence-based code review (>80% sure before flagging)
