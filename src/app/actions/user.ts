'use server';

import { createClient } from '@/utils/supabase/server';

export async function checkNickname(nickname: string): Promise<boolean> {
    const supabase = await createClient();

    // 1. Check if nickname is blocked (AI keywords)
    const forbiddenKeywords = ['ai', 'bot', 'agent', 'robot', 'gpt', 'admin', 'moderator'];
    if (forbiddenKeywords.some(keyword => nickname.toLowerCase().includes(keyword))) {
        return false; // Treat as unavailable
    }

    // 2. Check DB for existence
    const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .ilike('username', nickname)
        .single();

    if (error && error.code === 'PGRST116') {
        // PGRST116: JSON object requested, multiple (or no) rows returned
        // In .single() context, no rows means it's available
        return true;
    }

    if (data) {
        return false; // Nickname exists
    }

    return true; // Available
}

export async function checkEmail(email: string): Promise<boolean> {
    const supabase = await createClient();

    // Check if email exists in profiles table
    // (Assuming email is stored in profiles or we check auth.users via an RPC if exposed)
    const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email.toLowerCase())
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error("Error checking email availability:", error);
        return true; // Assume available on error to not block user
    }

    return !data; // Return true if no data found (available)
}
