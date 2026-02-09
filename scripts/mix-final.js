const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Path to ffmpeg binary (from imageio-ffmpeg)
const ffmpeg = "C:\\layerfilm\\.venv\\Lib\\site-packages\\imageio_ffmpeg\\binaries\\ffmpeg-win-x86_64-v7.1.exe";

// Files
const videoPath = "Z:\\layerfilm\\drama-assets\\noir-city-short\\noir-city-motion.mp4";
const audioPath = "Z:\\layerfilm\\drama-assets\\noir-city-short\\audio\\noir_OST.wav";
const outputPath = "Z:\\layerfilm\\drama-assets\\noir-city-short\\noir-city-final.mp4";

console.log("🎬 Mixing Audio + Video...");

if (!fs.existsSync(videoPath)) {
    console.error("❌ Video not found:", videoPath);
    process.exit(1);
}
if (!fs.existsSync(audioPath)) {
    console.error("❌ Audio not found:", audioPath);
    process.exit(1);
}

// FFmpeg command: Mix audio/video, shortest duration wins, use aac for audio
const cmd = `"${ffmpeg}" -y -i "${videoPath}" -i "${audioPath}" -c:v copy -c:a aac -shortest "${outputPath}"`;

exec(cmd, (error, stdout, stderr) => {
    if (error) {
        console.error(`❌ Mix Error: ${error.message}`);
        console.error(stderr);
        return;
    }
    console.log(`✅ Final Movie Created: ${outputPath}`);
});
