# Phase 7: Enterprise & Advanced Features from ECC

**Date**: 2026-03-24
**Priority**: 🟠 Medium
**Status**: ⬜ Pending
**Depends on**: Phase 4 (hooks), Phase 5 (skills)

## Key Insights

ECC (everything-claude-code) có nhiều tính năng enterprise-grade mà CSL có thể adopt ở mức đơn giản hoá:

1. **Identity system** — Technical profile hints
2. **MCP config templates** — Pre-configured MCP server examples
3. **Statusline configs** — Cross-platform status display
4. **Hook README** — Comprehensive hook documentation
5. **Research playbook** — Documentation-heavy task handling

**KHÔNG port** (quá phức tạp, không cần cho CSL):
- Multi-IDE adapters (Cursor, Codex, Kiro, OpenCode)
- Enterprise controls & governance
- Team config sync
- ECC-tools module tracking system
- Language-specific review agents

## Requirements

### Functional
- Thêm `.mcp.json.example` — Pre-configured MCP servers template
- Thêm statusline configs (JS, SH, PS1)
- Thêm `hooks/README.md` — Hook documentation
- Thêm identity.json concept (simplified: preferred style, domains)
- Thêm research playbook (simplified) vào planning skill references

### Non-Functional
- Tất cả additions phải optional — không break existing installs
- MCP config phải document-only (example file, not auto-install)

## Related Code Files

| File | Action | Description |
|------|--------|-------------|
| `.mcp.json.example` | **CREATE** | MCP server config template |
| `hooks/README.md` | **CREATE** | Comprehensive hook documentation |
| `assets/statusline.js` | **CREATE** | Node.js statusline |
| `assets/statusline.sh` | **CREATE** | Bash statusline |
| `skills/tier-2/planning/references/research-playbook.md` | **CREATE** | Research methodology guide |

## Implementation Steps

1. **Create `.mcp.json.example`** — Template with common MCP servers:
   - context7 (documentation)
   - sequential-thinking (problem solving)
   - Placeholder for: github, slack, obsidian

2. **Create `hooks/README.md`** — Port from ECC:
   - Hook types (PreToolUse, PostToolUse, Stop)
   - Exit code semantics (0=pass, 2=block)
   - How to add custom hooks
   - Profile system documentation
   - Troubleshooting guide

3. **Create statusline configs** — Port from claudekit-engineer:
   - `statusline.js` — Node.js version (shows project, branch, agent count)
   - `statusline.sh` — Bash version (lightweight)
   - Place in `assets/` for optional copy

4. **Add research playbook** to planning skill references:
   - When to research (new tech, unfamiliar domain, security-sensitive)
   - How to research (max 2 agents, ≤5 calls each, ≤150 lines output)
   - Source evaluation (official docs > blog posts > SO)
   - Documentation-heavy task protocol

5. **Update manifests** — Add new assets to optional install module

## Todo
- [ ] Create .mcp.json.example
- [ ] Create hooks/README.md
- [ ] Create statusline configs
- [ ] Add research playbook reference
- [ ] Update manifests

## Success Criteria
- Users can copy .mcp.json.example and customize
- hooks/README.md fully documents hook system
- Statusline shows useful project info
- Research playbook improves plan quality

## Risk Assessment
- **LOW**: All additions are optional, no breaking changes
- **LOW**: Statusline may not work on all terminals → test macOS + Linux

## Security Considerations
- `.mcp.json.example` must NOT contain real API keys — only placeholders
- Statusline must not leak sensitive info (no API keys, passwords)
