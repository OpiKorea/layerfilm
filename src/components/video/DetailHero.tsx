
"use client";

import { useState, useRef, useEffect } from "react";
import { Lock, CheckCircle, Play, Star, ChevronRight, Maximize, Trash2 } from "lucide-react";
import Link from "next/link";
import { VideoPlayer } from "./VideoPlayer";
import { FavoriteButton } from "./FavoriteButton";
import { ReportButton } from "./ReportButton";
import { IdeaItem } from "@/lib/types";
import { EmojiReactions } from "./EmojiReactions";
import { ShareButtons } from "./ShareButtons";
import { LocalizedText } from "../common/LocalizedText";

interface DetailHeroProps {
    idea: IdeaItem;
    user: any;
    averageRating?: number;
}

export function DetailHero({ idea, user, averageRating }: DetailHeroProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this masterpiece? This action cannot be undone.")) return;
        const { deleteIdea } = await import("@/lib/data");
        const res = await deleteIdea(idea.id);
        if (res.success) {
            window.location.href = "/";
        } else {
            alert("Failed to delete idea: " + res.error);
        }
    };

    const handlePlay = (fullscreen: boolean) => {
        setIsPlaying(true);
        if (fullscreen && containerRef.current) {
            const el = containerRef.current;
            if (el.requestFullscreen) {
                el.requestFullscreen().catch(err => {
                    console.error("Error enabling full-screen:", err.message);
                });
            }
        }
    };

    if (isPlaying && idea.videoUrl) {
        return (
            <div ref={containerRef} className="relative w-full h-[100vh] bg-black">
                <VideoPlayer src={idea.videoUrl} />
                <button
                    onClick={() => {
                        if (document.fullscreenElement) {
                            document.exitFullscreen();
                        }
                        setIsPlaying(false);
                    }}
                    className="absolute top-10 right-10 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-full font-bold transition-all border border-white/10"
                >
                    CLOSE
                </button>
            </div>
        );
    }

    const isAuthorOrAdmin = user && (user.id === idea.author_id || user.role === 'admin');

    return (
        <div className="relative w-full h-[85vh] group">
            {/* Dynamic Background Layer */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/20 via-[#0a0a0a] to-[#0a0a0a] z-0" />
                {idea.thumbnailUrl && (
                    <img
                        src={idea.thumbnailUrl}
                        alt={idea.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
                    />
                )}
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-30 mix-blend-overlay pointer-events-none" />

                {/* Vignette & Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent z-10" />
            </div>

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 w-full px-6 md:px-16 pb-24 z-20 flex flex-col items-start gap-6 max-w-4xl">
                {/* Breadcrumbs / Metadata */}
                <div className="flex items-center gap-3 animate-fade-in-up">
                    <Link href="/explore" className="text-gray-400 hover:text-white transition-colors text-sm font-bold tracking-widest uppercase flex items-center gap-1">
                        Library <ChevronRight className="w-3 h-3" />
                    </Link>
                    <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-widest text-accent border border-white/10">
                        {idea.genre || 'Sci-Fi'}
                    </span>
                </div>

                {/* Title */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-gray-400 drop-shadow-2xl">
                    {idea.title}
                </h1>

                {/* Stats Row */}
                <div className="flex items-center gap-6 text-sm md:text-lg font-medium text-gray-300">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent-purple p-0.5">
                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                                {idea.author.avatar ? <img src={idea.author.avatar} alt="Author" className="w-full h-full object-cover" /> : <span className="text-xs font-bold">AI</span>}
                            </div>
                        </div>
                        <span className="text-white font-bold">{idea.author.name}</span>
                    </div>
                    <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-accent rounded-full" /> {idea.runtime || '02:30'}</span>
                    <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gray-600 rounded-full" /> 2026</span>
                    <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-5 h-5 fill-yellow-400" />
                        <span className="font-bold text-white">{(averageRating || 8.5).toFixed(1)}</span>
                        <span className="text-[10px] text-gray-500 font-bold ml-1">/ 10</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 mt-4">
                    {!user ? (
                        <Link href="/login" className="bg-white text-black h-14 px-8 rounded-full font-bold text-lg flex items-center gap-3 hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                            <Lock className="w-5 h-5" />
                            Sign in to Watch
                        </Link>
                    ) : (
                        <div className="flex flex-wrap items-center gap-4">
                            <button
                                onClick={() => handlePlay(false)}
                                className="bg-accent text-black h-14 px-10 rounded-full font-bold text-lg flex items-center gap-3 hover:bg-accent/80 transition-all shadow-[0_0_40px_rgba(0,245,255,0.4)] hover:shadow-[0_0_60px_rgba(0,245,255,0.6)]"
                            >
                                <Play className="w-6 h-6 fill-black" />
                                <LocalizedText en="Play Now" ko="지금 재생" />
                            </button>

                            <button
                                onClick={() => handlePlay(true)}
                                className="bg-white/10 backdrop-blur-md text-white h-14 px-10 rounded-full font-bold text-lg flex items-center gap-3 hover:bg-white/20 transition-all border border-white/10 group"
                            >
                                <Maximize className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                <LocalizedText en="Full Screen View" ko="전체화면보기" />
                            </button>
                        </div>
                    )}

                    <FavoriteButton ideaId={idea.id} />
                    <ReportButton ideaId={idea.id} />

                    {isAuthorOrAdmin && (
                        <button
                            onClick={handleDelete}
                            className="w-12 h-12 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-full transition-all"
                            title="Delete Piece"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    )}

                    <div className="h-8 w-px bg-white/10 mx-2" />
                    <ShareButtons url={`https://layerfilm.com/idea/${idea.id}`} title={idea.title} />
                </div>

                {/* Emoji Reactions (Phase 21) */}
                <div className="mt-4 pt-8 border-t border-white/5 w-full">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">React to this masterpiece</p>
                    <EmojiReactions ideaId={idea.id} initialReactions={idea.metrics?.reactions} />
                </div>
            </div>
        </div>
    );
}
