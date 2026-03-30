#!/usr/bin/env node

/**
 * Prepare Release Assets
 *
 * Called by semantic-release during the prepare step.
 * Creates a zip archive of the plugin for GitHub releases.
 *
 * Usage: node scripts/prepare-release-assets.cjs <version>
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const version = process.argv[2];
if (!version) {
  console.error('Usage: node scripts/prepare-release-assets.cjs <version>');
  process.exit(1);
}

const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');
const zipName = 'claude-skill-lord.zip';
const zipPath = path.join(distDir, zipName);

// Ensure dist/ exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Update version in plugin.json and marketplace.json
const pluginJsonPath = path.join(root, '.claude-plugin', 'plugin.json');
const marketplaceJsonPath = path.join(root, '.claude-plugin', 'marketplace.json');

function updateJsonVersion(filePath, version) {
  if (!fs.existsSync(filePath)) return;
  const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  if (json.version) {
    json.version = version;
  }
  // marketplace.json has nested plugins[].version
  if (json.plugins) {
    for (const plugin of json.plugins) {
      if (plugin.version) plugin.version = version;
    }
  }
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n');
}

updateJsonVersion(pluginJsonPath, version);
updateJsonVersion(marketplaceJsonPath, version);

console.log(`Updated plugin configs to version ${version}`);

// Read files list from package.json
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const includePatterns = (pkg.files || []).join(' ');

// Create zip (exclude git, node_modules, dist itself)
try {
  // Remove old zip if exists
  if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
  }

  execSync(
    `zip -r "${zipPath}" ${includePatterns} -x "*.DS_Store" -x "__MACOSX/*" -x "*.git*"`,
    { cwd: root, stdio: 'pipe' }
  );

  const stats = fs.statSync(zipPath);
  const sizeMB = (stats.size / 1024 / 1024).toFixed(1);
  console.log(`Created ${zipName} (${sizeMB} MB)`);
} catch (err) {
  console.error(`Failed to create zip: ${err.message}`);
  process.exit(1);
}
