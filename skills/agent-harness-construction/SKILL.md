---
name: agent-harness-construction
description: Design and optimize AI agent action spaces, tool definitions, observation formatting, and error recovery for higher completion rates. Use when building or improving agent tool layers.
---

> Pairs with: agentic-engineering, eval-harness, cost-aware-llm-pipeline

# Agent Harness Construction

## When to Activate

- Designing tools for a new agent
- Agent has low completion rate or high retry count
- Tool outputs are ambiguous or lack recovery hints
- Context window is filling up unexpectedly during agent runs
- Choosing between ReAct vs function-calling architecture

## Core Model

Agent output quality is constrained by 4 factors:

| Factor | Key Question |
|--------|-------------|
| Action space quality | Are tools stable, narrow, schema-first? |
| Observation quality | Do responses include status + next steps? |
| Recovery quality | Does every error path have a retry hint? |
| Context budget quality | Is the system prompt minimal and invariant? |

## Action Space Design

1. Use stable, explicit tool names — never generic `run_command`
2. Keep input schemas narrow — one concern per tool
3. Return deterministic output shapes — same keys every time
4. Avoid catch-all tools unless isolation is impossible

**Granularity guide:**

| Granularity | When to Use | Examples |
|-------------|-------------|---------|
| Micro | High-risk, irreversible ops | deploy, migrate, chmod |
| Medium | Common edit/read/search loops | read_file, search_code, patch |
| Macro | Round-trip overhead dominates | full_test_suite, build_project |

## Observation Design

Every tool response must include these fields:

```json
{
  "status": "success | warning | error",
  "summary": "One-line result — what happened",
  "next_actions": ["specific follow-up the agent can take"],
  "artifacts": ["file/path/or/id produced"]
}
```

Missing `next_actions` on error is the #1 cause of agent loops.

## Error Recovery Contract

Every error path must include:
- **Root cause hint** — what went wrong and why
- **Safe retry instruction** — exactly what to change before retrying
- **Explicit stop condition** — when to escalate instead of retrying

## Context Budgeting

1. Keep system prompt minimal and invariant — it loads every turn
2. Move large guidance into skills loaded on demand
3. Prefer file references over inlining long documents
4. Compact at phase boundaries, not arbitrary token thresholds

## Architecture Patterns

| Pattern | Best For |
|---------|---------|
| ReAct | Exploratory tasks with uncertain path |
| Function-calling | Structured deterministic flows |
| **Hybrid (recommended)** | ReAct planning + typed tool execution |

## Preflight Checklist

Before shipping an agent harness:
- [ ] Every tool has a stable name and narrow schema
- [ ] Every tool response includes `status`, `summary`, `next_actions`, `artifacts`
- [ ] Every error path has root cause + retry instruction + stop condition
- [ ] System prompt fits in <500 tokens
- [ ] Context compaction triggers at phase boundaries

## Anti-Patterns

| Pattern | Problem |
|---------|---------|
| Overlapping tool semantics | Agent can't choose, causes loops |
| Opaque tool output | No recovery path on failure |
| Error-only response | No next steps = agent stuck |
| Context overloading | Irrelevant references fill the window |

## Benchmarks to Track

- **Completion rate** — % of tasks finished without human intervention
- **Retries per task** — target < 2 average
- **pass@1 / pass@3** — first-attempt vs 3-attempt success rate
- **Cost per successful task** — tracks efficiency over time
