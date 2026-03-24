---
name: plan-preview
description: Preview markdown files in a directory with a beautiful web interface. Features dark sidebar with search, syntax highlighting with Prism.js, GitHub-flavored markdown, responsive design. Use when you need to preview plans, documentation, or any markdown files.
license: MIT
---

# Plan Preview

Beautiful markdown preview server with professional UI.

## Capabilities

- Recursive markdown scanning in directory and subdirectories
- Dark sidebar with organized file navigation and search
- Syntax highlighting via Prism.js (Tomorrow Night theme)
- GitHub-Flavored Markdown (tables, task lists, strikethrough)
- Responsive design (desktop + mobile)

## Usage

```bash
python3 skills/plan-preview/scripts/preview_server.py [directory]
```

Server starts at: **http://localhost:5555**

### Examples

```bash
# Preview plans
python3 skills/plan-preview/scripts/preview_server.py ./plans

# Preview docs
python3 skills/plan-preview/scripts/preview_server.py ./docs
```

## Dependencies

```bash
pip3 install Flask markdown
```

## File Structure

```
plan-preview/
├── SKILL.md
├── scripts/
│   └── preview_server.py
└── requirements.txt
```

## Integration

Used by `/preview-plan` command (if available):
```
/preview-plan ./docs
```

## Troubleshooting

- **Port in use**: `lsof -ti :5555 | xargs kill -9`
- **Dependencies**: `pip3 install Flask markdown`
- **Encoding**: Files must be UTF-8
