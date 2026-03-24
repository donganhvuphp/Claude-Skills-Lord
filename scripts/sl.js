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

  init: async () => {
    let profile = subArgs.find(a => !a.startsWith('-')) || null;
    const hasTarget = subArgs.includes('--target');
    const dryRun = subArgs.includes('--dry-run');
    const fresh = subArgs.includes('--fresh');

    // Interactive mode if no profile specified and not in CI
    if (!profile && !process.env.CI) {
      console.log(`\n  Claude Skill Lord — Project Setup\n`);
      console.log('  Profiles:');
      console.log('    1) core       — 16 skills, 7 agents (lightweight)');
      console.log('    2) developer  — 44 skills, 22 agents (recommended)');
      console.log('    3) full       — 61 skills, 22 agents (everything)\n');

      const choice = await ask('  Choose profile [1/2/3] (default: 2): ');
      profile = { '1': 'core', '2': 'developer', '3': 'full' }[choice] || 'developer';

      const confirmTarget = await ask(`  Target directory [.]: `);
      const target = confirmTarget || '.';

      const confirm = await ask(`\n  Install "${profile}" profile to "${path.resolve(target)}"? [Y/n]: `);
      if (confirm.toLowerCase() === 'n') {
        console.log('  Cancelled.\n');
        return;
      }

      process.argv = ['node', 'install.js', profile, '--target', target];
      if (dryRun) process.argv.push('--dry-run');
      if (fresh) process.argv.push('--fresh');
    } else {
      profile = profile || 'developer';
      const initArgs = hasTarget ? subArgs : [...subArgs, '--target', '.'];
      process.argv = ['node', 'install.js', ...initArgs];
    }

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

    // B2 + B7: Check existing installation for upgrade/downgrade/same-profile warnings
    if (!fresh && !dryRun) {
      const { detectInstalledProfile, readPluginJson } = require('./lib/profile-utils');
      const targetIdx = process.argv.indexOf('--target');
      const targetPath = targetIdx >= 0 ? path.resolve(process.argv[targetIdx + 1]) : path.resolve('.');
      const existingClaudeDir = path.join(targetPath, '.claude');
      const existingPlugin = readPluginJson(existingClaudeDir);

      if (existingPlugin) {
        const existingProfile = existingPlugin.profile || detectInstalledProfile(existingClaudeDir);

        if (existingProfile === profile) {
          // B7: Same profile re-init
          console.log(`\n  Already installed: ${profile} profile (v${existingPlugin.version})`);
          console.log(`  Use "csl init ${profile} --fresh" to reinstall from scratch.\n`);
          return;
        }

        const profileOrder = { core: 1, developer: 2, full: 3 };
        const isDowngrade = profileOrder[profile] < profileOrder[existingProfile];

        if (isDowngrade && !process.env.CI) {
          // B2: Downgrade warning
          const agentCount = existingPlugin.agents ? existingPlugin.agents.length : '?';
          console.log(`\n  WARNING: Downgrade detected`);
          console.log(`  Current: ${existingProfile} (${agentCount} agents)`);
          console.log(`  Target:  ${profile}`);
          console.log(`  Extra agents/skills will become unreferenced.\n`);

          const confirm = await ask(`  Continue with downgrade? [y/N]: `);
          if (confirm.toLowerCase() !== 'y') {
            console.log('  Cancelled.\n');
            return;
          }
        } else if (!isDowngrade) {
          // Upgrade info
          console.log(`\n  Upgrading: ${existingProfile} -> ${profile}`);
        }
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

    // Collect files from source
    const profiles = JSON.parse(fs.readFileSync(path.join(rootDir, 'manifests', 'install-profiles.json'), 'utf8'));
    const modules = JSON.parse(fs.readFileSync(path.join(rootDir, 'manifests', 'install-modules.json'), 'utf8'));

    // Detect which profile is installed based on skill directories
    const installedSkillDirs = fs.existsSync(path.join(claudeDir, 'skills'))
      ? fs.readdirSync(path.join(claudeDir, 'skills'), { withFileTypes: true })
          .filter(e => e.isDirectory()).map(e => e.name)
      : [];
    const hasTier3 = installedSkillDirs.includes('tier-3');
    const hasTier2 = installedSkillDirs.includes('tier-2');
    const detectedProfile = hasTier3 ? 'full' : hasTier2 ? 'developer' : 'core';

    console.log(`  Detected profile:  ${detectedProfile}`);

    const selectedProfile = profiles.profiles[detectedProfile];
    const selectedModules = modules.modules.filter(m => selectedProfile.modules.includes(m.id));

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
      const rebuilt = buildPluginJson(detectedProfile, sourceFiles, newVersion);
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

  upgrade: async () => {
    const { detectInstalledProfile, buildPluginJson, loadManifests } = require('./lib/profile-utils');
    const targetProfile = subArgs.find(a => !a.startsWith('-')) || null;
    const targetDir = path.resolve(subArgs.includes('--target')
      ? subArgs[subArgs.indexOf('--target') + 1] : '.');
    const claudeDir = path.join(targetDir, '.claude');
    const dryRun = subArgs.includes('--dry-run');

    if (!fs.existsSync(claudeDir)) {
      console.log(`\n  No .claude/ found. Run "csl init" first.\n`);
      process.exit(1);
    }

    const currentProfile = detectInstalledProfile(claudeDir);
    if (!currentProfile) {
      console.log(`\n  Could not detect current profile. Run "csl init" first.\n`);
      return;
    }
    const newProfile = targetProfile || currentProfile;
    const profileOrder = { core: 1, developer: 2, full: 3 };

    if (!profileOrder[newProfile]) {
      console.log(`\n  Unknown profile "${newProfile}". Available: core, developer, full\n`);
      return;
    }

    if (profileOrder[newProfile] < profileOrder[currentProfile]) {
      console.log(`\n  Cannot downgrade with upgrade. Use "csl init ${newProfile} --fresh" instead.\n`);
      return;
    }

    console.log(`\n  Claude Skill Lord — Upgrade\n`);
    console.log(`  Current: ${currentProfile}`);
    console.log(`  Target:  ${newProfile}`);

    const { profiles, modules } = loadManifests();
    const selectedProfile = profiles.profiles[newProfile];
    const selectedModules = modules.modules.filter(m => selectedProfile.modules.includes(m.id));

    const filesToCopy = collectModuleFiles(selectedModules);

    let added = 0;
    for (const f of filesToCopy) {
      const destPath = path.join(claudeDir, f.rel);
      if (!fs.existsSync(destPath)) {
        if (dryRun) { console.log(`  + ${f.rel}`); }
        else {
          const destDir = path.dirname(destPath);
          if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
          fs.copyFileSync(f.src, destPath);
        }
        added++;
      }
    }

    if (!dryRun) {
      const pkg = require(path.join(rootDir, 'package.json'));
      const pluginJson = buildPluginJson(newProfile, filesToCopy, pkg.version);
      fs.writeFileSync(path.join(claudeDir, 'plugin.json'), JSON.stringify(pluginJson, null, 2));
    }

    console.log(`\n  ${dryRun ? '[DRY RUN] ' : ''}Added ${added} new files`);
    console.log(`  Profile: ${currentProfile} -> ${newProfile}\n`);
  },

  diff: () => {
    const { detectInstalledProfile, loadManifests } = require('./lib/profile-utils');
    const targetDir = path.resolve(subArgs.includes('--target')
      ? subArgs[subArgs.indexOf('--target') + 1] : '.');
    const claudeDir = path.join(targetDir, '.claude');

    if (!fs.existsSync(claudeDir)) {
      console.log(`\n  No .claude/ found in ${targetDir}\n`);
      process.exit(1);
    }

    const profile = detectInstalledProfile(claudeDir);
    console.log(`\n  Claude Skill Lord — Diff (${profile} profile)\n`);

    const { profiles, modules } = loadManifests();
    const selectedProfile = profiles.profiles[profile];
    const selectedModules = modules.modules.filter(m => selectedProfile.modules.includes(m.id));

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
    const { readPluginJson, detectInstalledProfile } = require('./lib/profile-utils');
    const manifest = JSON.parse(
      fs.readFileSync(path.join(rootDir, 'skills', 'manifest.json'), 'utf8')
    );
    const agents = fs.readdirSync(path.join(rootDir, 'agents')).filter(f => f.endsWith('.md'));

    // Detect installed state from project
    const projectClaudeDir = path.join(process.cwd(), '.claude');
    const projectPlugin = readPluginJson(projectClaudeDir);
    const installedAgents = projectPlugin
      ? new Set((projectPlugin.agents || []).map(a => a.replace('./', '').replace('.md', '')))
      : null;
    const installedSkillDirs = projectPlugin
      ? new Set((projectPlugin.skills || []).map(s => s.replace('./', '').replace(/\/$/, '')))
      : null;

    const tag = (name, set) => set ? (set.has(name) ? ' [installed]' : ' [available]') : '';

    console.log(`\n  Claude Skill Lord Components\n`);

    if (projectPlugin) {
      const profile = projectPlugin.profile || detectInstalledProfile(projectClaudeDir) || '?';
      console.log(`  Project profile: ${profile} (v${projectPlugin.version || '?'})\n`);
    }

    console.log(`  Agents: ${agents.length}`);
    agents.forEach(a => {
      const name = a.replace('.md', '');
      console.log(`    - ${name}${tag(`agents/${name}`, installedAgents)}`);
    });

    console.log(`\n  Skills: ${manifest.skills.length}`);
    [1, 2, 3].forEach(tier => {
      const skills = manifest.skills.filter(s => s.tier === tier);
      const tierDir = `skills/tier-${tier}`;
      const tierInstalled = installedSkillDirs ? installedSkillDirs.has(tierDir) : null;
      const tierTag = tierInstalled === null ? '' : tierInstalled ? ' [installed]' : ' [available]';
      console.log(`\n  Tier ${tier}${tierTag} (${skills.length}):`);
      skills.forEach(s => console.log(`    - ${s.name}: ${s.description}`));
    });

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

    check('manifest.json valid', () => {
      const m = JSON.parse(fs.readFileSync(path.join(rootDir, 'skills', 'manifest.json'), 'utf8'));
      if (!m.skills || m.skills.length === 0) throw new Error('no skills');
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

      // B5: Profile consistency checks
      info('Profile consistency', () => {
        const pPath = path.join(projectClaudeDir, 'plugin.json');
        if (!fs.existsSync(pPath)) throw new Error('no plugin.json');
        const p = JSON.parse(fs.readFileSync(pPath, 'utf8'));

        const declaredAgents = (p.agents || []).map(a => a.replace('./', ''));
        const agentsDir = path.join(projectClaudeDir, 'agents');
        const diskAgents = fs.existsSync(agentsDir)
          ? fs.readdirSync(agentsDir).filter(f => f.endsWith('.md'))
          : [];
        const orphaned = diskAgents.filter(f => !declaredAgents.includes(`agents/${f}`));

        const declaredSkillDirs = (p.skills || []).map(s => s.replace('./', '').replace(/\/$/, ''));
        const missingSkillDirs = declaredSkillDirs.filter(d => !fs.existsSync(path.join(projectClaudeDir, d)));

        if (missingSkillDirs.length > 0) {
          throw new Error(`${missingSkillDirs.length} declared skill dirs missing: ${missingSkillDirs.join(', ')}`);
        }

        const details = [];
        if (orphaned.length > 0) details.push(`${orphaned.length} orphaned agent files`);
        if (p.profile) details.push(`profile: ${p.profile}`);
        if (details.length) console.log(`      (${details.join(', ')})`);
      });

      info('Profile metadata', () => {
        const pPath = path.join(projectClaudeDir, 'plugin.json');
        const p = JSON.parse(fs.readFileSync(pPath, 'utf8'));
        if (!p.profile) {
          throw new Error('no profile field in plugin.json. Run "csl migrate" to fix.');
        }
        const { detectInstalledProfile } = require('./lib/profile-utils');
        const detected = detectInstalledProfile(projectClaudeDir);
        if (detected && detected !== p.profile) {
          throw new Error(`plugin.json says "${p.profile}" but disk shows "${detected}". Run "csl migrate" to fix.`);
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
    init [profile]      Set up in current project (interactive if no profile given)
    upgrade [profile]   Upgrade to a higher profile (additive, no overwrites)
    update              Update CLI to latest version
    migrate             Update installed files to match current CLI version
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

  Upgrade Options:
    --target <path>     Target directory (default: current directory)
    --dry-run           Preview what would be added

  Migrate Options:
    --target <path>     Target directory (default: current directory)
    --dry-run           Preview changes without applying

  Diff Options:
    --target <path>     Target directory (default: current directory)

  Uninstall Options:
    --target <path>     Target directory (default: current directory)
    --force, -f         Skip confirmation prompt

  Profiles:
    core                16 skills, 7 agents — lightweight
    developer           44 skills, 22 agents — recommended
    full                61 skills, 22 agents — everything

  Examples:
    csl init                     # Interactive setup
    csl init full                # Install everything, no questions
    csl init core --dry-run      # Preview core profile
    csl upgrade full             # Upgrade to full profile (additive)
    csl update                   # Update to latest version
    csl migrate                  # Update project files after csl update
    csl migrate --dry-run        # Preview what would change
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
