const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const FFMPEG_PATH = "C:\\Program Files\\Topaz Labs LLC\\Topaz Video AI\\ffmpeg.exe";
const OUTPUT_VIDEO = path.resolve(__dirname, '../public/drama-ep1-visuals.mp4');
const IMAGE_DIR = path.resolve(__dirname, '../.gemini/antigravity/artifacts'); // Images might be here or locally?
// Actually generate_image saves to Artifacts, so I need to find where they are or copy them.
// The user doesn't have direct access to artifacts dir in the script.
// I should probably copy the images to public folder first or reference them if I know the path.
// For now, let's assume I will copy them to public/drama-images/

const PUBLIC_IMG_DIR = path.resolve(__dirname, '../public/drama-images');

// Duration: 20 minutes = 1200 seconds
const TOTAL_DURATION = 1200;
const IMAGE_DURATION = 10; // each image shown for 10 seconds (before looping)

// We will use a concat file approach or complex filter to loop the images.
// Simpler: Create a slideshow of the images (~5 images * 10s = 50s) and then loop that video.

async function assemble() {
    console.log("🎬 Assembling Drama Visuals...");

    if (!fs.existsSync(FFMPEG_PATH)) {
        console.error(`❌ FFMPEG not found at ${FFMPEG_PATH}`);
        return;
    }

    if (!fs.existsSync(PUBLIC_IMG_DIR)) {
        fs.mkdirSync(PUBLIC_IMG_DIR, { recursive: true });
    }

    // copy artifacts to public dir (This part needs to be done by the agent manually or assumed done)
    // The script assumes images are in PUBLIC_IMG_DIR named scene_01.png etc.
    // I will write a separate block to move them or do it in the command line.

    // Check for images
    const images = fs.readdirSync(PUBLIC_IMG_DIR).filter(f => f.endsWith('.webp') || f.endsWith('.png'));
    if (images.length === 0) {
        console.error("❌ No images found to assemble.");
        return;
    }

    // Create inputs
    // ffmpeg -loop 1 -t 10 -i img1 -loop 1 -t 10 -i img2 ... -filter_complex ... 

    // Let's make a file list for concat
    // file 'path/to/img1.webp'
    // duration 10
    // file 'path/to/img2.webp'
    // duration 10
    // ...
    const listFile = path.join(PUBLIC_IMG_DIR, 'images.txt');
    let listContent = '';

    // We want to loop the images to fill 1200 seconds.
    // 5 images * 10s = 50s per loop.
    // 1200 / 50 = 24 loops.

    for (let i = 0; i < 240; i++) { // Loop enough times
        const img = images[i % images.length];
        listContent += `file '${path.join(PUBLIC_IMG_DIR, img).replace(/\\/g, '/')}'\n`;
        listContent += `duration 5\n`; // Faster pacing 5s
    }
    // Last file repeated to fix known ffmpeg concat bug where last item duration is skipped
    if (images.length > 0) {
        listContent += `file '${path.join(PUBLIC_IMG_DIR, images[images.length - 1]).replace(/\\/g, '/')}'\n`;
    }

    fs.writeFileSync(listFile, listContent);

    // Command
    // -f concat -safe 0 -i list.txt -c:v h264_nvenc ...
    const command = `"${FFMPEG_PATH}" -y -f concat -safe 0 -i "${listFile}" -c:v h264_nvenc -b:v 1M -pix_fmt yuv420p "${OUTPUT_VIDEO}"`;

    console.log(`running: ${command}`);

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Assembly Failed: ${error.message}`);
            return;
        }
        console.log(`✅ Visuals Assembled: ${OUTPUT_VIDEO}`);
    });
}

assemble();
