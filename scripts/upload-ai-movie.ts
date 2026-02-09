import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const VIDEO_PATH = path.resolve(__dirname, '../public/ai-generated-movie.mp4');
const BUCKET_NAME = 'videos'; // Ensure this bucket exists and is public
const FILE_NAME = `ai-movie-${Date.now()}.mp4`;

async function uploadAndCreateIdea() {
    console.log("🚀 Starting Upload & Idea Creation...");

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
    const { data: userProfile, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', 'Loca') // Adjust if username check fails
        .single();

    // Fallback if username lookup fails/is ambiguous, trying by email if possible (but profiles table usually has username)
    // If Loca doesn't exist, use the admin ID found previously or fail
    let userId = userProfile?.id;
    if (!userId) {
        console.warn("⚠️ User 'Loca' not found. Using hardcoded Admin ID or failing...");
        // Replace with the UUID found in previous steps: 34e0d951-d852-40e8-a751-18bb14430c83
        userId = '34e0d951-d852-40e8-a751-18bb14430c83';
    }

    console.log(`👤 Linking to User ID: ${userId}`);

    // 3. Create Idea Record
    const ideaPayload = {
        title: "The GPU Awakens",
        description: "A short film generated entirely on the user's local NVIDIA GPU, demonstrating the power of edge AI creation.",
        type: 'video',
        genre: 'Sci-Fi', // Matches existing genre in seeds
        ai_tool: 'Topaz Video AI (FFMPEG NVENC)',
        price: 0,
        author_id: userId,
        status: 'approved', // Auto-approve for admin
        video_url: publicUrl,
        thumbnail_url: 'https://layerfilm.com/placeholder-film.jpg', // Use site placeholder or upload a frame
        private_content: publicUrl,
        preview_url: publicUrl
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
    }
}

uploadAndCreateIdea();
