---
name: ai-first-engineering
description: Engineering operating model for teams where AI agents generate a significant share of implementation. Covers process shifts, architecture requirements, code review focus, and testing standards.
---

> Pairs with: ai-regression-testing, agentic-engineering, coding-standards, santa-method

# AI-First Engineering

## When to Activate

- Designing process or reviewing architecture for an AI-assisted team
- Setting code review standards when most code is AI-generated
- Evaluating hiring signals for engineers in AI-heavy environments
- Deciding what to test and how in AI-generated codebases

## Process Shifts

| Traditional Focus | AI-First Focus |
|-------------------|----------------|
| Typing speed | Planning quality |
| Code coverage % | Eval coverage on AI outputs |
| Syntax review | System behavior review |
| Style consistency | Boundary & contract clarity |

Key shift: **planning quality matters more than typing speed**. A well-specified task produces better AI output than fast iteration on a vague one.

## Architecture Requirements

Design for agent-friendliness:
- **Explicit boundaries** — clear module ownership, no hidden coupling
- **Stable contracts** — typed interfaces that don't change silently
- **Deterministic tests** — tests that catch regressions AI might reintroduce
- **Typed interfaces** — schema-first APIs, not loosely-shaped objects

Avoid implicit behavior spread across hidden conventions. What's implicit to a human is opaque to an agent.

## Code Review in AI-First Teams

**Review for (high priority):**
- Behavior regressions — did the AI break an existing contract?
- Security assumptions — new code often inherits incorrect auth assumptions
- Data integrity — AI frequently misses transaction boundaries
- Failure handling — generated code often happy-paths only
- Rollout safety — AI doesn't think about migration risk

**Minimize time on:**
- Style issues already covered by linters/formatters
- Naming conventions enforced by coding-standards skill

## Testing Standard

Raise the bar for AI-generated code:
- **Required regression coverage** for every touched domain (see `ai-regression-testing`)
- **Explicit edge-case assertions** — AI tends to test the happy path only
- **Integration checks at interface boundaries** — most AI bugs occur at the seam between modules
- **Sandbox/production parity tests** — the #1 AI regression pattern

## Hiring Signals

Strong AI-first engineers:
- Decompose ambiguous work into clear, measurable subtasks
- Define acceptance criteria before implementation starts
- Produce high-signal prompts and evals — know how to direct AI effectively
- Enforce risk controls under delivery pressure — don't skip tests when "moving fast"

Weak signal: engineers who measure productivity by how fast AI generates code without verifying correctness.
