/**
 * Shared utilities for installation and plugin.json generation.
 * Used by: install.js, sl.js (migrate, doctor, list, diff)
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..', '..');

function loadManifests() {
  const manifest = JSON.parse(fs.readFileSync(path.join(rootDir, 'manifests', 'install-profiles.json'), 'utf8'));
  const modules = JSON.parse(fs.readFileSync(path.join(rootDir, 'manifests', 'install-modules.json'), 'utf8'));
  return { manifest, modules };
}

function buildPluginJson(profile, filesToCopy, version) {
  const agentFiles = filesToCopy
    .filter(f => f.rel.startsWith('agents/') && f.rel.endsWith('.md'))
    .map(f => `./${f.rel}`);

  const skillDirs = new Set();
  filesToCopy
    .filter(f => f.rel.startsWith('skills/'))
    .forEach(f => {
      const parts = f.rel.split('/');
      if (parts.length >= 2) skillDirs.add(`./${parts[0]}/${parts[1]}/`);
    });

  return {
    name: 'claude-skill-lord',
    version,
    description: `Claude Skill Lord v${version}`,
    agents: agentFiles,
    commands: ['./commands/'],
    skills: [...skillDirs],
  };
}

function readPluginJson(claudeDir) {
  const p = path.join(claudeDir, 'plugin.json');
  if (!fs.existsSync(p)) return null;
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch { return null; }
}

function collectFiles(dirPath, relBase, results) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relPath = path.join(relBase, entry.name);
    if (entry.isDirectory()) collectFiles(fullPath, relPath, results);
    else results.push({ src: fullPath, rel: relPath });
  }
}

function collectModuleFiles(selectedModules) {
  const filesToCopy = [];
  for (const mod of selectedModules) {
    for (const srcRelPath of mod.paths) {
      const srcFullPath = path.join(rootDir, srcRelPath);
      if (!fs.existsSync(srcFullPath)) continue;
      const stat = fs.statSync(srcFullPath);
      if (stat.isDirectory()) {
        const collected = [];
        collectFiles(srcFullPath, srcRelPath, collected);
        if (mod.destPrefix) {
          collected.forEach(f => {
            const relToSrc = path.relative(
              path.resolve(rootDir, srcRelPath),
              path.resolve(rootDir, f.rel)
            );
            f.rel = path.join(mod.destPrefix, path.basename(srcRelPath), relToSrc);
          });
        }
        filesToCopy.push(...collected);
      } else {
        const rel = mod.destPrefix ? path.join(mod.destPrefix, srcRelPath) : srcRelPath;
        filesToCopy.push({ src: srcFullPath, rel });
      }
    }
  }
  return filesToCopy;
}

module.exports = { loadManifests, buildPluginJson, readPluginJson, collectFiles, collectModuleFiles };
