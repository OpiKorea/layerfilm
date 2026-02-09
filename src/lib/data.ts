"use server";

import { createClient } from '@/utils/supabase/server';
import { IdeaItem, CommentItem, ContentType, DatabaseIdea } from './types';
import { revalidatePath } from 'next/cache';
import { mapRowToIdea } from './mappers';

const GLOBAL_REVALIDATE_PATHS = ["/", "/explore", "/dashboard", "/admin", "/library", "/mylist"];

async function revalidateAll() {
    GLOBAL_REVALIDATE_PATHS.forEach(p => revalidatePath(p));
}

export async function updateIdeaStatus(id: string, status: 'approved' | 'rejected') {
    const supabase = await createClient();

    let { data, error } = await supabase.from('ideas').update({ status }).eq('id', id).select().single();

    if (error && (error.code === '42703' || error.message.toLowerCase().includes('column'))) {
        console.warn("[Data] Falling back to metrics metadata for status update");
        const { data: current } = await supabase.from('ideas').select('metrics').eq('id', id).single();
        const currentMetrics = current?.metrics || { views: 0, likes: 0 };
        const updatedMetrics = { ...currentMetrics, metadata: { ...(currentMetrics.metadata || {}), status } };
        ({ data, error } = await supabase.from('ideas').update({ metrics: updatedMetrics }).eq('id', id).select().single());
    }

    if (!error) {
        revalidateAll();
        return mapRowToIdea(data);
    }
    console.error("[Data] updateIdeaStatus failed:", error.message);
    return null;
}

export async function createIdea(ideaData: {
    title: string;
    description: string;
    title_ko?: string;
    description_ko?: string;
    genre: string;
    video_url: string;
    thumbnail_url: string;
    author_id: string;
}) {
    const supabase = await createClient();
    console.log(`[Data] Creating new idea: ${ideaData.title}`);

    const payload: Partial<DatabaseIdea> = {
        title: ideaData.title,
        description: ideaData.description,
        type: 'video',
        price: 0,
        author_id: ideaData.author_id,
        private_content: ideaData.video_url,
        preview_url: ideaData.video_url,
    };

    const fullPayload = {
        ...payload,
        video_url: ideaData.video_url,
        thumbnail_url: ideaData.thumbnail_url,
        genre: ideaData.genre,
        status: 'pending',
        title_ko: ideaData.title_ko,
        description_ko: ideaData.description_ko
    };

    let { data, error } = await supabase.from('ideas').insert(fullPayload).select().single();

    if (error && (error.code === '42703' || error.message.includes('column'))) {
        console.warn("[Data] Falling back to metrics metadata for insertion");
        const fallbackPayload = {
            ...payload,
            metrics: {
                views: 0,
                likes: 0,
                metadata: {
                    video_url: ideaData.video_url,
                    thumbnail_url: ideaData.thumbnail_url,
                    genre: ideaData.genre,
                    status: 'pending',
                    title_ko: ideaData.title_ko,
                    description_ko: ideaData.description_ko
                }
            }
        };
        ({ data, error } = await supabase.from('ideas').insert(fallbackPayload).select().single());
    }

    if (!error) {
        revalidateAll();
        return { success: true, data: mapRowToIdea(data) };
    }
    console.error("[Data] createIdea failed:", error.message);
    return { success: false, error: error.message };
}

export async function getUserSubmissions(userId: string): Promise<IdeaItem[]> {
    const supabase = await createClient();
    const { data: rows, error } = await supabase
        .from('ideas')
        .select(`
            *,
            author:profiles!ideas_author_id_fkey(*)
        `)
        .eq('author_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("[Data] getUserSubmissions failed:", error.message);
        return [];
    }
    return (rows || []).map(mapRowToIdea);
}

export async function getProfile(userId: string) {
    const supabase = await createClient();
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    return profile;
}

export async function getFollowerCount(userId: string): Promise<number> {
    const supabase = await createClient();
    const { count } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', userId);

    return count || 0;
}

