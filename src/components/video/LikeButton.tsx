
"use client";

import { useState } from "react";
import { toggleLike } from "@/app/actions/social";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";

interface LikeButtonProps {
    ideaId: string;
    initialLiked: boolean;
    initialCount: number;
    currentUserId?: string;
}

export function LikeButton({ ideaId, initialLiked, initialCount, currentUserId }: LikeButtonProps) {
    const [liked, setLiked] = useState(initialLiked);
    const [count, setCount] = useState(initialCount);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating to detail page
        e.stopPropagation();

        if (!currentUserId) {
            router.push('/login');
            return;
        }

        setLoading(true);
        // Optimistic UI
        setLiked(!liked);
        setCount(prev => liked ? prev - 1 : prev + 1);

        const result = await toggleLike(ideaId);
        setLoading(false);

        if (!result.success) {
            // Revert on error
            setLiked(liked);
            setCount(initialCount);
            alert(result.error);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            className={`flex items-center gap-1.5 transition-all active:scale-125 ${liked ? 'text-accent drop-shadow-[0_0_8px_rgba(0,245,255,0.4)]' : 'text-gray-400 hover:text-white'}`}
        >
            <Heart className={`w-5 h-5 transition-transform ${liked ? 'fill-accent text-accent animate-pulse-subtle' : ''}`} />
            <span className="text-xs font-black tracking-tighter">
                {count > 0 ? count : ''}
            </span>
        </button>
    );
}
