$outDir = "Z:\layerfilm\drama-assets\the-last-unicorn"
if (!(Test-Path -Path $outDir)) { New-Item -ItemType Directory -Force -Path $outDir }
$jsonFile = Join-Path $outDir "full_lifecycle_script.json"

# Narrative Arc (45 Scenes x 4 sec = ~3 mins)
# Focus on consistency: Same camera angle (Majestic Side Profile) to achieve the morphing effect
$scenes = @()
$stages = @(
    @{ Range = 1..10; Stage = "Foal"; Season = "Spring, lush green forest"; Activity = "standing still, blinking, breathing softly" },
    @{ Range = 11..25; Stage = "Adult"; Season = "Summer/Autumn, vibrant woods"; Activity = "standing majesticly, glowing horn, wind blowing mane" },
    @{ Range = 26..35; Stage = "Elder"; Season = "Winter, falling snow"; Activity = "looking wise, breathing visible frozen mist" },
    @{ Range = 36..45; Stage = "Spirit"; Season = "Cosmic, starlight void"; Activity = "slowly dissolving into golden particles" }
)

foreach ($part in $stages) {
    foreach ($i in $part.Range) {
        $padIdx = ($i).ToString("000")
        $scenename = "scene_$padIdx"
        
        # FIXED HORN REINFORCEMENT
        if ($part.Stage -eq "Foal") {
            $charDef = "a specific adorable unicorn foal, pure white fur, deep crystal blue eyes, (visible tiny golden nub of a horn on forehead:1.6)"
        }
        elseif ($part.Stage -eq "Adult") {
            $charDef = "a majestic adult unicorn, pure white fur, (long spiraling golden horn:1.7), flowing mane, crystal blue eyes"
        }
        elseif ($part.Stage -eq "Elder") {
            $charDef = "an ancient wise unicorn, pure white fur, (chipped golden horn:1.5), wise tired eyes"
        }
        else {
            $charDef = "a glowing spirit form of a unicorn, made of starlight, (glowing energy horn:1.4)"
        }

        # POSE LOCKING: "Majestic side profile, eye contact with camera"
        $prompt = "cinematic shot, 8k, photorealistic, majestic side profile, $($part.Season), $charDef, $($part.Activity), solo subject, master-pose"
        
        $scenes += @{
            Name   = $scenename
            Prompt = $prompt
            Stage  = $part.Stage
        }
    }
}

$scenes | ConvertTo-Json -Depth 4 | Out-File -FilePath $jsonFile -Encoding UTF8
Write-Host "✅ Generated Pose-Locked Script (3 Mins): $jsonFile"
