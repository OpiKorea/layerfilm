$ErrorActionPreference = "Stop"
$scriptDir = "C:\layerfilm\scripts"
$assetsDir = "Z:\layerfilm\drama-assets\the-last-unicorn"
$jsonFile = Join-Path $assetsDir "full_lifecycle_script.json"

# Tools
$python = "C:\layerfilm\.venv\Scripts\python.exe"
$p_img2img = Join-Path $scriptDir "local-sd-img2img.py"
$p_txt2img = Join-Path $scriptDir "local-sd-generate.py"
$p_svd = Join-Path $scriptDir "local-svd-generate.py"
$p_conv = Join-Path $scriptDir "convert-to-4k-60fps.ps1" # We will reuse logic or call it per file

# Load Script
$scenes = Get-Content $jsonFile | ConvertFrom-Json

Write-Host "🎬 STARTING 10-MINUTE FILM PRODUCTION (150 SCENES)"
Write-Host "⚠️ This will take several hours. Do not close window."

$prevImage = $null

foreach ($scene in $scenes) {
    $idx = $scenes.IndexOf($scene) + 1
    Write-Host "`n🎥 [Scene $idx/150] Processing $($scene.Name)..."
    
    $imgOut = Join-Path $assetsDir "images\$($scene.Name).png"
    $vidOut = Join-Path $assetsDir "films\$($scene.Name).mp4"
    $vidFinal = Join-Path $assetsDir "films_4k_60fps\$($scene.Name).mp4"
    
    # 1. Image Generation
    if (Test-Path $imgOut) {
        Write-Host "   Example Image exists, skipping generation."
        $prevImage = $imgOut
    }
    else {
        # First scene OR different stage transition triggers new Txt2Img
        # Img2Img only works well if the subject is similar. 
        # When moving Foal -> Adult, we might need a fresh start or very low strength impl.
        # For simplicity & stability: Use Img2Img for continuity within stages, Txt2Img for new stages?
        # User wants "Best Continuity". Let's try Img2Img even across stages but with lower strength.
        
        if ($prevImage -ne $null) {
            Write-Host "   🎨 Generatng via Img2Img (Chaining)..."
            # Strength 0.3 for consistency, maybe 0.4 for stage changes?
            & $python $p_img2img --prompt "$($scene.Prompt)" --init_image "$prevImage" --output "$imgOut" --strength 0.35 --seed 42
        }
        else {
            Write-Host "   🎨 Generating Base Image (Txt2Img)..."
            & $python $p_txt2img --prompt "$($scene.Prompt)" --output "$imgOut" --steps 40 --seed 42 --neg "other horses, multiple subjects"
        }
        $prevImage = $imgOut
    }
    
    # 2. Motion (SVD)
    if (!(Test-Path $vidOut)) {
        Write-Host "   🎬 Generating Motion..."
        & $python $p_svd --image "$imgOut" --output "$vidOut"
    }
    
    # 3. 4K 60FPS
    if (!(Test-Path $vidFinal)) {
        Write-Host "   ✨ Converting to 4K 60FPS..."
        # Call ffmpeg directly or use helper? Let's use helper script logic inline or call single file arg if supported?
        # The script convert-to-4k-60fps.ps1 processes a folder.
        # To avoid overhead scanning 150 files every time, let's just run the conversion command directly here.
        
        $ffmpeg = "C:\layerfilm\.venv\Lib\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"
        $filter = "minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1,scale=3840:2160:flags=lanczos"
        $argList = "-i `"$vidOut`" -vf `"$filter`" -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -y `"$vidFinal`""
        
        # Ensure dir
        if (!(Test-Path "Z:\layerfilm\drama-assets\the-last-unicorn\films_4k_60fps")) { New-Item -ItemType Directory -Force -Path "Z:\layerfilm\drama-assets\the-last-unicorn\films_4k_60fps" }
        
        Start-Process -FilePath $ffmpeg -ArgumentList $argList -Wait -NoNewWindow
    }
}

# 4. Final Assembly
Write-Host "`n🎞️ Assembling Final 10-Minute Cut..."
node C:\layerfilm\scripts\assemble-unicorn-seamless.js

Write-Host "`n*** GRAND PRODUCTION COMPLETE! ***"
