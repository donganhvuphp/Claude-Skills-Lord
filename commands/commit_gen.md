---
description: Generate conventional commit messages based on staged changes
---

Generate a commit message based on staged files and rename branch to match task.

This command analyzes staged git files to create meaningful commit messages and rename the current branch to follow project conventions.

Usage: `/commit_gen #XXXXX`

Given the task ID provided as argument, do this:

1. **Validate Input**: Check task ID format matches `#\d+` pattern
2. **Check Staged Files**: Use `git diff --staged --name-only` to get list of staged files
3. **Analyze Changes**: 
   - Determine primary scope (e.g., modals, reports, components, utils) based on file paths
   - Identify change type (feat, fix, refactor, enhance) based on file modifications
   - Generate descriptive summary of changes
4. **Generate Commit Message**:
   - Format: `MICRO: #{task_id} {type}({scope}): {description}`
   - Add detailed bullet points describing specific changes
   - Exclude any Claude Code references or generated annotations
5. **Create Commit**: Execute `git commit -m "message"` with generated message
6. **Rename Branch**: 
   - Generate new branch name: `feature/{task_id}_{sanitized_description}`
   - Use `git branch -m` to rename current branch
   - Replace spaces with underscores, remove special characters

## Example Usage:
```
/commit_gen #25421
```

## Example Output:
- **Commit Message**: `MICRO: #25421 feat(modals): add hashtag report button with popup functionality`
- **New Branch Name**: `feature/25421_add_hashtag_report_button_with_popup_functionality`

## Error Handling:
- Verify task ID format is valid
- Ensure there are staged files to commit
- Handle git command failures gracefully
- Validate branch rename operations

Context for commit generation: $ARGUMENTS