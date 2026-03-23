#!/usr/bin/env node
/**
 * Validate all command .md files in commands/ (recursive)
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const commandsDir = path.join(ROOT, 'commands');
const errors = [];

function findMdFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findMdFiles(full));
    } else if (entry.name.endsWith('.md')) {
      results.push(full);
    }
  }
  return results;
}

const files = findMdFiles(commandsDir);

if (files.length === 0) {
  console.error('FAIL: No command files found in commands/');
  process.exit(1);
}

for (const filePath of files) {
  const rel = path.relative(ROOT, filePath);
  const content = fs.readFileSync(filePath, 'utf8');

  // Check frontmatter
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    errors.push(`${rel}: missing YAML frontmatter`);
    continue;
  }

  // Check description field
  if (!/description:\s*.+/.test(match[1])) {
    errors.push(`${rel}: missing "description" in frontmatter`);
  }

  // Body is non-empty (>5 lines total)
  const lines = content.split('\n');
  if (lines.length <= 5) {
    errors.push(`${rel}: too short (${lines.length} lines, need >5)`);
  }
}

if (errors.length > 0) {
  console.error('FAIL: Command validation errors:\n  ' + errors.join('\n  '));
  process.exit(1);
}
console.log(`OK: ${files.length} commands validated`);
