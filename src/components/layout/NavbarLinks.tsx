
"use client";

import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";

export function NavbarLinks() {
    const { t, language, toggleLanguage } = useLanguage();

    const items = [
        { label: t.nav.home, href: '/' },
        { label: t.nav.series, href: '/series' },
        { label: t.nav.films, href: '/films' },
        { label: t.nav.new, href: '/new' },
        { label: t.nav.mylist, href: '/mylist' },
    ];

    return (
        <div className="flex items-center gap-4">
            {items.map((item) => (
                <Link key={item.label} href={item.href} className="flex items-center px-5 py-2 rounded-full text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/10 transition-all whitespace-nowrap border border-transparent hover:border-white/10">
                    {item.label}
                </Link>
            ))}


        </div>
    );
}
