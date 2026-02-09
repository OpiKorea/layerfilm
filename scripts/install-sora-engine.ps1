$ErrorActionPreference = "Stop"
$installDir = "Z:\layerfilm\programs\ComfyUI"
$customNodesDir = Join-Path $installDir "custom_nodes"
$modelsDir = Join-Path $installDir "models\checkpoints"
$vaeDir = Join-Path $installDir "models\vae"
$clipDir = Join-Path $installDir "models\clip"
# USE THE EXISTING LAYERFILM VENV TO AVOID Z: VENV ISSUES
$venvPython = "C:\layerfilm\.venv\Scripts\python.exe"
$venvPip = "C:\layerfilm\.venv\Scripts\pip.exe"

Write-Host "INITIALIZING GRAND MASTER ENGINE (Wan2.1 Extreme Setup)..." -ForegroundColor Cyan

# 1. Clone ComfyUI
if (-not (Test-Path $installDir)) {
    Write-Host "Cloning ComfyUI..."
    git clone https://github.com/comfyanonymous/ComfyUI.git $installDir
}

# 2. Install Dependencies
Write-Host "Installing Core Dependencies..."
& $venvPip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
& $venvPip install -r "$installDir\requirements.txt"
& $venvPip install websocket-client

# 3. Install Custom Nodes Suite (2026 HOLLYWOOD EDITION)
Write-Host "Installing Control & Final Polish Layers..."
$nodes = @(
    @{ Name = "ComfyUI-Manager"; Url = "https://github.com/ltdrdata/ComfyUI-Manager.git" },
    @{ Name = "ComfyUI-GGUF"; Url = "https://github.com/city96/ComfyUI-GGUF.git" },
    @{ Name = "ComfyUI_InstantID"; Url = "https://github.com/ZHO-ZHO-ZHO/ComfyUI-InstantID.git" },
    @{ Name = "ComfyUI_IPAdapter_plus"; Url = "https://github.com/cubiq/ComfyUI_IPAdapter_plus.git" },
    @{ Name = "ComfyUI-ControlnetAux"; Url = "https://github.com/Fannovel16/comfyui_controlnet_aux.git" },
    @{ Name = "ComfyUI-LivePortraitKJ"; Url = "https://github.com/Kijai/ComfyUI-LivePortraitKJ.git" },
    @{ Name = "ComfyUI-VideoHelperSuite"; Url = "https://github.com/Kosinkadink/ComfyUI-VideoHelperSuite.git" },
    @{ Name = "ComfyUI-Advanced-ControlNet"; Url = "https://github.com/Kosinkadink/ComfyUI-Advanced-ControlNet.git" },
    @{ Name = "ComfyUI-WanAnimatePreprocess"; Url = "https://github.com/Kijai/ComfyUI-WanAnimatePreprocess.git" },
    @{ Name = "ComfyUI-LatentSync"; Url = "https://github.com/iVideoGameBoss/ComfyUI-LatentSync-Node.git" },
    @{ Name = "ComfyUI-Frame-Interpolation"; Url = "https://github.com/Fannovel16/ComfyUI-Frame-Interpolation.git" },
    @{ Name = "ComfyUI-SUPIR"; Url = "https://github.com/kijai/ComfyUI-SUPIR.git" }
)

foreach ($node in $nodes) {
    $nodePath = Join-Path $customNodesDir $node.Name
    if (-not (Test-Path $nodePath)) {
        Write-Host "Cloning $($node.Name)..."
        git clone $node.Url $nodePath
        if (Test-Path (Join-Path $nodePath "requirements.txt")) {
            & $venvPip install -r (Join-Path $nodePath "requirements.txt")
        }
    }
    else {
        Write-Host "✅ $($node.Name) exists."
    }
}

# 4. Download Core Models
Write-Host "STARTING MODEL DOWNLOADS (Wan 2.2 Elite + Continuity Suite)..." -ForegroundColor Yellow

