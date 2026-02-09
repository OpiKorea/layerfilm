
export type ContentType = 'video' | 'series';

export interface IdeaItem {
    id: string;
    title: string;
    description: string;
    type: ContentType;
    genre: string;
    runtime: string;
    ai_tool: string;
    thumbnailUrl?: string;
    videoUrl?: string;
    title_ko?: string;
    description_ko?: string;
    status: 'pending' | 'approved' | 'rejected' | 'reported';
    privateContent: string;
    author_id: string;
    author: {
        name: string;
        avatar: string;
        role: 'director' | 'assistant' | 'admin';
    };
    price?: number;
    metrics: {
        views: number;
        likes: number;
        reactions?: Record<string, number>;
    };
    isUnlocked?: boolean;
}

export interface CommentItem {
    id: string;
    idea_id: string;
    user_id: string;
    content: string;
    rating: number;
    created_at: string;
    user: {
        username: string;
        avatar_url: string;
    };
}

export interface DatabaseIdea {
    id?: string;
    title: string;
    description: string;
    type: ContentType;
    genre?: string;
    runtime?: string;
    ai_tool?: string;
    thumbnail_url?: string;
    video_url?: string;
    title_ko?: string;
    description_ko?: string;
    status: 'pending' | 'approved' | 'rejected' | 'reported';
    private_content?: string;
    preview_url?: string;
    author_id: string;
    price?: number;
    view_count?: number;
    like_count?: number;
    metrics?: any;
}
