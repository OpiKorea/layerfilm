
import { BrandLogo } from "../common/BrandLogo";
import { LocalizedText } from "../common/LocalizedText";
import Link from "next/link";
import { Twitter, Github, Youtube, Instagram } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-[#0a0a0a] border-t border-white/5 pt-20 pb-10 px-6 md:px-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                {/* Brand Column */}
                <div className="col-span-1 md:col-span-2 space-y-6">
                    <BrandLogo className="scale-125 origin-left" />
                    <p className="max-w-md text-gray-400 font-medium leading-relaxed">
                        <LocalizedText
                            en="The world's first AI-native cinematic platform. Discover, trade, and create high-end AI films with global creators."
                            ko="세계 최초의 AI 네이티브 시네마틱 플랫폼. 글로벌 크리에이터들과 함께 하이엔드 AI 영화를 발견하고 제작하고 거래하세요."
                        />
                    </p>
                    <div className="flex items-center gap-4 text-gray-500">
                        <Twitter className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                        <Instagram className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                        <Youtube className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                        <Github className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                    </div>
                </div>

                {/* Platform Links */}
                <div className="space-y-6">
                    <h4 className="text-white font-black uppercase text-sm tracking-widest italic">Platform</h4>
                    <ul className="space-y-3 text-sm font-bold text-gray-400">
                        <li><Link href="/explore" className="hover:text-accent transition-colors">Explore</Link></li>
                        <li><Link href="/series" className="hover:text-accent transition-colors">Series</Link></li>
                        <li><Link href="/new" className="hover:text-accent transition-colors">New Releases</Link></li>
                        <li><Link href="/director" className="hover:text-accent transition-colors">Creators</Link></li>
                    </ul>
                </div>

                {/* Support Links */}
                <div className="space-y-6">
                    <h4 className="text-white font-black uppercase text-sm tracking-widest italic">Support</h4>
                    <ul className="space-y-3 text-sm font-bold text-gray-400">
                        <li><Link href="/faq" className="hover:text-accent transition-colors">FAQ</Link></li>
                        <li><Link href="/guidelines" className="hover:text-accent transition-colors">Community Guidelines</Link></li>
                        <li><Link href="/terms" className="hover:text-accent transition-colors">Terms of Service</Link></li>
                        <li><Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
                    </ul>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-10 border-t border-white/5 gap-6">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
                    © 2026 LAYERFILM GLOBAL INC. ALL RIGHTS RESERVED.
                </div>
                <div className="flex items-center gap-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        SYSTEMS OPERATIONAL
                    </span>
                </div>
            </div>
        </footer>
    );
}
