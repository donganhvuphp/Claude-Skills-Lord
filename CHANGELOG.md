# Changelog

## [2.0.7] - 2026-03-29

### Fixed

- Add missing `model` and `tools` fields to 12 agent frontmatter files
- Add YAML frontmatter to 21 command files missing it
- Fix 3 skill files with invalid/missing frontmatter (google-adk-python, skill-stocktake, template-skill)
- Expand 2 short command files (git/cm.md, git/cp.md) to meet minimum length
- Generate `skills/manifest.json` for 161 actual skills
- Update `validate-manifests.js` to count only directories with SKILL.md
- Update `validate-skills.js` to exclude non-skill meta-directories

### Changed

- Skills count: 170 → 161 (corrected: 9 non-skill directories excluded from count)
- All 6 CI validation tests now pass

---

## [1.1.0] - 2026-03-23

### Added

- **ui-ux-pro-max** (Tier 1) — Design intelligence with 67 styles, 161 color palettes, 57 font pairings, 25 charts, 13 stacks, reasoning engine with 161 industry-specific rules
- **design-system** (Tier 2) — Design token architecture, component specs, HTML slide generation
- **design** (Tier 2) — Logo, corporate identity, icons, banners, slides, social media design with Gemini AI
- **brand** (Tier 2) — Brand identity management with guidelines, asset validation, token sync
- **ui-styling-canvas** (Tier 3) — Canvas-based visual designs, poster generation with bundled fonts
- **banner-design** (Tier 3) — Banner design for social media, ads, web, and print
- **slides** (Tier 3) — HTML presentation slides with copywriting formulas and layout patterns

### Changed

- Skills count: 55 → 62 (7 new UI/UX design skills)
- Tier 1 core skills: 15 → 16 (added ui-ux-pro-max)
- Tier 2 on-demand skills: 25 → 28 (added design-system, design, brand)
- Tier 3 specialty skills: 15 → 18 (added ui-styling-canvas, banner-design, slides)

### Attribution

- [UI/UX Pro Max Skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) by Next Level Builder (MIT)

---

## [1.0.0] - 2026-03-23

### Added

- 22 curated agents (11 ECC + 9 ClaudeKit + 2 new: skill-router, quality-gate)
- 55 skills in 3 tiers (15 Core + 25 On-Demand + 15 Specialty)
- 40+ slash commands with variants (fix, cook, design, bootstrap, etc.)
- Advisory skill router with scoring algorithm
- Quality gate with auto-detect lint/types/tests/security
- 3 install profiles: core (348 files), developer (553), full (609)
- Profile-aware installer with dry-run support
- Skills manifest cataloging all 55 skills
- Curated hooks (security, formatting, type checking)
- Merged workflows with research-first approach
- Test suite (6 validators, zero dependencies)
- CI/CD (GitHub Actions)
- JSON schemas for validation

### Attribution

- [Everything Claude Code](https://github.com/affaan-m/everything-claude-code) by Affaan Mustafa
- [ClaudeKit Engineer](https://github.com/claudekit/claudekit-engineer) by Duy Nguyen
