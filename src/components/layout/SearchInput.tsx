"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { getIdeas } from "@/app/actions/ideas";
import { IdeaItem } from "@/lib/types";
import Link from "next/link";

export function SearchInput({ placeholder }: { placeholder: string }) {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<IdeaItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (query.trim().length < 2) {
            setSuggestions([]);
            return;
        }

        const timer = setTimeout(async () => {
            setIsLoading(true);
            try {
                // We use a small limit for suggestions
                const results = await getIdeas(query);
                setSuggestions(results.slice(0, 5));
                setIsOpen(results.length > 0);
            } catch (error) {
                console.error("Search failed:", error);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/explore?q=${encodeURIComponent(query)}`);
            setIsOpen(false);
        }
    };

    return (
        <div ref={containerRef} className="w-full relative group">
            <form onSubmit={handleSubmit} className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                    placeholder={placeholder}
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl px-14 text-white placeholder:text-gray-400 text-base focus:outline-none focus:border-accent-500/50 focus:bg-white/10 focus:ring-1 focus:ring-accent-500/50 transition-all shadow-inner"
                />
                <Search className="absolute left-5 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-accent-400 transition-colors" />
                {isLoading && <Loader2 className="absolute right-5 top-3.5 w-5 h-5 text-accent-500 animate-spin" />}
            </form>

            {/* Suggestions Dropdown */}
            {isOpen && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2 border-b border-white/5 bg-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2">Suggestions</span>
                        <span className="text-[10px] font-bold text-violet-400 px-2 uppercase tracking-widest">Global Search</span>
                    </div>
                    <div className="flex flex-col">
                        {suggestions.map((idea) => (
                            <Link
                                key={idea.id}
                                href={`/idea/${idea.id}`}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-4 p-3 hover:bg-white/5 transition-colors group"
                            >
                                <div className="w-16 h-10 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-white/5">
                                    <img src={idea.thumbnailUrl || '/placeholder-film.jpg'} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-white truncate group-hover:text-violet-400 transition-colors">{idea.title}</h4>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-tight">{idea.genre} • {idea.author.name}</p>
                                </div>
                                <Play className="w-4 h-4 text-gray-600 group-hover:text-violet-400 opacity-0 group-hover:opacity-100 transition-all" />
                            </Link>
                        ))}
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="w-full p-3 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 border-t border-white/5 transition-all flex items-center justify-center gap-2"
                    >
                        See all results for "{query}"
                    </button>
                </div>
            )}
        </div>
    );
}
