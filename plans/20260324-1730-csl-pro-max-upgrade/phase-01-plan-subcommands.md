# Phase 1: Plan Sub-Commands & Routing Intelligence

**Date**: 2026-03-24
**Priority**: 🔴 Critical
**Status**: ⬜ Pending
**Depends on**: None

## Key Insights

CSL hiện có `/plan` command nhưng thiếu hoàn toàn sub-command routing. claudekit-engineer có 5 plan variants (`fast`, `hard`, `two`, `cro`, `ci`) cho phép user chọn mức độ research phù hợp. Đây là gap lớn nhất ảnh hưởng đến UX.

## Requirements

### Functional
- `/plan` tự phân tích complexity → route đến `:fast` hoặc `:hard`
- `/plan:fast` — chỉ analyze codebase, không research, tạo plan nhanh
- `/plan:hard` — spawn researcher agents + scout + planner, tạo plan chi tiết
- `/plan:two` — tạo 2 approaches song song để so sánh
- `/plan:cro` — CRO-specific planning (25 principles framework)
- `/plan:ci` — GitHub Actions log analysis + fix plan

### Non-Functional
- Plan files output phải theo chuẩn directory structure đã có trong planning skill
- Researcher reports ≤ 150 lines
- plan.md overview ≤ 80 lines
- Phase files có đầy đủ: Context, Overview, Requirements, Architecture, Implementation Steps, Todo, Success Criteria, Risk Assessment

## Architecture

```
commands/
├── plan.md                    # Router: analyze → route to :fast or :hard
└── plan/
    ├── fast.md                # NEW: No research, analyze + plan
    ├── hard.md                # NEW: Research + analyze + plan
    ├── two.md                 # NEW: 2 approaches comparison
    ├── cro.md                 # NEW: CRO planning (25 principles)
    └── ci.md                  # NEW: CI/CD fix planning
```

## Related Code Files

| File | Action | Description |
|------|--------|-------------|
| `commands/plan.md` | **MODIFY** | Add routing logic: analyze complexity → delegate |
| `commands/plan/fast.md` | **CREATE** | Fast plan — no research, just analyze + plan |
| `commands/plan/hard.md` | **CREATE** | Hard plan — research + scout + planner |
| `commands/plan/two.md` | **CREATE** | Two-approach comparison plan |
| `commands/plan/cro.md` | **CREATE** | CRO optimization plan with 25 principles |
| `commands/plan/ci.md` | **CREATE** | CI/CD GitHub Actions analysis + fix plan |
| `.claude-plugin/plugin.json` | **MODIFY** | Register new plan sub-commands |

## Implementation Steps

1. **Create plan/ subdirectory** under commands/
2. **Modify `commands/plan.md`** — Add complexity analysis routing:
   - Simple task (< 3 files, clear scope) → `/plan:fast`
   - Complex task (multi-file, unclear scope, new tech) → `/plan:hard`
   - User can override: explicit `:fast`, `:hard`, `:two`
3. **Create `commands/plan/fast.md`**:
   - Activate `planning` skill
   - Create `plans/YYYYMMDD-HHmm-name/` directory
   - Read codebase docs (development-rules.md, etc.)
   - Call `planner` subagent
   - Output: plan.md + phase files
   - Ask user review
4. **Create `commands/plan/hard.md`**:
   - Activate `planning` skill
   - Create plan directory
   - Spawn max 2 `researcher` agents parallel (≤5 tool calls each, ≤150 lines)
   - Run `/scout` if codebase-summary.md missing or >3 days old
   - Gather research + scout reports → pass to `planner` subagent
   - Output: plan.md + phase files + research/ + scout/ directories
   - Ask user review
5. **Create `commands/plan/two.md`**:
   - Same as `:hard` but planner outputs ≥2 approaches
   - Each approach with trade-offs, pros/cons, recommended choice
6. **Create `commands/plan/cro.md`**:
   - Port 25 CRO principles from claudekit-engineer
   - Support screenshot/URL input via `ai-multimodal` skill
   - CRO-specific plan output
7. **Create `commands/plan/ci.md`**:
   - Accept GitHub Actions URL as argument
   - Read CI logs → analyze → root cause → fix plan
   - Output ≥2 approaches
8. **Update plugin.json** — Add new command paths
9. **Test** — Run `csl doctor` to validate

## Todo
- [ ] Create commands/plan/ directory
- [ ] Modify plan.md with routing logic
- [ ] Create plan/fast.md
- [ ] Create plan/hard.md
- [ ] Create plan/two.md
- [ ] Create plan/cro.md
- [ ] Create plan/ci.md
- [ ] Update plugin.json
- [ ] Validate with csl doctor

## Success Criteria
- `/plan "add auth"` auto-routes to appropriate variant
- `/plan:fast "add auth"` creates plan without research
- `/plan:hard "add auth"` creates plan with research reports
- `/plan:two "add auth"` outputs 2+ approaches
- All plan outputs follow existing directory structure convention

## Risk Assessment
- **LOW**: Sub-commands may not be auto-discovered by plugin.json → verify registration
- **LOW**: Researcher agent spawning may timeout → set max 5 tool calls per researcher

## Security Considerations
- `/plan:ci` reads external GitHub URLs → validate URL format before fetching
- Researcher agents should not execute code, only read/search
