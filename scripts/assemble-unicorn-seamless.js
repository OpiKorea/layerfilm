const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// FFmpeg Path
const ffmpegPath = "C:\\layerfilm\\.venv\\Lib\\site-packages\\imageio_ffmpeg\\binaries\\ffmpeg-win-x86_64-v7.1.exe";

// Project Name from Argument
const projectName = process.argv[2] || "the-last-unicorn";

// Video directory
const filmDir = `Z:\\layerfilm\\drama-assets\\${projectName}\\films_4k_60fps`;
const outputDir = `Z:\\layerfilm\\drama-assets\\${projectName}`;
const outputFile = path.join(outputDir, `${projectName}-seamless.mp4`);

// 1. Get all video files
try {
    const files = fs.readdirSync(filmDir)
        .filter(file => file.endsWith('.mp4'))
        .sort(); // scene_01, scene_02...

    if (files.length === 0) {
        console.error("No videos found!");
        process.exit(1);
    }

    // Convert to full paths
    const videos = files.map(file => path.join(filmDir, file));
    console.log(`🎬 Found ${videos.length} One-Take Transitions...`);

    // 2. Build Complex Filtergraph for X-Fade
    // SVD clip duration is typically ~3.57s (25 frames / 7 fps)
    // We overlap by 1.0 second.
    const clipDur = 3.57;
    const overlap = 1.0;

    let filterStr = "";
    let inputs = "";
    let mapLabel = "[0:v]"; // Start with first video label

    // Command Construction:
    // ffmpeg -i v0 -i v1 -i v2 ... -filter_complex "[0][1]xfade...[v1];[v1][2]xfade...[v2]" -map "[vN]" output

    // Add all inputs
    videos.forEach(v => {
        inputs += `-i "${v}" `;
    });

    // Build filter chain
    // [0:v][1:v]xfade=transition=fade:duration=1:offset=2.57[v1];
    // [v1][2:v]xfade=transition=fade:duration=1:offset=5.14[v2];

    let currentOffset = 0;
    let lastLabel = "[0:v]"; // The label of the 'accumulated' video stream so far

    // If only 1 video, just copy
    if (videos.length === 1) {
        console.log("Only 1 video, just copying.");
        fs.copyFileSync(videos[0], outputFile);
        process.exit(0);
    }

    // Filter Logic
    // Loop through transitions (N-1 transitions for N videos)
    for (let i = 0; i < videos.length - 1; i++) {
        const nextInputIndex = i + 1;
        const nextInputLabel = `[${nextInputIndex}:v]`;
        const outputLabel = `[x${i + 1}]`;

        // Offset Calculation
        // First transition offset = clipDur - overlap
        // Subsequent offsets = previous_offset + (clipDur - overlap)
        if (i === 0) {
            currentOffset = clipDur - overlap;
        } else {
            currentOffset += (clipDur - overlap);
        }

        // Add filter segment
        // usage: [main][next]xfade...[out]
        filterStr += `${lastLabel}${nextInputLabel}xfade=transition=fade:duration=${overlap}:offset=${currentOffset.toFixed(2)}${outputLabel};`;

        // Update lastLabel for next iteration
        lastLabel = outputLabel;
    }

    // Remove trailing semicolon if any (though usually fine in complex filter strings if followed by nothing, but let's be clean)
    // Actually, we want to add format=yuv420p to the very end
    const finalMap = `${lastLabel}format=yuv420p[final]`;
    filterStr += finalMap;

    const cmd = `"${ffmpegPath}" ${inputs} -filter_complex "${filterStr}" -map "[final]" -y "${outputFile}"`;

    console.log("🚀 Executing seamless render...");
    // Increase buffer for long commands
    exec(cmd, { maxBuffer: 1024 * 1024 * 50 }, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Visual Error: ${error.message}`);
            // console.error(stderr); // optional verbose
            return;
        }
        console.log(`✅ Seamless Video Created: ${outputFile}`);
    });

} catch (e) {
    console.error("Script Error:", e);
}
