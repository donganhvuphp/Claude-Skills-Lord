#!/usr/bin/env node
/**
 * Validate all agent .md files in agents/
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const agentsDir = path.join(ROOT, 'agents');
const errors = [];
const VALID_MODELS = ['opus', 'sonnet', 'haiku'];

const files = fs.readdirSync(agentsDir).filter(f => f.endsWith('.md'));

if (files.length === 0) {
  console.error('FAIL: No agent files found in agents/');
  process.exit(1);
}

for (const file of files) {
  const filePath = path.join(agentsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const prefix = `agents/${file}`;

  // Check frontmatter exists
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    errors.push(`${prefix}: missing YAML frontmatter`);
    continue;
  }

  // Parse frontmatter (simple key: value)
  const fm = {};
  for (const line of match[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.+)$/);
    if (kv) fm[kv[1]] = kv[2].trim();
  }

  if (!fm.name) errors.push(`${prefix}: missing "name" in frontmatter`);
  if (!fm.description) errors.push(`${prefix}: missing "description" in frontmatter`);
  if (!fm.model) {
    errors.push(`${prefix}: missing "model" in frontmatter`);
  } else if (!VALID_MODELS.includes(fm.model)) {
    errors.push(`${prefix}: model must be one of ${VALID_MODELS.join(', ')} (got "${fm.model}")`);
  }
  if (!fm.tools) {
    errors.push(`${prefix}: missing "tools" in frontmatter`);
  }

  // Body after frontmatter is non-empty
  const body = content.slice(match[0].length).trim();
  if (!body) {
    errors.push(`${prefix}: body after frontmatter is empty`);
  }
}

if (errors.length > 0) {
  console.error('FAIL: Agent validation errors:\n  ' + errors.join('\n  '));
  process.exit(1);
}
console.log(`OK: ${files.length} agents validated`);
