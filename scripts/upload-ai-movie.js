const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

// Load env vars
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const VIDEO_PATH = path.resolve(__dirname, '../public/ai-generated-movie.mp4');
const BUCKET_NAME = 'videos';
const FILE_NAME = `ai-movie-${Date.now()}.mp4`;

async function uploadAndCreateIdea() {
    console.log("🚀 Starting Upload & Idea Creation (Final Attempt)...");

    if (!fs.existsSync(VIDEO_PATH)) {
        console.error(`❌ Video file not found at ${VIDEO_PATH}. Run generation script first.`);
        return;
    }

    const fileBuffer = fs.readFileSync(VIDEO_PATH);

    // 1. Upload to Storage
    console.log(`📤 Uploading to bucket '${BUCKET_NAME}'...`);
    const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from(BUCKET_NAME)
        .upload(FILE_NAME, fileBuffer, {
            contentType: 'video/mp4',
            upsert: true
        });

    if (uploadError) {
        console.error("❌ Upload Failed:", uploadError.message);
        return;
    }

    // Get Public URL
    const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(FILE_NAME);
    console.log(`✅ Upload Successful! Public URL: ${publicUrl}`);

    // 2. Get User (Loca)
    let userId = '34e0d951-d852-40e8-a751-18bb14430c83';
    const { data: userProfile } = await supabase.from('profiles').select('id').eq('username', 'Loca').single();
    if (userProfile) userId = userProfile.id;

    // 3. Create Idea Record using JSONB 'metrics' for metadata since schema is strict
    console.log("📝 Inserting with JSONB Metadata...");

    // Columns we KNOW exist based on schema.sql:
    // id, title, description, price, type, private_content, author_id, created_at
    // Missing/Hidden: genre, video_url, thumbnail_url, status, ai_tool

    const ideaPayload = {
        title: "The GPU Awakens " + new Date().toLocaleTimeString(),
        description: "A short film generated entirely on the user's local NVIDIA GPU.",
        type: 'video',
        price: 0,
        author_id: userId,
        private_content: publicUrl, // Using this for the video URL as per schema
        metrics: {
            views: 0,
            likes: 0,
            metadata: {
                genre: 'Sci-Fi',
                ai_tool: 'Topaz Video AI (FFMPEG NVENC)',
                status: 'approved',
                video_url: publicUrl,
                thumbnail_url: 'https://layerfilm.com/placeholder-film.jpg',
                preview_url: publicUrl
            }
        }
    };

    const { data: idea, error: dbError } = await supabase
        .from('ideas')
        .insert(ideaPayload)
        .select()
        .single();

    if (dbError) {
        console.error("❌ Database Insertion Failed:", dbError.message);
        console.error("Details:", dbError.details);
    } else {
        console.log(`🎉 Success! Idea created with ID: ${idea.id}`);
        console.log(`   Title: ${idea.title}`);
        console.log(`   Video URL: ${publicUrl}`);
    }
}

uploadAndCreateIdea();
