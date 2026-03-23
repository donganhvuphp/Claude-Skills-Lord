#!/usr/bin/env node
/**
 * SkillLord Test Runner — runs all validate-*.js files
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const testsDir = __dirname;
const testFiles = fs.readdirSync(testsDir)
  .filter(f => f.startsWith('validate-') && f.endsWith('.js'))
  .sort();

console.log(`\n  SkillLord Test Suite`);
console.log(`  ====================\n`);

let passed = 0;
let failed = 0;
const failures = [];

for (const file of testFiles) {
  const testPath = path.join(testsDir, file);
  const testName = file.replace('.js', '');
  try {
    execSync(`node "${testPath}"`, { stdio: 'pipe', cwd: path.resolve(testsDir, '..') });
    console.log(`  \u2713 ${testName}`);
    passed++;
  } catch (err) {
    console.log(`  \u2717 ${testName}`);
    const stdout = err.stdout ? err.stdout.toString() : '';
    const stderr = err.stderr ? err.stderr.toString() : '';
    const output = (stdout + '\n' + stderr).trim() || err.message;
    failures.push({ name: testName, error: output.trim() });
    failed++;
  }
}

console.log(`\n  Results: ${passed} passed, ${failed} failed\n`);

if (failures.length > 0) {
  console.log('  Failures:\n');
  for (const f of failures) {
    console.log(`  --- ${f.name} ---`);
    console.log(`  ${f.error.split('\n').join('\n  ')}\n`);
  }
  process.exit(1);
}
