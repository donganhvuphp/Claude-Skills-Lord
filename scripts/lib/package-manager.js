#!/usr/bin/env node

/**
 * Package Manager Detection
 *
 * Detects which package manager (npm, yarn, pnpm, bun) the project uses
 * by checking lock files and environment variables.
 *
 * Used by: resolve-formatter.js, session hooks
 */

'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Package manager configurations
 */
const PM_CONFIGS = {
  bun: {
    name: 'bun',
    lockFile: 'bun.lockb',
    execCmd: 'bunx',
    installCmd: 'bun install',
    runCmd: 'bun run',
  },
  pnpm: {
    name: 'pnpm',
    lockFile: 'pnpm-lock.yaml',
    execCmd: 'pnpm exec',
    installCmd: 'pnpm install',
    runCmd: 'pnpm run',
  },
  yarn: {
    name: 'yarn',
    lockFile: 'yarn.lock',
    execCmd: 'yarn dlx',
    installCmd: 'yarn install',
    runCmd: 'yarn run',
  },
  npm: {
    name: 'npm',
    lockFile: 'package-lock.json',
    execCmd: 'npx',
    installCmd: 'npm install',
    runCmd: 'npm run',
  },
};

/**
 * Detect which package manager a project uses.
 *
 * Priority:
 * 1. CLAUDE_PACKAGE_MANAGER env variable
 * 2. Lock file detection (bun > pnpm > yarn > npm)
 * 3. Default to npm
 *
 * @param {{ projectDir?: string }} [options]
 * @returns {{ name: string, config: object }}
 */
function getPackageManager(options = {}) {
  const projectDir = options.projectDir || process.cwd();

  // 1. Environment variable override
  const envPm = process.env.CLAUDE_PACKAGE_MANAGER;
  if (envPm && PM_CONFIGS[envPm]) {
    return { name: envPm, config: PM_CONFIGS[envPm] };
  }

  // 2. Lock file detection (ordered by specificity)
  for (const [name, config] of Object.entries(PM_CONFIGS)) {
    const lockPath = path.join(projectDir, config.lockFile);
    if (fs.existsSync(lockPath)) {
      return { name, config };
    }
  }

  // 3. Default to npm
  return { name: 'npm', config: PM_CONFIGS.npm };
}

module.exports = { getPackageManager, PM_CONFIGS };
