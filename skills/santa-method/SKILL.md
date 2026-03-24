---
name: santa-method
description: Multi-agent adversarial verification. Two independent review agents must both pass before output ships. Breaks the self-review bias loop where a single agent misses its own errors.
---

> Pairs with: verification-loop, eval-harness, continuous-learning

# Santa Method

Make a list, check it twice. If it's naughty, fix it until it's nice.

**Core insight:** A single agent reviewing its own output carries the same biases and blind spots that produced the output. Two independent reviewers with no shared context break this failure mode.

## When to Activate

Use when:
- Output ships to production without human review
- Compliance, regulatory, or brand constraints apply
- Hallucination risk is elevated (statistics, API references, legal language)
- Batch generation at scale where spot-checking misses systemic patterns
- Technical docs or customer-facing content where accuracy matters

**Do NOT use** for: internal drafts, exploratory research, or tasks with deterministic verification (use build/test/lint for those — `verification-loop` skill).

## Architecture

```
GENERATOR (Agent A) → output
         ↓
REVIEWER B ──┐
             ├── both must PASS → SHIP
REVIEWER C ──┘
             │
          NAUGHTY → FIX (collect all flags) → re-run both reviewers
                     max 3 iterations → escalate to human
```

**Critical invariants:**
1. Reviewers run in **parallel** — neither sees the other's assessment
2. Both receive the **identical rubric** and identical inputs
3. Each review round uses **fresh agents** — no memory of prior rounds (prevents anchoring bias)
4. **Both must pass** — one reviewer's catch is a real issue regardless of what the other found

## Rubric Design

The rubric is the most important input. Vague rubrics produce vague reviews. Every criterion needs an objective pass/fail condition.

**Universal criteria:**

| Criterion | Pass Condition | Failure Signal |
|-----------|---------------|----------------|
| Factual accuracy | All claims verifiable | Invented stats, wrong versions, nonexistent APIs |
| Hallucination-free | No fabricated entities/URLs | Links to pages that don't exist |
| Completeness | Every spec requirement addressed | Missing sections, skipped edge cases |
| Internal consistency | No contradictions | Section A says X, Section B says not-X |
| Technical correctness | Code compiles, algorithms sound | Syntax errors, wrong complexity |

**Domain extensions:**

- **Code:** type safety, error handling coverage, security (no secrets, injection prevention), test coverage
- **Content/marketing:** brand voice, SEO, CTA present and linked, no trademark misuse
- **Compliance-sensitive:** required disclaimers, approved terminology, jurisdiction-appropriate language

## Implementation (Claude Code)

```python
REVIEWER_PROMPT = """
You are an independent quality reviewer. You have NOT seen any other review.

Task Specification: {task_spec}
Output Under Review: {output}
Evaluation Rubric: {rubric}

For each rubric criterion, evaluate PASS or FAIL with specific evidence.
Return JSON: {"verdict": "PASS|FAIL", "checks": [...], "critical_issues": [...], "suggestions": [...]}
Be rigorous. Your job is to find problems, not to approve.
"""

# Spawn in parallel — context isolation via subagents
reviewer_b = Agent(description="Santa Reviewer B", prompt=REVIEWER_PROMPT.format(...))
reviewer_c = Agent(description="Santa Reviewer C", prompt=REVIEWER_PROMPT.format(...))

# Verdict gate
if b.verdict == "PASS" and c.verdict == "PASS":
    ship(output)
else:
    issues = dedupe(b.critical_issues + c.critical_issues)
    output = fix_agent.execute(output=output, issues=issues,
                               instruction="Fix ONLY the flagged issues.")
    # Re-run with fresh agents (max 3 iterations)
```

## Failure Modes

| Failure | Mitigation |
|---------|-----------|
| Infinite loop | Hard cap at 3 iterations, then escalate |
| Rubber stamping | Prompt: "Your job is to find problems, not approve" |
| Subjective drift | Rubric must have objective pass/fail only — no style preferences |
| Fix regression | Fresh reviewers each round catch regressions introduced by fixes |

## Cost vs. Benefit

Santa costs ~2-3x the generation token cost per verification cycle. For batch operations, use stratified sampling (10-15% of batch, minimum 5 items) — catches >90% of systematic issues at ~15-20% of full verification cost.

## Metrics to Track

- **First-pass rate** — % passing Santa on round 1 (target: >70%)
- **Mean iterations to convergence** — target: <1.5
- **Escape rate** — issues found post-ship Santa should have caught (target: 0)
