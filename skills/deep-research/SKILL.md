---
name: deep-research
description: Multi-source deep research using firecrawl and exa MCPs. Searches the web, reads key sources in full, synthesizes findings, and delivers cited reports with source attribution.
---

> Pairs with: research, sequential-thinking, planning

# Deep Research

## When to Activate

- User asks to research any topic in depth
- Competitive analysis, technology evaluation, market sizing
- Due diligence on companies, technologies, or architectural choices
- Any question requiring synthesis from multiple sources
- User says "research", "deep dive", "investigate", "what's the current state of"

## MCP Requirements

At least one of:
- **firecrawl** — `firecrawl_search`, `firecrawl_scrape`, `firecrawl_crawl`
- **exa** — `web_search_exa`, `web_search_advanced_exa`, `crawling_exa`

Both together give best coverage. Without either MCP, fall back to `docs-seeker` + `WebFetch` with a note that coverage is limited.

## Workflow

### Step 1: Understand the Goal
Ask 1–2 quick clarifying questions:
- "What's your goal — learning, making a decision, or writing something?"
- "Any specific angle or depth?"

If user says "just research it" — skip ahead with reasonable defaults.

### Step 2: Plan Sub-Questions
Break topic into 3–5 research sub-questions. Example:

Topic: "Impact of AI on healthcare"
1. Main AI applications in healthcare today?
2. Measured clinical outcomes?
3. Regulatory challenges?
4. Leading companies and market position?
5. Market size and growth trajectory?

### Step 3: Multi-Source Search

For each sub-question:

```
# firecrawl
firecrawl_search(query: "<keywords>", limit: 8)

# exa
web_search_exa(query: "<keywords>", numResults: 8)
web_search_advanced_exa(query: "<keywords>", numResults: 5, startPublishedDate: "2025-01-01")
```

**Strategy:** 2–3 keyword variations per sub-question. Mix general + news queries. Aim for 15–30 unique sources. Prioritize: academic/official/reputable news > blogs > forums.

### Step 4: Deep-Read Key Sources

For the 3–5 most promising URLs, fetch full content:

```
firecrawl_scrape(url: "<url>")          # firecrawl
crawling_exa(url: "<url>", tokensNum: 5000)  # exa
```

Don't rely only on search snippets for high-stakes claims.

### Step 5: Parallel Research (broad topics)

Spawn 3 agents in parallel:
- Agent 1: sub-questions 1–2
- Agent 2: sub-questions 3–4
- Agent 3: sub-question 5 + cross-cutting themes

Main session synthesizes into final report.

### Step 6: Synthesize — Report Structure

```markdown
# [Topic]: Research Report
*Generated: [date] | Sources: [N] | Confidence: High/Medium/Low*

## Executive Summary
[3–5 sentences covering key findings]

## 1. [First Major Theme]
[Findings with inline citations — ([Source Name](url))]

## Key Takeaways
- [Actionable insight 1]
- [Actionable insight 2]

## Sources
1. [Title](url) — one-line summary

## Methodology
Searched N queries. Analyzed M sources. Sub-questions: [list]
```

**Delivery:** Short topics → full report in chat. Long reports → executive summary in chat + full report saved to file.

## Quality Rules

1. **Every claim needs a source** — no unsourced assertions
2. **Cross-reference** — flag single-source claims as unverified
3. **Recency matters** — prefer sources from last 12 months
4. **Acknowledge gaps** — if a sub-question had poor coverage, say so
5. **No hallucination** — "insufficient data found" beats making something up
6. **Separate fact from inference** — label estimates and projections clearly
