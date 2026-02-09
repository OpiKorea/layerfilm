
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTypes() {
    console.log("Fetching detailed table info...");
    // Using an old trick to get column info via RPC or just probing values
    const { data, error } = await supabase.from('ideas').select('*').limit(1);

    if (error) {
        console.error("Error:", error);
        return;
    }

    const firstRow = data[0];
    if (firstRow) {
        console.log("Row Data structure:");
        for (const [key, value] of Object.entries(firstRow)) {
            console.log(`${key}: ${typeof value} (Value: ${JSON.stringify(value)})`);
        }
    } else {
        console.log("Table is empty, trying to fetch from profiles to verify user IDs...");
        const { data: profiles } = await supabase.from('profiles').select('id, username').limit(5);
        console.log("Valid user IDs:", profiles);
    }
}

checkTypes();
