/**
 * Cross-platform utility functions for Claude Code hooks and scripts
 * Works on Windows, macOS, and Linux
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

// Platform detection
const isWindows = process.platform === 'win32';
const isMacOS = process.platform === 'darwin';
const isLinux = process.platform === 'linux';

/**
 * Get the user's home directory (cross-platform)
 */
function getHomeDir() {
  return os.homedir();
}

/**
 * Get the Claude config directory
 */
function getClaudeDir() {
  return path.join(getHomeDir(), '.claude');
}

/**
 * Get the sessions directory
 */
function getSessionsDir() {
  return path.join(getClaudeDir(), 'sessions');
}

/**
 * Get the learned skills directory
 */
function getLearnedSkillsDir() {
  return path.join(getClaudeDir(), 'skills', 'learned');
}

/**
 * Ensure a directory exists (create if not)
 * @param {string} dirPath - Directory path to create
 * @returns {string} The directory path
 * @throws {Error} If directory cannot be created (e.g., permission denied)
 */
function ensureDir(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  } catch (err) {
    // EEXIST is fine (race condition with another process creating it)
    if (err.code !== 'EEXIST') {
      throw new Error(`Failed to create directory '${dirPath}': ${err.message}`);
    }
  }
  return dirPath;
}

/**
 * Get current date in YYYY-MM-DD format
 */
function getDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get current time in HH:MM format
 */
function getTimeString() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Get the git repository name
 */
function getGitRepoName() {
  const result = runCommand('git rev-parse --show-toplevel');
  if (!result.success) return null;
  return path.basename(result.output);
}

/**
 * Get project name from git repo or current directory
 */
function getProjectName() {
  const repoName = getGitRepoName();
  if (repoName) return repoName;
  return path.basename(process.cwd()) || null;
}

/**
 * Get short session ID from CLAUDE_SESSION_ID environment variable
 * Returns last 8 characters, falls back to project name then 'default'
 */
function getSessionIdShort(fallback = 'default') {
  const sessionId = process.env.CLAUDE_SESSION_ID;
  if (sessionId && sessionId.length > 0) {
    return sessionId.slice(-8);
  }
  return getProjectName() || fallback;
}

/**
 * Find files matching a pattern in a directory (cross-platform alternative to find)
 * @param {string} dir - Directory to search
 * @param {string} pattern - File pattern (e.g., "*.tmp", "*.md")
 * @param {object} options - Options { maxAge: days, recursive: boolean }
 */
function findFiles(dir, pattern, options = {}) {
  if (!dir || typeof dir !== 'string') return [];
  if (!pattern || typeof pattern !== 'string') return [];

  const { maxAge = null, recursive = false } = options;
  const results = [];

  if (!fs.existsSync(dir)) {
    return results;
  }

  // Escape all regex special characters, then convert glob wildcards.
  // Order matters: escape specials first, then convert * and ? to regex equivalents.
  const regexPattern = pattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '.*')
    .replace(/\?/g, '.');
  const regex = new RegExp(`^${regexPattern}$`);

  function searchDir(currentDir) {
    try {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);

        if (entry.isFile() && regex.test(entry.name)) {
          let stats;
          try {
            stats = fs.statSync(fullPath);
          } catch {
            continue; // File deleted between readdir and stat
          }

          if (maxAge !== null) {
            const ageInDays = (Date.now() - stats.mtimeMs) / (1000 * 60 * 60 * 24);
            if (ageInDays <= maxAge) {
              results.push({ path: fullPath, mtime: stats.mtimeMs });
            }
          } else {
            results.push({ path: fullPath, mtime: stats.mtimeMs });
          }
        } else if (entry.isDirectory() && recursive) {
          searchDir(fullPath);
        }
      }
    } catch (_err) {
      // Ignore permission errors
    }
  }

  searchDir(dir);

  // Sort by modification time (newest first)
  results.sort((a, b) => b.mtime - a.mtime);

  return results;
}

/**
 * Read JSON from stdin (for hook input)
 * @param {object} options - Options
 * @param {number} options.timeoutMs - Timeout in milliseconds (default: 5000).
 *   Prevents hooks from hanging indefinitely if stdin never closes.
 * @returns {Promise<object>} Parsed JSON object, or empty object if stdin is empty
 */
async function readStdinJson(options = {}) {
  const { timeoutMs = 5000, maxSize = 1024 * 1024 } = options;

  return new Promise((resolve) => {
    let data = '';
    let settled = false;

    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        // Clean up stdin listeners so the event loop can exit
        process.stdin.removeAllListeners('data');
        process.stdin.removeAllListeners('end');
        process.stdin.removeAllListeners('error');
        if (process.stdin.unref) process.stdin.unref();
        // Resolve with whatever we have so far rather than hanging
        try {
          resolve(data.trim() ? JSON.parse(data) : {});
        } catch {
          resolve({});
        }
      }
    }, timeoutMs);

    process.stdin.setEncoding('utf8');
    process.stdin.on('data', chunk => {
      if (data.length < maxSize) {
        data += chunk;
      }
    });

    process.stdin.on('end', () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      try {
        resolve(data.trim() ? JSON.parse(data) : {});
      } catch {
        // Consistent with timeout path: resolve with empty object
        // so hooks don't crash on malformed input
        resolve({});
      }
    });

    process.stdin.on('error', () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      // Resolve with empty object so hooks don't crash on stdin errors
      resolve({});
    });
  });
}

