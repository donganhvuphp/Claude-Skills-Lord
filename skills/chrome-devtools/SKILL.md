---
name: chrome-devtools
description: Browser automation, debugging, and performance analysis using Puppeteer CLI scripts. Use for automating browsers, taking screenshots, analyzing performance, monitoring network traffic, web scraping, form automation, and JavaScript debugging.
license: Apache-2.0
---

# Chrome DevTools

Browser automation via executable Puppeteer scripts. All scripts output JSON.

## Quick Start

```bash
# Install dependencies
cd skills/chrome-devtools/scripts && npm install

# Test
node navigate.js --url https://example.com
```

## Available Scripts

### Core Automation
- `navigate.js` — Navigate to URLs
- `screenshot.js` — Capture screenshots (full page or element)
- `click.js` — Click elements
- `fill.js` — Fill form fields
- `evaluate.js` — Execute JavaScript in page context

### Analysis
- `snapshot.js` — Extract interactive elements with metadata
- `console.js` — Monitor console messages/errors
- `network.js` — Track HTTP requests/responses
- `performance.js` — Measure Core Web Vitals

## Usage Patterns

### Screenshot
```bash
node screenshot.js --url https://example.com --output ./docs/screenshots/page.png
```

### Chain Commands
```bash
node navigate.js --url https://example.com/login --close false
node fill.js --selector "#email" --value "user@example.com" --close false
node click.js --selector "button[type=submit]"
```

### Performance
```bash
node performance.js --url https://example.com | jq '.vitals.LCP'
```

### Web Scraping
```bash
node evaluate.js --url https://example.com --script "
  Array.from(document.querySelectorAll('.item')).map(el => ({
    title: el.querySelector('h2')?.textContent,
    link: el.querySelector('a')?.href
  }))
"
```

## Protocol

1. Check `pwd` before running scripts
2. Validate output after screenshots (`ls -lh`)
3. Use `snapshot.js` to discover selectors
4. All scripts support `--headless false`, `--close false`, `--timeout`

## References

- [CDP Domains](./references/cdp-domains.md)
- [Puppeteer Reference](./references/puppeteer-reference.md)
- [Performance Guide](./references/performance-guide.md)
