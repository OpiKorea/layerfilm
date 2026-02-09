export function getMediaUrl(src: string) {
    if (!src) return '';

    // Convert local development paths to Supabase Storage URLs for production
    if (src.startsWith('/drama-assets/')) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        if (supabaseUrl) {
            // Check if it's a video or image based on extension or folder
            const isVideo = src.endsWith('.mp4') || src.endsWith('.webm');
            const bucket = isVideo ? 'videos' : 'thumbnails';
            const path = src.replace('/drama-assets/', '');
            return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
        }
    }

    return src;
}
