$outDir = "Z:\layerfilm\drama-assets\the-last-unicorn"
$jsonFile = Join-Path $outDir "full_lifecycle_script.json"

# Narrative Arc: 30 Dynamic Scenes starting from the "Forest Run"
$scenes = @()
$stages = @(
    @{ Range = 1..10; Stage = "Adult (Active)"; Season = "Lush green forest, blue flowers, bright daylight"; Activity = "running through ferns, jumping over logs, galloping toward the light, stopping to sniff a flower" },
    @{ Range = 11..20; Stage = "Adult (Majestic)"; Season = "Deep golden woods, sunset rays, mystical mist"; Activity = "standing on a rock, horn glowing brightly, rearing up against the sun, walking slowly through tall grass" },
    @{ Range = 21..28; Stage = "Elder"; Season = "First snowfall, blue twilight, cold air"; Activity = "walking with tired grace, breath visible, lying down under an old oak tree, closing eyes" },
    @{ Range = 29..30; Stage = "Spirit"; Season = "Abyssal space, floating stars, aurora"; Activity = "turning into pure light, becoming part of the galaxy" }
)

foreach ($part in $stages) {
    foreach ($i in $part.Range) {
        $padIdx = ($i).ToString("000")
        $scenename = "scene_$padIdx"
        
        if ($part.Stage -like "*Adult*") {
            $charDef = "a majestic adult white unicorn, (spiraling golden horn on forehead:1.8), crystal blue eyes, flowing white mane"
        }
        elseif ($part.Stage -eq "Elder") {
            $charDef = "an ancient white unicorn, wise eyes, (chipped golden horn:1.5), slow movements"
        }
        else {
            $charDef = "a constellation forms the shape of a unicorn in the stars, glowing energy"
        }

        # DYNAMIC & FREE (자유롭게)
        $prompt = "cinematic masterpiece, 8k, photorealistic, same unicorn as before, $($part.Season), $charDef, $($part.Activity), solo subject"
        
        $scenes += @{
            Name   = $scenename
            Prompt = $prompt
            Stage  = $part.Stage
        }
    }
}

$scenes | ConvertTo-Json -Depth 4 | Out-File -FilePath $jsonFile -Encoding UTF8
Write-Host "✅ Generated Script starting from User Image: $jsonFile"
