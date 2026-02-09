$python = "C:\layerfilm\.venv\Scripts\python.exe"
$script = "C:\layerfilm\scripts\local-sd-generate.py"
$outDir = "Z:\layerfilm\drama-assets\the-last-unicorn\images"

if (!(Test-Path -Path $outDir)) { New-Item -ItemType Directory -Force -Path $outDir }

# 1. FIXED CHARACTER DEFINITION (Consistency Lock)
# SOLO RULE: We emphasize "single" and "alone" in prompts.
$character = "a specific adorable unicorn foal, pure white fur, deep crystal blue eyes, tiny golden nub of a horn on forehead, pink nose, fluffy white mane"
$style = "cinematic shot, national geographic wildlife photography, 8k, hyper-realistic, soft morning light, magical forest, completely alone, single subject"
$neg = "other horses, multiple unicorns, mother, parents, herd, two unicorns, distortion, bad anatomy"

# Stage 1: Birth & Foal (Scenes 01-10) - SOLO VERSION
$scenes = @(
    @{ Name = "scene_01"; Prompt = "$style, close up of $character curling inside a translucent glowing egg, magical atmosphere, alone" },
    @{ Name = "scene_02"; Prompt = "$style, the egg cracking, $character poking its head out, wet fur, blinking eyes, solo" },
    @{ Name = "scene_03"; Prompt = "$style, full body shot of $character trying to stand up on shaky legs, golden horn nub visible, alone in forest clearing" },
    @{ Name = "scene_04"; Prompt = "$style, $character shaking water off its fur, wet mane, dynamic motion, backlit by sun, alone" }, # Replaced "Mother Licking" with "Shaking off water"
    @{ Name = "scene_05"; Prompt = "$style, $character taking a confident step on mossy ground, sunlight hitting the white fur, solo" },
    @{ Name = "scene_06"; Prompt = "$style, close up of $character sniffing a blue butterfly, focus on the blue eyes and golden horn nub, alone" },
    @{ Name = "scene_07"; Prompt = "$style, $character drinking from a stream, reflection showing the same blue eyes and horn, solo subject" },
    @{ Name = "scene_08"; Prompt = "$style, low angle shot of $character running playfully across a meadow, mane blowing in wind, alone" },
    @{ Name = "scene_09"; Prompt = "$style, $character sleeping curled up under a giant fern, peaceful night lighting, solo" },
    @{ Name = "scene_10"; Prompt = "$style, $character looking up at the full moon, heavy atmosphere, mystical, silhouette, alone" }
)

foreach ($scene in $scenes) {
    $outFile = Join-Path $outDir "$($scene.Name).png"
    Write-Host "🎨 Regenerating $($scene.Name) (SOLO Ver.)..."
    # Added --neg to enforce solo constraint
    # Note: verify local-sd-generate.py supports --neg? The script viewed earlier didn't show it explicitly but let's check or assume standard negative exists or append to prompt.
    # Checking previous view_file: it had negative prompt HARDCODED in the python script.
    # "negative_prompt": "cartoon, illustration, anime, deformities..."
    # I should edit the python script to accept --negative_prompt or just trust the prompt keywords.
    # Better: Update python script to accept negative prompt argument for flexibility.
    
    & $python $script --prompt "$($scene.Prompt)" --neg "$neg" --output $outFile --steps 40 --seed 42 
}
Write-Host "✅ Solo Childhood Scenes Generated!"
