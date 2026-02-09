// Force cache break
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { UserCircle, Search, Menu, ChevronDown, Bell, Wallet, Shield, LogOut } from "lucide-react";
import { signOut } from "@/app/actions/auth";
import { NavbarLinks } from "@/components/layout/NavbarLinks";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { LocalizedText } from "@/components/common/LocalizedText";
import { cookies } from "next/headers";
import { translations, Language } from "@/lib/i18n";

import { MobileSearch } from "./MobileSearch";
import { SearchInput } from "./SearchInput";

export async function Navbar() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const cookieStore = await cookies();
    const lang = (cookieStore.get('layerfilm-lang')?.value || 'en') as Language;
    const t = translations[lang];

    let profile = null;
    if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        profile = data;
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex flex-col bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5 shadow-2xl font-sans transition-all">
            {/* Main Header Row */}
            <div className="h-20 flex items-center justify-between px-6 md:px-12 gap-8">
                {/* 1. Left: Logo & Brand */}
                <div className="flex items-center gap-6 min-w-fit">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform">
                            <span className="text-white font-black text-xl">L</span>
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-white group-hover:text-violet-400 transition-colors">
                            LAYER<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">FILM</span>
                        </span>
                    </Link>
                </div>

                {/* 2. Center: Search Bar (Wider & Taller) */}
                <div className="hidden md:flex flex-1 max-w-4xl justify-center">
                    <SearchInput placeholder={t.nav.searchPlaceholder} />
                </div>

                {/* 3. Right: User / Auth */}
                <div className="flex items-center gap-4 sm:gap-6 min-w-fit justify-end">
                    <LanguageToggle />

                    {/* Mobile Search Trigger (Optional, keeps layout balanced) */}
                    <MobileSearch placeholder={t.nav.searchPlaceholder} />

                    <MobileMenu user={user} profile={profile} />

                    {user ? (
                        <div className="hidden md:flex items-center gap-4">
                            {/* Notifications */}
                            <button className="text-gray-400 hover:text-white transition-colors relative mr-2">
                                <Bell className="w-6 h-6" />
                                <div className="absolute top-0 right-0 w-2 h-2 bg-violet-500 rounded-full border border-black" />
                            </button>

                            {/* User Profile Link (Nickname + Avatar) */}
                            <Link href="/dashboard" className="flex items-center gap-3 pl-4 pr-1.5 py-1.5 bg-white/5 hover:bg-violet-500/10 rounded-full border border-white/10 hover:border-violet-500/30 transition-all group">
                                <span className="text-sm font-black text-gray-300 group-hover:text-white transition-colors">
                                    {profile?.username || (lang === 'ko' ? '사용자' : 'User')}
                                </span>
                                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-violet-500 transition-colors shadow-lg">
                                    {profile?.avatar_url ? (
                                        <img src={profile.avatar_url} alt="User" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-black text-[10px] uppercase">
                                            {profile?.username?.[0] || 'U'}
                                        </div>
                                    )}
                                </div>
                            </Link>

                            {/* Logout Button */}
                            <form action={signOut}>
                                <button type="submit" className="p-2 text-gray-500 hover:text-red-400 transition-colors" title={t.common.signOut}>
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    ) : (
                        <Link href="/login" className="hidden md:flex px-6 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-gray-200 transition-colors shadow-lg shadow-white/10">
                            {t.nav.signin}
                        </Link>
                    )}
                </div>
            </div>

            {/* Sub-Navbar (Chips - Larger & More Spaced) */}
            <div className="h-14 bg-black/40 backdrop-blur-md border-b border-white/5 flex items-center gap-4 px-6 md:px-12 overflow-x-auto scrollbar-hide">
                <NavbarLinks />

                {/* Live Status Widget (Blue Theme) */}
                <div className="ml-auto hidden sm:flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs font-bold text-blue-400 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
                    <span>LIVE: Director Q&A</span>
                </div>
            </div>
        </header>
    );
}
