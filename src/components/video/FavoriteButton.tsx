"use client";

import { useState, useEffect } from "react";
import { Plus, Check } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface FavoriteButtonProps {
    ideaId: string;
}

export function FavoriteButton({ ideaId }: FavoriteButtonProps) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        checkFavoriteStatus();
    }, [ideaId]);

    const checkFavoriteStatus = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setLoading(false);
            return;
        }

        const { data } = await supabase
            .from('favorites')
            .select('id')
            .eq('user_id', user.id)
            .eq('idea_id', ideaId)
            .single();

        setIsFavorite(!!data);
        setLoading(false);
    };

    const toggleFavorite = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            alert("Please login to save your favorite films!");
            window.location.href = '/login';
            return;
        }

        setLoading(true);
        if (isFavorite) {
            await supabase.from('favorites').delete().eq('user_id', user.id).eq('idea_id', ideaId);
            setIsFavorite(false);
        } else {
            await supabase.from('favorites').insert({ user_id: user.id, idea_id: ideaId });
            setIsFavorite(true);
        }
        setLoading(false);
    };

    if (loading) return <div className="w-14 h-14 rounded-full bg-white/5 animate-pulse" />;

    return (
        <button
            onClick={toggleFavorite}
            className={`h-14 w-14 flex items-center justify-center rounded-full border transition-all ${isFavorite
                ? "bg-violet-600 border-violet-500 text-white"
                : "bg-white/5 border-white/10 hover:bg-white/10 text-white"
                }`}
        >
            {isFavorite ? <Check className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
        </button>
    );
}
