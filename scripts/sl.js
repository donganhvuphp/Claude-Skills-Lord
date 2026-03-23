#!/usr/bin/env node

/**
 * SkillLord CLI
 * Usage: sl <command> [options]
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const command = args[0];
const subArgs = args.slice(1);

const commands = {
  version: () => {
    const pkg = require(path.join(rootDir, 'package.json'));
    console.log(`SkillLord v${pkg.version}`);
  },

  init: () => {
    // Default to --target . if no --target provided
    const hasTarget = subArgs.includes('--target');
    const initArgs = hasTarget ? subArgs : [...subArgs, '--target', '.'];
    process.argv = ['node', 'install.js', ...initArgs];
    require('./install.js');
  },

  install: () => {
    process.argv = ['node', 'install.js', ...subArgs];
    require('./install.js');
  },

  list: () => {
    const manifest = JSON.parse(
      fs.readFileSync(path.join(rootDir, 'skills', 'manifest.json'), 'utf8')
    );
    const agents = fs.readdirSync(path.join(rootDir, 'agents')).filter(f => f.endsWith('.md'));

    console.log(`\n  SkillLord Components\n`);
    console.log(`  Agents: ${agents.length}`);
    agents.forEach(a => console.log(`    - ${a.replace('.md', '')}`));

    console.log(`\n  Skills: ${manifest.skills.length}`);
    [1, 2, 3].forEach(tier => {
      const skills = manifest.skills.filter(s => s.tier === tier);
      console.log(`\n  Tier ${tier} (${skills.length}):`);
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
    console.log(`\n  SkillLord Doctor\n`);
    let ok = 0;
    let fail = 0;

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

    check('Node.js >= 18', () => {
      const v = parseInt(process.versions.node.split('.')[0]);
      if (v < 18) throw new Error(`Node ${process.versions.node}, need >= 18`);
    });

    check('Python 3 available', () => {
      try {
        execSync('python3 --version', { stdio: 'pipe' });
      } catch {
        throw new Error('not found (needed for ui-ux-pro-max skill)');
      }
    });

    console.log(`\n  Results: ${ok} passed, ${fail} failed\n`);
    if (fail > 0) process.exit(1);
  },

  help: () => {
    console.log(`
  SkillLord — Curated Claude Code Plugin
  https://github.com/donganhvuphp/Claude-Skills-Lord

  Usage: csl <command> [options]

  Commands:
    init [profile]      Set up SkillLord in current project (default: developer)
    list                List all agents, skills, and commands
    doctor              Check installation health
    version             Show version
    help                Show this help

  Init Options:
    --target <path>     Target directory (default: current directory)
    --dry-run           Preview without copying
    --fresh             Clean reinstall (remove existing .claude/ first)

  Profiles:
    core                16 skills, 7 agents — lightweight
    developer           44 skills, 22 agents — recommended
    full                62 skills, 22 agents — everything

  Examples:
    csl init                     # Install developer profile to current dir
    csl init full                # Install everything
    csl init core --dry-run      # Preview core profile
    csl init --target ../other   # Install to another project
    csl doctor                   # Check health
    csl list                     # Show all components
    `);
  },
};

const handler = commands[command] || commands.help;
handler();
