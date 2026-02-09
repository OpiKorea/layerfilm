import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function migrate() {
    console.log("Starting migration...");

    // Read local data
    const dataPath = path.resolve(__dirname, '../src/lib/data.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const ideas = JSON.parse(rawData);

    // Initial check: if table is empty
    // Actually, let's just upsert based on title or something? 
    // Since IDs in JSON are "1", "2", "3" (strings), but DB uses UUID.
    // We will generate new UUIDs and map them? 
    // OR we can just insert and let DB generate UUIDs, but then we need to update our code to use DB IDs.
    // For this migration, let's just Insert.

    for (const idea of ideas) {
        console.log(`Migrating: ${idea.title}`);

        const { error } = await supabase.from('ideas').insert({
            title: idea.title,
            description: idea.description,
            price: idea.price,
            type: idea.type,
            private_content: idea.privateContent,
            author_name: idea.author.name,
            author_avatar: idea.author.avatar,
            views_count: idea.metrics.views,
            likes_count: idea.metrics.likes
        });

        if (error) {
            console.error(`Error inserting ${idea.title}:`, error.message);
        } else {
            console.log(`Successfully migrated ${idea.title}`);
        }
    }
    console.log("Migration complete.");
}

migrate();
