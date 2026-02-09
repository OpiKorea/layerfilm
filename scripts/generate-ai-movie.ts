import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

const FFMPEG_PATH = "C:\\Program Files\\Topaz Labs LLC\\Topaz Video AI\\ffmpeg.exe";
const INPUT_IMAGE = path.resolve(__dirname, '../public/placeholder-film.jpg');
const OUTPUT_VIDEO = path.resolve(__dirname, '../public/ai-generated-movie.mp4');

// Duration in seconds
const DURATION = 5;

async function generateMovie() {
    console.log("🎬 Starting AI Movie Generation on Local GPU...");

    if (!fs.existsSync(FFMPEG_PATH)) {
        console.error(`❌ FFMPEG not found at ${FFMPEG_PATH}`);
        return;
    }

    if (!fs.existsSync(INPUT_IMAGE)) {
        console.error(`❌ Input image not found at ${INPUT_IMAGE}`);
        return;
    }

    // Command to create a 5-second video from a single image using NVENC
    // -loop 1: Loop the image
    // -t: Duration
    // -c:v h264_nvenc: Use NVIDIA hardware encoder
    // -pix_fmt yuv420p: Standard pixel format for compatibility
    const command = `"${FFMPEG_PATH}" -y -loop 1 -i "${INPUT_IMAGE}" -c:v h264_nvenc -t ${DURATION} -pix_fmt yuv420p "${OUTPUT_VIDEO}"`;

    console.log(`running: ${command}`);

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Generation Failed: ${error.message}`);
            return;
        }
        if (stderr) {
            // ffmpeg writes progress to stderr, so we just log it as info or debug
            console.log(`[ffmpeg] ${stderr.substring(0, 100)}...`);
        }

        console.log(`✅ Movie Generated Successfully: ${OUTPUT_VIDEO}`);
        console.log(`   Size: ${(fs.statSync(OUTPUT_VIDEO).size / 1024 / 1024).toFixed(2)} MB`);
    });
}

generateMovie();
