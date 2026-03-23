#!/usr/bin/env node
/**
 * Validate .claude-plugin/plugin.json
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const pluginPath = path.join(ROOT, '.claude-plugin', 'plugin.json');

const errors = [];

// File exists
if (!fs.existsSync(pluginPath)) {
  console.error('FAIL: .claude-plugin/plugin.json not found');
  process.exit(1);
}

// Valid JSON
let plugin;
try {
  plugin = JSON.parse(fs.readFileSync(pluginPath, 'utf8'));
} catch (e) {
  console.error('FAIL: Invalid JSON in plugin.json —', e.message);
  process.exit(1);
}

// version field — semver
if (!plugin.version || !/^\d+\.\d+\.\d+$/.test(plugin.version)) {
  errors.push('version must be semver (e.g. 1.0.0)');
}

// agents is array, all entries end with .md
if (!Array.isArray(plugin.agents) || plugin.agents.length === 0) {
  errors.push('agents must be a non-empty array');
} else {
  for (const agent of plugin.agents) {
    if (!agent.endsWith('.md')) {
      errors.push(`agent entry does not end with .md: ${agent}`);
    }
    const resolved = path.resolve(ROOT, agent);
    if (!fs.existsSync(resolved)) {
      errors.push(`agent file not found: ${agent}`);
    }
  }
}

// commands and skills are arrays
if (!Array.isArray(plugin.commands)) {
  errors.push('commands must be an array');
}
if (!Array.isArray(plugin.skills)) {
  errors.push('skills must be an array');
}

// No hooks field (would cause duplicate hooks)
if (plugin.hooks !== undefined) {
  errors.push('plugin.json must NOT contain a "hooks" field (use hooks/hooks.json instead)');
}

if (errors.length > 0) {
  console.error('FAIL: plugin.json validation errors:\n  ' + errors.join('\n  '));
  process.exit(1);
}
console.log('OK: plugin.json is valid');
