# Documentation Management Protocol

## Documentation Structure

Keep project docs in `./docs/` folder:
```
docs/
├── project-overview-pdr.md     # Product Design Review
├── code-standards.md           # Code conventions & best practices
├── codebase-summary.md         # Component structure summary
├── design-guidelines.md        # UI/UX design guidelines
├── deployment-guide.md         # Deployment procedures
├── system-architecture.md      # Architecture & design decisions
└── project-roadmap.md          # Roadmap, milestones, progress
```

## Automatic Update Triggers

The `project-manager` agent MUST update documentation when:

| Trigger | Required Updates |
|---------|-----------------|
| Feature implemented | Update roadmap progress + codebase-summary |
| Major milestone reached | Review roadmap phases + update success metrics |
| Bug fixed | Document fix in changelog with severity & impact |
| Security update | Record security improvements & version updates |
| Architecture change | Update system-architecture + code-standards |
| Breaking change | Document in deployment-guide + codebase-summary |
| New dependency added | Update system-architecture + deployment-guide |

## Update Protocol

### Before Updates
- Always read current docs status first
- Check what changed since last update
- Identify which docs are affected

### During Updates
- Maintain version consistency
- Use proper formatting (headers, tables, code blocks)
- Keep docs concise — sacrifice grammar for brevity
- Cross-reference related docs with links

### After Updates
- Verify links and dates are accurate
- Ensure updates align with actual implementation
- Check no stale information remains

### Quality Check
- Docs match current codebase state
- No outdated references to removed features
- Architecture diagrams reflect current design
- All commands and APIs documented correctly

## Agent Responsibilities

| Agent | Docs Responsibility |
|-------|-------------------|
| `docs-manager` | Create/update docs content, maintain structure |
| `project-manager` | Update roadmap, track progress, trigger doc updates |
| `code-reviewer` | Flag undocumented public APIs |
| `planner` | Create plan docs in `./plans/` directory |

## Roadmap & Changelog

- **Project Roadmap** (`./docs/project-roadmap.md`): Living document tracking phases, milestones, progress percentages
- **Codebase Summary** (`./docs/codebase-summary.md`): Component inventory, file counts, architecture notes
- Keep both updated after every significant change
