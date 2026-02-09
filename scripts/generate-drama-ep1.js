const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const FFMPEG_PATH = "C:\\Program Files\\Topaz Labs LLC\\Topaz Video AI\\ffmpeg.exe";
const OUTPUT_VIDEO = path.resolve(__dirname, '../public/drama-ep1.mp4');

// Duration in seconds (20 minutes)
const DURATION = 20 * 60;

async function generateDrama() {
    console.log(`🎬 Starting Drama Episode 1 Generation on Local GPU (${DURATION}s)...`);

    if (!fs.existsSync(FFMPEG_PATH)) {
        console.error(`❌ FFMPEG not found at ${FFMPEG_PATH}`);
        return;
    }

    // Command to create a 20-minute video using a test pattern (testsrc)
    // -f lavfi -i testsrc: Synthetic pattern
    // -c:v h264_nvenc: Use NVIDIA hardware encoder (Fast!)
    // -pix_fmt yuv420p: Standard pixel format
    // -preset p1: High performance preset for NVENC to generate quickly
    const command = `"${FFMPEG_PATH}" -y -f lavfi -i testsrc=duration=${DURATION}:size=1920x1080:rate=30 -c:v h264_nvenc -preset p1 -pix_fmt yuv420p "${OUTPUT_VIDEO}"`;

    console.log(`running: ${command}`);

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Generation Failed: ${error.message}`);
            return;
        }

        console.log(`✅ Drama Ep.1 Generated Successfully: ${OUTPUT_VIDEO}`);
        try {
            console.log(`   Size: ${(fs.statSync(OUTPUT_VIDEO).size / 1024 / 1024).toFixed(2)} MB`);
        } catch (e) {
            console.log("   Size: Unknown");
        }
    });
}

generateDrama();
