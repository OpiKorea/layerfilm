
"use client";

import Link from "next/link";
import Image from "next/image";

interface BrandLogoProps {
    className?: string;
    showText?: boolean;
    size?: number;
}

export function BrandLogo({ className = "", showText = true, size = 40 }: BrandLogoProps) {
    return (
        <Link href="/" className={`flex items-center gap-3 group transition-transform active:scale-95 ${className}`}>
            <div className="relative">
                {/* Official Logo Image */}
                <div className="relative w-10 h-10 md:w-12 md:h-12 overflow-hidden rounded-xl border border-white/10 group-hover:border-accent/50 transition-colors shadow-2xl shadow-accent/20">
                    <Image
                        src="/logo.png"
                        alt="LayerFilm Logo"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                </div>

                {/* Glitch Effect Overlays (CSS only) */}
                <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 group-hover:animate-pulse rounded-xl pointer-events-none" />
            </div>

            {showText && (
                <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
                    <span className="group-hover:text-accent transition-colors">LAYER</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-purple">FILM</span>
                </span>
            )}
        </Link>
    );
}