/**
 * Log to stderr (visible to user in Claude Code)
 */
function log(message) {
  console.error(message);
}

/**
 * Output to stdout (returned to Claude)
 */
function output(data) {
  if (typeof data === 'object') {
    console.log(JSON.stringify(data));
  } else {
    console.log(data);
  }
}

/**
 * Read a text file safely
 */
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

/**
 * Write a text file
 */
function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
}

/**
 * Run a command and return output
 *
 * SECURITY NOTE: This function executes shell commands. Only use with
 * trusted, hardcoded commands. Never pass user-controlled input directly.
 * For user input, use spawnSync with argument arrays instead.
 *
 * @param {string} cmd - Command to execute (should be trusted/hardcoded)
 * @param {object} options - execSync options
 */
function runCommand(cmd, options = {}) {
  // Allowlist: only permit known-safe command prefixes
  const allowedPrefixes = ['git ', 'node ', 'npx ', 'which ', 'where '];
  if (!allowedPrefixes.some(prefix => cmd.startsWith(prefix))) {
    return { success: false, output: 'runCommand blocked: unrecognized command prefix' };
  }

  // Reject shell metacharacters. $() and backticks are evaluated inside
  // double quotes, so block $ and ` anywhere in cmd. Other operators
  // (;|&) are literal inside quotes, so only check unquoted portions.
  const unquoted = cmd.replace(/"[^"]*"/g, '').replace(/'[^']*'/g, '');
  if (/[;|&\n]/.test(unquoted) || /[`$]/.test(cmd)) {
    return { success: false, output: 'runCommand blocked: shell metacharacters not allowed' };
  }

  try {
    const result = execSync(cmd, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      ...options
    });
    return { success: true, output: result.trim() };
  } catch (err) {
    return { success: false, output: err.stderr || err.message };
  }
}

/**
 * Check if current directory is a git repository
 */
function isGitRepo() {
  return runCommand('git rev-parse --git-dir').success;
}

/**
 * Get git modified files, optionally filtered by regex patterns
 * @param {string[]} patterns - Array of regex pattern strings to filter files.
 *   Invalid patterns are silently skipped.
 * @returns {string[]} Array of modified file paths
 */
function getGitModifiedFiles(patterns = []) {
  if (!isGitRepo()) return [];

  const result = runCommand('git diff --name-only HEAD');
  if (!result.success) return [];

  let files = result.output.split('\n').filter(Boolean);

  if (patterns.length > 0) {
    // Pre-compile patterns, skipping invalid ones
    const compiled = [];
    for (const pattern of patterns) {
      if (typeof pattern !== 'string' || pattern.length === 0) continue;
      try {
        compiled.push(new RegExp(pattern));
      } catch {
        // Skip invalid regex patterns
      }
    }
    if (compiled.length > 0) {
      files = files.filter(file => compiled.some(regex => regex.test(file)));
    }
  }

  return files;
}

/**
 * Strip all ANSI escape sequences from a string.
 *
 * Handles:
 * - CSI sequences: \x1b[ … <letter>  (colors, cursor movement, erase, etc.)
 * - OSC sequences: \x1b] … BEL/ST    (window titles, hyperlinks)
 * - Charset selection: \x1b(B
 * - Bare ESC + single letter: \x1b <letter>  (e.g. \x1bM for reverse index)
 *
 * @param {string} str - Input string possibly containing ANSI codes
 * @returns {string} Cleaned string with all escape sequences removed
 */
function stripAnsi(str) {
  if (typeof str !== 'string') return '';
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1b(?:\[[0-9;?]*[A-Za-z]|\][^\x07\x1b]*(?:\x07|\x1b\\)|\([A-Z]|[A-Z])/g, '');
}

module.exports = {
  // Platform info
  isWindows,
  isMacOS,
  isLinux,

  // Directories
  getClaudeDir,
  getSessionsDir,
  getLearnedSkillsDir,
  ensureDir,

  // Date/Time
  getDateString,
  getTimeString,

  // Session/Project
  getSessionIdShort,
  getGitRepoName,
  getProjectName,

  // File operations
  findFiles,
  readFile,
  writeFile,

  // String sanitisation
  stripAnsi,

  // Hook I/O
  readStdinJson,
  log,
  output,

  // System
  runCommand,
  isGitRepo,
  getGitModifiedFiles
};
