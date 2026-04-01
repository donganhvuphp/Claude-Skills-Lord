<p align="center">
  <img src="https://raw.githubusercontent.com/donganhvuphp/Claude-Skills-Lord/main/assets/logo.png" alt="Claude Skill Lord" width="120" />
</p>

<h1 align="center">Claude Skill Lord</h1>

<p align="center">
  <strong>The all-in-one Claude Code plugin you install once and never outgrow.</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/claude-skill-lord"><img src="https://img.shields.io/npm/v/claude-skill-lord?color=cb0000&label=npm" alt="npm" /></a>
  <a href="https://www.npmjs.com/package/claude-skill-lord"><img src="https://img.shields.io/npm/dm/claude-skill-lord?color=cb0000" alt="downloads" /></a>
  <a href="https://github.com/donganhvuphp/Claude-Skills-Lord"><img src="https://img.shields.io/github/stars/donganhvuphp/Claude-Skills-Lord?style=flat&color=orange" alt="stars" /></a>
  <img src="https://img.shields.io/badge/agents-43-8b5cf6" alt="agents" />
  <img src="https://img.shields.io/badge/skills-165-f97316" alt="skills" />
  <img src="https://img.shields.io/badge/commands-114-ef4444" alt="commands" />
  <img src="https://img.shields.io/badge/languages-11-3b82f6" alt="languages" />
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-22c55e" alt="license" /></a>
</p>

---

## What is Claude Skill Lord?

