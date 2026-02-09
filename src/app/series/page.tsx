
import { FilmRow } from "@/components/video/FilmRow";
import { getIdeas } from "@/lib/data";
import Link from "next/link";
import { Play, Info } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function SeriesPage() {
    // 1. Fetch Series Data
    const featuredSeries = await getIdeas(undefined, undefined, 'director', 'series');
    const sciFiSeries = await getIdeas(undefined, 'Sci-Fi', undefined, 'series');
    const dramaSeries = await getIdeas(undefined, 'Drama', undefined, 'series');

    // Hero Idea: First from Director list
    const heroIdea = featuredSeries.length > 0 ? featuredSeries[0] : null;

    return (
        <div className="flex flex-col min-h-screen pb-20 bg-[#0a0a0a]">
            {/* 1. Hero Section (Series Specific) */}
            <section className="relative w-full h-[80vh] group overflow-hidden">
                <div className="absolute inset-0 bg-black z-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/60 z-10" />
                    {heroIdea && heroIdea.id ? (
                        <div className="w-full h-full bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-60 scale-105 group-hover:scale-100 transition-transform duration-[10s]" />
                    ) : (
                        <div className="w-full h-full bg-slate-900" />
                    )}
                </div>

                <div className="absolute bottom-[20%] left-0 w-full px-6 md:px-16 z-20 flex flex-col items-start gap-5 max-w-3xl">
                    <div className="flex flex-col gap-1">
                        <span className="text-violet-500 font-black uppercase tracking-[0.2em] text-sm drop-shadow-md">
                            LAYERFILM SERIES
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter drop-shadow-2xl">
                            {heroIdea?.title || "FEATURED SERIES"}
                        </h1>
                    </div>

                    <div className="flex items-center gap-3 text-white font-medium text-sm md:text-base drop-shadow-md">
                        <span className="text-green-400 font-bold">New Episodes</span>
                        <span className="text-gray-300">2026</span>
                        <span className="border border-gray-500 px-1 text-xs">TV-MA</span>
                        <span className="text-gray-300">{heroIdea?.runtime || '8 Episodes'}</span>
                        <span className="border border-white/40 rounded px-1 text-[10px] font-bold">4K</span>
                    </div>

                    <p className="text-lg text-white drop-shadow-md line-clamp-3 md:line-clamp-none max-w-xl font-medium text-shadow-sm">
                        {heroIdea?.description}
                    </p>

                    <div className="flex items-center gap-3 mt-2">
                        <Link href={heroIdea ? `/idea/${heroIdea.id}` : '#'} className="bg-white text-black px-8 py-3 rounded-md font-bold text-lg flex items-center gap-2 hover:bg-white/90 transition-colors">
                            <Play className="w-6 h-6 fill-black" />
                            Play E1
                        </Link>
                        <Link href={heroIdea ? `/idea/${heroIdea.id}` : '#'} className="bg-gray-500/70 text-white px-8 py-3 rounded-md font-bold text-lg flex items-center gap-2 hover:bg-gray-500/50 transition-colors">
                            <Info className="w-6 h-6" />
                            Episodes
                        </Link>
                    </div>
                </div>
            </section>

            {/* 2. Content Rows */}
            <div className="relative z-20 -mt-24 md:-mt-32 flex flex-col gap-4">
                <FilmRow title="Trending Series" ideas={featuredSeries} />
                <FilmRow title="Sci-Fi Worlds" ideas={sciFiSeries} />
                <FilmRow title="Bingeworthy Dramas" ideas={dramaSeries} />
            </div>
        </div>
    );
}
