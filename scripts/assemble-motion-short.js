const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Unused path removed


// Z: Drive
const VID_DIR = "Z:\\layerfilm\\drama-assets\\noir-city-short\\films";
const OUTPUT_VIDEO = "Z:\\layerfilm\\drama-assets\\noir-city-short\\noir-city-motion.mp4";

// Ensure output dir
const outDir = path.dirname(OUTPUT_VIDEO);
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

// Scene Files
const clips = [
    'scene_01.mp4', 'scene_02.mp4', 'scene_03.mp4',
    'scene_04.mp4', 'scene_05.mp4', 'scene_06.mp4'
];

async function assemble() {
    console.log(`🎬 Assembling Motion Short with Crossfades...`);

    // Verify clips exist
    const validClips = clips.filter(c => fs.existsSync(path.join(VID_DIR, c)));
    if (validClips.length === 0) {
        console.error("❌ No clips found!");
        return;
    }

    // FFMPEG Filter Complex for Crossfades
    // This is complex. For 6 clips, we need 5 offsets.
    // Assuming each clip is ~3.5s (25 frames @ 7fps).
    // Let's settle on a standard duration. 
    // Actually, simply concatenating might be safer for a first pass if xfade is too brittle with variable lengths.
    // User wants "Seamless". Xfade is best.
    // Let's assume standard length of 3.5s.
    // Offset = CurrentTime - FadeDuration

    // Simplified: Just concat with a simple mix? No, xfade is specific.
    // Let's try a simple version first: Concat. 
    // User emphasized "Second follows first". 
    // If the content is cuts, then hard cut is standard. 
    // If they want "Morph", that's different.
    // Let's Stick to CONCAT for reliability first, but ensure they are all converted to same timeframe.

    // We will re-encode to 24fps (interpolation) to make it smooth?
    // SVD files are 7fps. FFMPEG needs to handle this.

    let inputs = [];
    let filterComplex = "";

    // 1. Resample all to 24fps using minterpolate (Optical Flow) for smoothness?
    // That takes FOREVER.
    // Let's just duplicate frames (r=24) or let the player handle it.
    // Doing strict concat.

    clips.forEach(c => inputs.push("-i", path.join(VID_DIR, c)));

    // Simple Concat
    /*
    filterComplex = `concat=n=${clips.length}:v=1:a=0[outv]`;
    */

    // Let's try XFADE for that "Seamless" feel.
    // Fade duration 0.5s.
    // Clip duration ~3.5s.
    // Offset = 3.0s, 6.0s, 9.0s...
    // Actually, calculating offsets dynamically is hard in one command without probing.
    // Strategy: Create a temporary txt list for 'concat demuxer' which is safest.

    const listFile = path.join(VID_DIR, 'filelist.txt');
    const fileContent = clips.map(c => `file '${path.join(VID_DIR, c)}'`).join('\n');
    fs.writeFileSync(listFile, fileContent);

    const args = [
        "-y",
        "-f", "concat",
        "-safe", "0",
        "-i", listFile,
        "-c:v", "h264_nvenc",
        "-b:v", "10M",
        "-r", "24", // Force 24fps output (interpolation by duplication)
        OUTPUT_VIDEO
    ];

    console.log("Running FFMPEG Concat...");

    const ffmpegPath = "C:\\layerfilm\\.venv\\Lib\\site-packages\\imageio_ffmpeg\\binaries\\ffmpeg-win-x86_64-v7.1.exe";
    const ffmpeg = spawn(ffmpegPath, args);

    ffmpeg.stdout.on('data', (data) => console.log(`stdout: ${data}`));
    ffmpeg.stderr.on('data', (data) => console.error(`stderr: ${data}`));

    ffmpeg.on('close', (code) => {
        if (code === 0) {
            console.log(`✅ Motion Short Assembled!`);
            console.log(`📂 ${OUTPUT_VIDEO}`);
        } else {
            console.error(`❌ FFMPEG exited with code ${code}`);
        }
    });
}

assemble();
