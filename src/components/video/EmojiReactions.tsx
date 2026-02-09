"use client";

import { useState } from "react";
import { LocalizedText } from "../common/LocalizedText";

const EMOJIS = [
    { label: "Love", emoji: "❤️", key: "love" },
    { label: "Fire", emoji: "🔥", key: "fire" },
    { label: "Clap", emoji: "👏", key: "clap" },
    { label: "Funny", emoji: "😂", key: "funny" },
    { label: "Cool", emoji: "😎", key: "cool" },
];

export function EmojiReactions({ ideaId, initialReactions = {} }: { ideaId: string, initialReactions?: Record<string, number> }) {
    const [reactions, setReactions] = useState<Record<string, number>>(initialReactions);
    const [userSelected, setUserSelected] = useState<string | null>(null);

    const handleReaction = (key: string) => {
        if (userSelected === key) {
            // Remove reaction
            setReactions(prev => ({ ...prev, [key]: Math.max(0, (prev[key] || 0) - 1) }));
            setUserSelected(null);
        } else {
            // Change or add reaction
            setReactions(prev => {
                const next = { ...prev };
                if (userSelected) {
                    next[userSelected] = Math.max(0, next[userSelected] - 1);
                }
                next[key] = (next[key] || 0) + 1;
                return next;
            });
            setUserSelected(key);
        }

        // TODO: Persist to DB via server action
    };

    return (
        <div className="flex flex-wrap items-center gap-3">
            {EMOJIS.map(({ label, emoji, key }) => (
                <button
                    key={key}
                    onClick={() => handleReaction(key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all active:scale-90 ${userSelected === key
                            ? 'bg-violet-600/20 border-violet-500 text-white'
                            : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:border-white/10'
                        }`}
                >
                    <span className="text-xl">{emoji}</span>
                    <span className="text-xs font-bold">{reactions[key] || 0}</span>
                </button>
            ))}
        </div>
    );
}
