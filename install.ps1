# SkillLord Installer for Windows
# Usage: irm https://raw.githubusercontent.com/donganhvuphp/Claude-Skills-Lord/main/install.ps1 | iex
# Or: .\install.ps1 [profile]

param(
    [string]$Profile = "developer",
    [string]$Target = ""
)

$ErrorActionPreference = "Stop"
$InstallDir = "$env:USERPROFILE\.skilllord"
$RepoUrl = "https://github.com/donganhvuphp/Claude-Skills-Lord.git"

Write-Host ""
Write-Host "  SkillLord Installer"
Write-Host "  ==================="
Write-Host ""

# Check Node.js
try {
    $nodeVersion = (node -v) -replace 'v', ''
    $major = [int]($nodeVersion.Split('.')[0])
    if ($major -lt 18) {
        Write-Host "  Error: Node.js >= 18 required (found v$nodeVersion)" -ForegroundColor Red
        exit 1
    }
    Write-Host "  Node.js: v$nodeVersion ✓"
} catch {
    Write-Host "  Error: Node.js is required (>= 18). Install from https://nodejs.org" -ForegroundColor Red
    exit 1
}

Write-Host "  Profile: $Profile"
Write-Host "  Install dir: $InstallDir"
Write-Host ""

# Clone or update
if (Test-Path $InstallDir) {
    Write-Host "  Updating existing installation..."
    Set-Location $InstallDir
    git pull --quiet
} else {
    Write-Host "  Cloning SkillLord..."
    git clone --quiet --depth 1 $RepoUrl $InstallDir
}

Set-Location $InstallDir

# Install
$targetArg = if ($Target) { "--target", $Target } else { @() }
Write-Host "  Installing $Profile profile..."
Write-Host ""
node scripts/install.js $Profile @targetArg

Write-Host ""
Write-Host "  Done! SkillLord installed to $InstallDir" -ForegroundColor Green
Write-Host ""
Write-Host "  Next steps:"
Write-Host "    cd your-project"
Write-Host "    node $InstallDir\scripts\install.js developer --target ."
Write-Host "    claude  # start using SkillLord commands"
Write-Host ""
