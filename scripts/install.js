#!/usr/bin/env node

/**
 * Claude Skill Lord Installer
 *
 * Usage: csl init [--target <path>] [--dry-run] [--no-fonts]
 */

const fs = require('fs');
const path = require('path');

// Parse CLI args
const args = process.argv.slice(2);
const flags = {};

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--target' && args[i + 1]) {
    flags.target = args[++i];
  } else if (args[i] === '--dry-run') {
    flags.dryRun = true;
  } else if (args[i] === '--no-fonts') {
    flags.noFonts = true;
  } else if (args[i] === '--help' || args[i] === '-h') {
    flags.help = true;
  }
}

if (flags.help) {
  console.log(`
Claude Skill Lord Installer

Usage: csl init [options]

Options:
  --target <path>  Target project directory (default: current directory)
  --dry-run        Show what would be installed without copying
  --no-fonts       Skip canvas font files (~7MB)
  --help, -h       Show this help
  `);
  process.exit(0);
}

// Resolve paths
const skillLordRoot = path.resolve(__dirname, '..');
const targetDir = path.resolve(flags.target || process.cwd());
const targetClaudeDir = path.join(targetDir, '.claude');

// Load modules manifest
const { collectModuleFiles, buildPluginJson } = require('./lib/profile-utils');
const modulesPath = path.join(skillLordRoot, 'manifests', 'install-modules.json');

if (!fs.existsSync(modulesPath)) {
  console.error('Error: install-modules.json not found. Ensure SkillLord is properly installed.');
  process.exit(1);
}

const modules = JSON.parse(fs.readFileSync(modulesPath, 'utf8'));

// Install all modules (optionally skip fonts)
let allModules = modules.modules;
if (flags.noFonts) {
  allModules = allModules.filter(m => m.id !== 'canvas-fonts');
}

const pkg = require(path.join(skillLordRoot, 'package.json'));
console.log(`\n  Claude Skill Lord v${pkg.version}`);
console.log(`  ${'='.repeat(38)}\n`);
console.log(`  Target:   ${targetDir}`);
if (flags.noFonts) console.log(`  Fonts:    skipped (--no-fonts)`);
console.log(`  Dry run:  ${flags.dryRun ? 'yes' : 'no'}\n`);

// Collect all files to copy
for (const mod of allModules) {
  console.log(`  [${mod.cost}] ${mod.id}: ${mod.description}`);
}
const filesToCopy = collectModuleFiles(allModules);

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

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  if (fs.existsSync(destPath)) {
    skipped++;
  } else {
    fs.copyFileSync(f.src, destPath);
    copied++;
  }
}

// Generate plugin.json
const pluginJsonPath = path.join(targetClaudeDir, 'plugin.json');
const pluginJson = buildPluginJson(filesToCopy, pkg.version);
fs.writeFileSync(pluginJsonPath, JSON.stringify(pluginJson, null, 2));
console.log(`\n  Generated: .claude/plugin.json`);

// Copy CLAUDE.md to project root (Claude Code reads this automatically)
const claudeMdSrc = path.join(skillLordRoot, 'CLAUDE.md');
const claudeMdDest = path.join(targetDir, 'CLAUDE.md');
if (fs.existsSync(claudeMdSrc)) {
  if (fs.existsSync(claudeMdDest)) {
    console.log(`  Skipped:  CLAUDE.md (already exists in project root)`);
  } else {
    fs.copyFileSync(claudeMdSrc, claudeMdDest);
    console.log(`  Copied:   CLAUDE.md → project root`);
    copied++;
  }
}

console.log(`\n  Installation complete!`);
console.log(`  Copied:  ${copied} files`);
if (skipped > 0) console.log(`  Skipped: ${skipped} files (already exist)`);
console.log(`\n  Run "claude" in your project to start using Claude Skill Lord.\n`);
