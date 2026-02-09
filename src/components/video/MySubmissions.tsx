"use client";

import { IdeaItem } from "@/lib/types";
import { LocalizedText } from "../common/LocalizedText";
import Link from "next/link";
import { Clock, CheckCircle2, AlertCircle, Play, Trash2 } from "lucide-react";
import { deleteIdea } from "@/lib/data";
import { useState } from "react";

interface MySubmissionsProps {
    ideas: IdeaItem[];
}

export function MySubmissions({ ideas: initialIdeas }: MySubmissionsProps) {
    const [ideas, setIdeas] = useState(initialIdeas);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this masterpiece? This action cannot be undone.")) return;
        const res = await deleteIdea(id);
        if (res.success) {
            setIdeas(ideas.filter(i => i.id !== id));
        } else {
            alert("Failed to delete: " + res.error);
        }
    };

    if (ideas.length === 0) {
        return (
            <div className="h-48 flex flex-col items-center justify-center bg-white/5 rounded-3xl border border-white/5 border-dashed">
                <p className="text-gray-400 mb-4 font-bold"><LocalizedText en="You haven't submitted any films yet." ko="아직 제출한 영상이 없습니다." /></p>
                <Link href="/" className="px-6 py-2 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-full transition-all text-sm uppercase tracking-widest">
                    <LocalizedText en="Browse Films" ko="영상 둘러보기" />
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea) => (
                <div key={idea.id} className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden group hover:border-violet-500/30 transition-all">
                    {/* Thumbnail View */}
                    <div className="aspect-video relative overflow-hidden">
                        <img
                            src={idea.thumbnailUrl || "/placeholder-film.jpg"}
                            alt={idea.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                            <Link
                                href={`/idea/${idea.id}`}
                                className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/40 transition-all"
                            >
                                <Play className="w-6 h-6 text-white" />
                            </Link>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleDelete(idea.id);
                                }}
                                className="w-12 h-12 bg-red-500/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-red-500/40 transition-all text-red-400"
                                title="Delete Piece"
                            >
                                <Trash2 className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Status Badge */}
                        <div className="absolute top-4 right-4">
                            {idea.status === 'approved' && (
                                <div className="px-3 py-1 bg-green-500/20 backdrop-blur-md border border-green-500/30 rounded-full flex items-center gap-1.5 text-green-400 text-[10px] font-black uppercase tracking-widest">
                                    <CheckCircle2 className="w-3 h-3" /> Approved
                                </div>
                            )}
                            {idea.status === 'pending' && (
                                <div className="px-3 py-1 bg-amber-500/20 backdrop-blur-md border border-amber-500/30 rounded-full flex items-center gap-1.5 text-amber-400 text-[10px] font-black uppercase tracking-widest">
                                    <Clock className="w-3 h-3 animate-pulse" /> Pending
                                </div>
                            )}
                            {idea.status === 'reported' && (
                                <div className="px-3 py-1 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-full flex items-center gap-1.5 text-red-400 text-[10px] font-black uppercase tracking-widest">
                                    <AlertCircle className="w-3 h-3" /> Reported
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="p-6 space-y-2">
                        <h3 className="font-bold text-white text-lg truncate group-hover:text-violet-400 transition-colors uppercase tracking-tight">
                            {idea.title}
                        </h3>
                        <p className="text-gray-500 text-xs font-mono">
                            {new Date(idea.id).toLocaleDateString()} • {idea.genre}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
