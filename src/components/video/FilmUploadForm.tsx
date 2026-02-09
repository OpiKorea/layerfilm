
"use client";

import { useState } from "react";
import { Upload, X, Check, Loader2 } from "lucide-react";
import { createIdea } from "@/lib/data";
import { LocalizedText } from "@/components/common/LocalizedText";

interface FilmUploadFormProps {
    userId: string;
}

export function FilmUploadForm({ userId }: FilmUploadFormProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        video_url: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const result = await createIdea({
            ...formData,
            title_ko: formData.title, // Use same title for both
            description_ko: formData.description, // Use same desc for both
            genre: "Sci-Fi", // Default
            thumbnail_url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format", // Default film poster
            author_id: userId
        });

        if (result.success) {
            setIsSuccess(true);
            setTimeout(() => {
                setIsOpen(false);
                setIsSuccess(false);
                setFormData({
                    title: "",
                    description: "",
                    video_url: ""
                });
            }, 3000);
        } else {
            setError(result.error || "Failed to submit film. Please check your data and try again.");
        }
        setIsSubmitting(false);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-3xl hover:border-accent/50 hover:bg-accent/5 transition-all group"
            >
                <Upload className="w-8 h-8 text-gray-500 group-hover:text-accent mb-2 transition-colors" />
                <span className="text-gray-400 font-bold group-hover:text-white"><LocalizedText en="Submit New Film" ko="새 영화 제출하기" /></span>
            </button>
        );
    }

    return (
        <div className="bg-white/5 border border-white/10 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 relative animate-in fade-in zoom-in duration-300">
            <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 md:top-10 md:right-10 text-gray-500 hover:text-white transition-colors"
            >
                <X className="w-6 h-6" />
            </button>

            <h3 className="text-2xl md:text-3xl font-black text-white mb-8 md:mb-12 flex items-center gap-4">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-violet-600/20 rounded-xl md:rounded-2xl flex items-center justify-center">
                    <Upload className="w-5 h-5 md:w-7 md:h-7 text-violet-400" />
                </div>
                <LocalizedText en="Film Submission" ko="영화 제출" />
            </h3>

            {isSuccess ? (
                <div className="py-12 text-center space-y-4">
                    <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto">
                        <Check className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-xl font-bold text-white"><LocalizedText en="Submission Successful!" ko="제출 완료!" /></h4>
                        <p className="text-gray-400 text-sm md:text-base"><LocalizedText en="Your film is now pending review by administrators." ko="제출하신 영화는 현재 관리자의 검토를 대기 중입니다." /></p>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Simplified Info */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                                <LocalizedText en="Title" ko="제목" />
                            </label>
                            <input
                                required
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white focus:ring-2 focus:ring-accent/50 outline-none transition-all text-lg"
                                placeholder="Film title..."
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                                <LocalizedText en="Video Link" ko="영상 링크" />
                            </label>
                            <input
                                required
                                placeholder="https://youtube.com/..."
                                value={formData.video_url}
                                onChange={e => setFormData({ ...formData, video_url: e.target.value })}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white focus:ring-2 focus:ring-accent/50 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex justify-between">
                                <span><LocalizedText en="Description" ko="설명" /></span>
                                <span className="text-violet-400 lowercase italic">#hashtags supported</span>
                            </label>
                            <textarea
                                required
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-white focus:ring-2 focus:ring-accent/50 outline-none h-40"
                                placeholder="Tell us about your film... (TIP: Add #hashtags like #AI #Cyberpunk to help others find your work!)"
                            />
                        </div>
                    </div>

                    <div className="lg:col-span-2 pt-6">
                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-bold animate-shake">
                                {error}
                            </div>
                        )}
                        <button
                            disabled={isSubmitting}
                            className="w-full h-16 md:h-20 bg-accent text-black rounded-2xl md:rounded-3xl font-black text-xl hover:bg-accent/80 transition-all shadow-xl shadow-accent/20 disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95"
                        >
                            {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin text-black" /> : <Upload className="w-6 h-6 text-black" />}
                            <LocalizedText en="Submit for Review" ko="검토 요청하기" />
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
