# Grand Master Wan 2.2 - API Integration Script
# This script triggers the ComfyUI API to generate video using the Hollywood 2026 workflow.

Param(
    [string]$ProjectName = "Hollywood_Test",
    [string]$Prompt = "A cinematic shot of a futuristic motorcycle racing through Neo-Tokyo",
    [string]$Workflow = "Z:\layerfilm\programs\ComfyUI\workflow_grand_master_2026.json"
)

Write-Host "?? HOLLYWOOD 2026 - API INTEGRATION ACTIVE ??" -ForegroundColor Cyan
Write-Host "Project: $ProjectName"

# 1. Start ComfyUI if not running
$process = Get-Process -Name "python" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*ComfyUI\main.py*" }
if (-not $process) {
    Write-Host "Engine is offline. Launching Grand Master Engine..." -ForegroundColor Yellow
    Start-Process -FilePath "C:\layerfilm\.venv\Scripts\python.exe" -ArgumentList "Z:\layerfilm\programs\ComfyUI\main.py --listen 127.0.0.1 --port 8188 --reserve-vram 2.0 --highvram" -WindowStyle Hidden
    Write-Host "Waiting for engine to warm up (30s)..."
    Start-Sleep -Seconds 30
}

# 2. Trigger Workflow via API Bridge
Write-Host "Queueing Hollywood Generation Task..." -ForegroundColor Green
& C:\layerfilm\.venv\Scripts\python.exe c:\layerfilm\scripts\comfy-api-bridge.py $Workflow

Write-Host "?? Task Successfully Handled by Grand Master Engine."
Write-Host "Check Z:\layerfilm\programs\ComfyUI\output for your masterpiece." -ForegroundColor Cyan
