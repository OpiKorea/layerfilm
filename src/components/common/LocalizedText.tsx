
"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";

interface LocalizedTextProps {
    en: string;
    ko?: string;
    className?: string;
}

export function LocalizedText({ en, ko, className }: LocalizedTextProps) {
    const { language } = useLanguage();

    return (
        <span className={className}>
            {(language === 'ko' && ko) ? ko : en}
        </span>
    );
}
