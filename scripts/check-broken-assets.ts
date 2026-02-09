
import { createClient } from '../src/utils/supabase/server';

async function checkIdeas() {
    const supabase = await createClient();
    const { data: ideas, error } = await supabase.from('ideas').select('id, title, video_url, thumbnail_url, preview_url, metrics');

    if (error) {
        console.error("Error fetching ideas:", error);
        return;
    }

    console.log(`Checking ${ideas.length} ideas...`);
    ideas.forEach(idea => {
        const vUrl = idea.video_url || idea.preview_url || idea.metrics?.metadata?.video_url;
        const tUrl = idea.thumbnail_url || idea.metrics?.metadata?.thumbnail_url;

        if (vUrl && (vUrl.includes('layerfilm.com') || vUrl.includes('noir-city-short'))) {
            console.log(`[!] Broken Video URL in Idea: ${idea.title} (${idea.id}) -> ${vUrl}`);
        }
        if (tUrl && (tUrl.includes('layerfilm.com') || tUrl.includes('noir-city-short'))) {
            console.log(`[!] Broken Thumbnail URL in Idea: ${idea.title} (${idea.id}) -> ${tUrl}`);
        }
    });
}

checkIdeas();