Claude Skill Lord is a curated plugin for [Claude Code](https://docs.anthropic.com/en/docs/claude-code) that adds **43 specialized agents**, **165 production-ready skills**, **114 commands**, and **11 language rule sets** to your development workflow. One install gives Claude deep expertise in planning, coding, testing, reviewing, debugging, and designing — across any language or framework.

---

## Quick Start

### Install globally (recommended)

```bash
npm i -g claude-skill-lord
```

### Set up in any project

```bash
cd your-project
csl init       # copies agents, skills, commands into .claude/
claude         # start coding with Claude Skill Lord
```

That's it. `csl init` generates `plugin.json` and wires everything up automatically.

### Alternative installs

```bash
# Per-project
npm i claude-skill-lord && npx csl init

# From source
git clone https://github.com/donganhvuphp/Claude-Skills-Lord.git
cd Claude-Skills-Lord && node scripts/sl.js init --target /path/to/your/project
```

---

## CLI

```
csl init                  Install everything
csl init --dry-run        Preview without copying
csl init --fresh          Clean reinstall
csl init --no-fonts       Skip canvas font files (~7 MB)
csl update                Update CLI to latest version
csl migrate               Update project files after csl update
csl migrate --dry-run     Preview what would change
csl diff                  Compare project files with source
csl uninstall             Remove from current project
csl doctor                Health check + available updates
csl list                  Show all components
```

---

## How It Works

```
┌─────────────────────────────────────────────────────────┐
│                    Claude Skill Lord                     │
│                                                         │
│  ┌───────────┐  ┌───────────┐  ┌──────────┐  ┌──────┐  │
│  │ 43 Agents │  │165 Skills │  │114 Cmds  │  │Rules │  │
│  └─────┬─────┘  └─────┬─────┘  └────┬─────┘  └──┬───┘  │
│        │              │              │            │      │
│        └──────────┬───┴──────────────┘            │      │
│                   ▼                               │      │
│          ┌────────────────┐                       │      │
│          │  Quality Gate  │◄──────────────────────┘      │
│          └───────┬────────┘                              │
│                  ▼                                       │
│    ┌──────────────────────────┐                          │
│    │ Hooks · Workflows · MCP │                          │
│    └──────────────────────────┘                          │
└─────────────────────────────────────────────────────────┘
```

---

## Usage

### Plan → Code → Test

```
/plan Add user authentication with OAuth2
/code
/test
```

### Fix issues

```
/fix login not redirecting after auth
/fix:ci                                # fix from CI/CD logs
/fix:types                             # fix TypeScript errors
/fix:fast connection timeout on API    # quick fix, no deep research
```

### Design UI

```
/design:good Landing page for a fintech SaaS
/design:fast Signup button with glassmorphism style
/design:3d Interactive 3D product showcase
```

### Build features end-to-end

```
/cook Add dark mode toggle in settings page
/brainstorm WebSocket vs SSE for real-time notifications?
/bootstrap:auto Next.js SaaS starter with auth and payments
```

### Explore & understand code

```
/scout src/ find all API endpoints
/model-route I need to refactor the authentication module
```

### Multi-agent workflows

```
/multi-plan Complex feature requiring multiple perspectives
/multi-backend Microservice architecture implementation
/orchestrate Coordinate multiple agents on a large task
```

### Session management

```
/save-session      Save current work context
/resume-session    Resume where you left off
/checkpoint        Create a recovery point
```

### Language-specific workflows

```
/rust-build   /rust-review   /rust-test
/go-build     /go-review     /go-test
/kotlin-build /kotlin-review /kotlin-test
/cpp-build    /cpp-review    /cpp-test
/python-review
```

---

## Key Commands

| Command | What it does |
|---------|-------------|
| `/plan` | Create implementation plan (`fast`, `hard`, `two`, `cro`, `ci`) |
| `/code` | Start coding from plan |
| `/test` | Run and validate tests |
| `/fix` | Fix issues (`fast`, `hard`, `ci`, `test`, `types`, `ui`, `logs`) |
| `/cook` | Implement features end-to-end (`auto`, `auto/fast`) |
| `/tdd` | Test-driven development workflow |
| `/debug` | Deep root-cause investigation |
| `/design` | Create UI designs (`fast`, `good`, `3d`, `screenshot`, `video`) |
| `/audit` | Run quality gate checks |

<details>
<summary><strong>View all 114 commands</strong></summary>

| Category | Commands |
|----------|----------|
| **Core** | `/plan`, `/code`, `/test`, `/fix`, `/cook`, `/debug`, `/tdd`, `/verify` |
| **Review** | `/code-review`, `/python-review`, `/rust-review`, `/go-review`, `/cpp-review`, `/kotlin-review` |
| **Build** | `/build-fix`, `/cpp-build`, `/go-build`, `/kotlin-build`, `/rust-build`, `/gradle-build` |
| **Test** | `/test-coverage`, `/e2e`, `/cpp-test`, `/go-test`, `/kotlin-test`, `/rust-test` |
| **Design** | `/design:fast`, `/design:good`, `/design:3d`, `/design:screenshot`, `/design:video`, `/design:describe` |
| **Content** | `/content:fast`, `/content:good`, `/content:cro`, `/content:enhance` |
| **Docs** | `/docs:init`, `/docs:update`, `/docs:summarize`, `/update-docs` |
| **Git** | `/git:pr`, `/git:cp`, `/git:cm`, `/commit_gen` |
| **Multi-agent** | `/multi-plan`, `/multi-workflow`, `/multi-backend`, `/multi-frontend`, `/multi-execute`, `/orchestrate` |
| **Session** | `/save-session`, `/resume-session`, `/sessions`, `/checkpoint` |
| **Scout** | `/scout`, `/scout:ext` |
| **Bootstrap** | `/bootstrap`, `/bootstrap:auto`, `/bootstrap:auto/fast` |
| **Skills** | `/skill:add`, `/skill:create`, `/skill:optimize`, `/skill:fix-logs` |
| **Quality** | `/quality-gate`, `/audit`, `/refactor-clean`, `/prompt-optimize` |
| **Loop** | `/loop-start`, `/loop-status` |

</details>

---

## Agents

<details>
<summary><strong>43 agents — click to expand</strong></summary>

### Core

| Agent | Role |
|-------|------|
| planner | Technical planning with 9 mental models |
| architect | System design and scalability |
| code-reviewer | Quality assessment with confidence filtering |
| security-reviewer | OWASP vulnerability detection |
| tdd-guide | RED-GREEN-REFACTOR workflow |
| debugger | Root cause investigation |
| build-error-resolver | Build / compile error fixing |
| e2e-runner | Playwright E2E test generation |
| refactor-cleaner | Dead code cleanup |
| git-manager | Version control operations |
| docs-manager | Documentation management |
| doc-updater | Documentation specialist |
| docs-lookup | Documentation researcher |
| project-manager | Progress tracking |
| ui-ux-designer | UI/UX design |
| database-admin | Database optimization |
| database-reviewer | Database review |
| brainstormer | Solution ideation (YAGNI / KISS / DRY) |
| copywriter | Conversion-focused content |
| scout | Parallel codebase exploration |
| scout-external | External tool-based exploration |
| loop-operator | Autonomous development loops |
| chief-of-staff | Multi-channel coordination |
| harness-optimizer | Agent self-optimization |
| quality-gate | Output validation |
| researcher | Deep research |
| tester | Test execution |
| mcp-manager | MCP server management |
| journal-writer | Session journaling |

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
| flutter-reviewer | Flutter / Dart |

### Language-Specific Build Resolvers

| Agent | Language |
|-------|----------|
| cpp-build-resolver | C++ |
| rust-build-resolver | Rust |
| java-build-resolver | Java |
| kotlin-build-resolver | Kotlin |
| go-build-resolver | Go |
| pytorch-build-resolver | PyTorch |

</details>

---

## Skills (165)

All skills live in `./skills/<name>/SKILL.md` — flat or nested structure.

<details>
<summary><strong>View all 165 skills by category</strong></summary>

**Development Core** — debugging, code-review, tdd-workflow, testing, backend-development, frontend-development, web-frameworks, ui-styling, databases, api-design, devops, sequential-thinking, research, planning, problem-solving, coding-standards

**Frontend & Design** — ui-ux-pro-max, react-best-practices, frontend-patterns, frontend-design, frontend-slides, nextjs-turbopack, design, design-system, brand, banner-design, slides, aesthetic, web-design-guidelines, liquid-glass-design, threejs

**Backend & API** — backend-patterns, api-design, mcp-server-patterns, mcp-management, mcp-builder

**Language Patterns** — python-patterns, golang-patterns, rust-patterns, kotlin-patterns, perl-patterns, django-patterns, laravel-patterns, springboot-patterns, swiftui-patterns, nuxt4-patterns

**Language Testing & Security** — python-testing, golang-testing, rust-testing, kotlin-testing, cpp-testing, perl-testing, perl-security, django-tdd, laravel-tdd, springboot-tdd, django-security, laravel-security, springboot-security, django-verification, laravel-verification, springboot-verification

**Language Specialized** — kotlin-coroutines-flows, kotlin-exposed-patterns, kotlin-ktor-patterns, java-coding-standards, cpp-coding-standards, swift-actor-persistence, swift-concurrency-6-2, swift-protocol-di-testing, jpa-patterns, compose-multiplatform-patterns

**Mobile** — mobile-development, android-clean-architecture, flutter-dart-code-review

**DevOps & Infrastructure** — deployment-patterns, docker-patterns, vercel-deploy

**Database** — postgres-patterns, database-migrations, clickhouse-io

**AI & ML** — ai-multimodal, pytorch-patterns, google-adk-python, cost-aware-llm-pipeline, foundation-models-on-device, prompt-optimizer

**Agentic Engineering** — agentic-engineering, ai-first-engineering, ai-regression-testing, agent-harness-construction, agent-eval, autonomous-loops, continuous-agent-loop, continuous-learning, continuous-learning-v2, eval-harness, verification-loop, enterprise-agent-ops

**Content & Business** — article-writing, content-engine, crosspost, market-research, investor-outreach, investor-materials, shopify

**Security & Auth** — security-review, security-scan, better-auth, payment-integration, safety-guard

**Media & Processing** — media-processing, video-editing, videodb, fal-ai-media, nutrient-document-processing

**Document Skills** — document-skills/docx, document-skills/pdf, document-skills/pptx, document-skills/xlsx

**Tools & Utilities** — repomix, chrome-devtools, docs-seeker, documentation-lookup, skill-creator, data-scraper-agent, exa-search, x-api, bun-runtime, nanoclaw-repl, dmux-workflows

**Research & Strategy** — deep-research, strategic-compact, search-first, iterative-retrieval, codebase-onboarding, blueprint, santa-method, team-builder, architecture-decision-records

**Domain-Specific** — carrier-relationship-management, customs-trade-compliance, energy-procurement, inventory-demand-planning, logistics-exception-management, production-scheduling, quality-nonconformance, returns-reverse-logistics, visa-doc-translate

**Meta & Config** — claude-api, claude-devfleet, configure-skilllord, skill-comply, skill-stocktake, rules-distill, plankton-code-quality, ralphinho-rfc-pipeline, regex-vs-llm-structured-text, click-path-audit, context-budget, content-hash-cache-pattern, project-guidelines-example, plan-preview, template-skill, e2e-testing

</details>

---

## Rules

11 language-specific rule sets plus a common base, each covering: coding-style, hooks, patterns, security, and testing.

**Supported languages:** TypeScript, Python, Go, Rust, Java, Kotlin, C++, C#, PHP, Perl, Swift

---

## Hooks

| Hook | Trigger | What it does |
|------|---------|-------------|
| Block no-verify | PreToolUse | Prevents bypassing git hooks |
| Config protection | PreToolUse | Prevents weakening linter/formatter configs |
| Auto-format | PostToolUse | Runs Biome or Prettier on edited JS/TS |
| Type check | PostToolUse | Validates TypeScript after edits |
| Quality gate | PostToolUse | Lint + types + tests + security checks |
| Modularization | PostToolUse | Suggests splitting files > 200 LOC |
| Console.log check | Stop | Flags debug code left in modified files |
| Session persistence | Stop | Persist state for cross-session continuity |
| Notifications | Stop | Discord / Telegram notification on session end |

---

## Statusline

Built-in cross-platform statusline with real-time session metrics: cost tracking, token count, session timer, git branch, and model info. Available as Node.js, Bash, and PowerShell scripts.

---

## License

[MIT](LICENSE)
