# Phase 6: Command Routing Intelligence

**Date**: 2026-03-24
**Priority**: 🟠 Medium
**Status**: ⬜ Pending
**Depends on**: Phase 1 (plan sub-commands as reference pattern)

## Key Insights

claudekit-engineer có smart routing trong `/cook`, `/fix`, `/bootstrap` commands — tự phân tích complexity rồi delegate. CSL có commands nhưng routing logic yếu hơn. Cần upgrade routing cho consistency.

## Requirements

### Functional
- `/cook` auto-routes: simple → direct implement, complex → research → plan → implement
- `/fix` auto-routes: simple → `/fix:fast`, complex → `/fix:hard`
- `/bootstrap` enhanced: thêm wireframe & design phase từ claudekit-engineer
- Tất cả routers follow cùng pattern: analyze → enhance prompt → delegate

### Non-Functional
- Routing decision phải transparent (log lý do chọn variant)
- Override luôn available (user có thể force `:fast` hoặc `:hard`)

## Related Code Files

| File | Action | Description |
|------|--------|-------------|
| `commands/cook.md` | **MODIFY** | Add orchestration flow from claudekit-engineer |
| `commands/fix.md` | **MODIFY** | Add complexity routing logic |
| `commands/bootstrap.md` | **MODIFY** | Add wireframe & design phase |
| `commands/cook/auto.md` | **MODIFY** | Enhance auto mode |

## Implementation Steps

1. **Upgrade `commands/cook.md`** — Port full orchestration from claudekit-engineer:
   - Step A: Fulfill request (ask details, activate skills)
   - Step B: Research (researcher agents parallel)
   - Step C: Plan (planner subagent, plan directory)
   - Step D: Implementation (general agent per plan)
   - Step E: Testing (real tests, no mocks just to pass)
   - Step F: Code Review (code-reviewer verification gate)
   - Step G: Documentation (project-manager + docs-manager parallel)
   - Step H: Onboarding (guide user step by step)
   - Step I: Final Report (summary + next steps)

2. **Upgrade `commands/fix.md`** — Add routing:
   - If markdown plan exists → use `/code <plan-path>`
   - Else: analyze complexity → `/fix:fast` or `/fix:hard`
   - Enhanced prompt generation from issue description

3. **Upgrade `commands/bootstrap.md`** — Add design phase:
   - Git init check
   - Tech stack selection (research + user approval)
   - Planning phase (with plan directory)
   - **NEW**: Wireframe & Design phase (ui-ux-designer + ai-multimodal)
   - Implementation, Testing, Code Review
   - Documentation generation (5 doc files)
   - Onboarding + Final Report

4. **Upgrade `commands/cook/auto.md`** — Match claudekit auto behavior

## Todo
- [ ] Upgrade cook.md with full orchestration
- [ ] Upgrade fix.md with routing logic
- [ ] Upgrade bootstrap.md with design phase
- [ ] Upgrade cook/auto.md
- [ ] Test all routing paths

## Success Criteria
- `/cook "add dark mode"` → research → plan → implement → test → review → docs
- `/fix "button broken"` → auto-detects simple → fix:fast
- `/bootstrap "saas app"` → includes wireframe/design phase option

## Risk Assessment
- **MEDIUM**: Full cook orchestration may be too slow for small tasks → routing must be fast for simple cases
- **LOW**: Design phase in bootstrap requires ai-multimodal → make optional
