#!/usr/bin/env node

/**
 * SkillLord Installer — Profile-aware selective installation
 *
 * Usage:
 *   skilllord-install [profile] [--target <path>] [--dry-run]
 *
 * Profiles: core, developer, full (default: developer)
 *
 * Examples:
 *   skilllord-install core
 *   skilllord-install full --target ./my-project
 *   skilllord-install developer --dry-run
 */

const fs = require('fs');
const path = require('path');

// Parse CLI args
const args = process.argv.slice(2);
const flags = {};
let profile = 'developer';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--target' && args[i + 1]) {
    flags.target = args[++i];
  } else if (args[i] === '--dry-run') {
    flags.dryRun = true;
  } else if (args[i] === '--help' || args[i] === '-h') {
    flags.help = true;
  } else if (!args[i].startsWith('-')) {
    profile = args[i];
  }
}

if (flags.help) {
  console.log(`
Claude Skill Lord Installer — Profile-aware selective installation

Usage: csl init [profile] [options]

Profiles:
  core        16 tier-1 skills, 7 agents (lightweight)
  developer   44 skills (tier-1+2), 22 agents (recommended)
  full        62 skills (all tiers), 22 agents (everything)

Options:
  --target <path>  Target project directory (default: current directory)
  --dry-run        Show what would be installed without copying
  --help, -h       Show this help
  `);
  process.exit(0);
}

// Resolve paths
const skillLordRoot = path.resolve(__dirname, '..');
const targetDir = path.resolve(flags.target || process.cwd());
const targetClaudeDir = path.join(targetDir, '.claude');

// Load manifests
const profilesPath = path.join(skillLordRoot, 'manifests', 'install-profiles.json');
const modulesPath = path.join(skillLordRoot, 'manifests', 'install-modules.json');

if (!fs.existsSync(profilesPath) || !fs.existsSync(modulesPath)) {
  console.error('Error: Manifest files not found. Ensure SkillLord is properly installed.');
  process.exit(1);
}

const profiles = JSON.parse(fs.readFileSync(profilesPath, 'utf8'));
const modules = JSON.parse(fs.readFileSync(modulesPath, 'utf8'));

const selectedProfile = profiles.profiles[profile];
if (!selectedProfile) {
  console.error(`Error: Unknown profile "${profile}".`);
  console.error(`Available profiles: ${Object.keys(profiles.profiles).join(', ')}`);
  process.exit(1);
}

const pkg = require(path.join(skillLordRoot, 'package.json'));
console.log(`\n  Claude Skill Lord Installer v${pkg.version}`);
console.log(`  ${'='.repeat(38)}\n`);
console.log(`  Profile:  ${profile}`);
console.log(`  Desc:     ${selectedProfile.description}`);
console.log(`  Target:   ${targetDir}`);
console.log(`  Dry run:  ${flags.dryRun ? 'yes' : 'no'}\n`);

// Resolve modules for selected profile
const selectedModules = modules.modules.filter(
  (m) => selectedProfile.modules.includes(m.id)
);

// Collect all files to copy
const filesToCopy = [];

for (const mod of selectedModules) {
  console.log(`  [${mod.cost}] ${mod.id}: ${mod.description}`);

  for (const srcRelPath of mod.paths) {
    const srcFullPath = path.join(skillLordRoot, srcRelPath);

    if (!fs.existsSync(srcFullPath)) {
      console.warn(`    WARN: Source not found: ${srcRelPath}`);
      continue;
    }

    const stat = fs.statSync(srcFullPath);
    if (stat.isDirectory()) {
      // Recursively collect files from directory
      collectFiles(srcFullPath, srcRelPath, filesToCopy);
    } else {
      filesToCopy.push({ src: srcFullPath, rel: srcRelPath });
    }
  }
}

console.log(`\n  Files to install: ${filesToCopy.length}`);

if (flags.dryRun) {
  console.log('\n  [DRY RUN] Files that would be copied:\n');
  for (const f of filesToCopy) {
    console.log(`    ${f.rel}`);
  }
  console.log(`\n  Total: ${filesToCopy.length} files`);
  process.exit(0);
}

// Copy files
let copied = 0;
let skipped = 0;

for (const f of filesToCopy) {
  const destPath = path.join(targetClaudeDir, f.rel);
  const destDir = path.dirname(destPath);

  // Create directory if needed
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // Copy file (don't overwrite existing)
  if (fs.existsSync(destPath)) {
    skipped++;
  } else {
    fs.copyFileSync(f.src, destPath);
    copied++;
  }
}

// Generate plugin.json for the target project
const pluginJsonPath = path.join(targetClaudeDir, 'plugin.json');
if (!fs.existsSync(pluginJsonPath)) {
  const agentFiles = filesToCopy
    .filter((f) => f.rel.startsWith('agents/') && f.rel.endsWith('.md'))
    .map((f) => `./${f.rel}`);

  const skillDirs = new Set();
  filesToCopy
    .filter((f) => f.rel.startsWith('skills/'))
    .forEach((f) => {
      const parts = f.rel.split('/');
      if (parts.length >= 2) {
        skillDirs.add(`./${parts[0]}/${parts[1]}/`);
      }
    });

  const pluginJson = {
    name: 'claude-skill-lord',
    version: pkg.version,
    description: `Claude Skill Lord (${profile} profile)`,
    agents: agentFiles,
    commands: ['./commands/'],
    skills: [...skillDirs],
  };

  fs.writeFileSync(pluginJsonPath, JSON.stringify(pluginJson, null, 2));
  console.log(`\n  Generated: .claude/plugin.json`);
}

console.log(`\n  Installation complete!`);
console.log(`  Copied:  ${copied} files`);
console.log(`  Skipped: ${skipped} files (already exist)`);
console.log(`\n  Run "claude" in your project to start using Claude Skill Lord.\n`);

// --- Helpers ---

function collectFiles(dirPath, relBase, results) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relPath = path.join(relBase, entry.name);
    if (entry.isDirectory()) {
      collectFiles(fullPath, relPath, results);
    } else {
      results.push({ src: fullPath, rel: relPath });
    }
  }
}
