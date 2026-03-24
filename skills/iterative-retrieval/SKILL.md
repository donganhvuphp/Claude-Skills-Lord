---
name: iterative-retrieval
description: Progressive context retrieval for multi-agent workflows. Solves the subagent context problem — agents don't know what files they need until they start working. 4-phase loop with max 3 cycles.
---

> Pairs with: agentic-engineering, autonomous-loops, agent-harness-construction

# Iterative Retrieval

## When to Activate

- Spawning subagents that need codebase context they can't predict upfront
- Encountering "context too large" or "missing context" failures in agent tasks
- Building RAG-like retrieval pipelines for code exploration
- Optimizing token usage in multi-agent orchestration

## The Problem

Subagents start cold. They don't know:
- Which files contain relevant code
- What patterns or naming conventions exist
- What terminology the project uses

Standard approaches fail:
- **Send everything** → exceeds context limits
- **Send nothing** → agent lacks critical info
- **Guess upfront** → often wrong

## The Solution: 4-Phase Loop

```
DISPATCH → EVALUATE → REFINE → LOOP (max 3 cycles)
```

Stop early when you have ≥3 high-relevance files and no critical gaps.

### Phase 1: DISPATCH — broad initial query

```javascript
const query = {
  patterns: ['src/**/*.ts', 'lib/**/*.ts'],
  keywords: ['authentication', 'user', 'session'],
  excludes: ['*.test.ts']
};
const candidates = await retrieveFiles(query);
```

### Phase 2: EVALUATE — score relevance

Score each file 0–1:
- **0.8–1.0** — directly implements target functionality
- **0.5–0.7** — related patterns or types
- **0.2–0.4** — tangentially related
- **0–0.2** — not relevant, exclude

Also identify: what context is still **missing**?

### Phase 3: REFINE — update search criteria

```javascript
{
  patterns: [...prev.patterns, ...extractedPatterns],  // new patterns found
  keywords: [...prev.keywords, ...codebaseTerminology], // actual project terms
  excludes: [...prev.excludes, ...lowRelevancePaths],  // confirmed irrelevant
  focusAreas: missingContextFromEvaluation             // specific gaps to fill
}
```

**Key insight:** First cycle often reveals the project's actual naming conventions (e.g., searching for "rate limit" but codebase uses "throttle").

### Phase 4: LOOP

Repeat with refined criteria. Hard stop at 3 cycles — proceed with best available context.

## Example Traces

**Bug fix context:**
```
Cycle 1: search "token", "auth", "expiry" → auth.ts (0.9), tokens.ts (0.8), user.ts (0.3)
Cycle 2: add "refresh", "jwt"; exclude user.ts → session-manager.ts (0.95), jwt-utils.ts (0.85)
Result: 4 high-relevance files
```

**Terminology mismatch:**
```
Cycle 1: search "rate limit" → 0 matches
Cycle 2: add "throttle", "middleware" (discovered from source) → throttle.ts (0.9)
Result: correct files found via project terminology
```

## Agent Prompt Integration

```markdown
When retrieving context for this task:
1. Start with broad keyword search based on task description
2. Evaluate each file's relevance (0-1) and identify gaps
3. Refine search using patterns and terminology found in retrieved files
4. Repeat max 3 cycles — stop when you have ≥3 files at relevance ≥0.7
5. Exclude files below 0.2 — they won't become relevant
```

## Best Practices

- Start broad, narrow progressively — don't over-specify initial queries
- Track what's **missing** explicitly — gap identification drives refinement
- Stop at "good enough" — 3 high-relevance files beats 10 mediocre ones
- Exclude confidently — low-relevance files waste context budget
