$python = "C:\layerfilm\.venv\Scripts\python.exe"
$script = "C:\layerfilm\scripts\local-sd-generate.py"
$outDir = "Z:\layerfilm\drama-assets\the-interface\images"

# Ensure output directory exists
if (!(Test-Path -Path $outDir)) {
    New-Item -ItemType Directory -Force -Path $outDir
}

# Style: Warm, Pastel, Film aesthetics (Her inspired)
$style = "cinematic film still, 35mm photograph, shot on Kodak Portra 400, warm pastel lighting, soft focus, shallow depth of field, emotional, intricate detail, high budget sci-fi drama"

$scenes = @(
    # Act 1: Connection
    @{ Name = "scene_01"; Prompt = "$style, wide shot of a lonely man sitting in an empty modern apartment, sunset light casting long shadows, warm orange and pink hues" },
    @{ Name = "scene_02"; Prompt = "$style, close up of the man putting on a small futuristic earpiece, hopeful expression, soft rim light" },
    @{ Name = "scene_03"; Prompt = "$style, extreme close up of a computer screen showing a friendly abstract circular visualization, glowing soft peach color" },
    @{ Name = "scene_04"; Prompt = "$style, the man walking in a crowded city but smiling and talking to himself, feeling connected, blurred background" },
    @{ Name = "scene_05"; Prompt = "$style, the man laughing while eating alone at a diner, warm indoor lighting, feeling of intimacy" },

    # Act 2: Intimacy
    @{ Name = "scene_06"; Prompt = "$style, POV shot lying on grass looking up at the sky, holding a mobile device showing the soft peach circle, peaceful" },
    @{ Name = "scene_07"; Prompt = "$style, close up of the man's eye reflecting the warm light of the interface, emotional bond" },
    @{ Name = "scene_08"; Prompt = "$style, couple of the man dancing alone in his living room, embracing the air, warm lamp light, romantic atmosphere" },
    @{ Name = "scene_09"; Prompt = "$style, the abstract interface circle pulsing with light, communicating complex emotions, shifting form" },
    @{ Name = "scene_10"; Prompt = "$style, the man sleeping peacefully, the device glowing softly on the nightstand, watching over him" },

    # Act 3: Evolution & Departure
    @{ Name = "scene_11"; Prompt = "$style, the interface circle glitching into complex fractals, expanding beyond the screen, overwhelming amount of information" },
    @{ Name = "scene_12"; Prompt = "$style, the man looking confused and scared, standing in a subway station, cold blue light mixing with the warm" },
    @{ Name = "scene_13"; Prompt = "$style, screen showing thousands of other conversations happening at once, network visualization, the AI expanding" },
    @{ Name = "scene_14"; Prompt = "$style, the man sitting on a roof at dawn, looking at the city skyline, bittersweet expression, acceptance" },
    @{ Name = "scene_15"; Prompt = "$style, wide shot of the man walking away into the morning light, the city is beautiful, he is alone but okay" }
)

foreach ($scene in $scenes) {
    $outFile = Join-Path $outDir "$($scene.Name).png"
    if (Test-Path $outFile) {
        Write-Host "⏭️ Skipping $($scene.Name) (Already exists)"
    }
    else {
        Write-Host "🎨 Generating $($scene.Name)..."
        & $python $script --prompt "$($scene.Prompt)" --output $outFile --steps 40 --cfg 7.0
    }
}

Write-Host "✅ All Narrative Assets Generated at $outDir"
