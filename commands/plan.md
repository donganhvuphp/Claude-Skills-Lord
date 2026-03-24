---
description: "⚡⚡⚡ Restate requirements, assess risks, and create step-by-step implementation plan. WAIT for user CONFIRM before touching any code."
argument-hint: "[task]"
---

## Your mission
<task>
$ARGUMENTS
</task>

## Workflow
- Analyze the given task and ask for more details if needed.
- Decide to use `/plan:fast` or `/plan:hard` SlashCommands based on the complexity:
  - **Simple** (< 3 files, clear scope, familiar tech) → `/plan:fast <enhanced-prompt>`
  - **Complex** (multi-file, unclear scope, new tech, security-sensitive) → `/plan:hard <enhanced-prompt>`
- Execute the chosen SlashCommand with an **enhanced prompt** that describes the task in detail based on the provided task description.
- Activate `planning` skill.

## Important Notes
**IMPORTANT:** Analyze the skills catalog and activate the skills that are needed for the task during the process.
**IMPORTANT:** Sacrifice grammar for the sake of concision when writing reports.
**IMPORTANT:** Ensure token efficiency while maintaining high quality.
**IMPORTANT:** In reports, list any unresolved questions at the end, if any.
**IMPORTANT**: **Do not** start implementing.
