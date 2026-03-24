# Phase 2: Workflow Improvements

**Date**: 2026-03-24
**Priority**: 🔴 Critical
**Status**: ⬜ Pending
**Depends on**: None (can parallel with Phase 1)

## Key Insights

CSL có 3 workflows (primary, development-rules, orchestration-protocol) nhưng thiếu **documentation-management workflow** và workflows hiện tại quá ngắn (15-51 lines) so với claudekit-engineer (hàng trăm lines). Cần enrich nội dung và thêm workflow mới.

## Requirements

### Functional
- Thêm `documentation-management.md` workflow — quản lý docs tự động
- Enrich `orchestration-protocol.md` — thêm patterns từ claudekit-engineer & ECC
- Enrich `primary-workflow.md` — thêm chi tiết về cook/bootstrap orchestration
- Update CLAUDE.md để reference workflow mới

### Non-Functional
- Workflows phải actionable, không abstract
- Mỗi workflow có clear triggers và expected outputs

## Architecture

```
workflows/
├── primary-workflow.md           # ENRICH: Add cook/bootstrap orchestration details
├── development-rules.md          # ENRICH: Add documentation update triggers
├── orchestration-protocol.md     # ENRICH: Add sequential/parallel patterns detail
└── documentation-management.md   # NEW: From claudekit-engineer
```

## Related Code Files

| File | Action | Description |
|------|--------|-------------|
| `workflows/documentation-management.md` | **CREATE** | Docs management protocol |
| `workflows/orchestration-protocol.md` | **MODIFY** | Enrich with detailed patterns |
| `workflows/primary-workflow.md` | **MODIFY** | Add orchestration flow details |
| `CLAUDE.md` | **MODIFY** | Reference documentation-management workflow |

## Implementation Steps

1. **Create `documentation-management.md`** — Port from claudekit-engineer:
   - Roadmap & changelog maintenance rules
   - Automatic update triggers (after feature, milestone, bug fix, security)
   - Documentation structure convention (`./docs/` folder)
   - Update protocol (before/during/after/quality check)
   - project-manager agent responsibilities

2. **Enrich `orchestration-protocol.md`**:
   - Sequential chaining patterns (Planning → Implementation → Testing → Review)
   - Parallel execution patterns (Research + Scout, Code + Tests + Docs)
   - Agent handoff protocol — context passing between agents
   - Conflict prevention — no file conflicts in parallel
   - Merge strategy — integration points before execution

3. **Enrich `primary-workflow.md`**:
   - Add `/cook` orchestration flow (research → plan → implement → test → review → docs)
   - Add `/bootstrap` orchestration flow (research → tech stack → plan → wireframe → implement → test → docs)
   - Add verification gates between stages
   - Add rollback protocol if stage fails

4. **Update `CLAUDE.md`** — Add documentation-management to workflows section

## Todo
- [ ] Create documentation-management.md
- [ ] Enrich orchestration-protocol.md
- [ ] Enrich primary-workflow.md
- [ ] Update CLAUDE.md references

## Success Criteria
- Documentation-management workflow triggers docs-manager after feature implementations
- Orchestration protocol clearly defines when to use sequential vs parallel
- Primary workflow covers cook + bootstrap flows end-to-end

## Risk Assessment
- **LOW**: Enriching workflows may bloat context → keep each under 200 lines
- **LOW**: documentation-management may conflict with existing docs-manager agent behavior → align
