
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase URL or Service Role Key in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function uploadFile(bucketName, localPath, remotePath) {
    if (!fs.existsSync(localPath)) {
        console.warn(`⚠️ skipping: ${localPath} (not found)`);
        return null;
    }

    const fileBuffer = fs.readFileSync(localPath);
    const contentType = localPath.endsWith('.mp4') ? 'video/mp4' : 'image/png';

    console.log(`📤 Uploading ${localPath} -> ${bucketName}/${remotePath}...`);
    const { data, error } = await supabase.storage.from(bucketName).upload(remotePath, fileBuffer, {
        contentType,
        upsert: true
    });

    if (error) {
        console.error(`❌ Error uploading ${remotePath}:`, error.message);
        return null;
    }

    const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(remotePath);
    console.log(`✅ Success! Public URL: ${publicUrl}`);
    return publicUrl;
}

async function startMigration() {
    const dramaAssetsDir = 'Z:/layerfilm/drama-assets/showcase';

    // Define the assets we need for the hero section and initial views
    const assets = [
        { bucket: 'videos', local: 'scene_001_7s_master.mp4', remote: 'showcase/scene_001_7s_master.mp4' },
        { bucket: 'thumbnails', local: 'base.png', remote: 'showcase/base.png' },
    ];

    for (const asset of assets) {
        const fullLocalPath = path.join(dramaAssetsDir, asset.local);
        await uploadFile(asset.bucket, fullLocalPath, asset.remote);
    }
}

startMigration();
