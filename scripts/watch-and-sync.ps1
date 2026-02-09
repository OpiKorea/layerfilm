$ErrorActionPreference = "SilentlyContinue"

Write-Host "👀 Starting Content Watcher (Auto-Sync every 60s)..." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop." -ForegroundColor Gray

while ($true) {
    # Check for changes without outputting to console unless there are changes
    $status = git status --porcelain

    if (-not [string]::IsNullOrWhiteSpace($status)) {
        $timestamp = Get-Date -Format "HH:mm:ss"
        Write-Host "[$timestamp] ⚡ Changes detected. Syncing..." -ForegroundColor Yellow
        
        # Call the sync script
        try {
            .\scripts\sync-github.ps1
        }
        catch {
            Write-Host "❌ Sync failed: $_" -ForegroundColor Red
        }
    }

    Start-Sleep -Seconds 60
}
