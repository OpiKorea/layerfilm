"use client";

import { Play, Clock, Award, Star, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { getMediaUrl } from "@/lib/media";
import Link from "next/link";
import { IdeaItem } from "@/lib/types";

export function IdeaCard({ idea }: { idea: IdeaItem }) {
    const [isHovered, setIsHovered] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoLoaded, setVideoLoaded] = useState(false);

    // Enforce uniform aspect ratio (Cinema Ticket Style)
    const aspectClass = 'aspect-video';

    const isDirector = idea.author.role === 'director';
    const isAssistant = idea.author.role === 'assistant' || !idea.author.role;

    // Handle video playback on hover
    useEffect(() => {
        if (isHovered && videoRef.current && idea.videoUrl && !idea.videoUrl.includes('youtube')) {
            videoRef.current.play().catch(() => { });
        } else if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    }, [isHovered, idea.videoUrl]);

    return (
        <Link
            href={`/idea/${idea.id}`}
            className="group relative flex flex-col gap-3 p-0 bg-transparent rounded-2xl hover:-translate-y-2 transition-all duration-500"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Thumbnail Container */}
            <div className={`relative ${aspectClass} w-full rounded-2xl overflow-hidden bg-slate-900 shadow-2xl border border-white/5 group-hover:border-violet-500/50 group-hover:shadow-[0_20px_50px_rgba(124,58,237,0.3)] transition-all duration-500`}>

                {/* Static Image / Background */}
                <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                    style={{ backgroundImage: `url(${idea.thumbnailUrl || '/placeholder-film.jpg'})` }}
                />

                {/* Video Hover Preview (Hidden by default, plays on hover) */}
                {idea.videoUrl && !idea.videoUrl.includes('youtube') && (
                    <video
                        ref={videoRef}
                        src={getMediaUrl(idea.videoUrl)}
                        muted
                        loop
                        playsInline
                        onLoadedData={() => setVideoLoaded(true)}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                    />
                )}

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 scale-90 group-hover:scale-100 transition-transform">
                        <Play className="w-6 h-6 text-white fill-white" />
                    </div>
                </div>

                {/* Top Badge: AI Tool */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-300">{idea.ai_tool}</span>
                </div>

                {/* Runtime Badge */}
                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    {idea.runtime}
                </div>

                {/* Status Badge (if not approved) */}
                {idea.status !== 'approved' && (
                    <div className={`absolute top-3 right-3 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border backdrop-blur-md ${idea.status === 'pending'
                        ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-500"
                        : "bg-red-500/20 border-red-500/50 text-red-500"
                        }`}>
                        {idea.status}
                    </div>
                )}
            </div>

            {/* Meta Info */}
            <div className="flex flex-col px-1 gap-1">
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-base leading-tight text-white group-hover:text-accent transition-colors line-clamp-1">
                        {idea.title}
                    </h3>
                </div>

                <div className="flex items-center justify-between mt-1">
                    {/* Author with Role Badge */}
                    <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center overflow-hidden ${isDirector ? 'border-yellow-500' : 'border-gray-600'}`}>
                            {idea.author.avatar ? (
                                <img src={idea.author.avatar} alt={idea.author.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-slate-800" />
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-300 leading-none">{idea.author.name}</span>
                            <div className="flex items-center gap-1 mt-0.5">
                                {isDirector && <Award className="w-3 h-3 text-yellow-500" />}
                                <span className={`text-[8px] font-black uppercase tracking-wider ${isDirector ? 'text-yellow-500' : 'text-slate-500'}`}>
                                    {isDirector ? 'Director' : 'Assistant'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Genre Tag */}
                    <span className="text-[10px] font-medium text-gray-500 border border-white/5 px-1.5 py-0.5 rounded">
                        {idea.genre}
                    </span>
                </div>
            </div>
        </Link>
    );
}
