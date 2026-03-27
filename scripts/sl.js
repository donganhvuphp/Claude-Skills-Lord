#!/usr/bin/env node

/**
 * Claude Skill Lord CLI
 * Usage: csl <command> [options]
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rootDir = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const command = args[0];
const subArgs = args.slice(1);
const PKG_NAME = 'claude-skill-lord';

// --- Helpers ---

const { collectFiles, collectModuleFiles } = require('./lib/profile-utils');

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, answer => { rl.close(); resolve(answer.trim()); }));
}

function getInstalledVersion() {
  const pkg = require(path.join(rootDir, 'package.json'));
  return pkg.version;
}

function getLatestVersion() {
  try {
    return execSync(`npm view ${PKG_NAME} version`, { stdio: 'pipe' }).toString().trim();
  } catch {
    return null;
  }
}

// --- Commands ---

const commands = {
  version: () => {
    console.log(`Claude Skill Lord v${getInstalledVersion()}`);
  },

  init: () => {
    const hasTarget = subArgs.includes('--target');
    const dryRun = subArgs.includes('--dry-run');
    const fresh = subArgs.includes('--fresh');
    const noFonts = subArgs.includes('--no-fonts');

    const initArgs = hasTarget ? subArgs : [...subArgs, '--target', '.'];
    process.argv = ['node', 'install.js', ...initArgs];

    // Handle --fresh: remove existing .claude/ before install
    if (fresh) {
      const targetIdx = process.argv.indexOf('--target');
      const targetDir = targetIdx >= 0 ? process.argv[targetIdx + 1] : '.';
      const claudeDir = path.join(path.resolve(targetDir), '.claude');
      if (fs.existsSync(claudeDir)) {
        fs.rmSync(claudeDir, { recursive: true, force: true });
        console.log(`  Removed existing ${claudeDir}`);
      }
    }

    // Check existing installation
    if (!fresh && !dryRun) {
      const { readPluginJson } = require('./lib/profile-utils');
      const targetIdx = process.argv.indexOf('--target');
      const targetPath = targetIdx >= 0 ? path.resolve(process.argv[targetIdx + 1]) : path.resolve('.');
      const existingPlugin = readPluginJson(path.join(targetPath, '.claude'));

      if (existingPlugin) {
        console.log(`\n  Already installed (v${existingPlugin.version})`);
        console.log(`  Use "csl init --fresh" to reinstall from scratch.\n`);
        return;
      }
    }

    require('./install.js');
  },

  update: () => {
    console.log(`\n  Claude Skill Lord — Update\n`);
    const current = getInstalledVersion();
    console.log(`  Current version: ${current}`);

    const latest = getLatestVersion();
    if (!latest) {
      console.log('  Could not check latest version. Are you online?\n');
      process.exit(1);
    }
    console.log(`  Latest version:  ${latest}`);

    if (current === latest) {
      console.log('\n  Already up to date!\n');
      return;
    }

    console.log(`\n  Updating ${current} → ${latest}...`);
    try {
      execSync(`npm i -g ${PKG_NAME}@latest`, { stdio: 'inherit' });
      console.log(`\n  Updated to ${latest}!`);
      console.log('  Run "csl migrate" in your projects to update installed files.\n');
    } catch (e) {
      console.error(`\n  Update failed: ${e.message}\n`);
      process.exit(1);
    }
  },

  migrate: () => {
    console.log(`\n  Claude Skill Lord — Migrate\n`);

    const targetDir = path.resolve(subArgs.includes('--target')
      ? subArgs[subArgs.indexOf('--target') + 1]
      : '.');
    const claudeDir = path.join(targetDir, '.claude');
    const dryRun = subArgs.includes('--dry-run');

    if (!fs.existsSync(claudeDir)) {
      console.log(`  No .claude/ directory found in ${targetDir}`);
      console.log('  Run "csl init" first.\n');
      process.exit(1);
    }

    // Read installed plugin.json to determine profile
    const pluginPath = path.join(claudeDir, 'plugin.json');
    if (!fs.existsSync(pluginPath)) {
      console.log('  No plugin.json found. Run "csl init" first.\n');
      process.exit(1);
    }

    const pluginJson = JSON.parse(fs.readFileSync(pluginPath, 'utf8'));
    const currentVersion = pluginJson.version || 'unknown';
    const newVersion = getInstalledVersion();

    console.log(`  Project:  ${targetDir}`);
    console.log(`  Installed version: ${currentVersion}`);
    console.log(`  New version:       ${newVersion}`);

    // Collect files from source (all modules)
    const { loadManifests } = require('./lib/profile-utils');
    const { manifest, modules } = loadManifests();
    const selectedModules = modules.modules.filter(m => manifest.modules.includes(m.id));

    // Collect all source files
    const sourceFiles = collectModuleFiles(selectedModules);

    // Compare and find files to update
    let added = 0;
    let updated = 0;
    let unchanged = 0;

    for (const f of sourceFiles) {
      const destPath = path.join(claudeDir, f.rel);
      if (!fs.existsSync(destPath)) {
        if (dryRun) console.log(`  + NEW: ${f.rel}`);
        else {
          const destDir = path.dirname(destPath);
          if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
          fs.copyFileSync(f.src, destPath);
        }
        added++;
      } else {
        const srcContent = fs.readFileSync(f.src);
        const destContent = fs.readFileSync(destPath);
        if (!srcContent.equals(destContent)) {
          if (dryRun) console.log(`  ~ UPDATED: ${f.rel}`);
          else fs.copyFileSync(f.src, destPath);
          updated++;
        } else {
          unchanged++;
        }
      }
    }

    // Rebuild plugin.json with correct agents/skills for detected profile
    const { buildPluginJson } = require('./lib/profile-utils');
    if (!dryRun) {
      const rebuilt = buildPluginJson('full', sourceFiles, newVersion);
      fs.writeFileSync(pluginPath, JSON.stringify(rebuilt, null, 2));
      console.log(`  Rebuilt plugin.json (${rebuilt.agents.length} agents, ${rebuilt.skills.length} skill dirs)`);
    }

    console.log(`\n  ${dryRun ? '[DRY RUN] ' : ''}Results:`);
    console.log(`    New files:     ${added}`);
    console.log(`    Updated:       ${updated}`);
    console.log(`    Unchanged:     ${unchanged}`);
    console.log(`    Total:         ${sourceFiles.length}\n`);
  },

  uninstall: async () => {
    const targetDir = path.resolve(subArgs.includes('--target')
      ? subArgs[subArgs.indexOf('--target') + 1]
      : '.');
    const claudeDir = path.join(targetDir, '.claude');

    if (!fs.existsSync(claudeDir)) {
      console.log(`\n  No .claude/ directory found in ${targetDir}\n`);
      return;
    }

    const force = subArgs.includes('--force') || subArgs.includes('-f');
    if (!force && !process.env.CI) {
      const confirm = await ask(`\n  Remove ${claudeDir}? This cannot be undone. [y/N]: `);
      if (confirm.toLowerCase() !== 'y') {
        console.log('  Cancelled.\n');
        return;
      }
    }

    fs.rmSync(claudeDir, { recursive: true, force: true });
    console.log(`\n  Removed ${claudeDir}`);
    console.log('  Claude Skill Lord has been uninstalled from this project.\n');
  },

  diff: () => {
    const { loadManifests } = require('./lib/profile-utils');
    const targetDir = path.resolve(subArgs.includes('--target')
      ? subArgs[subArgs.indexOf('--target') + 1] : '.');
    const claudeDir = path.join(targetDir, '.claude');

    if (!fs.existsSync(claudeDir)) {
      console.log(`\n  No .claude/ found in ${targetDir}\n`);
      process.exit(1);
    }

    console.log(`\n  Claude Skill Lord — Diff\n`);

    const { manifest, modules } = loadManifests();
    const selectedModules = modules.modules.filter(m => manifest.modules.includes(m.id));

    const sourceFiles = collectModuleFiles(selectedModules);

    let modified = 0, unchanged = 0, missing = 0;
    for (const f of sourceFiles) {
      const destPath = path.join(claudeDir, f.rel);
      if (!fs.existsSync(destPath)) {
        console.log(`  - MISSING: ${f.rel}`);
        missing++;
      } else {
        const srcBuf = fs.readFileSync(f.src);
        const destBuf = fs.readFileSync(destPath);
        if (!srcBuf.equals(destBuf)) {
          console.log(`  ~ MODIFIED: ${f.rel}`);
          modified++;
        } else {
          unchanged++;
        }
      }
    }

    const sourceRels = new Set(sourceFiles.map(f => f.rel));
    const projectFiles = [];
    const knownDirs = ['agents', 'skills', 'commands', 'workflows', 'hooks'];
    for (const dir of knownDirs) {
      const dirPath = path.join(claudeDir, dir);
      if (fs.existsSync(dirPath)) collectFiles(dirPath, dir, projectFiles);
    }
    const extra = projectFiles.filter(f => !sourceRels.has(f.rel));

    if (extra.length > 0) {
      extra.forEach(f => console.log(`  + EXTRA: ${f.rel}`));
    }

    console.log(`\n  Modified: ${modified} | Unchanged: ${unchanged} | Missing: ${missing} | Extra: ${extra.length}\n`);
  },

  list: () => {
    const agents = fs.readdirSync(path.join(rootDir, 'agents')).filter(f => f.endsWith('.md'));

    console.log(`\n  Claude Skill Lord Components\n`);

    console.log(`  Agents: ${agents.length}`);
    agents.forEach(a => console.log(`    - ${a.replace('.md', '')}`));

    const skillsDir = path.join(rootDir, 'skills');
    const skills = fs.readdirSync(skillsDir, { withFileTypes: true })
      .filter(e => e.isDirectory() && fs.existsSync(path.join(skillsDir, e.name, 'SKILL.md')))
      .map(e => e.name);
    console.log(`\n  Skills: ${skills.length}`);
    skills.forEach(s => console.log(`    - ${s}`));

    const cmds = [];
    const collectCmds = (dir) => {
      if (!fs.existsSync(dir)) return;
      fs.readdirSync(dir, { withFileTypes: true }).forEach(e => {
        if (e.isFile() && e.name.endsWith('.md')) cmds.push(e.name.replace('.md', ''));
        if (e.isDirectory()) collectCmds(path.join(dir, e.name));
      });
    };
    collectCmds(path.join(rootDir, 'commands'));
    console.log(`\n  Commands: ${cmds.length}\n`);
  },

  doctor: () => {
    console.log(`\n  Claude Skill Lord Doctor\n`);
    let ok = 0;
    let fail = 0;
    let warn = 0;

    const check = (name, fn) => {
      try {
        fn();
        console.log(`  ✓ ${name}`);
        ok++;
      } catch (e) {
        console.log(`  ✗ ${name}: ${e.message}`);
        fail++;
      }
    };

    const info = (name, fn) => {
      try {
        fn();
        console.log(`  ✓ ${name}`);
        ok++;
      } catch (e) {
        console.log(`  ⚠ ${name}: ${e.message}`);
        warn++;
      }
    };

    // --- System checks ---
    console.log('  System:');

    check('Node.js >= 18', () => {
      const v = parseInt(process.versions.node.split('.')[0]);
      if (v < 18) throw new Error(`Node ${process.versions.node}, need >= 18`);
    });

    info('Python 3 available', () => {
      try {
        execSync('python3 --version', { stdio: 'pipe' });
      } catch {
        throw new Error('not found (needed for ui-ux-pro-max skill)');
      }
    });

    // --- Package checks ---
    console.log('\n  Package:');

    check('plugin.json exists', () => {
      if (!fs.existsSync(path.join(rootDir, '.claude-plugin', 'plugin.json')))
        throw new Error('not found');
    });

    check('plugin.json valid', () => {
      const p = JSON.parse(fs.readFileSync(path.join(rootDir, '.claude-plugin', 'plugin.json'), 'utf8'));
      if (!p.version) throw new Error('missing version');
      if (!Array.isArray(p.agents)) throw new Error('agents not array');
    });

    check('All agent files exist', () => {
      const p = JSON.parse(fs.readFileSync(path.join(rootDir, '.claude-plugin', 'plugin.json'), 'utf8'));
      const missing = p.agents.filter(a => !fs.existsSync(path.join(rootDir, a.replace('./', ''))));
      if (missing.length) throw new Error(`missing: ${missing.join(', ')}`);
    });

    check('Skills directory populated', () => {
      const skillsDir = path.join(rootDir, 'skills');
      const skills = fs.readdirSync(skillsDir, { withFileTypes: true })
        .filter(e => e.isDirectory() && fs.existsSync(path.join(skillsDir, e.name, 'SKILL.md')));
      if (skills.length === 0) throw new Error('no skills with SKILL.md found');
    });

    check('hooks.json valid', () => {
      JSON.parse(fs.readFileSync(path.join(rootDir, 'hooks', 'hooks.json'), 'utf8'));
    });

    // --- Project checks ---
    const projectClaudeDir = path.join(process.cwd(), '.claude');
    console.log('\n  Project:');

    info('Project .claude/ exists', () => {
      if (!fs.existsSync(projectClaudeDir))
        throw new Error(`not found in ${process.cwd()}. Run: csl init`);
    });

    if (fs.existsSync(projectClaudeDir)) {
      info('Project plugin.json valid', () => {
        const pPath = path.join(projectClaudeDir, 'plugin.json');
        if (!fs.existsSync(pPath)) throw new Error('not found');
        const p = JSON.parse(fs.readFileSync(pPath, 'utf8'));
        const agentCount = p.agents ? p.agents.length : 0;
        const skillDirs = p.skills ? p.skills.length : 0;
        console.log(`      (${agentCount} agents, ${skillDirs} skill dirs, v${p.version || '?'})`);
      });

      info('Project agents intact', () => {
        const pPath = path.join(projectClaudeDir, 'plugin.json');
        if (!fs.existsSync(pPath)) throw new Error('no plugin.json');
        const p = JSON.parse(fs.readFileSync(pPath, 'utf8'));
        const missing = (p.agents || []).filter(a =>
          !fs.existsSync(path.join(projectClaudeDir, a.replace('./', '')))
        );
        if (missing.length) throw new Error(`missing: ${missing.join(', ')}`);
      });

      // Consistency: check declared skill dirs exist on disk
      info('Skills intact', () => {
        const pPath = path.join(projectClaudeDir, 'plugin.json');
        if (!fs.existsSync(pPath)) throw new Error('no plugin.json');
        const p = JSON.parse(fs.readFileSync(pPath, 'utf8'));
        const declaredSkillDirs = (p.skills || []).map(s => s.replace('./', '').replace(/\/$/, ''));
        const missing = declaredSkillDirs.filter(d => !fs.existsSync(path.join(projectClaudeDir, d)));
        if (missing.length > 0) {
          throw new Error(`${missing.length} skill dirs missing: ${missing.join(', ')}`);
        }
      });
    }

    // Check for updates
    check('Up to date', () => {
      const current = getInstalledVersion();
      const latest = getLatestVersion();
      if (latest && current !== latest)
        throw new Error(`${current} installed, ${latest} available. Run: csl update`);
    });

    console.log(`\n  Results: ${ok} passed, ${fail} failed${warn ? `, ${warn} warnings` : ''}\n`);
    if (fail > 0) process.exit(1);
  },

  help: () => {
    console.log(`
  Claude Skill Lord — Curated Claude Code Plugin
  https://github.com/donganhvuphp/Claude-Skills-Lord

  Usage: csl <command> [options]

  Commands:
    init                Install in current project (43 agents, 170 skills, 114 commands)
    update              Update CLI to latest version
    migrate             Update project files after csl update
    diff                Compare project files with source package
    uninstall           Remove Claude Skill Lord from a project
    list                List all agents, skills, and commands
    doctor              Check installation health + updates
    version             Show version
    help                Show this help

  Init Options:
    --target <path>     Target directory (default: current directory)
    --dry-run           Preview without copying
    --fresh             Clean reinstall (remove existing .claude/ first)
    --no-fonts          Skip canvas font files (~7MB)

  Migrate/Diff Options:
    --target <path>     Target directory (default: current directory)
    --dry-run           Preview changes without applying (migrate only)

  Uninstall Options:
    --target <path>     Target directory (default: current directory)
    --force, -f         Skip confirmation prompt

  Examples:
    csl init                     # Install everything
    csl init --no-fonts          # Skip canvas fonts (~7MB lighter)
    csl init --dry-run           # Preview without copying
    csl init --fresh             # Clean reinstall
    csl update                   # Update to latest version
    csl migrate                  # Update project files after csl update
    csl diff                     # Show modified/missing/extra files
    csl uninstall                # Remove from current project
    csl doctor                   # Check health + updates
    csl list                     # Show all components
    `);
  },
};

// Run command (handle async)
const handler = commands[command] || commands.help;
const result = handler();
if (result && typeof result.catch === 'function') {
  result.catch(e => { console.error(e.message); process.exit(1); });
}
