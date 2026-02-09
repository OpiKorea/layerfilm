import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function verify() {
    const { data: users, error: userError } = await supabase.auth.admin.listUsers();
    if (userError) {
        console.error("Auth Error:", userError);
        return;
    }

    const adminUser = users.users.find(u => u.email === 'nowpoa@naver.com');
    if (!adminUser) {
        console.log("X User nowpoa@naver.com NOT FOUND in Auth.");
    } else {
        console.log(`O User Found: ${adminUser.id} (${adminUser.email})`);

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', adminUser.id)
            .single();

        if (profileError) {
            console.error("Profile Error:", profileError);
        } else {
            console.log(`O Profile Found: Role = ${profile.role}, Username = ${profile.username}`);
        }
    }
}

verify();
