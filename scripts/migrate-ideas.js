/* eslint-disable */
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function migrate() {
    console.log("Reading data.json...");
    const dataPath = path.join(__dirname, '../src/lib/data.json');
    if (!fs.existsSync(dataPath)) {
        console.error("data.json not found at", dataPath);
        return;
    }

    const rawData = fs.readFileSync(dataPath, 'utf8');
    const ideas = JSON.parse(rawData);

    console.log(`Starting migration of ${ideas.length} ideas...`);

    for (const idea of ideas) {
        console.log(`Migrating: ${idea.title}`);

        // Map types if necessary
        const { error } = await supabase.from('ideas').insert([{
            title: idea.title,
            description: idea.description,
            type: idea.type || 'video',
            price: idea.price || 0,
            preview_url: idea.previewUrl || idea.youtubeUrl || null,
            private_content: idea.privateContent || null,
            metrics: { views: idea.views || 0, sales: idea.sales || 0 }
        }]);

        if (error) {
            console.error(`❌ Failed to migrate ${idea.title}:`, error.message);
        } else {
            console.log(`✅ Migrated: ${idea.title}`);
        }
    }

    console.log("Migration complete!");
}

migrate();
