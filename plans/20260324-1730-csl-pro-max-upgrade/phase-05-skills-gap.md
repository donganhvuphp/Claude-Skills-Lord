# Phase 5: Skills Gap Fill

**Date**: 2026-03-24
**Priority**: 🟡 High
**Status**: ⬜ Pending
**Depends on**: None (can parallel)

## Key Insights

So sánh 3 sources, CSL thiếu một số skills có giá trị cao từ claudekit-engineer và ECC:

### Skills cần port (High Value, không duplicate):

| Skill | Source | Tier | Reason |
|-------|--------|------|--------|
| `plan-preview` | claudekit | T2 | Preview plan markdown files qua web server |
| `repomix` | claudekit | T2 | Package repo thành AI-friendly files |
| `chrome-devtools` | claudekit | T2 | Browser automation, screenshots, debugging |
| `canvas-design` | claudekit | T2 | Design visual art (.png, .pdf) |
| `web-design-guidelines` | claudekit | T2 | Web Interface Guidelines compliance |
| `docs-seeker` | claudekit | T2 | Search llms.txt documentation sources |
| `skill-creator` | claudekit | T2 | Guide for creating new skills |
| `continuous-learning-v2` | ECC | T2 | Instinct-based learning system |

### Skills CSL đã có tương đương (SKIP):
- `document-skills` (docx/pdf/pptx/xlsx) — CSL không cần, quá niche
- `shopify` — CSL đã có ở T3
- `threejs` — CSL đã có ở T3
- `google-adk-python` — CSL đã có ở T2
- `better-auth` — CSL đã có ở T2

## Requirements

### Functional
- Port 8 skills liệt kê trên vào CSL tier system
- Mỗi skill có SKILL.md + references/ (nếu cần)
- Register trong `manifests/skills.json`
- Continuous-learning-v2 cần simplify: bỏ YAML instincts, dùng markdown

### Non-Functional
- Skills phải self-contained (không depend on external Python/Flask trừ plan-preview)
- Skill content phải updated cho CSL context (không reference claudekit paths)

## Related Code Files

| File | Action | Description |
|------|--------|-------------|
| `skills/tier-2/plan-preview/SKILL.md` | **CREATE** | Markdown plan preview server |
| `skills/tier-2/repomix/SKILL.md` | **CREATE** | Repo packaging for LLM |
| `skills/tier-2/chrome-devtools/SKILL.md` | **CREATE** | Browser automation skill |
| `skills/tier-2/canvas-design/SKILL.md` | **CREATE** | Visual art design |
| `skills/tier-2/web-design-guidelines/SKILL.md` | **CREATE** | Web interface compliance |
| `skills/tier-2/docs-seeker/SKILL.md` | **CREATE** | Documentation search |
| `skills/tier-2/skill-creator/SKILL.md` | **CREATE** | Skill creation guide |
| `skills/tier-2/continuous-learning/SKILL.md` | **MODIFY** | Upgrade to v2 with instincts |
| `manifests/skills.json` | **MODIFY** | Register 7 new skills |

## Implementation Steps

1. **Port `plan-preview`** — Copy from claudekit-engineer, update paths
   - Includes Python Flask server script
   - Dark sidebar, search, Prism.js syntax highlighting
   - Add to install as optional module (requires Flask)

2. **Port `repomix`** — Copy SKILL.md + references
   - Package repo into AI-friendly format
   - Customizable patterns, token counting

3. **Port `chrome-devtools`** — Copy SKILL.md + references
   - Puppeteer-based browser automation
   - Screenshots, performance monitoring, DOM inspection

4. **Port `canvas-design`** — Copy SKILL.md
   - Design visual art with canvas APIs
   - Output .png and .pdf

5. **Port `web-design-guidelines`** — Copy SKILL.md
   - Web Interface Guidelines compliance checker
   - Accessibility audit, design review

6. **Port `docs-seeker`** — Copy SKILL.md + references
   - Search llms.txt sources (context7.com)
   - Auto-distribute documentation to agents

7. **Port `skill-creator`** — Copy SKILL.md
   - Guide for creating effective skills
   - Template structure, best practices

8. **Upgrade `continuous-learning`** — Merge v2 concepts from ECC:
   - Add instinct capture (simplified markdown, not YAML)
   - Project-scoped learning
   - Confidence scoring (high/medium/low instead of 0.0-1.0)
   - Auto-promote patterns seen in 2+ projects

9. **Update `manifests/skills.json`** — Register all new skills

## Todo
- [ ] Port plan-preview skill
- [ ] Port repomix skill
- [ ] Port chrome-devtools skill
- [ ] Port canvas-design skill
- [ ] Port web-design-guidelines skill
- [ ] Port docs-seeker skill
- [ ] Port skill-creator skill
- [ ] Upgrade continuous-learning to v2
- [ ] Update manifests/skills.json

## Success Criteria
- All 8 skills discoverable via `/route` skill-router
- `continuous-learning` captures instincts during sessions
- `plan-preview` serves plan files on localhost
- All skills have proper SKILL.md with frontmatter

## Risk Assessment
- **MEDIUM**: plan-preview requires Python Flask → make it optional with clear install instructions
- **LOW**: chrome-devtools requires Puppeteer → document as optional dependency
- **LOW**: continuous-learning v2 may be too complex → start simple, iterate
