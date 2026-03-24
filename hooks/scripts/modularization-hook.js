#!/usr/bin/env node

/**
 * Modularization Hook - PostToolUse
 *
 * Suggests modularization for files exceeding 200 LOC.
 * Non-blocking (always exits 0).
 */

const fs = require('fs');
const path = require('path');

const LOC_THRESHOLD = 200;

try {
  const stdin = fs.readFileSync(0, 'utf-8').trim();
  if (!stdin) process.exit(0);

  const payload = JSON.parse(stdin);
  const filePath = payload.tool_input?.file_path;

  if (!filePath || !fs.existsSync(filePath)) {
    process.exit(0);
  }

  const lines = fs.readFileSync(filePath, 'utf-8').split('\n').length;

  if (lines > LOC_THRESHOLD) {
    const relativePath = path.relative(process.cwd(), filePath);
    const output = {
      continue: true,
      hookSpecificOutput: {
        hookEventName: 'PostToolUse',
        additionalContext: [
          `📊 File ${relativePath} has ${lines} LOC (threshold: ${LOC_THRESHOLD}).`,
          `Consider modularization:`,
          `- Analyze logical separation boundaries`,
          `- Use descriptive file names for LLM tools (Grep, Glob)`,
          `- After modularization, continue with main task`
        ].join('\n')
      }
    };
    console.log(JSON.stringify(output));
  }

  process.exit(0);
} catch (error) {
  process.exit(0);
}
