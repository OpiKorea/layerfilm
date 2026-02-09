$python = "C:\layerfilm\.venv\Scripts\python.exe"
$script = "C:\layerfilm\scripts\local-sd-generate.py"
$outDir = "Z:\layerfilm\drama-assets\the-interface\images"

# Ensure output directory exists (PowerShell style)
if (!(Test-Path -Path $outDir)) {
    New-Item -ItemType Directory -Force -Path $outDir
}

# "Her" inspired warmth, pastel colors, soft focus, emotion
$basePrompt = "cinematic film still, 35mm photograph, shot on Kodak Portra 400, warm pastel lighting, soft focus, shallow depth of field, emotional, intricate detail, high budget sci-fi drama"

$scenes = @(
    @{ Name="scene_01"; Prompt="$basePrompt, close up of a lonely man sitting in a sun-drenched minimalist apartment, looking at a floating holographic mote of dust, warm orange and pink hues, peaceful yet sad" },
    @{ Name="scene_02"; Prompt="$basePrompt, extreme close up of a human eye reflecting a complex digital interface, soft interface light, emotional expression, tears" },
    @{ Name="scene_03"; Prompt="$basePrompt, a woman standing on a futuristic balcony at sunset, warm red sun, wind blowing hair, soft blurred city background, melancholic atmosphere" },
    @{ Name="scene_04"; Prompt="$basePrompt, abstract visualization of an AI consciousness, swirling digital particles in soft pink and peach colors, ethereal, dreamlike" },
    @{ Name="scene_05"; Prompt="$basePrompt, the man smiling gently at the empty air, feeling connected, warm sunlight hitting face, dust particles dancing in light" }
)

foreach ($scene in $scenes) {
    $outFile = Join-Path $outDir "$($scene.Name).png"
    Write-Host "🎨 Generating $($scene.Name)..."
    & $python $script --prompt "$($scene.Prompt)" --output $outFile --steps 40 --cfg 7.0
}

Write-Host "✅ All Interface Assets Generated at $outDir"
