
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function signup() {
    const email = 'layerfilme@gmail.com';
    const password = '!a54198900';
    const nickname = 'LayerfilmAdmin';

    console.log(`Attempting to sign up ${email}...`);

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                nickname,
            }
        }
    });

    if (error) {
        if (error.message.includes('already registered')) {
            console.log("User already exists. Attempting to fetch user...");
            const { data: userData, error: userError } = await supabase.auth.signInWithPassword({ email, password });
            if (userError) {
                console.error("Login failed:", userError.message);
                return;
            }
            console.log("SUCCESS: User logged in. ID:", userData.user?.id);
        } else {
            console.error("Signup failed:", error.message);
        }
    } else {
        console.log("SUCCESS: User registered. ID:", data.user?.id);
        console.log("Please check email for confirmation if required.");
    }
}

signup();
