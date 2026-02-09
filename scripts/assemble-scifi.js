const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const FFMPEG_PATH = "C:\\Program Files\\Topaz Labs LLC\\Topaz Video AI\\ffmpeg.exe";

// STRICTLY USING Z: DRIVE AS REQUESTED
const ASSETS_DIR = "Z:\\layerfilm\\drama-assets\\scifi-short\\images";
const OUTPUT_VIDEO = "Z:\\layerfilm\\drama-assets\\scifi-short\\scifi-short.mp4";

// Ensure output dir exists
const videoDir = path.dirname(OUTPUT_VIDEO);
if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true });
}

// Scene Config (Total ~20s)
const scenes = [
    { file: 'scene_01_space.png', duration: 4 },
    { file: 'scene_02_landing.png', duration: 3 },
    { file: 'scene_03_artifact.png', duration: 4 },
    { file: 'scene_04_city.png', duration: 3 },
    { file: 'scene_05_cyborg.png', duration: 3 },
    { file: 'scene_06_warp.png', duration: 3 }
];

async function assemble() {
    console.log(`🎬 Assembling Sci-Fi Short Video to: ${OUTPUT_VIDEO}`);

    let inputs = [];
    let filterComplex = "";

    scenes.forEach((scene, index) => {
        inputs.push("-loop", "1", "-t", scene.duration.toString(), "-i", path.join(ASSETS_DIR, scene.file));

        // Simple scale/pad
        let filter = `[${index}:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1[v${index}];`;
        filterComplex += filter;
    });

    // Concat
    scenes.forEach((_, i) => filterComplex += `[v${i}]`);
    filterComplex += `concat=n=${scenes.length}:v=1:a=0[outv]`;

    const args = [
        "-y",
        ...inputs,
        "-filter_complex", filterComplex,
        "-map", "[outv]",
        "-c:v", "h264_nvenc",
        "-b:v", "5M",
        "-pix_fmt", "yuv420p",
        OUTPUT_VIDEO
    ];

    console.log("Running FFMPEG...");

    const { spawn } = require('child_process');
    const ffmpeg = spawn(FFMPEG_PATH, args);

    ffmpeg.stdout.on('data', (data) => console.log(`stdout: ${data}`));
    ffmpeg.stderr.on('data', (data) => console.error(`stderr: ${data}`));

    ffmpeg.on('close', (code) => {
        if (code === 0) {
            console.log(`✅ Sci-Fi Short Assembled Successfully!`);
            console.log(`📂 Location: ${OUTPUT_VIDEO}`);
        } else {
            console.error(`❌ FFMPEG exited with code ${code}`);
        }
    });
}

assemble();
