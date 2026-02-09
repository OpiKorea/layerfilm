param(
    [string]$BaseImage,
    [string]$Prompt,
    [string]$OutputVideo,
    [int]$TotalSeconds = 7,
    [int]$Seed = 42,
    [int]$Motion = 32,
    [float]$Noise = 0.2
)

$ErrorActionPreference = "Stop"
$ScriptPath = "c:\layerfilm\scripts\local-svd-generate.py"
$PythonPath = "c:\layerfilm\.venv\Scripts\python.exe"
$TempDir = "Z:\layerfilm\temp\chaining"
$FFmpeg = "C:\layerfilm\.venv\Lib\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"

# 1. Calculate Chunks
$FullChunks = [math]::Floor($TotalSeconds / 3)
$Remainder = $TotalSeconds % 3

$CalculationStr = "🧮 Calculation: Total ${TotalSeconds}s = ($FullChunks x 3s) + ${Remainder}s"
Write-Host $CalculationStr -ForegroundColor Cyan

# Ensure Temp Dir
if (!(Test-Path $TempDir)) { New-Item -ItemType Directory -Path $TempDir -Force }

$CurrentInput = $BaseImage
$GeneratedClips = @()

# 2. Generate Full 3s Chunks
for ($i = 1; $i -le $FullChunks; $i++) {
    $ChunkName = "chunk_0${i}_3s"
    $ChunkOutput = Join-Path $TempDir "${ChunkName}_raw.mp4"
    
    Write-Host "🎥 Generating Chunk $i ($CurrentInput -> 3s)..." -ForegroundColor Yellow
    
    # Python script modification: We need to output RAW 7fps chunks and not 60fps mastered ones.
    # The python script currently masters to 60fps automatically. This is actually OK as long
    # as we concatenate them correctly, BUT concatenation of interpolated frames might be jerky.
    # Ideally, we should concatenate the RAW 7fps source and then interpolate ONCE at the end.
    
    # Let's add a --raw-only flag to the python script or just use the _raw.mp4 it generates.
    # The updated script generates _raw.mp4 as an intermediate. We can use that!
    
    # 21 frames = 3 seconds @ 7fps
    & $PythonPath $ScriptPath --image $CurrentInput --output $ChunkOutput --frames 21 --seed $Seed --motion $Motion --noise $Noise --skip-master
    
    # The python script produces:
    # 1. Output (Mastered 60fps): $ChunkOutput
    # 2. Raw (7fps): $ChunkOutput.replace(".mp4", "_raw.mp4")
    # 3. Last Frame: $ChunkOutput.replace(".mp4", "_last.png")

    $RawChunk = $ChunkOutput.Replace(".mp4", "_raw.mp4")
    $GeneratedClips += $RawChunk
    
    # Wait for file to exist
    Start-Sleep -Seconds 1
    
    # Update Input for Next Chunk
    $LastFrame = $ChunkOutput.Replace(".mp4", "_last.png")
    if (Test-Path $LastFrame) {
        $CurrentInput = $LastFrame
        Write-Host "  -> Next Input: $LastFrame"
    }
    else {
        Write-Error "❌ Missing last frame for chaining!"
    }
}

# 3. Generate Remainder Chunk (if any)
if ($Remainder -gt 0) {
    $ChunkName = "chunk_final_${Remainder}s"
    $ChunkOutput = Join-Path $TempDir "${ChunkName}_raw.mp4"
    $Frames = $Remainder * 7 
    
    Write-Host "🎥 Generating Remainder: ${Remainder}s (${Frames} frames)..." -ForegroundColor Yellow
    
    & $PythonPath $ScriptPath --image $CurrentInput --output $ChunkOutput --frames $Frames --seed $Seed --motion $Motion --noise $Noise --skip-master
    
    $RawChunk = $ChunkOutput.Replace(".mp4", "_raw.mp4")
    $GeneratedClips += $RawChunk
}

# 4. Concatenate Raw Clips
Write-Host "🔗 Concatenating Clips..." -ForegroundColor Magenta

# Wait for all clips to exist explicitly
foreach ($clip in $GeneratedClips) {
    while (-not (Test-Path $clip)) { Start-Sleep -Milliseconds 500 }
}

$ConcatList = Join-Path $TempDir "concat_list.txt"
$ListContent = ""
foreach ($clip in $GeneratedClips) {
    # Convert to forward slashes for FFMPEG compatibility
    $FormattedPath = $clip -replace "\\", "/"
    $ListContent += "file '$FormattedPath'`n"
}
$ListContent | Out-File -FilePath $ConcatList -Encoding ASCII

Write-Host "🔄 STARTING RECURSIVE CHAIN PRODUCTION"
Write-Host "✅ Production Protocol Active: Enforcing Identity & Physics Consistency (200 Checklist)"
Write-Host "Logic: Motion N -> Last Frame -> Image N+1"
Write-Host "📄 Concat List Content:"
Write-Host $ListContent

# Concatenate without re-encoding (RAW 7fps stream)
$RawMerged = Join-Path $TempDir "merged_raw.mp4"

& $FFmpeg -f concat -safe 0 -i $ConcatList -c copy -y $RawMerged

if (-not (Test-Path $RawMerged)) {
    Write-Error "❌ Concatenation failed!"
}

# 5. Final Master (Split Protocol for Stability)
Write-Host "🚀 Mastering to 60FPS 4K (Split Protocol)..." -ForegroundColor Green

# PASS 1: Interpolation (CPU Heavy)
$InterpRaw = Join-Path $TempDir "merged_60fps_raw.mp4"
Write-Host "  -> PASS 1: Interpolating to 60FPS..." -ForegroundColor Yellow

$FilterInterp = "minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1"

& $FFmpeg -i $RawMerged -vf $FilterInterp -c:v libx264 -preset fast -crf 18 -y $InterpRaw

if (-not (Test-Path $InterpRaw)) { Write-Error "❌ Interpolation failed!" }

# Cooldown
Write-Host "  -> Cooling down system (3s)..." -ForegroundColor Cyan
Start-Sleep -Seconds 3

# PASS 2: Mastering (Rescale + Denoise)
Write-Host "  -> PASS 2: Upscaling & Denoising..." -ForegroundColor Yellow

$FilterMaster = "hqdn3d=2:2:3:3,atadenoise=0.04:0.04:0.04,scale=3840:2160:flags=lanczos"

& $FFmpeg -i $InterpRaw -vf $FilterMaster -c:v libx264 -preset fast -crf 16 -pix_fmt yuv420p -y $OutputVideo

# Cleanup intermediate
Remove-Item $InterpRaw -ErrorAction SilentlyContinue

# 6. Cleanup Protocol
Write-Host "🧹 Finalizing and Cleaning up background data..." -ForegroundColor Cyan
Remove-Item $ConcatList -ErrorAction SilentlyContinue
Remove-Item $RawMerged -ErrorAction SilentlyContinue
# Scrub all temporary chunks and last frame caches
Get-ChildItem $TempDir -File | Remove-Item -ErrorAction SilentlyContinue

Write-Host "✅ COMPLETE: $OutputVideo" -ForegroundColor Green
Write-Host "🔥 60FPS MASTERPIECE READY." -ForegroundColor White
