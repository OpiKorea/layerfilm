$python = "C:\layerfilm\.venv\Scripts\python.exe"
$script = "C:\layerfilm\scripts\local-svd-generate.py"
$imgDir = "Z:\layerfilm\drama-assets\noir-city-short\images"
$vidDir = "Z:\layerfilm\drama-assets\noir-city-short\films"

# Ensure output dir
if (!(Test-Path -Path $vidDir)) { New-Item -ItemType Directory -Force -Path $vidDir }

Write-Host "🚀 Starting SVD Motion Generation (Frame Interpolation)..."

# Process all 6 scenes
$scenes = @("scene_01", "scene_02", "scene_03", "scene_04", "scene_05", "scene_06")

foreach ($scene in $scenes) {
    $inputImg = "$imgDir\$scene.png"
    $outputVid = "$vidDir\$scene.mp4"
    
    if (Test-Path $inputImg) {
        Write-Host "🎬 Animating: $scene ..."
        & $python $script --image $inputImg --output $outputVid --seed 42
    }
    else {
        Write-Host "⚠️ Missing Image: $inputImg"
    }
}

Write-Host "✅ All Motion Clips Generated!"
