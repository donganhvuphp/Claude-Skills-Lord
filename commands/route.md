---
description: Analyze your current task and recommend the most relevant skills from the SkillLord catalog
---

# Route — Skill Recommendation

Invoke the **skill-router** agent to analyze your request and recommend relevant skills.

## Usage

```
/route <describe your task>
```

## Process

1. The skill-router agent reads the skill manifest
2. Analyzes your task description
3. Returns ranked skill recommendations with confidence scores
4. You decide which skills to prioritize

## Example

```
/route I need to add OAuth2 authentication to my Next.js app
```

Output: Recommended skills ranked by relevance (better-auth, frontend-development, api-design, security-patterns...)