export async function isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const supabase = await createClient();
    const { data } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', followerId)
        .eq('following_id', followingId)
        .single();

    return !!data;
}

export async function getLikeCount(ideaId: string): Promise<number> {
    const supabase = await createClient();
    const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('idea_id', ideaId);

    return count || 0;
}

export async function hasLiked(userId: string, ideaId: string): Promise<boolean> {
    const supabase = await createClient();
    const { data } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', userId)
        .eq('idea_id', ideaId)
        .single();

    return !!data;
}

export async function getIdeasByAuthor(authorId: string): Promise<IdeaItem[]> {
    const supabase = await createClient();
    const { data: rows, error } = await supabase
        .from('ideas')
        .select(`
            *,
            author:profiles!ideas_author_id_fkey(*)
        `)
        .eq('author_id', authorId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("[Data] getIdeasByAuthor failed:", error.message);
        return [];
    }
    return (rows || []).map(mapRowToIdea);
}

export async function getIdeas(
    query?: string,
    genre?: string,
    role?: string,
    type?: ContentType,
    mood?: string,
    aiTool?: string,
    includePending = false,
    sortBy: 'latest' | 'trending' = 'latest'
): Promise<IdeaItem[]> {
    const supabase = await createClient();
    let dbQuery = supabase.from('ideas').select('*, author:author_id!inner(username, avatar_url, role)');

    try {
        if (!includePending) {
            dbQuery = dbQuery.or('status.eq.approved,metrics->metadata->status.eq.approved');
        } else {
            dbQuery = dbQuery.or('status.in.(pending,reported),metrics->metadata->status.in.(pending,reported)');
        }

        if (role) dbQuery = dbQuery.eq('author.role', role);
        if (type) dbQuery = dbQuery.eq('type', type);
        if (genre && genre !== 'All') dbQuery = dbQuery.ilike('genre', `%${genre}%`);
        if (mood && mood !== 'All') dbQuery = dbQuery.ilike('mood', `%${mood}%`);
        if (aiTool && aiTool !== 'All') dbQuery = dbQuery.ilike('ai_tool', `%${aiTool}%`);
        if (query) dbQuery = dbQuery.ilike('title', `%${query}%`);

        if (sortBy === 'trending') {
            dbQuery = dbQuery.order('view_count', { ascending: false });
        } else {
            dbQuery = dbQuery.order('created_at', { ascending: false });
        }

        let { data, error } = await dbQuery;

        if (error && (error.code === '42703' || error.message.toLowerCase().includes('column'))) {
            let fallbackQuery = supabase.from('ideas').select('*, author:author_id!inner(username, avatar_url, role)');
            if (role) fallbackQuery = fallbackQuery.eq('author.role', role);
            if (type) fallbackQuery = fallbackQuery.eq('type', type);
            if (sortBy === 'trending') fallbackQuery = fallbackQuery.order('view_count', { ascending: false });
            else fallbackQuery = fallbackQuery.order('created_at', { ascending: false });
            const result = await fallbackQuery;
            data = result.data;
            error = result.error;
        }

        if (error) {
            console.error("[Data] getIdeas main query failed:", error.message);
            return [];
        }

        const allIdeas = (data || []).map(mapRowToIdea);
        let filtered = includePending
            ? allIdeas.filter(i => ['pending', 'reported'].includes(i.status))
            : allIdeas.filter(i => i.status === 'approved');

        if (genre && genre !== 'All') {
            const searchGenre = genre.toLowerCase();
            filtered = filtered.filter(i => i.genre?.toLowerCase().includes(searchGenre));
        }

        if (query) {
            const q = query.toLowerCase();
            filtered = filtered.filter(i => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
        }

        if (mood && mood !== 'All') {
            const m = mood.toLowerCase();
            filtered = filtered.filter(i => i.mood?.toLowerCase().includes(m));
        }

        if (aiTool && aiTool !== 'All') {
            const a = aiTool.toLowerCase();
            filtered = filtered.filter(i => i.ai_tool.toLowerCase().includes(a));
        }

        return filtered;
    } catch (e: any) {
        console.error("[Data] getIdeas exception:", e.message);
        return [];
    }
}

export async function getIdeaById(id: string): Promise<IdeaItem | undefined> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('ideas').select('*, author:author_id(username, avatar_url, role)').eq('id', id).single();
    if (error) {
        console.error(`[Data] getIdeaById(${id}) failed:`, error.message);
        return undefined;
    }
    return mapRowToIdea(data);
}

