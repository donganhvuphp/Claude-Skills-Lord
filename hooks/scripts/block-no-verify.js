#!/usr/bin/env node
/**
 * Inline replacement for npx block-no-verify.
 * Reads Claude hook stdin (JSON with tool_input), checks for --no-verify flag.
 * Exit 0 = allow, Exit 2 = block (Claude hook convention).
 */
let data = '';
process.stdin.on('data', chunk => { data += chunk; });
process.stdin.on('end', () => {
  try {
    const input = JSON.parse(data);
    const cmd = input.tool_input?.command || '';
    if (/--no-verify/.test(cmd)) {
      console.error('BLOCKED: --no-verify flag is not allowed. Git hooks must run.');
      process.exit(2);
    }
  } catch { /* non-JSON input — allow */ }
  process.exit(0);
});
