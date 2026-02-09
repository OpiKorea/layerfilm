
"use client";

import { BrandLogo } from "../common/BrandLogo";
import { useEffect, useState } from "react";

export function MainLoader() {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        // Simulate initial loading time
        const timer = setTimeout(() => {
            setVisible(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-[#050505] flex items-center justify-center animate-out fade-out duration-700 fill-mode-forwards">
            <div className="relative flex flex-col items-center gap-8">
                {/* Logo Pulse */}
                <div className="scale-150 animate-pulse">
                    <BrandLogo showText={false} size={80} className="pointer-events-none" />
                </div>

                {/* Loading Bar */}
                <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-accent to-accent-purple w-full -translate-x-full animate-[loading_1.5s_ease-in-out_infinite]" />
                </div>

                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-accent/60 animate-pulse">
                    Initializing LayerFilm 2.0
                </span>
            </div>

            <style jsx>{`
                @keyframes loading {
                    0% { transform: translateX(-100%); }
                    50% { transform: translateX(0); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
}
