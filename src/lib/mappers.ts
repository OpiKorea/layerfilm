import { IdeaItem } from './types';

export function mapRowToIdea(row: any): IdeaItem {
    const s = row.ideas || row;
    const auth = s.author || {};
    const meta = s.metrics?.metadata || {};

    return {
        id: s.id,
        title: s.title,
        description: s.description,
        type: s.type || meta.type || 'video',
        genre: s.genre || meta.genre || 'Sci-Fi',
        runtime: s.runtime || meta.runtime || '00:00',
        ai_tool: s.ai_tool || meta.ai_tool || 'Unknown',
        mood: s.mood || meta.mood || 'Neutral',
        privateContent: s.private_content || meta.private_content,
        videoUrl: s.video_url || s.preview_url || s.private_content || meta.video_url || 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnailUrl: s.thumbnail_url || s.preview_url || meta.thumbnail_url || '',
        title_ko: s.title_ko || meta.title_ko,
        description_ko: s.description_ko || meta.description_ko,
        status: s.status || meta.status || 'pending',
        author_id: s.author_id,
        author: {
            name: auth.username || 'Anonymous',
            avatar: auth.avatar_url || '',
            role: auth.role || 'assistant'
        },
        price: s.price,
        metrics: {
            views: s.view_count || s.metrics?.views || 0,
            likes: s.like_count || s.metrics?.likes || 0
        },
        created_at: s.created_at || new Date().toISOString()
    };

}
