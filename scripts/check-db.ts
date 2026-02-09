import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
    console.log('--- Database Health Check ---');
    console.log('URL:', supabaseUrl);

    // Check profiles table
    const { data: profiles, error: pError } = await supabase.from('profiles').select('count');
    if (pError) {
        console.error('❌ Profiles table error:', pError.message);
        if (pError.message.includes('relation "profiles" does not exist')) {
            console.log('👉 ACTION: You MUST run profiles.sql in Supabase SQL Editor.');
        }
    } else {
        console.log('✅ Profiles table exists.');
    }

    // Check ideas table
    const { data: ideas, error: iError } = await supabase.from('ideas').select('count');
    if (iError) {
        console.error('❌ Ideas table error:', iError.message);
    } else {
        console.log('✅ Ideas table exists.');
    }

    process.exit(0);
}

checkDatabase();
