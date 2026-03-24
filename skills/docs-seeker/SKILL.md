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

## MCP-Native Workflow (when Context7 MCP is configured)

When `resolve-library-id` and `query-docs` MCP tools are available, use this instead of scripts — no local setup needed.

**Activate when:** user asks about a specific library, framework, or API and needs accurate, up-to-date behavior.

### Steps

1. **Resolve** — call `resolve-library-id(libraryName, query)` where `query` is the user's full question
2. **Select** — pick the result with best name match + highest benchmark score; prefer version-specific ID if user mentioned a version
3. **Fetch** — call `query-docs(libraryId, query)` with the selected ID
4. **Answer** — use returned snippets; cite library version when relevant

Max 3 combined calls to `resolve-library-id` + `query-docs` per question.

**Example:** "How do I configure Next.js middleware?"
```
resolve-library-id("Next.js", "configure middleware") → /vercel/next.js
query-docs("/vercel/next.js", "configure middleware") → answer with snippets
```

> Never include API keys or secrets in queries sent to Context7 tools.

## Principles

1. Scripts first — execute, don't construct URLs manually
2. Zero-token overhead — scripts run without context loading
3. Automatic fallback — topic → general → error chains
4. Agent distribution — scripts recommend parallel strategy
5. MCP when available — prefer `resolve-library-id` + `query-docs` if Context7 MCP is configured
