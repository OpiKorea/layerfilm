$python = "C:\layerfilm\.venv\Scripts\python.exe"
$script = "C:\layerfilm\scripts\local-svd-generate.py"
$imgDir = "Z:\layerfilm\drama-assets\the-last-unicorn\images"
$vidDir = "Z:\layerfilm\drama-assets\the-last-unicorn\films"

if (!(Test-Path -Path $vidDir)) { New-Item -ItemType Directory -Force -Path $vidDir }

# Get all png images
$images = Get-ChildItem -Path $imgDir -Filter "*.png" | Sort-Object Name

Write-Host "?? Starting Unicorn Motion Generation (SVD)..."
Write-Host "?? Scenes found: $($images.Count)"

foreach ($img in $images) {
    $baseName = $img.BaseName
    $videoPath = Join-Path $vidDir "$baseName.mp4"
    
    if (Test-Path $videoPath) {
        Write-Host "?? Skipping $baseName (Already exists)"
    }
    else {
        Write-Host "?? Animating: $baseName ..."
        # SVD-XT (Default 25 frames, 7fps)
        & $python $script --image "$($img.FullName)" --output $videoPath --skip-master
    }
}
Write-Host "?? All Unicorn Clips Animated!"
