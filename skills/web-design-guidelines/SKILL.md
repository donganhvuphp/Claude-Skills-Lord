---
name: web-design-guidelines
description: Review UI code for Web Interface Guidelines compliance. Use when asked to review UI, check accessibility, audit design, review UX, or check site against best practices.
---

# Web Interface Guidelines

Review files for compliance with Web Interface Guidelines.

## How It Works

1. Fetch latest guidelines from source URL
2. Read specified files (or ask user for files/pattern)
3. Check against all rules
4. Output findings in terse `file:line` format

## Guidelines Source

Fetch fresh guidelines before each review:

```
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

Use WebFetch to retrieve the latest rules.

## Usage

1. Fetch guidelines from source URL
2. Read specified files
3. Apply all rules from fetched guidelines
4. Output findings using the format specified in the guidelines

If no files specified, ask user which files to review.
