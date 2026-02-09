$ErrorActionPreference = "Stop"
$scriptDir = "C:\layerfilm\scripts"
$assetsDir = "Z:\layerfilm\drama-assets\the-last-unicorn"
$jsonFile = Join-Path $assetsDir "full_lifecycle_script.json"

$python = "C:\layerfilm\.venv\Scripts\python.exe"
$p_img2img = Join-Path $scriptDir "local-sd-img2img.py"

$scenes = Get-Content $jsonFile | ConvertFrom-Json

Write-Host "🎨 STARTING IMAGE-ONLY PRODUCTION (30 SCENES)"
Write-Host "Using Img2Img Chaining for MAX CONTINUITY."

# Scene 1 is provided by the user (Already saved in Z:\...\images\scene_001.png)
$prevImage = Join-Path $assetsDir "images\scene_001.png"

# Filter to skip scene 1 processing since it's the anchor
$remainingScenes = $scenes | Where-Object { $_.Name -ne "scene_001" }

foreach ($scene in $remainingScenes) {
    $idx = $scenes.IndexOf($scene) + 1
    Write-Host "`n🎨 [Image $idx/30] Generating $($scene.Name)..."
    
    $imgOut = Join-Path $assetsDir "images\$($scene.Name).png"
    
    if (Test-Path $imgOut) {
        Write-Host "   Already exists, skipping."
    }
    else {
        # Using 0.35 strength for a balance between new movement and old context
        & $python $p_img2img --prompt "$($scene.Prompt)" --init_image "$prevImage" --output "$imgOut" --strength 0.35 --seed 42
    }
    $prevImage = $imgOut
}

Write-Host "`n✅ Done! 30 scenes are ready in the 'images' folder for your review."
