---
name: docs-seeker
description: "Search technical documentation using scripts to detect query type, fetch from llms.txt sources (context7.com), and analyze results. Use when user needs topic-specific documentation, library/framework docs, GitHub repository analysis, or documentation discovery with automated agent distribution."
version: 3.1.0
---

# Documentation Discovery

Script-first documentation discovery using llms.txt standard.

## Primary Workflow

```bash
# 1. DETECT query type
node scripts/detect-topic.js "<user query>"

# 2. FETCH documentation
node scripts/fetch-docs.js "<user query>"

# 3. ANALYZE results
cat llms.txt | node scripts/analyze-llms-txt.js -
```

## Scripts

| Script | Purpose |
|--------|---------|
| `detect-topic.js` | Classify query → `{topic, library, isTopicSpecific}` |
| `fetch-docs.js` | Fetch from context7.com with fallback chain |
| `analyze-llms-txt.js` | Categorize URLs, recommend agent distribution |

## Quick Start

**Topic query:** "How to use date picker in shadcn?"
```bash
node scripts/detect-topic.js "<query>"
node scripts/fetch-docs.js "<query>"
# Read URLs with WebFetch
```

**General query:** "Documentation for Next.js"
```bash
node scripts/detect-topic.js "<query>"
node scripts/fetch-docs.js "<query>"
cat llms.txt | node scripts/analyze-llms-txt.js -
# Deploy agents per recommendation
```

## References

- [Context7 Patterns](./references/context7-patterns.md)
- [Error Handling](./references/errors.md)
- [Advanced Usage](./references/advanced.md)

## Principles

1. Scripts first — execute, don't construct URLs manually
2. Zero-token overhead — scripts run without context loading
3. Automatic fallback — topic → general → error chains
4. Agent distribution — scripts recommend parallel strategy
