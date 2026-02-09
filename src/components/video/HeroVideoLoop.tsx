"use client";

import { useEffect, useRef, useState } from "react";
import { getMediaUrl } from "@/lib/media";

interface HeroVideoLoopProps {
    videoUrl?: string;
    thumbnailUrl?: string;
}

export function HeroVideoLoop({ videoUrl, thumbnailUrl }: HeroVideoLoopProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // YouTube Detection
    const isYouTube = videoUrl?.includes('youtube.com') || videoUrl?.includes('youtu.be');

    const PLACEHOLDER_IMG = "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop";

    if (isYouTube || !videoUrl) {
        return (
            <div
                className="w-full h-full bg-cover bg-center opacity-40 scale-105 group-hover:scale-100 transition-transform duration-[10s]"
                style={{ backgroundImage: `url(${thumbnailUrl || PLACEHOLDER_IMG})` }}
            />
        );
    }

    return (
        <div className="relative w-full h-full overflow-hidden">
            {/* Thumbnail as fallback/initial state */}
            {!isLoaded && (
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${thumbnailUrl || '/hero-bg.jpg'})` }}
                />
            )}

            <video
                ref={videoRef}
                src={getMediaUrl(videoUrl)}
                autoPlay
                loop
                muted
                playsInline
                onLoadedData={() => setIsLoaded(true)}
                className={`w-full h-full object-cover transition-opacity duration-1000 ${isLoaded ? 'opacity-60' : 'opacity-0'}`}
            />

            {/* Subtle Noise/Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/40" />
            <div className="absolute inset-0 bg-black/20 mix-blend-overlay" />
        </div>
    );
}
