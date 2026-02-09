$ErrorActionPreference = "Stop"

Write-Host "🧹 Cleaning build artifacts..." -ForegroundColor Cyan

# Remove .next folder
if (Test-Path ".next") {
    Write-Host "Removing .next folder..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force ".next"
    Write-Host "✅ .next folder removed." -ForegroundColor Green
}
else {
    Write-Host "ℹ️ .next folder not found." -ForegroundColor Gray
}

# Remove tsconfig.tsbuildinfo
if (Test-Path "tsconfig.tsbuildinfo") {
    Write-Host "Removing tsconfig.tsbuildinfo..." -ForegroundColor Yellow
    Remove-Item -Force "tsconfig.tsbuildinfo"
    Write-Host "✅ tsconfig.tsbuildinfo removed." -ForegroundColor Green
}

# Run build
Write-Host "🚀 Starting fresh build..." -ForegroundColor Cyan
npm run build
