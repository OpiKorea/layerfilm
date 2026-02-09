import { IdeaGrid } from "@/components/video/IdeaGrid";
import { Navbar } from "@/components/layout/Navbar";
import { Suspense } from "react";
import { IdeaGridSkeleton } from "@/components/ui/Skeleton";
import { LocalizedText } from "@/components/common/LocalizedText";
import Link from "next/link";

export default async function ExplorePage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; genre?: string; role?: string; mood?: string; aiTool?: string }>;
}) {
    const { q, genre, role, mood, aiTool } = await searchParams;

    const genres = [
        { key: "Sci-Fi", en: "Sci-Fi", ko: "공상과학" },
        { key: "Horror", en: "Horror", ko: "공포" },
        { key: "Drama", en: "Drama", ko: "드라마" },
        { key: "Documentary", en: "Documentary", ko: "다큐멘터리" },
        { key: "Experimental", en: "Experimental", ko: "실험 영화" },
        { key: "Animation", en: "Animation", ko: "애니메이션" },
        { key: "Music Video", en: "Music Video", ko: "뮤직 비디오" },
        { key: "Comedy", en: "Comedy", ko: "코미디" },
        { key: "Shorts", en: "Shorts", ko: "단편 영화" }
    ];

    const moods = [
        { key: "Cinematic", en: "Cinematic", ko: "시네마틱" },
        { key: "Dark", en: "Dark", ko: "어두운" },
        { key: "Cyberpunk", en: "Cyberpunk", ko: "사이버펑크" },
        { key: "Dreamy", en: "Dreamy", ko: "몽환적인" },
        { key: "Action", en: "Action", ko: "액션" }
    ];

    const aiTools = ["Runway", "Luma", "Kling", "Sora", "Midjourney", "Pika"];

    const getFilterUrl = (params: Record<string, string | undefined>) => {
        const url = new URL('/explore', 'http://localhost'); // Placeholder base
        const current = { q, genre, role, mood, aiTool, ...params };
        Object.entries(current).forEach(([key, val]) => {
            if (val && val !== 'All') url.searchParams.set(key, val);
        });
        return url.pathname + url.search;
    };

    return (
        <div className="flex flex-col gap-8 min-h-screen bg-background">
            {/* Title Header */}
            <div className="pt-24 px-6 md:px-12 w-full">
                <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">THE LOBBY</h1>
                <p className="text-gray-400">Discover experimental works from upcoming creators.</p>
            </div>

            {/* Filter Bar */}
            <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12 w-full transition-all duration-300">
                <div className="flex flex-col gap-6">
                    {/* Genre Pills */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        <Link
                            href={getFilterUrl({ genre: undefined })}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${!genre ? "bg-white text-black border-white scale-105" : "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            <LocalizedText en="All Genres" ko="모든 장르" />
                        </Link>
                        {genres.map((g) => (
                            <Link
                                key={g.key}
                                href={getFilterUrl({ genre: g.key })}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border whitespace-nowrap ${genre === g.key ? "bg-white text-black border-white scale-105" : "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                <LocalizedText en={g.en} ko={g.ko} />
                            </Link>
                        ))}
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                        <div className="flex flex-wrap gap-4 items-center">
                            {/* Mood Filter */}
                            <div className="flex flex-col gap-1.5">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Mood</span>
                                <div className="flex gap-1.5">
                                    {moods.map((m) => (
                                        <Link
                                            key={m.key}
                                            href={getFilterUrl({ mood: mood === m.key ? undefined : m.key })}
                                            className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all border ${mood === m.key ? "bg-accent-purple border-accent-purple text-white shadow-lg shadow-accent-purple/20" : "bg-white/5 border-white/5 text-gray-400 hover:text-white"
                                                }`}
                                        >
                                            <LocalizedText en={m.en} ko={m.ko} />
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* AI Tool Selector */}
                            <div className="flex flex-col gap-1.5">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">AI Tool</span>
                                <div className="flex gap-1.5">
                                    {aiTools.map((tool) => (
                                        <Link
                                            key={tool}
                                            href={getFilterUrl({ aiTool: aiTool === tool ? undefined : tool })}
                                            className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all border ${aiTool === tool ? "bg-accent border-accent text-white font-black" : "bg-white/5 border-white/5 text-gray-400 hover:text-white"
                                                }`}
                                        >
                                            {tool}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Role Filter */}
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Collection</span>
                            <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                                <Link
                                    href={getFilterUrl({ role: undefined })}
                                    className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${!role ? "bg-white/10 text-white border border-white/10" : "text-gray-400 hover:text-white"
                                        }`}
                                >
                                    All Roles
                                </Link>
                                <Link
                                    href={getFilterUrl({ role: 'assistant' })}
                                    className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${role === 'assistant' ? "bg-accent text-white shadow-lg" : "text-gray-400 hover:text-white"
                                        }`}
                                >
                                    Assistant
                                </Link>
                                <Link
                                    href={getFilterUrl({ role: 'director' })}
                                    className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${role === 'director' ? "bg-yellow-500 text-black font-black" : "text-gray-400 hover:text-white"
                                        }`}
                                >
                                    Director
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="px-6 md:px-12 w-full pb-20">
                <Suspense fallback={<IdeaGridSkeleton />}>
                    <IdeaGrid query={q} genre={genre} role={role} mood={mood} aiTool={aiTool} />
                </Suspense>
            </div>
        </div>
    );
}
