
export function getMediaUrl(src: string) {
    if (!src) return '';
    // Future Logic: If it's a Mux ID, return the Mux HLS URL.
    // For now, assume it's a direct URL.
    return src;
}
