
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function initStorage() {
    const buckets = ['videos', 'thumbnails'];

    for (const bucketName of buckets) {
        console.log(`Checking bucket: ${bucketName}...`);
        const { data: bucket, error: getError } = await supabase.storage.getBucket(bucketName);

        if (getError) {
            console.log(`Bucket ${bucketName} not found, creating...`);
            const { data, error } = await supabase.storage.createBucket(bucketName, {
                public: true,
                allowedMimeTypes: bucketName === 'videos' ? ['video/mp4', 'video/webm'] : ['image/png', 'image/jpeg', 'image/webp'],
                fileSizeLimit: 524288000 // 500MB
            });

            if (error) {
                console.error(`❌ Error creating bucket ${bucketName}:`, error.message);
            } else {
                console.log(`✅ Bucket ${bucketName} created successfully.`);
            }
        } else {
            console.log(`✅ Bucket ${bucketName} already exists.`);
        }
    }
}

initStorage();
