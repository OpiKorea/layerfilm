import { IdeaGrid } from "@/components/video/IdeaGrid";
import { Navbar } from "@/components/layout/Navbar";
import { Suspense } from "react";
import { IdeaGridSkeleton } from "@/components/ui/Skeleton";
import { LocalizedText } from "@/components/common/LocalizedText";
import Link from "next/link";

export default async function ExplorePage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; genre?: string; role?: string }>;
}) {
    const { q, genre, role } = await searchParams;

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

    return (
        <div className="flex flex-col gap-8 min-h-screen bg-background">
            {/* Title Header */}
            <div className="pt-24 px-6 md:px-12 w-full">
                <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">THE LOBBY</h1>
                <p className="text-gray-400">Discover experimental works from upcoming creators.</p>
            </div>

            {/* Filter Bar */}
            <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12 w-full transition-all duration-300">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    {/* Genre Pills */}
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
                        <Link
                            href="/explore"
                            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${!genre ? "bg-white text-black border-white scale-105" : "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            <LocalizedText en="All" ko="전체" />
                        </Link>
                        {genres.map((g) => (
                            <Link
                                key={g.key}
                                href={`/explore?genre=${g.key}${role ? `&role=${role}` : ''}${q ? `&q=${q}` : ''}`}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border whitespace-nowrap ${genre === g.key ? "bg-white text-black border-white scale-105" : "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                <LocalizedText en={g.en} ko={g.ko} />
                            </Link>
                        ))}
                    </div>

                    {/* Role Filter */}
                    <div className="flex gap-2 bg-white/5 p-1 rounded-lg border border-white/10">
                        <Link
                            href={`/explore?role=${!role ? 'director' : ''}${genre ? `&genre=${genre}` : ''}${q ? `&q=${q}` : ''}`}
                            className={`px-3 py-1 rounded-md text-xs font-bold uppercase transition-all ${!role ? "bg-accent/20 text-accent" : "text-gray-400 hover:text-white"
                                }`}
                        >
                            All Roles
                        </Link>
                        <Link
                            href={`/explore?role=assistant${genre ? `&genre=${genre}` : ''}${q ? `&q=${q}` : ''}`}
                            className={`px-3 py-1 rounded-md text-xs font-bold uppercase transition-all ${role === 'assistant' ? "bg-accent text-white shadow-lg" : "text-gray-400 hover:text-white"
                                }`}
                        >
                            Assistant
                        </Link>
                        <Link
                            href={`/explore?role=director${genre ? `&genre=${genre}` : ''}${q ? `&q=${q}` : ''}`}
                            className={`px-3 py-1 rounded-md text-xs font-bold uppercase transition-all ${role === 'director' ? "bg-yellow-500/20 text-yellow-500 border border-yellow-500/50" : "text-gray-400 hover:text-white"
                                }`}
                        >
                            Director
                        </Link>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="px-6 md:px-12 w-full pb-20">
                <Suspense fallback={<IdeaGridSkeleton />}>
                    <IdeaGrid query={q} genre={genre} role={role} />
                </Suspense>
            </div>
        </div>
    );
}
