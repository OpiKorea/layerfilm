
"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";

export function LanguageToggle() {
    const { language, setLanguage, t } = useLanguage();

    const toggle = () => {
        setLanguage(language === 'en' ? 'ko' : 'en');
        // Optional: Force reload if we move to server-side translation later
        // window.location.reload(); 
    };

    return (
        <button
            onClick={toggle}
            className="px-3 py-1.5 rounded-full text-xs font-bold border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all uppercase tracking-wider"
        >
            {language === 'en' ? 'KO' : 'EN'}
        </button>
    );
}
