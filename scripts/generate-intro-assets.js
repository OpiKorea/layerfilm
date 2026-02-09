const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const PYTHON_PATH = path.resolve(__dirname, '../.venv/Scripts/python.exe');
const GENERATOR_SCRIPT = path.resolve(__dirname, 'local-sd-generate.py');
const OUTPUT_DIR = path.resolve(__dirname, '../public/drama-assets/intro/images');

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const scenes = [
    {
        name: 'scene_01_city_rain',
        prompt: 'Futuristic city street at dawn, heavy rain, grey and blue tones, neon lights reflecting on wet pavement, blurred background, cinematic masterpiece, hyperrealistic, gloomy atmosphere, wide shot'
    },
    {
        name: 'scene_02_back_chip',
        prompt: 'Back view of a person standing by a window, holding a glowing microchip in hand, trembling hand, gloomy interior, cinematic lighting, shallow depth of field, focus on hand and chip'
    },
    {
        name: 'scene_03_hologram',
        prompt: 'A warm orange hologram floating in mid-air showing a happy memory silhouette, contrasting with cold grey rainy city background, cinematic, sci-fi, detailed'
    },
    {
        name: 'scene_04_eye_reflection',
        prompt: 'Extreme close-up of a human eye, iris reflecting a warm orange hologram, detailed eyelashes and skin texture, cinematic lighting, emotional'
    },
    {
        name: 'scene_05_fist_clench',
        prompt: 'Hand tightly clenching a glowing microchip, knuckles white, intense emotion, rain background, cinematic, detailed texture'
    },
    {
        name: 'scene_06_city_light',
        prompt: 'Wide shot of a dark rainy city skyline, only one window is lit up warm yellow in a tall building, lonely atmosphere, cinematic, hyperrealistic'
    }
];

async function generateSequentially() {
    console.log(`🚀 Starting Intro Asset Generation (${scenes.length} scenes)...`);

    for (const scene of scenes) {
        const outputFile = path.join(OUTPUT_DIR, `${scene.name}.png`);

        if (fs.existsSync(outputFile)) {
            console.log(`⏩ Skipping ${scene.name} (already exists)`);
            continue;
        }

        console.log(`🎨 Generating ${scene.name}...`);

        await new Promise((resolve, reject) => {
            // Spawn process directly without shell to avoid quoting issues
            const proc = spawn(PYTHON_PATH, [
                GENERATOR_SCRIPT,
                '--prompt', scene.prompt,
                '--output', outputFile,
                '--steps', '30'
            ]);

            proc.stdout.on('data', (data) => process.stdout.write(data));
            proc.stderr.on('data', (data) => process.stderr.write(data));

            proc.on('close', (code) => {
                if (code === 0) resolve();
                else reject(new Error(`Process exited with code ${code}`));
            });

            proc.on('error', (err) => {
                reject(err);
            });
        });
    }
    console.log("✅ All intro assets generated!");
}

generateSequentially();
