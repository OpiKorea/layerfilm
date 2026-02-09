$python = "C:\layerfilm\.venv\Scripts\python.exe"
$script = "C:\layerfilm\scripts\local-sd-generate.py"
$outDir = "C:\layerfilm\public\drama-assets\ep1\images"

# Ensure dir
if (!(Test-Path -Path $outDir)) { New-Item -ItemType Directory -Force -Path $outDir }

Write-Host "🚀 Starting Drama Ep1 Generation (20 Scenes)..."

# 1. Opening - The City
Write-Host "Generating Scene 1..."
& $python $script --prompt "Wide shot of a futuristic cyberpunk city at night, heavy rain, neon lights reflecting on wet streets, towering skyscrapers, dystopian atmosphere, cinematic lighting, 8k" --output "$outDir\scene_01.png" --steps 30

# 2. The Protagonist
Write-Host "Generating Scene 2..."
& $python $script --prompt "A hooded figure walking alone in a dark rainy alleyway, cyberpunk clothing, back view, mysterious, wet texture, cinematic masterpiece" --output "$outDir\scene_02.png" --steps 30

# 3. The Apartment
Write-Host "Generating Scene 3..."
& $python $script --prompt "Interior of a small cluttered cyberpunk apartment, multiple computer screens glowing blue, wires everywhere, dark room, rain on window, detailed" --output "$outDir\scene_03.png" --steps 30

# 4. The Chip
Write-Host "Generating Scene 4..."
& $python $script --prompt "Close up of a futuristic memory chip in a hand, the chip is glowing red, detailed circuits, metallic texture, shallow depth of field" --output "$outDir\scene_04.png" --steps 30

# 5. Interface
Write-Host "Generating Scene 5..."
& $python $script --prompt "A holographic computer interface floating in the air, displaying complex data and a progress bar stuck at 99%, sci-fi UI, blue and red colors" --output "$outDir\scene_05.png" --steps 30

# 6. Memory Flashback 1
Write-Host "Generating Scene 6..."
& $python $script --prompt "A blurry memory of a child laughing in a sunny park, soft focus, dreamlike quality, warm colors, contrast with the dark reality" --output "$outDir\scene_06.png" --steps 30

# 7. Memory Flashback 2
Write-Host "Generating Scene 7..."
& $python $script --prompt "A woman smiling, looking directly at the camera, sunlight flare, nostalgic atmosphere, highly detailed face, emotional" --output "$outDir\scene_07.png" --steps 30

# 8. Error
Write-Host "Generating Scene 8..."
& $python $script --prompt "Computer screen displaying a large 'CORRUPTED DATA' warning in red, glitch effect, digital distortion, dark environment" --output "$outDir\scene_08.png" --steps 30

# 9. Frustration
Write-Host "Generating Scene 9..."
& $python $script --prompt "The protagonist sitting with head in hands, despair, dark room illuminated only by the red warning light, emotional, cinematic composition" --output "$outDir\scene_09.png" --steps 30

# 10. The Decision
Write-Host "Generating Scene 10..."
& $python $script --prompt "Protagonist standing up, looking determined, profile view, dramatic lighting, rain shadows on face, cyberpunk style" --output "$outDir\scene_10.png" --steps 30

# 11. Leaving
Write-Host "Generating Scene 11..."
& $python $script --prompt "Protagonist stepping out of the apartment door into the rainy night, coat flapping in wind, wide angle shot, urban setting" --output "$outDir\scene_11.png" --steps 30

# 12. Travel
Write-Host "Generating Scene 12..."
& $python $script --prompt "A futuristic flying car or metro passing by rapidly, motion blur, neon trails, city background, speed, kinetic energy" --output "$outDir\scene_12.png" --steps 30

# 13. The Corporate Building
Write-Host "Generating Scene 13..."
& $python $script --prompt "Low angle shot of a massive menacing corporate headquarters building, brutalist architecture, logo glowing at the top, ominous clouds" --output "$outDir\scene_13.png" --steps 30

# 14. Infiltration
Write-Host "Generating Scene 14..."
& $python $script --prompt "Protagonist sneaking through a ventilation shaft or dark service corridor, industrial textures, steam, metal grates, tense atmosphere" --output "$outDir\scene_14.png" --steps 30

# 15. The Server Room
Write-Host "Generating Scene 15..."
& $python $script --prompt "A vast server room with endless rows of blue blinking lights, cold atmosphere, reflection on the floor, high tech facility" --output "$outDir\scene_15.png" --steps 30

# 16. Hacking
Write-Host "Generating Scene 16..."
& $python $script --prompt "Close up of hands typing furiously on a holographic keyboard, sparks flying, digital code overlay, intense action" --output "$outDir\scene_16.png" --steps 30

# 17. Discovery
Write-Host "Generating Scene 17..."
& $python $script --prompt "Protagonist looking shocked at a screen, face illuminated by white light, revelation, close up, high detail" --output "$outDir\scene_17.png" --steps 30

# 18. Escape
Write-Host "Generating Scene 18..."
& $python $script --prompt "Protagonist running down a corridor, security drones chasing with searchlights, dynamic angle, action blur, panic" --output "$outDir\scene_18.png" --steps 30

# 19. Rooftop Finale
Write-Host "Generating Scene 19..."
& $python $script --prompt "Protagonist standing on a rooftop edge at dawn, rain stopping, city skyline in background, holding the drive, sense of freedom" --output "$outDir\scene_19.png" --steps 30

# 20. To Be Continued
Write-Host "Generating Scene 20..."
& $python $script --prompt "Black screen with the words 'TO BE CONTINUED' in elegant white font, cinematic glitch effect" --output "$outDir\scene_20.png" --steps 30

Write-Host "✅ Episode 1 Visuals Generated!"
