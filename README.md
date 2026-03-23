# SkillLord

**Curated best-of-both Claude Code plugin — intelligent skill routing meets battle-tested agents.**

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Agents](https://img.shields.io/badge/agents-22-purple)
![Skills](https://img.shields.io/badge/skills-55-orange)
![Commands](https://img.shields.io/badge/commands-40%2B-red)

---

## Features

- **22 curated agents** — cherry-picked from ECC + ClaudeKit, enhanced with merged capabilities
- **55 skills in 3 tiers** — Core (always loaded), On-Demand, Specialty
- **40+ slash commands** — covering planning, coding, testing, debugging, design, and more
- **Advisory skill router** — `/route` analyzes your task and recommends relevant skills
- **Quality gate** — `/audit` validates lint, types, tests, security, and plan completeness
- **3 install profiles** — core, developer, full — install only what you need
- **Curated hooks** — security, auto-formatting, type checking
- **100% free and open-source** — MIT licensed

## Quick Start

```bash
# Clone and install to your project
git clone https://github.com/donganhvuphp/Claude-Skills-Lord.git
cd skilllord
node scripts/install.js developer --target /path/to/your/project

# Or dry-run to see what gets installed
node scripts/install.js full --dry-run
```

## Install Profiles

| Profile | Skills | Agents | Best For |
|---------|--------|--------|----------|
| `core` | 15 (Tier 1) | 7 core | Small projects, quick setup |
| `developer` | 40 (Tier 1+2) | 22 all | Full development workflow |
| `full` | 55 (all tiers) | 22 all | Multi-language, enterprise |

## Architecture

```
┌──────────────────────────────────────────┐
│             SkillLord Plugin              │
├──────────┬───────────┬───────────────────┤
│  Agents  │ Commands  │      Skills       │
│   (22)   │   (40+)   │  (55, 3 Tiers)   │
├──────────┴───────────┴───────────────────┤
│          Intelligence Layer               │
│   ┌────────────┐   ┌─────────────────┐   │
│   │   Skill    │   │    Quality      │   │
│   │   Router   │   │    Gate         │   │
│   └────────────┘   └─────────────────┘   │
├──────────────────────────────────────────┤
│    Hooks  │  Workflows  │  Manifests     │
└──────────────────────────────────────────┘
```

## Key Commands

| Command | Description |
|---------|-------------|
| `/plan` | Create implementation plan |
| `/code` | Start coding from plan |
| `/test` | Run and validate tests |
| `/fix` | Fix issues (variants: fast, hard, ci, test, types, ui, logs) |
| `/cook` | Implement features end-to-end |
| `/tdd` | Test-driven development workflow |
| `/debug` | Deep root-cause investigation |
| `/route` | Get skill recommendations for your task |
| `/audit` | Run quality gate checks |
| `/review` | Code review with confidence filtering |
| `/scout` | Search and explore codebase |
| `/bootstrap` | Initialize new projects |
| `/design` | Create UI designs (variants: fast, good, 3d) |
| `/e2e` | Generate and run E2E tests |
| `/brainstorm` | Explore solutions and trade-offs |

See [Command Reference](docs/COMMAND-REFERENCE.md) for the full list.

## Agents

| Agent | Role |
|-------|------|
| planner | Technical planning with 9 mental models |
| architect | System design and scalability |
| code-reviewer | Quality assessment with >80% confidence filtering |
| security-reviewer | OWASP vulnerability detection |
| tdd-guide | RED-GREEN-REFACTOR workflow |
| debugger | Root cause investigation methodology |
| build-error-resolver | Build and compile error fixing |
| e2e-runner | Playwright E2E test generation |
| refactor-cleaner | Dead code cleanup |
| git-manager | Version control operations |
| docs-manager | Documentation management |
| project-manager | Progress tracking |
| ui-ux-designer | UI/UX design |
| database-admin | Database optimization |
| brainstormer | Solution ideation (YAGNI/KISS/DRY) |
| copywriter | Conversion-focused content |
| scout | Parallel codebase exploration |
| loop-operator | Autonomous development loops |
| chief-of-staff | Multi-channel coordination |
| harness-optimizer | Agent self-optimization |
| skill-router | Advisory skill recommendations |
| quality-gate | Output validation |

## Skill Tiers

**Tier 1 — Core (15):** debugging, code-review, tdd-workflow, testing, backend-development, frontend-development, web-frameworks, ui-styling, react-best-practices, databases, api-design, devops, security-patterns, sequential-thinking, research

**Tier 2 — On-Demand (25):** ai-multimodal, better-auth, payment-integration, continuous-learning, codebase-onboarding, autonomous-loops, mcp-management, and 18 more

**Tier 3 — Specialty (15):** python-patterns, golang-patterns, rust-patterns, kotlin-patterns, django-patterns, pytorch-patterns, shopify, threejs, and 7 more

See [Skill Catalog](docs/SKILL-CATALOG.md) for full descriptions and tags.

## Testing

```bash
node tests/run-all.js
```

## Attribution

Built on the shoulders of giants:

> [Everything Claude Code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa — foundation agents, skills, hooks
>
> [ClaudeKit Engineer](https://github.com/claudekit/claudekit-engineer) by Duy Nguyen — mental models, strategic depth, unique agents

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

[MIT](LICENSE)
