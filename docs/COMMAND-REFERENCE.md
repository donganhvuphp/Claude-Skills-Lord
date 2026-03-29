# Command Reference

SkillLord provides 114 slash commands organized by function.

## Core Commands

| Command | Description |
|---------|-------------|
| `/plan` | Intelligent plan creation with prompt enhancement |
| `/plan:fast` | No research — analyze and create an implementation plan |
| `/plan:hard` | Research, analyze, and create an implementation plan |
| `/plan:two` | Research & create a plan with 2 approaches |
| `/plan:cro` | Create a CRO plan for given content |
| `/plan:ci` | Analyze GitHub Actions logs and provide a fix plan |
| `/code` | Start coding & testing an existing plan |
| `/test` | Run tests locally and analyze the summary report |
| `/fix` | Analyze and fix issues (auto-detect complexity) |
| `/fix:fast` | Quick fix without deep research |
| `/fix:hard` | Use subagents to plan and fix hard issues |
| `/fix:ci` | Analyze GitHub Actions logs and fix issues |
| `/fix:test` | Run test suite and fix issues |
| `/fix:types` | Fix type errors |
| `/fix:ui` | Analyze and fix UI issues |
| `/fix:logs` | Analyze logs and fix issues |
| `/debug` | Deep debugging with systematic root cause analysis |
| `/audit` | Run quality checks — lint, types, tests, security |
| `/verify` | Run comprehensive verification on codebase state |

## Development Commands

| Command | Description |
|---------|-------------|
| `/cook` | Implement a feature step by step |
| `/cook:auto` | Implement a feature automatically |
| `/cook:auto/fast` | No research — scout, plan & implement |
| `/tdd` | Enforce test-driven development workflow (80%+ coverage) |
| `/build-fix` | Incrementally fix build and type errors |
| `/refactor-clean` | Safely identify and remove dead code |
| `/e2e` | Generate and run Playwright E2E tests |
| `/bootstrap` | Bootstrap a new project step by step |
| `/bootstrap:auto` | Bootstrap a new project automatically |
| `/bootstrap:auto/fast` | Quick automatic bootstrap |
| `/evolve` | Analyze instincts and suggest evolved structures |
| `/test-coverage` | Analyze test coverage and generate missing tests |

## Planning & Analysis

| Command | Description |
|---------|-------------|
| `/brainstorm` | Explore solutions and brainstorm feature approaches |
| `/scout` | Scout given directories for codebase exploration |
| `/scout:ext` | Use external agentic tools to scout directories |
| `/ask` | Answer technical and architectural questions |
| `/aside` | Answer a side question without losing current context |
| `/model-route` | Recommend the best model tier for the current task |
| `/quality-gate` | Run the quality pipeline on demand |
| `/route` | Recommend relevant skills for current task |
| `/context-budget` | Analyze context window usage and find optimization opportunities |
| `/harness-audit` | Run a deterministic repository harness audit |
| `/eval` | Manage eval-driven development workflow |

## Design Commands

| Command | Description |
|---------|-------------|
| `/design:good` | Create an immersive design |
| `/design:fast` | Create a quick design |
| `/design:3d` | Create interactive 3D designs with Three.js |
| `/design:screenshot` | Create a design based on screenshot |
| `/design:video` | Create a design based on video |
| `/design:describe` | Describe a design from screenshot/video |

## Content & Review

| Command | Description |
|---------|-------------|
| `/code-review` | Comprehensive security and quality review |
| `/review:codebase` | Scan & analyze the codebase |
| `/content:fast` | Write creative & smart copy (fast) |
| `/content:good` | Write good creative & smart copy |
| `/content:cro` | Optimize current content for conversion |
| `/content:enhance` | Analyze and enhance current copy |
| `/prompt-optimize` | Analyze and optimize a draft prompt (advisory only) |
| `/journal` | Write journal entries |
| `/watzup` | Review recent changes and provide summary |

## Documentation Commands

