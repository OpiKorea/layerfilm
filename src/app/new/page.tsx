
import { FilmRow } from "@/components/video/FilmRow";
import { getIdeas } from "@/lib/data";

export const dynamic = 'force-dynamic';

export default async function NewAndPopularPage() {
    // Fetch data sorted by creation date (New)
    const newArrivals = await getIdeas(undefined, undefined, undefined, 'video');
    const newSeries = await getIdeas(undefined, undefined, undefined, 'series');

    // In a real app, we'd sort by view_count for "Popular"
    // Since getIdeas already sorts by created_at, let's just use it for "New"
    // And filter specific high-view count items for Popular if we had that logic exposed.
    // For now, we will reuse the data but present it differently.

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20 px-6 md:px-12">
            <div className="max-w-7xl mx-auto space-y-12">
                <header className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">New & Popular</h1>
                    <p className="text-gray-400 text-xl">The latest AI-generated masterpieces and trending hits.</p>
                </header>

                <div className="space-y-16">
                    <FilmRow title="New on LayerFilm" ideas={newArrivals.slice(0, 10)} />

                    <FilmRow title="Trending Series" ideas={newSeries} />

                    <FilmRow title="Most Watched This Week" ideas={newArrivals.slice(2, 7)} />

                    <FilmRow title="Coming Soon" ideas={[]} /> {/* Empty state test */}
                </div>
            </div>
        </div>
    );
}
