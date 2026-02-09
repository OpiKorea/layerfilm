
import { createClient } from "@/utils/supabase/server";
import { FilmRow } from "@/components/video/FilmRow";
import { mapRowToIdea } from "@/lib/mappers";
import { redirect } from "next/navigation";
import Link from "next/link";


export default async function MyListPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch Favorites
    const { data: favorites, error } = await supabase
        .from('favorites')
        .select(`
            ideas (
                *,
                author:author_id(username, avatar_url, role)
            )
        `)
        .eq('user_id', user.id);

    if (error) {
        console.error("Error fetching favorites:", error);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const myIdeas = (favorites || []).map((f: any) => mapRowToIdea(f)).filter(i => i.id);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl md:text-5xl font-black mb-8 tracking-tighter">My List</h1>

                {myIdeas.length > 0 ? (
                    <FilmRow title="Saved Content" ideas={myIdeas} />
                ) : (
                    <div className="h-[50vh] flex flex-col items-center justify-center bg-white/5 rounded-2xl border border-white/5 border-dashed">
                        <p className="text-gray-400 text-lg mb-6">Your list is empty.</p>
                        <Link href="/" className="px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-full transition-colors text-lg">
                            Go Home
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
