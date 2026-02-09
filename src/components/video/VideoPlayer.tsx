
"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";
import { getMediaUrl } from "@/lib/media";

interface VideoPlayerProps {
    src: string;
    poster?: string;
}

export function VideoPlayer({ src, poster }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    let controlsTimeout: NodeJS.Timeout;

    // YouTube Detection
    const isYouTube = src.includes('youtube.com') || src.includes('youtu.be');

    const getYouTubeEmbedUrl = (url: string) => {
        let videoId = '';
        if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1];
        } else if (url.includes('v=')) {
            videoId = url.split('v=')[1].split('&')[0];
        } else if (url.includes('embed/')) {
            videoId = url.split('embed/')[1];
        }
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1`;
    };

    if (isYouTube) {
        return (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-black">
                <iframe
                    src={getYouTubeEmbedUrl(src)}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        );
    }

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const current = videoRef.current.currentTime;
            const duration = videoRef.current.duration;
            setProgress((current / duration) * 100);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (videoRef.current) {
            const seekTime = (Number(e.target.value) / 100) * videoRef.current.duration;
            videoRef.current.currentTime = seekTime;
            setProgress(Number(e.target.value));
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const toggleFullscreen = () => {
        const container = videoRef.current?.parentElement;
        if (document.fullscreenElement) {
            document.exitFullscreen();
            setIsFullscreen(false);
        } else if (container) {
            container.requestFullscreen();
            setIsFullscreen(true);
        }
    };

    const handleMouseMove = () => {
        setShowControls(true);
        clearTimeout(controlsTimeout);
        controlsTimeout = setTimeout(() => {
            if (isPlaying) setShowControls(false);
        }, 2000);
    };

    return (
        <div
            className="relative w-full aspect-video bg-black group rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setShowControls(false)}
        >
            <video
                ref={videoRef}
                src={getMediaUrl(src)}
                poster={poster}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                onTimeUpdate={handleTimeUpdate}
                onClick={togglePlay}
                playsInline
            />

            {/* Premium Gradient Overlays */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0'}`} />

            {/* Center Play/Pause Transition */}
            <div
                className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-300 ${isPlaying ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}`}
            >
                <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl">
                    <Play className="w-10 h-10 text-white fill-current ml-1" />
                </div>
            </div>

            {/* Top Bar (Title/Close would go here) */}
            <div className={`absolute top-0 left-0 right-0 p-8 transition-transform duration-500 ${showControls ? 'translate-y-0' : '-translate-y-full'}`}>
                <div className="flex justify-end gap-4">
                    <button onClick={toggleMute} className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <button onClick={toggleFullscreen} className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
                        {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Bottom Controls (Netflix Style) */}
            <div className={`absolute bottom-0 left-0 right-0 p-8 pt-20 transition-transform duration-500 ${showControls ? 'translate-y-0' : 'translate-y-full'}`}>
                <div className="space-y-6">
                    {/* Premium Progress Bar */}
                    <div className="relative group/progress h-2 cursor-pointer transition-all hover:h-3">
                        <div className="absolute inset-0 bg-white/20 rounded-full" />
                        <div
                            className="absolute inset-y-0 left-0 bg-accent rounded-full transition-all duration-100"
                            style={{ width: `${progress}%` }}
                        />
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={progress}
                            onChange={handleSeek}
                            className="absolute inset-0 w-full opacity-0 cursor-pointer"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <button
                                onClick={togglePlay}
                                className="text-white hover:scale-110 transition-transform active:scale-95"
                            >
                                {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current" />}
                            </button>

                            <div className="text-white/60 text-sm font-black tracking-widest uppercase italic">
                                LayerFilm <span className="text-accent ml-2">Direct</span>
                            </div>
                        </div>

                        {/* Additional status icons/quality can go here */}
                    </div>
                </div>
            </div>
        </div>
    );
}
