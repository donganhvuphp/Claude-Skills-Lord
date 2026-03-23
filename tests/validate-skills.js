#!/usr/bin/env node
/**
 * Validate SKILL.md in each skill directory across all tiers
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const errors = [];
let count = 0;

for (const tier of ['tier-1', 'tier-2', 'tier-3']) {
  const tierDir = path.join(ROOT, 'skills', tier);
  if (!fs.existsSync(tierDir)) {
    errors.push(`skills/${tier}/ directory not found`);
    continue;
  }

  const dirs = fs.readdirSync(tierDir, { withFileTypes: true })
    .filter(d => d.isDirectory());

  for (const dir of dirs) {
    const skillFile = path.join(tierDir, dir.name, 'SKILL.md');
    const rel = `skills/${tier}/${dir.name}/SKILL.md`;

    if (!fs.existsSync(skillFile)) {
      errors.push(`${rel}: SKILL.md not found`);
      continue;
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
}

if (errors.length > 0) {
  console.error('FAIL: Skill validation errors:\n  ' + errors.join('\n  '));
  process.exit(1);
}
console.log(`OK: ${count} skills validated`);
