$python = "C:\layerfilm\.venv\Scripts\python.exe"
$script = "C:\layerfilm\scripts\local-sd-generate.py"
$outDir = "Z:\layerfilm\drama-assets\scifi-short\images"

# Ensure dir (Z drive directly as requested)
if (!(Test-Path -Path $outDir)) { New-Item -ItemType Directory -Force -Path $outDir }

Write-Host "🚀 Starting 20s Sci-Fi Short Generation..."

# 1. Opening - Deep Space
Write-Host "🎨 Scene 1: Deep Space Fleet..."
& $python $script --prompt "Epic wide shot of a massive spaceship fleet in deep space, nebula background, cinematic lighting, 8k, highly detailed, star wars style" --output "$outDir\scene_01_space.png" --steps 30

# 2. Planet Landing
Write-Host "🎨 Scene 2: Alien Planet Landing..."
& $python $script --prompt "A futuristic dropship landing on a red alien planet, dust kicking up, two suns in the sky, sci-fi concept art, matte painting" --output "$outDir\scene_02_landing.png" --steps 30

# 3. The Artifact
Write-Host "🎨 Scene 3: Ancient Artifact..."
& $python $script --prompt "Astronauts discovering a glowing blue ancient alien artifact in a dark cave, mysterious atmosphere, volumetric lighting, bioluminescence" --output "$outDir\scene_03_artifact.png" --steps 30

# 4. The City
Write-Host "🎨 Scene 4: Cyberpunk City..."
& $python $script --prompt "Bustling cyberpunk city street level, neon signs in foreign languages, flying cars, rain, blade runner vibe, photorealistic" --output "$outDir\scene_04_city.png" --steps 30

# 5. The Face
Write-Host "🎨 Scene 5: Cyborg Face..."
& $python $script --prompt "Close up portrait of a female cyborg with half human face and half mechanical parts, glowing eyes, intricate details, 8k resolution" --output "$outDir\scene_05_cyborg.png" --steps 30

# 6. Hyperdrive
Write-Host "🎨 Scene 6: Hyperdrive Jump..."
& $python $script --prompt "Cockpit view of a spaceship jumping to lightspeed, stars streaking into lines, blue and white light explosion, intense speed" --output "$outDir\scene_06_warp.png" --steps 30

Write-Host "✅ Sci-Fi Short Visuals Generated!"