export async function getPurchasedIdeas(userId: string): Promise<IdeaItem[]> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('purchases').select('ideas (*, author:author_id(username, avatar_url, role))').eq('user_id', userId);
    if (error) {
        console.error("[Data] getPurchasedIdeas failed:", error.message);
        return [];
    }
    return (data || []).map((row: unknown) => mapRowToIdea((row as { ideas: unknown }).ideas)).filter(item => item.id);
}

export async function getComments(ideaId: string): Promise<CommentItem[]> {
    const supabase = await createClient();
    const { data, error } = await supabase.from('comments').select('*, user:user_id(username, avatar_url)').eq('idea_id', ideaId).order('created_at', { ascending: false });
    if (error) {
        console.error("[Data] getComments failed:", error.message);
        return [];
    }
    return (data || []) as CommentItem[];
}

export async function updateMockIdea(id: string, updates: Partial<IdeaItem>) {
    const supabase = await createClient();
    const dbUpdates: Partial<DatabaseIdea> = {};
    if (updates.title) dbUpdates.title = updates.title;

    const { data, error } = await supabase
        .from('ideas')
        .update(dbUpdates)
        .eq('id', id)
        .select('*, author:author_id(username, avatar_url, role)')
        .single();

    if (error) {
        console.error("[Data] updateMockIdea failed:", error.message);
        return null;
    }

    return mapRowToIdea(data);
}

export async function postComment(ideaId: string, userId: string, content: string, rating: number) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('comments').insert({ idea_id: ideaId, user_id: userId, content, rating }).select('*, user:user_id(username, avatar_url)').single();
    if (error) {
        console.error("[Data] postComment failed:", error.message, error.details);
        return null;
    }
    revalidatePath(`/idea/${ideaId}`);
    revalidateAll();
    return data as unknown as CommentItem;
}

export async function deleteComment(commentId: string, ideaId: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('comments').delete().eq('id', commentId);
    if (error) {
        console.error("[Data] deleteComment failed:", error.message);
    } else {
        revalidatePath(`/idea/${ideaId}`);
    }
    return { success: !error, error: error?.message };
}

export async function deleteIdea(id: string) {
    const supabase = await createClient();

    // 1. Delete comments first
    await supabase.from('comments').delete().eq('idea_id', id);

    // 2. Delete favorites
    await supabase.from('favorites').delete().eq('idea_id', id);

    // 3. Delete idea
    const { error } = await supabase.from('ideas').delete().eq('id', id);
    if (error) {
        console.error("[Data] deleteIdea failed:", error.message);
    } else {
        revalidateAll();
    }
    return { success: !error, error: error?.message };
}

export async function reportIdea(id: string) {
    const supabase = await createClient();
    let { error } = await supabase.from('ideas').update({ status: 'reported' }).eq('id', id);

    if (error && (error.code === '42703' || error.message.toLowerCase().includes('column'))) {
        console.warn("[Data] Falling back to metrics metadata for reporting");
        const { data: current } = await supabase.from('ideas').select('metrics').eq('id', id).single();
        const currentMetrics = current?.metrics || { views: 0, likes: 0 };
        const updatedMetrics = { ...currentMetrics, metadata: { ...(currentMetrics.metadata || {}), status: 'reported' } };
        const result = await supabase.from('ideas').update({ metrics: updatedMetrics }).eq('id', id);
        error = result.error;
    }

    if (!error) {
        revalidateAll();
    } else {
        console.error("[Data] reportIdea failed:", error.message);
    }
    return { success: !error, error: error?.message };
}