| Command | Description |
|---------|-------------|
| `/docs` | Look up current documentation via Context7 |
| `/docs:init` | Analyze codebase and create initial documentation |
| `/docs:update` | Analyze codebase and update documentation |
| `/docs:summarize` | Summarize codebase documentation |
| `/update-docs` | Sync documentation with the codebase |
| `/update-codemaps` | Generate token-lean architecture documentation |

## Git Commands

| Command | Description |
|---------|-------------|
| `/git:pr` | Create a pull request |
| `/git:cm` | Stage all files and create a commit |
| `/git:cp` | Stage, commit and push all code |
| `/commit_gen` | Generate conventional commit messages |

## Multi-Agent Commands

| Command | Description |
|---------|-------------|
| `/multi-plan` | Multi-model collaborative planning |
| `/multi-workflow` | Multi-model collaborative development |
| `/multi-backend` | Backend-focused multi-model development |
| `/multi-frontend` | Frontend-focused multi-model development |
| `/multi-execute` | Multi-model collaborative execution |
| `/orchestrate` | Sequential and tmux/worktree orchestration |
| `/devfleet` | Orchestrate parallel Claude Code agents via DevFleet |

## Session Management

| Command | Description |
|---------|-------------|
| `/save-session` | Save current session state |
| `/resume-session` | Resume from most recent session |
| `/sessions` | Manage session history and metadata |
| `/checkpoint` | Create or verify a checkpoint |

## Language-Specific Commands

| Command | Description |
|---------|-------------|
| `/cpp-build` | Fix C++ build errors and CMake issues |
| `/cpp-review` | C++ code review for memory safety and modern idioms |
| `/cpp-test` | TDD workflow for C++ with GoogleTest |
| `/go-build` | Fix Go build errors and vet warnings |
| `/go-review` | Go code review for idiomatic patterns |
| `/go-test` | TDD workflow for Go with table-driven tests |
| `/kotlin-build` | Fix Kotlin/Gradle build errors |
| `/kotlin-review` | Kotlin code review for null safety and coroutines |
| `/kotlin-test` | TDD workflow for Kotlin with Kotest |
| `/rust-build` | Fix Rust build and borrow checker errors |
| `/rust-review` | Rust code review for ownership and lifetimes |
| `/rust-test` | TDD workflow for Rust with cargo-llvm-cov |
| `/python-review` | Python code review for PEP 8 and type hints |
| `/gradle-build` | Fix Gradle build errors for Android and KMP |

## Skill Management

| Command | Description |
|---------|-------------|
| `/skill:add` | Add new reference files or scripts to a skill |
| `/skill:create` | Create a new agent skill |
| `/skill:optimize` | Optimize an existing agent skill |
| `/skill:fix-logs` | Fix agent skill based on logs.txt |
| `/skill-create` | Extract coding patterns from git history |
| `/skill-health` | Show skill portfolio health dashboard |
| `/rules-distill` | Scan skills to extract cross-cutting principles |

## Automation & Learning

| Command | Description |
|---------|-------------|
| `/loop-start` | Start a managed autonomous loop |
| `/loop-status` | Inspect active loop state and progress |
| `/learn` | Extract reusable patterns from current session |
| `/learn-eval` | Extract patterns with self-evaluation |
| `/claw` | Start NanoClaw v2 persistent REPL |

## Instinct Management

| Command | Description |
|---------|-------------|
| `/instinct-status` | Show learned instincts with confidence |
| `/instinct-export` | Export instincts to a file |
| `/instinct-import` | Import instincts from file or URL |
| `/promote` | Promote project-scoped instincts to global |
| `/prune` | Delete pending instincts older than 30 days |
| `/projects` | List known projects and instinct statistics |

## Integration & Utilities

| Command | Description |
|---------|-------------|
| `/integrate:sepay` | Implement SePay.vn payment integration |
| `/integrate:polar` | Implement Polar.sh payment integration |
| `/pm2` | Auto-analyze project and generate PM2 commands |
| `/setup-pm` | Configure preferred package manager |
| `/use-mcp` | Utilize MCP server tools |
