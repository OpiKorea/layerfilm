
'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function toggleLike(ideaId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Authentication required' };

    // Check if already liked
    const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', user.id)
        .eq('idea_id', ideaId)
        .single();

    if (existingLike) {
        // Unlike
        const { error } = await supabase
            .from('likes')
            .delete()
            .eq('id', existingLike.id);

        if (error) return { error: error.message };
    } else {
        // Like
        const { error } = await supabase
            .from('likes')
            .insert({ user_id: user.id, idea_id: ideaId });

        if (error) return { error: error.message };
    }

    revalidatePath(`/ideas/${ideaId}`);
    return { success: true, liked: !existingLike };
}

export async function toggleFollow(followingId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Authentication required' };
    if (user.id === followingId) return { error: 'You cannot follow yourself' };

    // Check if already following
    const { data: existingFollow } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', followingId)
        .single();

    if (existingFollow) {
        // Unfollow
        const { error } = await supabase
            .from('follows')
            .delete()
            .eq('id', existingFollow.id);

        if (error) return { error: error.message };
    } else {
        // Follow
        const { error } = await supabase
            .from('follows')
            .insert({ follower_id: user.id, following_id: followingId });

        if (error) return { error: error.message };
    }

    revalidatePath(`/director/${followingId}`);
    return { success: true, following: !existingFollow };
}
