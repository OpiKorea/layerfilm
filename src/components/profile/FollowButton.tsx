
"use client";

import { useState } from "react";
import { toggleFollow } from "@/app/actions/social";
import { LocalizedText } from "@/components/common/LocalizedText";
import { UserPlus, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";

interface FollowButtonProps {
    targetUserId: string;
    initialIsFollowing: boolean;
    currentUserId?: string;
}

export function FollowButton({ targetUserId, initialIsFollowing, currentUserId }: FollowButtonProps) {
    const [following, setFollowing] = useState(initialIsFollowing);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    if (currentUserId === targetUserId) return null;

    const handleToggle = async () => {
        if (!currentUserId) {
            router.push('/login');
            return;
        }

        setLoading(true);
        const result = await toggleFollow(targetUserId);
        setLoading(false);

        if (result.success) {
            setFollowing(result.following!);
        } else {
            alert(result.error);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            className={`
                px-10 py-4 rounded-2xl font-black text-lg transition-all shadow-xl active:scale-95 flex items-center gap-3
                ${following
                    ? 'bg-white/10 text-white border border-white/20 hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/50'
                    : 'bg-white text-black hover:bg-accent hover:text-black hover:shadow-[0_0_20px_rgba(0,245,255,0.4)]'
                }
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
        >
            {following ? (
                <>
                    <UserCheck className="w-6 h-6" />
                    <LocalizedText en="Following" ko="팔로잉" />
                </>
            ) : (
                <>
                    <UserPlus className="w-6 h-6" />
                    <LocalizedText en="Follow" ko="팔로우" />
                </>
            )}
        </button>
    );
}
