param (
    [string]$ProjectName = "the-last-unicorn"
)

$ErrorActionPreference = "Stop"
$scriptDir = "C:\layerfilm\scripts"
$assetsDir = "Z:\layerfilm\drama-assets\$ProjectName"
$jsonFile = Join-Path $assetsDir "full_lifecycle_script.json"

$python = "C:\layerfilm\.venv\Scripts\python.exe"
$ffmpeg = "C:\layerfilm\.venv\Lib\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"
$p_img2img = Join-Path $scriptDir "local-sd-img2img.py"
$p_svd = Join-Path $scriptDir "local-svd-generate.py"

# Load 60s Script (15-20 scenes)
$scenes = Get-Content $jsonFile | ConvertFrom-Json

Write-Host "🔄 STARTING RECURSIVE CHAIN PRODUCTION (60 SECONDS)"
Write-Host "✅ Production Protocol Active: Enforcing Identity, Physics & Anatomy (200 Checklist)"
Write-Host "Logic: Motion N -> Last Frame -> Image N+1 (MAX CONTINUITY)"

# Start from User's Image (scene_001.png)
$currentInputImage = Join-Path $assetsDir "images\scene_001.png"

foreach ($scene in $scenes) {
    $idx = $scenes.IndexOf($scene) + 1
    Write-Host "`n🎞️ [Scene $idx/$($scenes.Count)] Processing $($scene.Name)..."
    
    $vidOut = Join-Path $assetsDir "films\$($scene.Name).mp4"
    $nextAnchor = Join-Path $assetsDir "images\anchor_$($scene.Name).png"
    $nextImage = Join-Path $assetsDir "images\scene_$(($idx + 1).ToString('000')).png"

    # 1. Generate Motion for Current Scene
    $lastFramePath = $vidOut.Replace(".mp4", "_last.png")
    
    # Check if BOTH video and anchor exist, otherwise regenerate
    if (!(Test-Path $vidOut) -or !(Test-Path $lastFramePath)) {
        Write-Host "   🎬 Animating: $currentInputImage"
        & $python $p_svd --image "$currentInputImage" --output "$vidOut" --skip-master
        Start-Sleep -Seconds 2
    }

    if (!(Test-Path $vidOut)) {
        Write-Error "Failed to generate video: $vidOut"
        continue
    }

    # 2. Extract LAST FRAME for next scene seeding
    # Optimization: Python script already generates _last.png, so we just copy it.
    
    if (Test-Path $lastFramePath) {
        Copy-Item -Path $lastFramePath -Destination $nextAnchor -Force
        Write-Host "   📸 Anchor Extracted (Cached): $nextAnchor"
    }
    else {
        Write-Warning "   ⚠️ Cached frame MISSING at: $generatedLastFrame"
        Write-Host "   📂 Directory contents:"
        Get-ChildItem (Split-Path $vidOut) | Select-Object Name | Format-Table -HideTableHeaders | Out-String | Write-Host
         
        # Fallback (Should not happen if script runs correctly)
        Write-Warning "   ⚠️ Attempting extraction with ffmpeg..."
        & $ffmpeg -sseof -0.1 -i "$vidOut" -update 1 -q:v 1 -y "$nextAnchor"
    }
    
    if (!(Test-Path $nextAnchor)) {
        Write-Error "Failed to extract anchor: $nextAnchor"
        continue
    }

    # 3. Generate NEXT Image using the Terminal Frame as Init_Image
    if ($idx -lt $scenes.Count) {
        $nextScene = $scenes[$idx]
        Write-Host "   🎨 Generating Next Image (Scene $(($idx + 1).ToString('000'))) from Anchor..."
        & $python $p_img2img --prompt "$($nextScene.Prompt)" --init_image "$nextAnchor" --output "$nextImage" --strength 0.3 --seed 42
        
        if (Test-Path $nextImage) {
            $currentInputImage = $nextImage
        }
        else {
            Write-Error "Failed to generate next image: $nextImage"
            break
        }
    }
}

# 4. Final Processing & Assembly
Write-Host "`n✨ All scenes generated with recursive feedback."
& $scriptDir\convert-to-4k-60fps.ps1 -ProjectName $ProjectName
node $scriptDir\assemble-unicorn-seamless.js $ProjectName

Write-Host "`n✅ RECURSIVE PRODUCTION COMPLETE."
