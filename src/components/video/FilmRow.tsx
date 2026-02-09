"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Film } from "lucide-react";
import { IdeaCard } from "./IdeaCard";
import { IdeaItem } from "@/lib/types";
import { FilmRowSkeleton } from "../ui/Skeleton";
import { LocalizedText } from "../common/LocalizedText";

interface FilmRowProps {
    title: string | React.ReactNode;
    ideas: IdeaItem[];
    isLoading?: boolean;
}

export function FilmRow({ title, ideas, isLoading }: FilmRowProps) {
    const rowRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (rowRef.current) {
            const { current } = rowRef;
            const scrollAmount = window.innerWidth * 0.8; // Scroll almost a full screen width
            if (direction === "left") {
                current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: "smooth" });
            }
        }
    };

    if (isLoading) return <FilmRowSkeleton />;

    if (ideas.length === 0) {
        return (
            <div className="px-6 md:px-12 py-8 group/row">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-6 group-hover/row:text-accent transition-colors">{title}</h2>
                <div className="h-40 flex flex-col items-center justify-center bg-white/5 border border-white/5 border-dashed rounded-3xl space-y-2">
                    <Film className="w-8 h-8 text-white/20" />
                    <span className="text-gray-600 font-bold uppercase tracking-widest text-[10px]">
                        <LocalizedText en="Coming Soon" ko="준비 중인 작품입니다" />
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 py-8 group/row">
            {/* Row Header */}
            <div className="flex items-end justify-between px-6 md:px-12">
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight group-hover/row:text-accent transition-colors">
                    {title}
                </h2>
                {/* Pagination Indicators (Visual Only for now) */}
                <div className="hidden md:flex gap-1">
                    {[...Array(Math.ceil(ideas.length / 4))].map((_, i) => (
                        <div key={i} className={`h-1 w-6 ${i === 0 ? 'bg-gray-500' : 'bg-gray-800'} rounded-full`} />
                    ))}
                </div>
            </div>

            {/* Carousel Container */}
            <div className="relative group/carousel">
                {/* Left Arrow */}
                <button
                    onClick={() => scroll("left")}
                    className="absolute left-0 top-0 bottom-0 w-12 md:w-16 bg-gradient-to-r from-black/80 to-transparent z-20 flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity disabled:opacity-0 cursor-pointer hover:bg-black/40"
                    aria-label="Scroll Left"
                >
                    <ChevronLeft className="w-8 h-8 text-white scale-110" />
                </button>

                {/* Right Arrow */}
                <button
                    onClick={() => scroll("right")}
                    className="absolute right-0 top-0 bottom-0 w-12 md:w-16 bg-gradient-to-l from-black/80 to-transparent z-20 flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity cursor-pointer hover:bg-black/40"
                    aria-label="Scroll Right"
                >
                    <ChevronRight className="w-8 h-8 text-white scale-110" />
                </button>

                {/* Scroll Area */}
                <div
                    ref={rowRef}
                    className="flex gap-4 overflow-x-auto overflow-y-hidden px-6 md:px-12 pb-4 scrollbar-hide snap-x"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {ideas.map((idea) => (
                        <div key={idea.id} className="min-w-[200px] md:min-w-[280px] lg:min-w-[320px] snap-start transition-transform duration-300 hover:z-10 hover:scale-105 origin-center">
                            <IdeaCard idea={idea} />
                        </div>
                    ))}

                    {/* Padding at the end */}
                    <div className="min-w-[4rem]" />
                </div>
            </div>
        </div>
    );
}
