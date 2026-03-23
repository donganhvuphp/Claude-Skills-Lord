---
description: Run quality checks on your implementation — lint, types, tests, security, plan completeness
---

# Audit — Quality Gate

Invoke the **quality-gate** agent to validate your implementation quality.

## Usage

```
/audit
```

## Checks Performed

1. **Lint** — Runs project linter (eslint, prettier, ruff, etc.)
2. **Types** — Runs type checker (tsc, mypy, etc.)
3. **Tests** — Runs test suite, checks coverage (>80%)
4. **Security** — Scans for hardcoded secrets, SQL injection, XSS
5. **Plan** — Verifies all TODOs resolved and success criteria met

## Output

Returns a verdict: **PASS**, **WARN**, or **FAIL** with detailed issue list.
