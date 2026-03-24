---
name: skill-creator
description: Guide for creating effective skills that extend Claude's capabilities with specialized knowledge, workflows, or tool integrations. Use when users want to create or update a skill.
license: MIT
---

# Skill Creator

Guide for creating effective agent skills.

## Skill Anatomy

```
skills/tier-N/skill-name/
├── SKILL.md (required, <100 lines)
│   ├── YAML frontmatter (name, description required)
│   └── Markdown instructions
├── references/       # Docs loaded on-demand
├── scripts/          # Executable code
│   └── tests/        # Script tests
└── assets/           # Templates, icons, fonts
```

## Key Rules

- SKILL.md **under 100 lines** — use references/ for details
- Reference files also **under 100 lines** — split if needed (progressive disclosure)
- Descriptions must be specific enough for auto-activation
- Combine related topics (e.g., cloudflare + docker → devops)
- Scripts: prefer Node.js/Python over bash (cross-platform)
- Scripts must have tests
- Scripts respect `.env` priority: `process.env` > skill `.env` > project `.env`

## Creation Process

### 1. Understand with Examples
Ask: What triggers this skill? What are concrete use cases?

### 2. Plan Reusable Contents
Identify scripts, references, assets needed for repeated workflows.

### 3. Initialize
```bash
# Use template or create manually
mkdir -p skills/my-skill/{references,scripts,assets}
```

### 4. Write SKILL.md
Answer: Purpose? When to use? How to use (reference all bundled resources)?

Write in **imperative form** (verb-first), not second person.

### 5. Create Resources
- **scripts/**: Deterministic, reusable automation
- **references/**: Documentation loaded when needed
- **assets/**: Files used in output (templates, images)

### 6. Test & Iterate
Use skill on real tasks → notice gaps → improve → repeat.

## Progressive Disclosure

Three-level loading for context efficiency:
1. **Metadata** (name + description) — Always in context (~100 words)
2. **SKILL.md body** — When skill triggers (<5k words)
3. **Bundled resources** — As needed (unlimited*)

*Scripts execute without loading into context window.

## Quality Checklist

- [ ] SKILL.md under 100 lines
- [ ] Description specific enough for auto-activation
- [ ] References under 100 lines each
- [ ] Scripts have tests
- [ ] Scripts handle .env correctly
- [ ] No duplication between SKILL.md and references
