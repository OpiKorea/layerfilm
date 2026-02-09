$ErrorActionPreference = "Stop"
$projectName = "motorcycle-race"
$scriptDir = "C:\layerfilm\scripts"
$assetsDir = "Z:\layerfilm\drama-assets\$projectName"
$imagesDir = Join-Path $assetsDir "images"
$filmsDir = Join-Path $assetsDir "films"

# Ensure dirs
New-Item -ItemType Directory -Path $assetsDir -Force | Out-Null
New-Item -ItemType Directory -Path $imagesDir -Force | Out-Null
New-Item -ItemType Directory -Path $filmsDir -Force | Out-Null

# Generate Start Image
$startImage = Join-Path $imagesDir "scene_001.png"
$python = "C:\layerfilm\.venv\Scripts\python.exe"
$sd_gen = Join-Path $scriptDir "local-sd-generate.py"

Write-Host "🏍️ Generating Starting Line Image..."
& $python $sd_gen --prompt "Cinematic shot of 5 futuristic racing motorcycles lined up on a asphalt track, daytime, stadium background, heat haze, 8k, photorealistic, (rigid body physics:1.2)" --output "$startImage"

if (-not (Test-Path $startImage)) {
    Write-Error "Failed to generate start image."
    exit 1
}

# Write Scene JSON
$jsonFile = Join-Path $assetsDir "full_lifecycle_script.json"
$scenes = @(
    @{
        Name        = "scene_001"
        Description = "The 5 motorcycles speed off the starting line."
        Prompt      = "5 motorcycles accelerating fast on a race track, motion blur, asphalt texture, daytime, cinematic lighting, rigid body physics"
    },
    @{
        Name        = "scene_002"
        Description = "Mid-race, bikes leaning into a corner."
        Prompt      = "Motorcycles leaning into a sharp curve, sparks flying from knee pucks, high speed action, dynamic angle, consistent lighting"
    },
    @{
        Name        = "scene_003"
        Description = "Intense overtaking maneuver."
        Prompt      = "Close up of two motorcycles side by side, riders focused, mechanical details visible, intense speed, (no morphing), (rigid metal)"
    },
    @{
        Name        = "scene_004"
        Description = "One bike crosses the finish line, checkered flag."
        Prompt      = "One winner motorcycle crossing the finish line, checkered flag waving, crowds blurring in background, victory moment, cinematic composition"
    }
)
$scenes | ConvertTo-Json -Depth 4 | Out-File -FilePath $jsonFile -Encoding UTF8

# Run Production
Set-Location $scriptDir
Write-Host "🏁 Starting Recursive Generation pipeline..."
& .\produce-recursive-chain.ps1 -ProjectName $projectName
