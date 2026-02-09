param (
    [string]$ProjectName = "the-last-unicorn"
)

$ErrorActionPreference = "Stop"
$ffmpeg = "C:\layerfilm\.venv\Lib\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"
$assetsDir = "Z:\layerfilm\drama-assets\$ProjectName\films"
$outDir = "Z:\layerfilm\drama-assets\$ProjectName\films_4k_60fps"

if (!(Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir -Force }

$videos = Get-ChildItem $assetsDir -Filter "*.mp4"

foreach ($video in $videos) {
    $inputPath = $video.FullName
    $baseName = $video.BaseName
    $finalOutput = Join-Path $outDir "$baseName.mp4"
    $interpOutput = Join-Path $outDir "${baseName}_60fps_raw.mp4"

    if (Test-Path $finalOutput) {
        Write-Host "⏭️ Skipping existing: $baseName" -ForegroundColor Gray
        continue
    }

    Write-Host "🎬 Processing: $baseName" -ForegroundColor Cyan

    # PASS 1: Interpolation (CPU Heavy)
    Write-Host "  -> PASS 1: Interpolating to 60FPS..." -ForegroundColor Yellow
    # strictly 60fps, no scaling yet
    $filterInterp = "minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1"
    
    & $ffmpeg -i $inputPath -vf $filterInterp -c:v libx264 -preset fast -crf 18 -y $interpOutput
    
    if (-not (Test-Path $interpOutput)) {
        Write-Error "❌ Interpolation failed for $baseName"
        continue
    }

    # Cooldown (CRITICAL)
    Write-Host "  -> Cooling down system (3s)..." -ForegroundColor Cyan
    Start-Sleep -Seconds 3

    # PASS 2: Mastering (Rescale + Denoise)
    Write-Host "  -> PASS 2: Upscaling & Denoising..." -ForegroundColor Yellow
    $filterMaster = "hqdn3d=2:2:3:3,atadenoise=0.04:0.04:0.04,scale=3840:2160:flags=lanczos"

    & $ffmpeg -i $interpOutput -vf $filterMaster -c:v libx264 -preset fast -crf 16 -pix_fmt yuv420p -y $finalOutput

    # Cleanup
    if (Test-Path $finalOutput) {
        Remove-Item $interpOutput -ErrorAction SilentlyContinue
        Write-Host "✅ Done: $baseName" -ForegroundColor Green
    }
}

Write-Host "✨ All videos converted to 4K 60FPS (Safe Mode)." -ForegroundColor Magenta
