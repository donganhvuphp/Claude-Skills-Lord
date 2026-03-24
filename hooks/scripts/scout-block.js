#!/usr/bin/env node

/**
 * scout-block.js - Block access to heavy directories
 *
 * Blocks: node_modules, __pycache__, .git/, dist/, build/, .next/
 *
 * Exit Codes:
 * - 0: Command allowed
 * - 2: Command blocked
 */

const fs = require('fs');

const BLOCKED_PATTERNS = [
  'node_modules',
  '__pycache__',
  '\\.git/',
  '\\.git\\\\',
  '/dist/',
  '\\\\dist\\\\',
  '/build/',
  '\\\\build\\\\',
  '/\\.next/',
  '\\\\.next\\\\',
  '/\\.nuxt/',
  '\\\\.nuxt\\\\',
  '/coverage/',
  '\\\\coverage\\\\'
];

const BLOCKED_REGEX = new RegExp(BLOCKED_PATTERNS.join('|'), 'i');

try {
  const hookInput = fs.readFileSync(0, 'utf-8');

  if (!hookInput || hookInput.trim().length === 0) {
    process.exit(0);
  }

  const data = JSON.parse(hookInput);
  const command = data.tool_input?.command || '';

  if (BLOCKED_REGEX.test(command)) {
    const match = command.match(BLOCKED_REGEX);
    console.error(`⛔ Blocked: command accesses heavy directory "${match[0]}". Use Glob/Grep tools instead.`);
    process.exit(2);
  }

  process.exit(0);
} catch (error) {
  // Don't block on parse errors
  process.exit(0);
}