# Wan 2.2 Elite Suite (T2V & I2V GGUF Splits)
$models = @(
    # Core Wan 2.2 Engine
    @{ Url = "https://huggingface.co/QuantStack/Wan2.2-T2V-A14B-GGUF/resolve/main/HighNoise/Wan2.2-T2V-A14B-HighNoise-Q4_K_M.gguf"; Path = Join-Path $modelsDir "Wan2.2-T2V-A14B-HighNoise-Q4_K_M.gguf"; Name = "Wan2.2-T2V-High" },
    @{ Url = "https://huggingface.co/QuantStack/Wan2.2-T2V-A14B-GGUF/resolve/main/LowNoise/Wan2.2-T2V-A14B-LowNoise-Q4_K_M.gguf"; Path = Join-Path $modelsDir "Wan2.2-T2V-A14B-LowNoise-Q4_K_M.gguf"; Name = "Wan2.2-T2V-Low" },
    @{ Url = "https://huggingface.co/Comfy-Org/Wan_2.1_ComfyUI_repackaged/resolve/main/split_files/text_encoders/umt5_xxl_fp8_e4m3fn_scaled.safetensors"; Path = Join-Path $clipDir "umt5_xxl_fp8_e4m3fn_scaled.safetensors"; Name = "UMT5 Encoder" },
    @{ Url = "https://huggingface.co/wangkanai/wan21-vae/resolve/main/vae/wan/wan21-vae.safetensors"; Path = Join-Path $vaeDir "wan21-vae.safetensors"; Name = "Wan VAE" },
    
    # InstantID Elite Layer
    @{ Url = "https://huggingface.co/InstantX/InstantID/resolve/main/ip-adapter.bin"; Path = Join-Path (New-Item -ItemType Directory -Force (Join-Path $installDir "models\instantid")) "ip-adapter.bin"; Name = "InstantID Adapter" },
    @{ Url = "https://huggingface.co/InstantX/InstantID/resolve/main/ControlNetModel/diffusion_pytorch_model.safetensors"; Path = Join-Path (Join-Path $installDir "models\controlnet") "instantid_controlnet.safetensors"; Name = "InstantID ControlNet" },
    
    # Wan 2.2 ControlNet Elite
    @{ Url = "https://huggingface.co/TheDenk/wan2.2-t2v-a14b-controlnet-depth-v1/resolve/main/diffusion_pytorch_model.safetensors"; Path = Join-Path (Join-Path $installDir "models\controlnet") "wan2.2_depth.safetensors"; Name = "Wan 2.2 Depth" },
    
    # Refinement Layer (SUPIR) - Quantized for 12GB VRAM (Confirmed Public Mirrors)
    @{ Url = "https://huggingface.co/Kijai/SUPIR_pruned/resolve/main/SUPIR-v0Q_fp16.safetensors"; Path = Join-Path (Join-Path $installDir "models\checkpoints") "SUPIR-v0Q_fp16.safetensors"; Name = "SUPIR-v0Q" },
    @{ Url = "https://huggingface.co/comfyanonymous/direct_download/resolve/main/sd_xl_base_1.0_0.9vae.safetensors"; Path = Join-Path (Join-Path $installDir "models\checkpoints") "sd_xl_base_1.0.safetensors"; Name = "SDXL-Base" }
)

foreach ($mod in $models) {
    # INTEGRITY CHECK: Delete if file is suspicious (Under 8GB for the 14B models)
    if (Test-Path $mod.Path) {
        $size = (Get-Item $mod.Path).Length
        if ($mod.Name -like "*Wan2.2-T2V*" -and $size -lt 8GB) {
            Write-Host "⚠️ Integrity Failure for $($mod.Name) ($([math]::Round($size/1GB, 2)) GB). Wiping and restarting..." -ForegroundColor Red
            Remove-Item $mod.Path -Force
        }
    }

    if (-not (Test-Path $mod.Path)) {
        Write-Host "Downloading $($mod.Name)... (Large File)" -ForegroundColor Yellow
        # PREFER BITS FOR LARGE ASSETS (Much faster and stable)
        try {
            Write-Host "Initiating BITS Transfer for $($mod.Name)..."
            Start-BitsTransfer -Source $mod.Url -Destination $mod.Path -DisplayName $mod.Name -ErrorAction Stop
        }
        catch {
            Write-Host "BITS failed for $($mod.Name), falling back to WebRequest..." -ForegroundColor Gray
            Invoke-WebRequest -Uri $mod.Url -OutFile $mod.Path
        }
    }
    else {
        Write-Host "✅ $($mod.Name) ready."
    }
}

# 5. SPECIAL: AntelopeV2 Face Models
$antelopeDir = Join-Path $installDir "models\insightface\models\antelopev2"
if (-not (Test-Path $antelopeDir)) {
    Write-Host "Installing AntelopeV2 Face Analysis Models..."
    $zipPath = Join-Path $installDir "antelopev2.zip"
    Invoke-WebRequest -Uri "https://huggingface.co/MonsterMMORPG/tools/resolve/main/antelopev2.zip" -OutFile $zipPath
    New-Item -ItemType Directory -Force $antelopeDir
    Expand-Archive -Path $zipPath -DestinationPath $antelopeDir -Force
    Remove-Item $zipPath
}

# 6. InsightFace Fix
Write-Host "Fixing InsightFace for InstantID (Windows Wheel)..."
& $venvPip install https://github.com/Gourieff/Assets/raw/main/Insightface/insightface-0.7.3-cp312-cp312-win_amd64.whl

Write-Host "✨ ALL SYSTEMS DEPLOYED! 'GRAND MASTER WAN 2.2 ELITE' READY." -ForegroundColor Green
Write-Host "Run 'C:\layerfilm\.venv\Scripts\python.exe Z:\layerfilm\programs\ComfyUI\main.py' to start."
