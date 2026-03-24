---
name: blueprint
description: Turn a one-line objective into a multi-session construction plan. Each step is self-contained with context brief, task list, verification commands, and exit criteria — so a fresh agent can execute any step cold.
---

> Pairs with: planning, sequential-thinking, autonomous-loops

# Blueprint — Construction Plan Generator

## When to Activate

- Breaking a large feature into multiple PRs with clear dependency order
- Planning a refactor or migration spanning multiple sessions
- Coordinating parallel workstreams across sub-agents
- Any task where context loss between sessions would cause rework

**Do NOT use** for tasks completable in a single PR, fewer than 3 tool calls, or when user says "just do it."

## How It Works — 5-Phase Pipeline

### 1. Research
Pre-flight checks: git status, project structure, existing plans, memory files. Gather context before designing anything.

### 2. Design
Break the objective into one-PR-sized steps (typically 3–12). For each step assign:
- Dependency edges (what must be done first)
- Parallel/serial ordering
- Model tier (strongest for architecture, default for implementation)
- Rollback strategy

### 3. Draft
Write a self-contained Markdown plan to `plans/`. Every step includes:
- **Context brief** — everything a fresh agent needs to start cold
- **Task list** — ordered, specific actions
- **Verification commands** — how to confirm the step is done
- **Exit criteria** — definition of done

### 4. Review (Adversarial Gate)
Delegate review to a strongest-model sub-agent (Opus) against this checklist:
- All steps completable independently?
- Dependency graph acyclic?
- Parallel steps have no shared file conflicts?
- Each step has clear rollback?
- Anti-patterns: missing error handling, skipped testing, monolithic PRs?

Fix all critical findings before finalizing.

### 5. Register
Save plan, update memory index, present step count and parallelism map.

## Plan File Structure

```markdown
# Plan: [Objective]
> Steps: N | Parallel groups: M | Estimated: X sessions

## Step 1: [Name]
**Depends on:** none
**Model:** default | strongest
**Rollback:** git revert / migration down

### Context Brief
[Everything a fresh agent needs — no prior context required]

### Tasks
- [ ] Specific action 1
- [ ] Specific action 2

### Verification
```bash
npm run test
npm run build
```

### Exit Criteria
- All tests pass
- No type errors
```

## Key Capabilities

- **Cold-start execution** — any step runnable without reading prior steps
- **Parallel detection** — steps with no shared files or output dependencies run concurrently
- **Git/gh auto-detect** — generates full branch/PR/CI workflow when git + GitHub CLI present; degrades to direct mode otherwise
- **Plan mutation protocol** — steps can be split, inserted, skipped, or reordered with audit trail

## Example

```
objective: "migrate database to PostgreSQL"

Step 1: Add PostgreSQL driver and connection config
Step 2: Create migration scripts for each table
Step 3: Update repository layer to use new driver
Step 4: Add integration tests against PostgreSQL
Step 5: Remove old database code and config
```
