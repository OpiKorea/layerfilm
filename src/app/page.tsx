import { FilmRow } from "@/components/video/FilmRow";
import { getIdeas } from "@/lib/data";
import { IdeaItem } from "@/lib/types";
import Link from "next/link";
import { Play, Info } from "lucide-react";
import { HeroVideoLoop } from "@/components/video/HeroVideoLoop";
import { LocalizedText } from "@/components/common/LocalizedText";

export default async function Home() {
    // 1. Fetch data for different rows
    const allIdeas = await getIdeas();

    // Helper to calculate popularity score (Views + Likes)
    const getPopularityScore = (item: IdeaItem) => (item.metrics?.views || 0) + (item.metrics?.likes || 0);

    // Sort all ideas by popularity
    const sortedByPopularity = [...allIdeas].sort((a, b) => getPopularityScore(b) - getPopularityScore(a));

    // Hero Idea: Most Popular
    const heroIdea = sortedByPopularity.length > 0 ? sortedByPopularity[0] : null;

    // Filter lists
    const trendingIdeas = sortedByPopularity.slice(0, 10);

    return (
        <div className="flex flex-col min-h-screen pb-20 bg-[#141414]">
            {/* 1. Hero Section (Most Popular) */}
            <section className="relative w-full h-[80vh] group overflow-hidden border-b border-white/5">
                {/* Background Video/Image */}
                <div className="absolute inset-0 bg-black z-0">
                    <HeroVideoLoop videoUrl="/drama-assets/noir-city-short/noir-city.mp4" thumbnailUrl="/drama-assets/noir-city-short/images/scene_01.png" />
                </div>

                {/* Metadata Layer */}
                <div className="absolute bottom-[10%] left-0 w-full px-6 md:px-16 z-20 flex flex-col items-start gap-5 max-w-3xl">
                    <div className="flex flex-col gap-1">
                        <span className="text-violet-500 font-black uppercase tracking-[0.2em] text-xs drop-shadow-md">
                            Featured Premiere
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter drop-shadow-2xl">
                            <LocalizedText en="Noir City: The Chase" ko="느와르 시티: 추격" />
                        </h1>
                    </div>

                    {/* Info Row */}
                    <div className="flex items-center gap-3 text-white font-medium text-sm md:text-base drop-shadow-md">
                        <span className="text-gray-300">2026</span>
                        <span className="text-gray-300">Season 1</span>
                        <span className="border border-white/40 rounded px-1 text-[10px] font-bold">4K</span>
                    </div>

                    <p className="text-lg text-white drop-shadow-md line-clamp-3 md:line-clamp-none max-w-xl font-medium text-shadow-sm">
                        <LocalizedText
                            en="In a city where rain never stops, she runs from the shadows. The hunter becomes the hunted."
                            ko="비가 멈추지 않는 도시, 그녀는 그림자로부터 도망친다. 사냥꾼이 사냥감이 되는 순간."
                        />
                    </p>

                    <div className="flex items-center gap-3 mt-2">
                        <Link href={heroIdea ? `/idea/${heroIdea.id}` : '#'} className="bg-white text-black px-8 py-3 rounded-md font-bold text-lg flex items-center gap-2 hover:bg-white/90 transition-colors">
                            <Play className="w-6 h-6 fill-black" />
                            <LocalizedText en="Play" ko="재생" />
                        </Link>
                        <Link href={heroIdea ? `/idea/${heroIdea.id}` : '#'} className="bg-gray-500/70 text-white px-8 py-3 rounded-md font-bold text-lg flex items-center gap-2 hover:bg-gray-500/50 transition-colors">
                            <Info className="w-6 h-6" />
                            <LocalizedText en="More Info" ko="상세 정보" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* 2. Content Rows */}
            <div className="relative z-20 flex flex-col gap-4">

                {/* Category Exploration Row (NOW AT THE TOP) */}
                <div className="px-6 md:px-12 py-10">
                    <h2 className="text-xl font-bold text-white mb-6">
                        <LocalizedText en="Explore by Genre" ko="장르별 탐색" />
                    </h2>
                    <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
                        {[
                            { key: 'Sci-Fi', en: 'Sci-Fi', ko: '공상과학' },
                            { key: 'Horror', en: 'Horror', ko: '공포' },
                            { key: 'Drama', en: 'Drama', ko: '드라마' },
                            { key: 'Documentary', en: 'Documentary', ko: '다큐멘터리' },
                            { key: 'Experimental', en: 'Experimental', ko: '실험 영화' },
                            { key: 'Animation', en: 'Animation', ko: '애니메이션' },
                            { key: 'Music Video', en: 'Music Video', ko: '뮤직 비디오' },
                            { key: 'Comedy', en: 'Comedy', ko: '코미디' },
                            { key: 'Shorts', en: 'Shorts', ko: '단편 영화' }
                        ].map(g => (
                            <Link
                                key={g.key}
                                href={`/explore?genre=${g.key}`}
                                className="h-20 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 hover:border-violet-500/30 transition-all group px-2"
                            >
                                <span className="text-[10px] md:text-xs text-gray-400 font-black tracking-tighter uppercase group-hover:text-white text-center leading-tight">
                                    <LocalizedText en={g.en} ko={g.ko} />
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

                <FilmRow title={<LocalizedText en="Trending Now" ko="지금 뜨는 콘텐츠" />} ideas={trendingIdeas} />
                <FilmRow title={<LocalizedText en="New Releases" ko="최신 등록 콘텐츠" />} ideas={allIdeas.slice(0, 10)} />

                {/* Genre Rows in Specific Order */}
                {[
                    { key: 'Sci-Fi', en: 'Sci-Fi Dimensions', ko: 'SF 디멘션' },
                    { key: 'Horror', en: 'Adrenaline Horror', ko: '아드레날린 호러' },
                    { key: 'Drama', en: 'Critically Acclaimed', ko: '비평가 추천 명작' },
                    { key: 'Documentary', en: 'Documentary', ko: '다큐멘터리' },
                    { key: 'Experimental', en: 'Experimental', ko: '실험 영화' },
                    { key: 'Animation', en: 'Animation', ko: '애니메이션' },
                    { key: 'Music Video', en: 'Music Video', ko: '뮤직 비디오' },
                    { key: 'Comedy', en: 'Comedy', ko: '코미디' },
                    { key: 'Shorts', en: 'Shorts', ko: '단편 영화' }
                ].map(genre => {
                    const genreIdeas = sortedByPopularity.filter(i => i.genre === genre.key);
                    if (genreIdeas.length === 0) return null;
                    return (
                        <FilmRow
                            key={genre.key}
                            title={<LocalizedText en={genre.en} ko={genre.ko} />}
                            ideas={genreIdeas}
                        />
                    );
                })}
            </div>
        </div>
    );
}
