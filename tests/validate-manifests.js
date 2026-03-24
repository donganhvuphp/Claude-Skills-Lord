#!/usr/bin/env node
/**
 * Validate skills/manifest.json, manifests/install-profiles.json, manifests/install-modules.json
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const errors = [];

// --- skills/manifest.json ---
const skillsManifestPath = path.join(ROOT, 'skills', 'manifest.json');
if (!fs.existsSync(skillsManifestPath)) {
  console.error('FAIL: skills/manifest.json not found');
  process.exit(1);
}

let skillsManifest;
try {
  skillsManifest = JSON.parse(fs.readFileSync(skillsManifestPath, 'utf8'));
} catch (e) {
  console.error('FAIL: Invalid JSON in skills/manifest.json —', e.message);
  process.exit(1);
}

// Count actual skill directories (flat structure under skills/)
const skillsDir = path.join(ROOT, 'skills');
const actualSkillCount = fs.readdirSync(skillsDir, { withFileTypes: true })
  .filter(d => d.isDirectory()).length;

if (skillsManifest.skills.length !== actualSkillCount) {
  errors.push(`skills/manifest.json: lists ${skillsManifest.skills.length} skills but found ${actualSkillCount} directories`);
}

// Each skill path resolves
for (const skill of skillsManifest.skills) {
  const absPath = path.join(ROOT, skill.path);
  if (!fs.existsSync(absPath)) {
    errors.push(`skills/manifest.json: path not found: ${skill.path}`);
  }
}

// --- manifests/install-profiles.json ---
const profilesPath = path.join(ROOT, 'manifests', 'install-profiles.json');
let profiles;
try {
  profiles = JSON.parse(fs.readFileSync(profilesPath, 'utf8'));
} catch (e) {
  console.error('FAIL: Invalid JSON in install-profiles.json —', e.message);
  process.exit(1);
}

for (const name of ['core', 'developer', 'full']) {
  if (!profiles.profiles || !profiles.profiles[name]) {
    errors.push(`install-profiles.json: missing "${name}" profile`);
  }
}

// --- manifests/install-modules.json ---
const modulesPath = path.join(ROOT, 'manifests', 'install-modules.json');
let modules;
try {
  modules = JSON.parse(fs.readFileSync(modulesPath, 'utf8'));
} catch (e) {
  console.error('FAIL: Invalid JSON in install-modules.json —', e.message);
  process.exit(1);
}

// Build module ID set
const moduleIds = new Set(modules.modules.map(m => m.id));

// All module paths resolve
for (const mod of modules.modules) {
  for (const p of mod.paths) {
    const absPath = path.join(ROOT, p);
    if (!fs.existsSync(absPath)) {
      errors.push(`install-modules.json: path not found: ${p} (module ${mod.id})`);
    }
  }
}

// Each profile's module IDs exist in install-modules.json
if (profiles.profiles) {
  for (const [name, profile] of Object.entries(profiles.profiles)) {
    for (const modId of profile.modules) {
      if (!moduleIds.has(modId)) {
        errors.push(`install-profiles.json: profile "${name}" references unknown module "${modId}"`);
      }
    }
  }
}

if (errors.length > 0) {
  console.error('FAIL: Manifest validation errors:\n  ' + errors.join('\n  '));
  process.exit(1);
}
console.log(`OK: All manifests validated (${skillsManifest.skills.length} skills, ${Object.keys(profiles.profiles).length} profiles, ${modules.modules.length} modules)`);
