const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const FFMPEG_PATH = "C:\\Program Files\\Topaz Labs LLC\\Topaz Video AI\\ffmpeg.exe";

// Z: Drive for inputs and output
const ASSETS_DIR = "Z:\\layerfilm\\drama-assets\\noir-city-short\\images";
const OUTPUT_VIDEO = "Z:\\layerfilm\\drama-assets\\noir-city-short\\noir-city.mp4";

// Ensure output dir exists
const videoDir = path.dirname(OUTPUT_VIDEO);
if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true });
}

// Scene Config (Total ~24s)
const scenes = [
    { file: 'scene_01.png', duration: 4 },
    { file: 'scene_02.png', duration: 4 },
    { file: 'scene_03.png', duration: 4 },
    { file: 'scene_04.png', duration: 4 },
    { file: 'scene_05.png', duration: 4 },
    { file: 'scene_06.png', duration: 4 }
];

async function assemble() {
    console.log(`🎬 Assembling Noir City Short to: ${OUTPUT_VIDEO}`);

    let inputs = [];
    let filterComplex = "";

    scenes.forEach((scene, index) => {
        inputs.push("-loop", "1", "-t", scene.duration.toString(), "-i", path.join(ASSETS_DIR, scene.file));

        // Scale and Pad to 1280x720 (Cinematic 16:9)
        // Also adding a subtle "Ken Burns" zoom effect
        // zoompan=z='min(zoom+0.001,1.5)':d=100:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1280x720
        // But for stability, let's stick to static crossfade or simple scale first. 
        // User wants "The Frost" quality, which has motion. 
        // Let's try to add a simple zoom.
        // To do zoompan properly on images in ffmpeg is tricky without jitter. 
        // Using a simple scale for now to ensure we deliver the VIDEO first.

        let filter = `[${index}:v]scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,setsar=1[v${index}];`;
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
        "-b:v", "8M", // Higher bitrate for quality
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
            console.log(`✅ Noir City Assembled Successfully!`);
            console.log(`📂 Location: ${OUTPUT_VIDEO}`);
            console.log(`🌍 Web URL: /drama-assets/noir-city-short/noir-city.mp4`);
        } else {
            console.error(`❌ FFMPEG exited with code ${code}`);
        }
    });
}

assemble();
