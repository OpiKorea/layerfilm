$outDir = "Z:\layerfilm\drama-assets\the-last-unicorn"
if (!(Test-Path -Path $outDir)) { New-Item -ItemType Directory -Force -Path $outDir }
$jsonFile = Join-Path $outDir "full_lifecycle_script.json"

# Narrative Arc (150 Scenes x 4 sec = ~10 mins)
# 1-30: Childhood (Spring)
# 31-90: Adulthood (Summer/Autumn) - The Prime
# 91-130: Elder (Winter) - Aging
# 131-150: Ascension (Starlight) - Death

$scenes = @()
$stages = @(
    @{ Range = 1..30; Stage = "Foal"; Season = "Spring, lush green forest, morning light"; Activity = "stumbling, learning to walk, chasing butterflies, drinking from stream, sleeping in ferns" },
    @{ Range = 31..60; Stage = "Adult"; Season = "Summer, vibrant sun, deep mystic woods"; Activity = "galloping full speed, rearing up, standing on cliff edge, glowing horn power, majestic poses" },
    @{ Range = 61..90; Stage = "Adult"; Season = "Autumn, falling golden leaves, sunset"; Activity = "walking through falling leaves, looking at reflection in lake, mysterious atmosphere, wind blowing mane" },
    @{ Range = 91..120; Stage = "Elder"; Season = "Winter, first snow, cold blue light"; Activity = "walking slowly in snow, breath visible, tired but wise eyes, lying down in snow, horn glowing faintly" },
    @{ Range = 121..150; Stage = "Spirit"; Season = "Cosmic, starlight, ethereal void"; Activity = "body turning into light, dissolving into stars, becoming a constellation, fading away" }
)

foreach ($part in $stages) {
    foreach ($i in $part.Range) {
        $padIdx = ($i).ToString("000")
        
        # Procedural Prompt variation
        $scenename = "scene_$padIdx"
        
        # Character Definition based on stage
        if ($part.Stage -eq "Foal") {
            $charDef = "a specific adorable unicorn foal, pure white fur, deep crystal blue eyes, tiny golden nub of a horn on forehead"
        }
        elseif ($part.Stage -eq "Adult") {
            $charDef = "a majestic adult unicorn, muscular body, long spiraling golden horn, flowing mane, crystal blue eyes"
        }
        elseif ($part.Stage -eq "Elder") {
            $charDef = "an ancient bearded unicorn, frail body, chipped golden horn, wise tired eyes, graying fur"
        }
        else {
            $charDef = "a glowing spirit form of a unicorn, made of starlight and translucent energy"
        }

        $prompt = "cinematic shot, national geographic, 8k, $($part.Season), $charDef, $($part.Activity), solo subject, masterpiece"
        
        $scenes += @{
            Name   = $scenename
            Prompt = $prompt
            Stage  = $part.Stage
        }
    }
}

$scenes | ConvertTo-Json -Depth 4 | Out-File -FilePath $jsonFile -Encoding UTF8
Write-Host "✅ Generated 150-Scene Script: $jsonFile"
