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
