#!/usr/bin/env node
/**
 * Validate hooks/hooks.json and referenced scripts
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const hooksPath = path.join(ROOT, 'hooks', 'hooks.json');
const errors = [];

// File exists
if (!fs.existsSync(hooksPath)) {
  console.error('FAIL: hooks/hooks.json not found');
  process.exit(1);
}

// Valid JSON
let config;
try {
  config = JSON.parse(fs.readFileSync(hooksPath, 'utf8'));
} catch (e) {
  console.error('FAIL: Invalid JSON in hooks.json —', e.message);
  process.exit(1);
}

if (!config.hooks || typeof config.hooks !== 'object') {
  console.error('FAIL: hooks.json must have a "hooks" object');
  process.exit(1);
}

// Check each hook event
let hookCount = 0;
for (const [event, entries] of Object.entries(config.hooks)) {
  if (!Array.isArray(entries)) {
    errors.push(`hooks.${event} must be an array`);
    continue;
  }

  for (const entry of entries) {
    if (!entry.hooks || !Array.isArray(entry.hooks)) {
      errors.push(`hooks.${event}: entry missing "hooks" array`);
      continue;
    }

    for (const hook of entry.hooks) {
      hookCount++;
      if (!hook.command) {
        errors.push(`hooks.${event}: hook missing "command"`);
        continue;
      }

      // Extract script paths with ${CLAUDE_PLUGIN_ROOT}
      const scriptMatch = hook.command.match(/\$\{CLAUDE_PLUGIN_ROOT\}\/([^\s"]+)/g);
      if (scriptMatch) {
        for (const ref of scriptMatch) {
          const relPath = ref.replace('${CLAUDE_PLUGIN_ROOT}/', '');
          const absPath = path.join(ROOT, relPath);
          if (!fs.existsSync(absPath)) {
            errors.push(`hooks.${event}: script not found: ${relPath}`);
          }
        }
      }
    }
  }
}

if (errors.length > 0) {
  console.error('FAIL: Hooks validation errors:\n  ' + errors.join('\n  '));
  process.exit(1);
}
console.log(`OK: ${hookCount} hooks validated`);
