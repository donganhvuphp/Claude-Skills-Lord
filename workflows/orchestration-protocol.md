# Orchestration Protocol

## Sequential Chaining

Chain subagents when tasks have dependencies or require outputs from previous steps.

### Common Sequential Patterns

**Feature Development:**
```
Planning → Implementation → Testing → Code Review → Documentation
```
- `planner` creates plan with phases
- Main agent implements per plan
- `tester` runs tests, `debugger` fixes failures
- `code-reviewer` reviews final code
- `docs-manager` updates documentation

**New System Components:**
```
Research → Design → Code → Test → Document
```
- `researcher` agents investigate approaches (max 2 parallel, ≤5 calls each)
- `planner` designs architecture
- Main agent codes solution
- `tester` validates, `code-reviewer` reviews
- `docs-manager` documents

**Bug Fix:**
```
Debug → Fix → Test → Review
```
- `debugger` identifies root cause
- Main agent implements fix
- `tester` validates fix + regression
- `code-reviewer` reviews changes

### Rules
- Each agent completes fully before the next begins
- Pass context and outputs between agents in the chain
- If any agent fails, halt chain and investigate before continuing

## Parallel Execution

Spawn multiple subagents simultaneously for independent tasks.

### Common Parallel Patterns

**Research Phase:**
```
researcher-01 ──┐
researcher-02 ──┤→ planner (gathers all reports)
scout ──────────┘
```
- Max 2 researcher agents, each researching different aspects
- Scout searches codebase independently
- Planner receives all reports and synthesizes

**Code + Tests + Docs:**
```
main-agent (code) ──┐
tester (tests) ─────┤→ code-reviewer (review all)
docs-manager ───────┘
```
- Only when implementing separate, non-conflicting components
- Each agent works on different files

**Post-Implementation:**
```
project-manager (update plan) ──┐
docs-manager (update docs) ─────┤→ report to user
```

### Conflict Prevention Rules
- **File locking**: No two agents modify the same file simultaneously
- **Directory isolation**: Assign different directories to parallel agents
- **Merge strategy**: Plan integration points before parallel execution begins
- **Status sync**: Each agent reports completion before moving to integration

## Agent Handoff Protocol

When passing work between agents:
1. **Provide file paths** — not file contents (saves tokens)
2. **Summarize findings** — key decisions, blockers, unresolved questions
3. **Set clear scope** — what the receiving agent should do and NOT do
4. **Include constraints** — max tool calls, output line limits, token budget

## Escalation Protocol

- If agent encounters blocker → report to main agent immediately
- If agent exceeds scope → stop and ask for guidance
- If agent finds critical security issue → halt all work, report to user
