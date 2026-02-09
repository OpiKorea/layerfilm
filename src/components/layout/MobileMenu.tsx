
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Home, Film, Tv, Sparkles, Heart, UserCircle, Wallet, Shield, LogOut } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { signOut } from "@/app/actions/auth";
import { LocalizedText } from "../common/LocalizedText";

interface MobileMenuProps {
    user?: any;
    profile?: any;
}

export function MobileMenu({ user, profile }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useLanguage();

    const toggle = () => setIsOpen(!isOpen);

    const items = [
        { label: t.nav.home, href: '/', icon: Home },
        { label: t.nav.series, href: '/series', icon: Tv },
        { label: t.nav.films, href: '/films', icon: Film },
        { label: t.nav.new, href: '/new', icon: Sparkles },
        { label: t.nav.mylist, href: '/mylist', icon: Heart },
    ];

    return (
        <div className="md:hidden">
            {/* Hamburger Button */}
            <button
                onClick={toggle}
                className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Open Menu"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity"
                    onClick={toggle}
                />
            )}

            {/* Sidebar Drawer */}
            <div className={`fixed top-0 right-0 h-full w-64 bg-[#111] border-l border-white/10 shadow-2xl z-[60] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
                        <span className="font-black text-lg tracking-widest text-white">
                            <LocalizedText en="MENU" ko="메뉴" />
                        </span>
                        <button onClick={toggle} className="text-gray-400 hover:text-white p-2">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Links */}
                    <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                        {items.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={toggle}
                                className="flex items-center gap-4 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="font-semibold">{item.label}</span>
                            </Link>
                        ))}

                        {/* Auth Specific Links */}
                        <div className="pt-4 mt-4 border-t border-white/5 space-y-2">
                            {user ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        onClick={toggle}
                                        className="flex items-center gap-4 px-4 py-3 text-violet-400 hover:bg-violet-500/10 rounded-xl transition-all"
                                    >
                                        <Wallet className="w-5 h-5" />
                                        <span className="font-bold">{t.nav.dashboard}</span>
                                    </Link>
                                    {profile?.role === 'admin' && (
                                        <Link
                                            href="/dashboard/moderation"
                                            onClick={toggle}
                                            className="flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                                        >
                                            <Shield className="w-5 h-5" />
                                            <span className="font-bold">
                                                <LocalizedText en="Moderation" ko="관리대기" />
                                            </span>
                                        </Link>
                                    )}
                                    <form action={signOut}>
                                        <button
                                            type="submit"
                                            className="w-full flex items-center gap-4 px-4 py-3 text-gray-500 hover:text-white hover:bg-red-500/10 rounded-xl transition-all"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            <span className="font-semibold">{t.common.signOut}</span>
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    onClick={toggle}
                                    className="flex items-center gap-4 px-4 py-3 bg-white text-black rounded-xl font-bold transition-all"
                                >
                                    <UserCircle className="w-5 h-5" />
                                    <span>{t.nav.signin}</span>
                                </Link>
                            )}
                        </div>
                    </nav>

                    {/* Footer / Extra */}
                    <div className="p-6 border-t border-white/5">
                        <div className="text-xs text-gray-500 text-center">
                            © 2026 LayerFilm
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
