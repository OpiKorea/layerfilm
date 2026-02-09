$outDir = "Z:\layerfilm\drama-assets\the-last-unicorn"
if (!(Test-Path -Path $outDir)) { New-Item -ItemType Directory -Force -Path $outDir }
$jsonFile = Join-Path $outDir "full_lifecycle_script.json"

# Narrative Arc: 3 Scenes * ~3.5s each = ~10.5 seconds
$scenes = @(
    @{ Name = "scene_001"; Stage = "Adult"; Season = "Lush green forest, blue flowers"; Activity = "galloping through ferns toward camera"; Prompt = "cinematic wide shot, 8k, photorealistic, (spiraling golden horn on forehead:1.8), majestic white unicorn, galloping through lush green forest and blue flowers, solo subject, masterpiece" },
    @{ Name = "scene_002"; Stage = "Adult"; Season = "Sun-drenched forest clearing"; Activity = "leaping over a fallen mossy log"; Prompt = "cinematic wide shot, 8k, photorealistic, same white unicorn, leaping over a fallen mossy log in a sun-drenched clearing, (spiraling golden horn:1.8), muscular graceful movement" },
    @{ Name = "scene_003"; Stage = "Adult"; Season = "Golden sunset forest edge"; Activity = "rearing up majesticly on a hill"; Prompt = "cinematic wide shot, 8k, photorealistic, same white unicorn, rearing up majesticly on a hill at sunset, (spiraling golden horn:1.8), long flowing mane, epic lighting" }
)

$scenes | ConvertTo-Json -Depth 4 | Out-File -FilePath $jsonFile -Encoding UTF8
Write-Host "✅ Generated 10s Script: $jsonFile"

# Run Production
powershell -ExecutionPolicy Bypass -File c:\layerfilm\scripts\produce-recursive-chain.ps1
