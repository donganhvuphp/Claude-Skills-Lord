#!/bin/bash
set -e

# SkillLord Installer for macOS/Linux
# Usage: curl -fsSL https://raw.githubusercontent.com/donganhvuphp/Claude-Skills-Lord/main/install.sh | bash
# Or: ./install.sh [profile]

PROFILE="${1:-developer}"
INSTALL_DIR="$HOME/.skilllord"
REPO_URL="https://github.com/donganhvuphp/Claude-Skills-Lord.git"

echo ""
echo "  SkillLord Installer"
echo "  ==================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "  Error: Node.js is required (>= 18). Install from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "  Error: Node.js >= 18 required (found v$(node -v))"
    exit 1
fi

echo "  Node.js: $(node -v) ✓"
echo "  Profile: $PROFILE"
echo "  Install dir: $INSTALL_DIR"
echo ""

# Clone or update
if [ -d "$INSTALL_DIR" ]; then
    echo "  Updating existing installation..."
    cd "$INSTALL_DIR"
    git pull --quiet
else
    echo "  Cloning SkillLord..."
    git clone --quiet --depth 1 "$REPO_URL" "$INSTALL_DIR"
fi

cd "$INSTALL_DIR"

# Install to current project
if [ -n "$2" ]; then
    TARGET="$2"
else
    TARGET="$(pwd)"
fi

echo "  Installing $PROFILE profile..."
echo ""
node scripts/install.js "$PROFILE" --target "$TARGET"

echo ""
echo "  Done! SkillLord installed to $INSTALL_DIR"
echo ""
echo "  Next steps:"
echo "    cd your-project"
echo "    node $INSTALL_DIR/scripts/install.js developer --target ."
echo "    claude  # start using SkillLord commands"
echo ""
