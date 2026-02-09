$python = "C:\layerfilm\.venv\Scripts\python.exe"
$script = "C:\layerfilm\scripts\local-sd-generate.py"
$outDir = "Z:\layerfilm\drama-assets\the-last-unicorn\images"

if (!(Test-Path -Path $outDir)) { New-Item -ItemType Directory -Force -Path $outDir }

# Style: National Geographic Fantasy, 8k, Unreal Engine 5, Hyper-realistic
$style = "cinematic shot, national geographic wildlife photography, 8k, hyper-realistic, soft morning light, magical forest, fantasy creature"

# 45 Scenes for ~3 minutes (Growth Stages)
$scenes = @(
    # Stage 1: Birth & Foal (Scenes 01-10)
    @{ Name = "scene_01"; Prompt = "$style, a magical glowing egg in a nest of golden leaves, deep in an ancient forest, mist" },
    @{ Name = "scene_02"; Prompt = "$style, the egg cracking open, light spilling out, baby unicorn snout visible" },
    @{ Name = "scene_03"; Prompt = "$style, newborn baby unicorn trying to stand up, wet fur, clumsy, big eyes, no horn yet" },
    @{ Name = "scene_04"; Prompt = "$style, mother unicorn licking the baby, warm sunlight filtering through trees" },
    @{ Name = "scene_05"; Prompt = "$style, baby unicorn taking first steps, wobbling, green mossy floor" },
    @{ Name = "scene_06"; Prompt = "$style, baby unicorn playing with a butterfly, small nub of a horn appearing" },
    @{ Name = "scene_07"; Prompt = "$style, young foal drinking from a crystal clear stream, reflection" },
    @{ Name = "scene_08"; Prompt = "$style, foal running through a field of flowers, energetic, horn growing slightly" },
    @{ Name = "scene_09"; Prompt = "$style, foal sleeping under a giant mushroom, peaceful, moonlight" },
    @{ Name = "scene_10"; Prompt = "$style, young unicorn looking at the moon, horn is now visible and glowing faintly" },

    # Stage 2: Prime Adult (Scenes 11-25)
    @{ Name = "scene_11"; Prompt = "$style, adolescent unicorn galloping through a dense forest, muscles tensing, powerful" },
    @{ Name = "scene_12"; Prompt = "$style, majestic adult unicorn standing on a cliff edge, long spiraling horn, wind blowing mane" },
    @{ Name = "scene_13"; Prompt = "$style, extreme close up of adult unicorn eye, wisdom, galaxy reflection in eye" },
    @{ Name = "scene_14"; Prompt = "$style, unicorn fighting a dark shadow wolf (blurred), action shot, magic sparks" },
    @{ Name = "scene_15"; Prompt = "$style, unicorn healing a withered tree with its horn, magical particles" },
    @{ Name = "scene_16"; Prompt = "$style, unicorn running on water, splashes frozen in time, ethereal beauty" },
    @{ Name = "scene_17"; Prompt = "$style, unicorn in a winter forest, breath visible in cold air, snow on fur" },
    @{ Name = "scene_18"; Prompt = "$style, unicorn leading a herd of deer, protector of the forest" },
    @{ Name = "scene_19"; Prompt = "$style, unicorn standing in a thunderstorm, lightning striking behind, unbothered" },
    @{ Name = "scene_20"; Prompt = "$style, close up of the horn, intricate carvings/texture, glowing with power" },
    @{ Name = "scene_21"; Prompt = "$style, unicorn interacting with a human child (silhouette), gentle" },
    @{ Name = "scene_22"; Prompt = "$style, unicorn resting in a sunbeam, coat shining like pearl" },
    @{ Name = "scene_23"; Prompt = "$style, unicorn running through autumn leaves, orange and red colors" },
    @{ Name = "scene_24"; Prompt = "$style, full body shot, perfect physical condition, peak of life" },
    @{ Name = "scene_25"; Prompt = "$style, unicorn roaring/neighing at the sunset, silhouette" },

    # Stage 3: Aging (Scenes 26-35)
    @{ Name = "scene_26"; Prompt = "$style, older unicorn walking slowly, coat losing some shine, gray hairs" },
    @{ Name = "scene_27"; Prompt = "$style, close up of eye, tired but wise, wrinkles starting to form" },
    @{ Name = "scene_28"; Prompt = "$style, unicorn resting more often, lying in the grass, watching younger animals" },
    @{ Name = "scene_29"; Prompt = "$style, horn slightly chipped or faded, battle scars visible" },
    @{ Name = "scene_30"; Prompt = "$style, slow walk through a dying forest branch, symbolism of autumn/winter of life" },
    @{ Name = "scene_31"; Prompt = "$style, unicorn drinking slowly from a pond, reflection shows a weary face" },
    @{ Name = "scene_32"; Prompt = "$style, heavy breathing in the cold air, steam, tired posture" },
    @{ Name = "scene_33"; Prompt = "$style, unicorn struggling to climb a small hill, determination" },
    @{ Name = "scene_34"; Prompt = "$style, lying down under the same tree as scene 01, full circle" },
    @{ Name = "scene_35"; Prompt = "$style, close up of closing eye, peaceful acceptance" },

    # Stage 4: Death & Rebirth (Scenes 36-45)
    @{ Name = "scene_36"; Prompt = "$style, the unicorn takes its last breath, body starts to glow softly" },
    @{ Name = "scene_37"; Prompt = "$style, unicorn's physical body dissolving into light particles, stardust" },
    @{ Name = "scene_38"; Prompt = "$style, spirit of the unicorn separating from the body, translucent ghost form" },
    @{ Name = "scene_39"; Prompt = "$style, the spirit ascending towards the stars, nebula background" },
    @{ Name = "scene_40"; Prompt = "$style, the body turning into a hill of flowers and moss, returning to nature" },
    @{ Name = "scene_41"; Prompt = "$style, the horn remaining as a crystal monument, overgrown with vines" },
    @{ Name = "scene_42"; Prompt = "$style, time lapse of seasons passing over the resting place" },
    @{ Name = "scene_43"; Prompt = "$style, a new golden egg appearing in the flowers where the unicorn lay" },
    @{ Name = "scene_44"; Prompt = "$style, wide shot of the forest, life goes on, cycle continues" },
    @{ Name = "scene_45"; Prompt = "$style, black screen with single word text: 'Eternal', cinematic font" }
)

foreach ($scene in $scenes) {
    $outFile = Join-Path $outDir "$($scene.Name).png"
    if (Test-Path $outFile) { Write-Host "⏭️ Skipping $($scene.Name)" }
    else {
        Write-Host "🎨 Generating $($scene.Name)..."
        & $python $script --prompt "$($scene.Prompt)" --output $outFile --steps 40 --cfg 7.5
    }
}
Write-Host "✅ All 45 Scenes Generated for 3-Minute Epic"
