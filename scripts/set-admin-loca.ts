import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error("Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing.");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function setAdmin() {
    console.log("Setting 'Loca' (nowpoa@naver.com) as Admin...");

    // 1. Find user by email to get ID (optional, but good for verification)
    // Actually, we can just update profiles directly if username is unique

    // Check if user exists first
    const { data: user, error: findError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', 'Loca')
        .single();

    if (findError) {
        console.error("Error finding user 'Loca':", findError.message);
        return;
    }

    if (!user) {
        console.error("User 'Loca' not found in profiles table.");
        return;
    }

    console.log(`Found user: ${user.username} (${user.id})`);

    // 2. Update role
    const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', user.id);

    if (updateError) {
        console.error("Error updating role:", updateError.message);
    } else {
        console.log("✅ Admin role granted to 'Loca' successfully!");
    }
}

setAdmin();
