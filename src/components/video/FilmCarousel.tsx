
"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FilmCarouselProps {
    children: React.ReactNode;
    title: string | React.ReactNode;
}

export function FilmCarousel({ children, title }: FilmCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(true);

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeft(scrollLeft > 10);
            setShowRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { clientWidth } = scrollRef.current;
            const scrollAmount = direction === 'left' ? -clientWidth * 0.8 : clientWidth * 0.8;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        handleScroll();
        window.addEventListener('resize', handleScroll);
        return () => window.removeEventListener('resize', handleScroll);
    }, []);

    return (
        <div className="space-y-4 group/carousel">
            <div className="flex items-center justify-between px-4 md:px-12">
                <h2 className="text-xl md:text-2xl font-black text-white italic tracking-tighter uppercase">
                    {title}
                </h2>
            </div>

            <div className="relative">
                {/* Scroll Buttons (Desktop Only) */}
                <button
                    onClick={() => scroll('left')}
                    className={`absolute left-0 top-0 bottom-0 z-10 w-12 md:w-16 bg-gradient-to-r from-[#141414] to-transparent items-center justify-center text-white transition-opacity duration-300 hidden md:flex ${showLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                    <ChevronLeft className="w-8 h-8" />
                </button>

                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 md:px-12 pb-4 pt-1"
                >
                    {children}
                </div>

                <button
                    onClick={() => scroll('right')}
                    className={`absolute right-0 top-0 bottom-0 z-10 w-12 md:w-16 bg-gradient-to-l from-[#141414] to-transparent items-center justify-center text-white transition-opacity duration-300 hidden md:flex ${showRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                    <ChevronRight className="w-8 h-8" />
                </button>
            </div>
        </div>
    );
}
