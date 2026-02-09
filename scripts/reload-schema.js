const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function reload() {
    console.log("🔄 Attempting to reload schema cache...");

    // Method 1: Call a non-existent function to trigger a reload (often works in dev)
    // Method 2: Just wait a bit, but we'll try to force a structured request

    // In Supabase hosted, we can't easily force it without dashboard access, 
    // but sometimes making a distinct schema request helps.

    const { data, error } = await supabase.from('ideas').select('id, title, video_url').limit(1);

    if (error) {
        console.log("❌ Select failed (expected if cache stale on columns):", error.message);
        console.log("   Hint:", error.hint);
    } else {
        console.log("✅ Select worked! Cache might be updated.");
        console.log(data);
    }
}

reload();
