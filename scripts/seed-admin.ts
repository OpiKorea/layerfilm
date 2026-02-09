import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required in .env.local');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function seedAdmin() {
    const email = 'nowpoa@naver.com';
    const password = '123456'; // UPDATED PASSWORD (min 6 chars)
    const nickname = 'Loca';

    console.log(`Creating/Updating Admin User: ${email}...`);

    // 1. Try to fetch the user first to see if they exist
    const { data: listData, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
        console.error("Failed to list users:", listError);
        return;
    }

    const existingUser = listData.users.find(u => u.email === email);
    let userId;

    if (existingUser) {
        console.log(`User already exists (ID: ${existingUser.id}). Updating password...`);
        userId = existingUser.id;

        const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
            password: password,
            user_metadata: { nickname: nickname }
        });

        if (updateError) {
            console.error("Error updating password:", updateError.message);
            return;
        }
        console.log("Password updated successfully to '1234'.");

    } else {
        console.log("User does not exist. Creating new user...");
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: { nickname: nickname }
        });

        if (createError) {
            console.error("Error creating user:", createError.message);
            return;
        }
        userId = newUser.user?.id;
        console.log(`User created successfully (ID: ${userId}).`);
    }

    if (!userId) {
        console.error("Failed to determine User ID.");
        return;
    }

    // 2. Assign Role in 'profiles' table
    console.log("Assigning 'admin' role...");

    const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
            id: userId,
            role: 'admin',
            username: nickname,
            // email: email // Optional depending on schema, but safe to omit if trigger works
        });

    if (upsertError) {
        console.error("Error assigning admin role:", upsertError.message);
    } else {
        console.log("✅ Success! Role is set to ADMIN.");
    }
}

seedAdmin();
