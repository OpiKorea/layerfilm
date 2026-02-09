"use client";

import { Share2, Link as LinkIcon, MessageCircle } from "lucide-react";
import { useState } from "react";

export function ShareButtons({ url, title }: { url: string, title: string }) {
    const [copied, setCopied] = useState(false);

    const shareToKakao = () => {
        const encodedUrl = encodeURIComponent(url);
        window.open(`https://sharer.kakao.com/talk/friends/picker/link?app_key=YOUR_APP_KEY&url=${encodedUrl}`, '_blank');
        // Note: Real Kakao SDK integration requires a registered app key
    };

    const shareToNaver = () => {
        const encodedUrl = encodeURIComponent(url);
        const encodedTitle = encodeURIComponent(title);
        window.open(`https://share.naver.com/web/shareView?url=${encodedUrl}&title=${encodedTitle}`, '_blank');
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex items-center gap-3">
            {/* Copy Link */}
            <button
                onClick={copyToClipboard}
                className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center transition-all group"
                title="Copy Link"
            >
                <LinkIcon className={`w-5 h-5 ${copied ? 'text-green-400' : 'text-gray-400 group-hover:text-white'}`} />
            </button>

            {/* Naver Share */}
            <button
                onClick={shareToNaver}
                className="w-12 h-12 rounded-full bg-[#03C75A]/20 hover:bg-[#03C75A]/30 border border-[#03C75A]/20 flex items-center justify-center transition-all group"
                title="Share on Naver"
            >
                <span className="text-[#03C75A] font-black text-xs">N</span>
            </button>

            {/* Kakao Share */}
            <button
                onClick={shareToKakao}
                className="w-12 h-12 rounded-full bg-[#FEE500]/20 hover:bg-[#FEE500]/30 border border-[#FEE500]/20 flex items-center justify-center transition-all group"
                title="Share on Kakao"
            >
                <MessageCircle className="w-5 h-5 text-[#3C1E1E]" />
            </button>
        </div>
    );
}
