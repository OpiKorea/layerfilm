
import { getProfile, getIdeasByAuthor, getFollowerCount, isFollowing } from "@/lib/data";
import { LocalizedText } from "@/components/common/LocalizedText";
import { FilmCarousel } from "@/components/video/FilmCarousel";
import { IdeaCard } from "@/components/video/IdeaCard";
import { FollowButton } from "@/components/profile/FollowButton";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { User, Film, Users } from "lucide-react";

interface DirectorPageProps {
    params: {
        id: string;
    };
}

export default async function DirectorPage({ params }: DirectorPageProps) {
    const { id } = params;

    // Auth Check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const [profile, ideas, followerCount, followingStatus] = await Promise.all([
        getProfile(id),
        getIdeasByAuthor(id),
        getFollowerCount(id),
        user ? isFollowing(user.id, id) : Promise.resolve(false)
    ]);

    if (!profile) {
        return notFound();
    }

    return (
        <div className="min-h-screen bg-[#141414] pb-20 pt-24">
            {/* Profile Header */}
            <section className="px-6 md:px-16 mb-16">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-8 md:gap-12">
                        {/* Avatar */}
                        <div className="w-40 h-40 md:w-56 md:h-56 rounded-[3rem] bg-violet-600/20 border-2 border-violet-500/30 flex items-center justify-center overflow-hidden shadow-2xl relative group focus-within:ring-4 focus-within:ring-violet-500/50 outline-none">
                            {profile.avatar_url ? (
                                <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            ) : (
                                <User className="w-20 h-20 text-violet-400" />
                            )}
                            <div className="absolute inset-0 bg-violet-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 space-y-6 text-center md:text-left">
                            <div className="space-y-2">
                                <div className="inline-block px-4 py-1 bg-violet-600/20 border border-violet-500/30 rounded-full text-[10px] font-black tracking-[0.2em] text-violet-400 uppercase italic">
                                    Official Director
                                </div>
                                <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-none">
                                    {profile.username || "Anonymous Creator"}
                                </h1>
                            </div>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-gray-400 font-bold text-sm uppercase tracking-widest">
                                <div className="flex items-center gap-2">
                                    <Film className="w-4 h-4 text-violet-500" />
                                    <span>{ideas.length} <LocalizedText en="Films" ko="작품" /></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-violet-500" />
                                    <span>{followerCount} <LocalizedText en="Followers" ko="팔로워" /></span>
                                </div>
                            </div>

                            <div className="flex justify-center md:justify-start">
                                <FollowButton
                                    targetUserId={id}
                                    initialIsFollowing={followingStatus}
                                    currentUserId={user?.id}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Works Section */}
            <section className="space-y-16">
                {ideas.length > 0 ? (
                    <FilmCarousel title={<LocalizedText en="Directorial Works" ko="감독의 작품들" />}>
                        {ideas.map((idea) => (
                            <div key={idea.id} className="min-w-[280px] md:min-w-[350px] snap-start">
                                <IdeaCard idea={idea} />
                            </div>
                        ))}
                    </FilmCarousel>
                ) : (
                    <div className="px-6 md:px-16 py-20 text-center border-y border-white/5 bg-white/2 cursor-default">
                        <div className="max-w-md mx-auto space-y-4">
                            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto">
                                <Film className="w-8 h-8 text-gray-600" />
                            </div>
                            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">
                                <LocalizedText en="No released films yet" ko="아직 공개된 작품이 없습니다" />
                            </h3>
                            <p className="text-gray-500 text-sm font-medium">
                                <LocalizedText
                                    en="This director is currently preparing their next masterpiece."
                                    ko="이 감독은 현재 차기작을 준비 중입니다."
                                />
                            </p>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}
