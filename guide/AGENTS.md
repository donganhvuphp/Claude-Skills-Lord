# CSL Agent Reference

## 22 Specialized Agents

### Planning & Architecture
| Agent | Role | When to Use |
|-------|------|-------------|
| **planner** | Technical planning with 9 mental models | Starting features, breaking down complex tasks |
| **architect** | System design & scalability | Designing new systems, evaluating architectures |
| **brainstormer** | Solution ideation (YAGNI/KISS/DRY) | Exploring approaches, debating trade-offs |
| **skill-router** | Advisory skill recommendation | Finding relevant skills for a task |

### Code Quality
| Agent | Role | When to Use |
|-------|------|-------------|
| **code-reviewer** | Quality assessment + confidence filtering | After implementation, before merge |
| **security-reviewer** | OWASP vulnerability detection | After writing auth, API, input handling code |
| **quality-gate** | Output validation (lint, types, tests) | Before claiming work is done |
| **refactor-cleaner** | Dead code cleanup (knip, depcheck) | After major changes, during maintenance |

### Testing
| Agent | Role | When to Use |
|-------|------|-------------|
| **tdd-guide** | TDD workflow (RED-GREEN-REFACTOR) | New features with test-first approach |
| **e2e-runner** | Playwright E2E testing | Testing user flows end-to-end |

### Debugging & Build
| Agent | Role | When to Use |
|-------|------|-------------|
| **debugger** | Root cause investigation | Bugs, performance issues, CI failures |
| **build-error-resolver** | Build/compile error fixing | Build failures, type errors |

### Development
| Agent | Role | When to Use |
|-------|------|-------------|
| **scout** | Parallel codebase exploration | Finding files, understanding project structure |
| **ui-ux-designer** | UI/UX design, wireframes | Frontend implementation, design review |
| **database-admin** | Database optimization | Query optimization, schema design, migrations |
| **copywriter** | Conversion-focused content | Marketing copy, landing pages, emails |

### Management
| Agent | Role | When to Use |
|-------|------|-------------|
| **project-manager** | Progress tracking, coordination | Updating plans, tracking milestones |
| **docs-manager** | Documentation management | Creating/updating project docs |
| **git-manager** | Version control operations | Commits, branches, pull requests |

### Specialized
| Agent | Role | When to Use |
|-------|------|-------------|
| **loop-operator** | Autonomous workflow loops | Running continuous dev loops safely |
| **chief-of-staff** | Multi-channel communication triage | Email/Slack/LINE/Messenger management |
| **harness-optimizer** | Self-optimization of harness config | Improving reliability and cost |

## How Agents Work

Agents are spawned as subprocesses with specific tools and capabilities. They work autonomously and report results back to the main agent.

### Orchestration Patterns

**Sequential**: Planning → Implementation → Testing → Review
**Parallel**: Research agents + Scout (independent tasks)

See `workflows/orchestration-protocol.md` for detailed patterns.
