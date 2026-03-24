# Phase 3: Docs Structure & Guide Folder

**Date**: 2026-03-24
**Priority**: 🟡 High
**Status**: ⬜ Pending
**Depends on**: Phase 2 (documentation-management workflow)

## Key Insights

claudekit-engineer có `docs/` phong phú (7 files) + `guide/` folder (user-facing docs). CSL chỉ có 3 docs files. Cần thêm template structure cho projects sử dụng CSL và guide cho users.

## Requirements

### Functional
- Thêm docs templates: `system-architecture.md`, `deployment-guide.md`, `design-guidelines.md`, `project-roadmap.md`
- Tạo `guide/` folder: `COMMANDS.md`, `SKILLS.md`, `AGENTS.md`
- Thêm `examples/` folder: CLAUDE.md templates cho các loại project
- Update docs-manager agent để auto-generate docs theo templates

### Non-Functional
- Templates phải generic, không project-specific
- Guide phải comprehensive nhưng scannable

## Related Code Files

| File | Action | Description |
|------|--------|-------------|
| `docs/system-architecture.md` | **CREATE** | Template for system architecture docs |
| `docs/deployment-guide.md` | **CREATE** | Template for deployment docs |
| `docs/design-guidelines.md` | **CREATE** | Template for design guidelines |
| `docs/project-roadmap.md` | **CREATE** | Template for project roadmap |
| `guide/COMMANDS.md` | **CREATE** | User-facing command guide |
| `guide/SKILLS.md` | **CREATE** | User-facing skill guide |
| `guide/AGENTS.md` | **CREATE** | User-facing agent guide |
| `examples/CLAUDE.md.fullstack` | **CREATE** | Example config for fullstack |
| `examples/CLAUDE.md.python` | **CREATE** | Example config for Python |
| `examples/CLAUDE.md.typescript` | **CREATE** | Example config for TypeScript |

## Implementation Steps

1. **Create docs templates** — Generic templates docs-manager can populate:
   - `system-architecture.md` — Sections: Overview, Tech Stack, Architecture Diagram, Component Map, Data Flow, API Contracts, Infrastructure
   - `deployment-guide.md` — Sections: Prerequisites, Environment Setup, Build, Deploy, Rollback, Monitoring
   - `design-guidelines.md` — Sections: Brand, Colors, Typography, Spacing, Components, Responsive
   - `project-roadmap.md` — Sections: Vision, Phases, Milestones, Dependencies, Risks

2. **Create guide/ folder** — Comprehensive user docs:
   - `COMMANDS.md` — All 60+ commands grouped by category, with examples
   - `SKILLS.md` — All 61 skills by tier, with usage patterns
   - `AGENTS.md` — All 22 agents with roles and when to use

3. **Create examples/** — CLAUDE.md templates per project type (from ECC)

4. **Update manifests** — Add guide/ and examples/ to install modules

## Todo
- [ ] Create 4 docs templates
- [ ] Create guide/COMMANDS.md
- [ ] Create guide/SKILLS.md
- [ ] Create guide/AGENTS.md
- [ ] Create 3 example CLAUDE.md files
- [ ] Update install manifests

## Success Criteria
- `/bootstrap` flow auto-generates docs using templates
- Users can read guide/ to understand all capabilities
- Examples provide quick-start for common project types

## Risk Assessment
- **MEDIUM**: Guide docs may become outdated fast → need automation to regenerate
- **LOW**: Templates may be too generic → users can customize
