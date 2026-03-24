# CSL PRO MAX Upgrade — Cherry-Pick Best of claudekit-engineer & ECC

**Created**: 2026-03-24
**Status**: 🟢 Implemented
**Approach**: Phương án A — Cherry-pick tinh tuý, không duplicate

## Overview

Port những tính năng tốt nhất từ **claudekit-engineer-main** và **everything-claude-code (ECC)** vào **claude-skill-lord (CSL)** v1.5.1 → v2.0.0.

**Sources**:
- claudekit-engineer-main: 60 commands, 16 agents, 37 skills, 4 workflows
- everything-claude-code: 60 commands, 28 agents, 119 skills, multi-IDE adapters
- CSL current: 60 commands, 22 agents, 61 skills, 3 workflows

**Nguyên tắc**: YAGNI, KISS, DRY — chỉ port những gì thực sự tạo giá trị.

## Implementation Phases

| # | Phase | Status | Priority | Link |
|---|-------|--------|----------|------|
| 1 | Plan Sub-Commands & Routing Intelligence | ✅ Done | 🔴 Critical | [phase-01](phase-01-plan-subcommands.md) |
| 2 | Workflow Improvements | ✅ Done | 🔴 Critical | [phase-02](phase-02-workflow-improvements.md) |
| 3 | Docs Structure & Guide Folder | ✅ Done | 🟡 High | [phase-03](phase-03-docs-guide.md) |
| 4 | Hook & Notification Enhancements | ✅ Done | 🟡 High | [phase-04](phase-04-hooks-notifications.md) |
| 5 | Skills Gap Fill | ✅ Done | 🟡 High | [phase-05](phase-05-skills-gap.md) |
| 6 | Command Routing Intelligence | ✅ Done | 🟠 Medium | [phase-06](phase-06-command-routing.md) |
| 7 | Enterprise & Advanced Features (ECC) | ✅ Done | 🟠 Medium | [phase-07](phase-07-enterprise-features.md) |

## Key Decisions
- Port planning sub-commands trước vì đây là pain point lớn nhất
- Không port multi-IDE adapter (Cursor/Codex/Kiro/OpenCode) — CSL là Claude Code plugin
- Không port language-specific review agents — CSL dùng code-reviewer chung
- Port instinct-based learning concept nhưng đơn giản hoá

## Success Criteria
- [ ] `/plan:fast`, `/plan:hard`, `/plan:two` hoạt động đúng
- [ ] `/cook`, `/fix`, `/bootstrap` có routing thông minh
- [ ] Workflow documentation-management được thêm
- [ ] Hook system có notification (Discord/Telegram)
- [ ] Skills gap từ claudekit-engineer được lấp đầy
- [ ] Tất cả tests pass (`csl doctor`)
- [ ] Version bump → 2.0.0

## Unresolved Questions
- Notification hooks nên là optional module hay built-in?
- Plan preview server (Python Flask) có phù hợp với npm package không?
- Continuous learning instincts nên ở tier mấy?
