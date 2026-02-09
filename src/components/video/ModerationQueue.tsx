
"use client";

import { Check, X, Shield, Clock, ExternalLink, Trash2 } from "lucide-react";
import Link from "next/link";
import { IdeaItem } from "@/lib/types";
import { updateIdeaStatus, deleteIdea } from "@/lib/data";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LocalizedText } from "../common/LocalizedText";

interface ModerationQueueProps {
    pendingIdeas: IdeaItem[];
}

export function ModerationQueue({ pendingIdeas: initialIdeas }: ModerationQueueProps) {
    const [ideas, setIdeas] = useState(initialIdeas);
    const router = useRouter();

    const handleApprove = async (id: string) => {
        const res = await updateIdeaStatus(id, 'approved');
        if (res) setIdeas(ideas.filter(i => i.id !== id));
    };

    const handleReject = async (id: string) => {
        const res = await updateIdeaStatus(id, 'rejected');
        if (res) setIdeas(ideas.filter(i => i.id !== id));
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This is permanent.")) return;
        const res = await deleteIdea(id);
        if (res.success) setIdeas(ideas.filter(i => i.id !== id));
    };

    if (ideas.length === 0) {
        return (
            <div className="py-12 flex flex-col items-center justify-center bg-white/5 border border-white/5 border-dashed rounded-3xl">
                <Shield className="w-12 h-12 text-gray-700 mb-3" />
                <p className="text-gray-500 font-bold uppercase tracking-tight">
                    <LocalizedText en="Queue is empty" ko="검토 대기 중인 항목이 없습니다" />
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6">
            <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                <Shield className="w-5 h-5 text-violet-500" />
                <LocalizedText en="Moderation Queue" ko="검토 대기열" /> ({ideas.length})
            </h2>
            {ideas.map((idea) => (
                <div key={idea.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row gap-6 hover:bg-white/10 transition-all group">
                    <div className="w-full md:w-48 aspect-video bg-black rounded-xl overflow-hidden relative shadow-xl">
                        <img src={idea.thumbnailUrl} alt={idea.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link href={idea.videoUrl || '#'} target="_blank" className="bg-white text-black p-2 rounded-full hover:scale-110 transition-transform">
                                <ExternalLink className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-violet-500/20 text-violet-400 text-[10px] font-bold uppercase tracking-widest border border-violet-500/20 rounded">
                                {idea.genre}
                            </span>
                            <span className="flex items-center gap-1 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                                <Clock className="w-3 h-3" /> {idea.status}
                            </span>
                        </div>
                        <h3 className="text-2xl font-black tracking-tight">{idea.title}</h3>
                        <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">{idea.description}</p>

                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <button
                                onClick={() => handleApprove(idea.id)}
                                className="flex items-center gap-2 px-6 py-2 bg-green-500 text-black rounded-full font-black text-xs uppercase tracking-widest hover:bg-green-400 transition-all active:scale-95"
                            >
                                <Check className="w-3 h-3" /> <LocalizedText en="Approve" ko="승인" />
                            </button>
                            <button
                                onClick={() => handleReject(idea.id)}
                                className="flex items-center gap-2 px-6 py-2 bg-white/5 border border-white/10 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95"
                            >
                                <X className="w-3 h-3" /> <LocalizedText en="Reject" ko="거절" />
                            </button>
                            <button
                                onClick={() => handleDelete(idea.id)}
                                className="flex items-center gap-2 px-6 py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all active:scale-95 ml-auto"
                            >
                                <Trash2 className="w-3 h-3" /> <LocalizedText en="Delete" ko="삭제" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
