$ErrorActionPreference = "Stop"

Write-Host "🔄 Starting GitHub Sync..." -ForegroundColor Cyan

# Ensure we are in the project root
Set-Location "c:\layerfilm"

# Check status
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "✅ No changes to commit." -ForegroundColor Green
    exit
}

# Add all changes
Write-Host "➕ Adding changes..." -ForegroundColor Yellow
git add .

# Commit with timestamp
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$message = "Auto-sync: $timestamp"
Write-Host "💾 Committing: $message" -ForegroundColor Yellow
git commit -m "$message"

# Push
Write-Host "🚀 Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "✅ Sync Complete!" -ForegroundColor Green
