---
name: repomix
description: Package entire code repositories into single AI-friendly files using Repomix. Capabilities include customizable include/exclude patterns, multiple output formats (XML, Markdown, plain text), token counting, security checks. Use when packaging codebases for AI analysis, creating repository snapshots for LLM context, or preparing for security audits.
---

# Repomix

Pack repositories into single AI-friendly files for LLM consumption.

## Quick Start

```bash
# Install
npm install -g repomix

# Package current directory (XML output)
repomix

# Markdown output
repomix --style markdown

# Remote repository
npx repomix --remote owner/repo

# Custom filters
repomix --include "src/**/*.ts" --remove-comments -o output.md
```

## Common Use Cases

### Code Review
```bash
repomix --include "src/**/*.ts" --remove-comments -o review.md --style markdown
```

### Security Audit
```bash
npx repomix --remote vendor/library --style xml -o audit.xml
```

### Bug Investigation
```bash
repomix --include "src/auth/**,src/api/**" -o debug-context.xml
```

### Token Count Tree
```bash
repomix --token-count-tree 1000  # Show files with 1000+ tokens
```

## Key Options

| Option | Description |
|--------|-------------|
| `--style` | Output format: xml, markdown, json, plain |
| `--include` | Include patterns (glob) |
| `-i` | Ignore patterns |
| `--remove-comments` | Strip code comments |
| `--copy` | Copy to clipboard |
| `-o` | Output file path |
| `--no-security-check` | Skip security scanning |

## Security

Repomix uses Secretlint to detect API keys, passwords, credentials. Always review output before sharing.

## Reference

- [Configuration](./references/configuration.md)
- [Usage Patterns](./references/usage-patterns.md)
- Docs: https://repomix.com/guide/
