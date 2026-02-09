"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

export function MobileSearch({ placeholder }: { placeholder: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="md:hidden flex items-center">
            <button
                onClick={() => setIsOpen(true)}
                className="text-gray-400 hover:text-white p-2"
            >
                <Search className="w-6 h-6" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col p-6 animate-in slide-in-from-top duration-300">
                    <div className="flex items-center justify-between mb-8">
                        <span className="text-xl font-black text-white">SEARCH</span>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                            <X className="w-8 h-8" />
                        </button>
                    </div>

                    <form action="/explore" method="GET" className="relative group">
                        <input
                            autoFocus
                            type="text"
                            name="q"
                            placeholder={placeholder}
                            className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-14 text-white text-xl focus:outline-none focus:border-violet-500/50 transition-all shadow-inner"
                        />
                        <Search className="absolute left-5 top-5.5 w-6 h-6 text-gray-400" />
                        <button
                            type="submit"
                            className="mt-6 w-full h-14 bg-violet-600 text-white font-bold rounded-2xl shadow-xl shadow-violet-500/20 active:scale-95 transition-all"
                        >
                            SEARCH
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
