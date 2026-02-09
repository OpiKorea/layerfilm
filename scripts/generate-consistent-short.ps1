$python = "C:\layerfilm\.venv\Scripts\python.exe"
$script = "C:\layerfilm\scripts\local-sd-generate.py"
$baseDir = "Z:\layerfilm\drama-assets\noir-city-short\images"

# Ensure dir (Z drive safety confirmed in script)
if (!(Test-Path -Path $baseDir)) { New-Item -ItemType Directory -Force -Path $baseDir }

Write-Host "🚀 Starting High-Fidelity 'Noir City' Generation (RealVisXL)..."

# Global Style Prompt (Teal & Orange, Cyberpunk Noir)
$style = "dark cyberpunk noir city, raining, neon lights reflecting on wet pavement, teal and orange color grading, cinematic atmosphere, photorealistic, 8k, highly detailed"

# 1. The Cityscape
Write-Host "🎨 Scene 1: Cityscape..."
& $python $script --prompt "Wide shot of a towering futuristic city at night, $style" --output "$baseDir\scene_01.png" --steps 40 --width 1280 --height 720 --seed 42

# 2. The Alley
Write-Host "🎨 Scene 2: Dark Alley..."
& $python $script --prompt "A dark narrow alleyway with steam rising from vents, red neon sign buzzing, $style" --output "$baseDir\scene_02.png" --steps 40 --width 1280 --height 720 --seed 42

# 3. The Protagonist (Back)
Write-Host "🎨 Scene 3: Protagonist Walking..."
& $python $script --prompt "Back view of a woman in a long black trench coat walking away, holding an umbrella, mystery, $style" --output "$baseDir\scene_03.png" --steps 40 --width 1280 --height 720 --seed 42

# 4. The Chase
Write-Host "🎨 Scene 4: Drone Chase..."
& $python $script --prompt "Action shot of a security drone flying low through the street, scanning beam, motion blur, $style" --output "$baseDir\scene_04.png" --steps 40 --width 1280 --height 720 --seed 42

# 5. Hiding
Write-Host "🎨 Scene 5: Hiding..."
& $python $script --prompt "Close up of the woman's face peeking from behind a wall, fear in eyes, wet hair, rain drops on face, $style" --output "$baseDir\scene_05.png" --steps 40 --width 1280 --height 720 --seed 42

# 6. Confrontation
Write-Host "🎨 Scene 6: Confrontation..."
& $python $script --prompt "Wide shot of the woman standing face to face with a massive mech robot in the rain, epic standoff, $style" --output "$baseDir\scene_06.png" --steps 40 --width 1280 --height 720 --seed 42

Write-Host "✅ Noir City Visuals Generated!"
