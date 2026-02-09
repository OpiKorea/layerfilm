import { getPurchasedIdeas } from "@/lib/data";
import { createClient } from "@/utils/supabase/server";
import { IdeaCard } from "@/components/video/IdeaCard";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function LibraryPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const ideas = await getPurchasedIdeas(user.id);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 mb-4">
                <h1 className="text-3xl font-bold text-white">My Library</h1>
                <p className="text-gray-400">Content you have unlocked.</p>
            </div>

            {ideas.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-gray-400 text-lg mb-4">You haven&apos;t purchased anything yet.</p>
                    <Link href="/" className="px-6 py-2 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors">
                        Explore Store
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
                    {ideas.map((idea) => (
                        <IdeaCard key={idea.id} idea={idea} />
                    ))}
                </div>
            )}
        </div>
    );
}
