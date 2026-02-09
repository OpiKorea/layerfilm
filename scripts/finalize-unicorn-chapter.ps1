$ErrorActionPreference = "Stop"

Write-Host "🤖 [AUTO-PILOT] Starting Post-Generation Pipeline..."

# Step 1: Motion Generation
Write-Host "`n🎬 [1/3] Generating Motion (SVD)..."
& C:\layerfilm\scripts\generate-unicorn-motion.ps1

# Step 2: 4K 60FPS Conversion
Write-Host "`n✨ [2/3] Upscaling to 4K 60FPS (YouTube Max)..."
& C:\layerfilm\scripts\convert-to-4k-60fps.ps1

# Step 3: Assembly
Write-Host "`n🎞️ [3/3] Assembling Seamless Cut..."
node C:\layerfilm\scripts\assemble-unicorn-seamless.js

Write-Host "`n✅ MISSION COMPLETE: Unicorn Childhood Chapter Ready."
