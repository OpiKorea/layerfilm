
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function convertToSeries() {
    console.log("🔄 Converting some films to Series...");

    // List of titles to convert to Series
    const seriesTitles = [
        "The Last Neural Network",
        "Chronicles of Aether",
        "Mars Protocol",
        "The Algorithm's Child"
    ];

    for (const title of seriesTitles) {
        const { error } = await supabase
            .from('ideas')
            .update({ type: 'series' })
            .ilike('title', title);

        if (error) {
            console.error(`❌ Failed to update ${title}:`, error);
        } else {
            console.log(`✅ Converted to Series: ${title}`);
        }
    }

    console.log("🎉 Conversion Complete!");
}

convertToSeries();
