import { getIdeaById, getIdeas, getComments } from "@/lib/data";
import { IdeaItem } from "@/lib/types";
import { Unlock, Info } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { FilmRow } from "@/components/video/FilmRow";
import { DetailHero } from "@/components/video/DetailHero";
import { LocalizedText } from "@/components/common/LocalizedText";
import { CommentSection } from "@/components/video/CommentSection";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const idea = await getIdeaById(id);
    if (!idea) return { title: "Film Not Found | LayerFilm" };

    return {
        title: `${idea.title} | LayerFilm`,
        description: idea.description,
        openGraph: {
            title: idea.title,
            description: idea.description,
            images: [idea.thumbnailUrl || ""],
            type: "video.other",
        },
        twitter: {
            card: "summary_large_image",
            title: idea.title,
            description: idea.description,
            images: [idea.thumbnailUrl || ""],
        }
    };
}

export default async function IdeaDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const idea = await getIdeaById(id);
    const comments = await getComments(id);

    // Calculate Average Rating (Scaled to 10)
    const avgRating = comments.length > 0
        ? (comments.reduce((acc, c) => acc + c.rating, 0) / comments.length) * 2
        : 7.5; // Default if no reviews

    // Auth Check & Profile Fetch
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    let userProfile = null;
    if (authUser) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();
        userProfile = profile;
    }

    if (!idea) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#0a0a0a]">
                <h2 className="text-3xl font-black text-white tracking-tighter">Film Not Found</h2>
                <Link href="/" className="text-violet-500 hover:text-violet-400 underline decoration-2 underline-offset-4">Return to Theater</Link>
            </div>
        );
    }

    // Fetch Related Ideas (Same Genre)
    const relatedIdeas = await getIdeas(undefined, idea.genre);
    const filteredRelated = relatedIdeas.filter((i: IdeaItem) => i.id !== idea.id).slice(0, 10);

    const privateContent = (authUser) ? idea.privateContent : null;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white pb-0 font-sans">
            {/* 1. Immersive Hero Section */}
            <DetailHero idea={idea} user={userProfile} averageRating={avgRating} />

            {/* 2. Content & Details */}
            <div className="relative z-20 bg-[#0a0a0a] px-6 md:px-16 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Left: Synopsis & Comments */}
                    <div className="lg:col-span-8 space-y-16">
                        <section className="space-y-8">
                            <div>
                                <h3 className="text-xl font-bold text-violet-400 mb-4 flex items-center gap-2">
                                    <Info className="w-5 h-5" />
                                    <LocalizedText en="Storyline" ko="줄거리" />
                                </h3>
                                <div className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light">
                                    <LocalizedText en={idea.description} ko={idea.description_ko} />
                                </div>
                            </div>


                            {/* Secret Content */}
                            {idea.isUnlocked && privateContent && (
                                <div className="bg-gradient-to-r from-violet-900/10 to-transparent p-8 rounded-3xl border border-violet-500/20">
                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                        <Unlock className="w-6 h-6 text-green-400" />
                                        <LocalizedText en="Unlocked Director's Assets" ko="잠금 해제된 감독의 에셋" />
                                    </h3>
                                    <div className="bg-black/40 p-6 rounded-xl border border-white/5 font-mono text-violet-200 break-all">
                                        {privateContent}
                                    </div>
                                </div>
                            )}
                        </section>

                        <div className="pt-16 border-t border-white/10">
                            <CommentSection
                                ideaId={id}
                                currentUser={userProfile}
                                ideaAuthorId={idea.author_id}
                            />
                        </div>
                    </div>

                    {/* Right: Meta / Tags */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Tags</h4>
                            <div className="flex flex-wrap gap-2">
                                {['AI Generated', '4K', 'Cinematic', idea.genre || 'Sci-Fi', 'Award Winning'].map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full text-xs font-bold text-gray-300 transition-colors cursor-pointer">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. More Like This (Full Width) */}
            <div className="pb-24 pt-12">
                <FilmRow title="More Like This" ideas={filteredRelated} />
            </div>
        </div>
    );
}
