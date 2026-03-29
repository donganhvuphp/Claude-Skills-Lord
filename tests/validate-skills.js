#!/usr/bin/env node
/**
 * Validate SKILL.md in each skill directory under skills/
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const errors = [];
let count = 0;

// Non-skill meta-directories that live under skills/ but are not skill definitions
const EXCLUDED_DIRS = new Set(['agents', 'common', 'document-skills', 'fixtures', 'hooks', 'prompts', 'reference', 'scripts', 'tests']);

const skillsDir = path.join(ROOT, 'skills');
if (!fs.existsSync(skillsDir)) {
  console.error('FAIL: skills/ directory not found');
  process.exit(1);
}

const dirs = fs.readdirSync(skillsDir, { withFileTypes: true })
  .filter(d => d.isDirectory() && !EXCLUDED_DIRS.has(d.name));

for (const dir of dirs) {
  const skillFile = path.join(skillsDir, dir.name, 'SKILL.md');
  const rel = `skills/${dir.name}/SKILL.md`;

  if (!fs.existsSync(skillFile)) {
    continue; // Skip non-skill directories (e.g. common, fixtures, scripts)
  }

  const content = fs.readFileSync(skillFile, 'utf8');

  // Check frontmatter
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    errors.push(`${rel}: missing YAML frontmatter`);
    continue;
  }

  const fm = {};
  for (const line of match[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.+)$/);
    if (kv) fm[kv[1]] = kv[2].trim();
  }

  if (!fm.name) errors.push(`${rel}: missing "name" in frontmatter`);
  if (!fm.description) errors.push(`${rel}: missing "description" in frontmatter`);

  // Meaningful content (>10 lines)
  const lines = content.split('\n');
  if (lines.length <= 10) {
    errors.push(`${rel}: too short (${lines.length} lines, need >10)`);
  }

  count++;
}

if (errors.length > 0) {
  console.error('FAIL: Skill validation errors:\n  ' + errors.join('\n  '));
  process.exit(1);
}
console.log(`OK: ${count} skills validated`);
