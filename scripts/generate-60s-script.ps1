$outDir = "Z:\layerfilm\drama-assets\the-last-unicorn"
if (!(Test-Path -Path $outDir)) { New-Item -ItemType Directory -Force -Path $outDir }
$jsonFile = Join-Path $outDir "full_lifecycle_script.json"

# Narrative Arc (15 Scenes * ~240 frames each = ~3,600 frames at 60fps)
# Total duration: 60 seconds
$scenes = @()
$stages = @(
    @{ Range = 1..4; Stage = "Foal"; Season = "Spring, lush green forest"; Activity = "galloping clumsily, following mother, playing with a frog, sleeping in flowers" },
    @{ Range = 5..10; Stage = "Adult"; Season = "Summer/Autumn, vibrant woods"; Activity = "leaping over a silver stream, horse rearing up majesticly, running through fireflies, standing on a misty cliff" },
    @{ Range = 11..13; Stage = "Elder"; Season = "Winter, heavy snow storm"; Activity = "walking against the wind, looking into a frozen lake, resting under a crystal tree" },
    @{ Range = 14..15; Stage = "Spirit"; Season = "Cosmic, starlight void"; Activity = "flying through the aurora, dissolving into a bright constellation" }
)

foreach ($part in $stages) {
    foreach ($i in $part.Range) {
        $padIdx = ($i).ToString("000")
        $scenename = "scene_$padIdx"
        
        # HORN REINFORCEMENT (WEIGHTED)
        if ($part.Stage -eq "Foal") {
            $charDef = "a specific adorable unicorn foal, pure white fur, deep crystal blue eyes, (visible tiny golden nub of a horn on forehead:1.7)"
        }
        elseif ($part.Stage -eq "Adult") {
            $charDef = "a majestic adult unicorn, muscular body, pure white fur, (long spiraling golden horn:1.8), flowing mane, crystal blue eyes"
        }
        elseif ($part.Stage -eq "Elder") {
            $charDef = "an ancient wise unicorn, pure white fur, (chipped golden horn:1.6), wise tired eyes"
        }
        else {
            $charDef = "a glowing spirit form of a unicorn, made of starlight, (glowing energy horn:1.5)"
        }

        # DYNAMIC POSE (As requested: "자유롭게")
        $prompt = "cinematic wide shot, 8k, photorealistic, dynamic composition, $($part.Season), $charDef, $($part.Activity), solo subject, high motion, masterpiece"
        
        $scenes += @{
            Name   = $scenename
            Prompt = $prompt
            Stage  = $part.Stage
        }
    }
}

$scenes | ConvertTo-Json -Depth 4 | Out-File -FilePath $jsonFile -Encoding UTF8
Write-Host "✅ Generated Dynamic 60s Script (3,600 Frames): $jsonFile"
