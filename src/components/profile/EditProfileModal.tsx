
"use client";

import { useState } from "react";
import { X, Settings, User, Image as ImageIcon, Loader2, Check } from "lucide-react";
import { updateProfile } from "@/app/actions/profile";
import { LocalizedText } from "../common/LocalizedText";

interface EditProfileModalProps {
    profile: any;
    userId: string;
}

export function EditProfileModal({ profile, userId }: EditProfileModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        username: profile?.username || "",
        avatar_url: profile?.avatar_url || ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const result = await updateProfile(userId, formData);

        if (result.success) {
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                setIsOpen(false);
            }, 2000);
        } else {
            alert("Error updating profile: " + result.error);
        }
        setIsSubmitting(false);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors font-bold text-sm"
            >
                <Settings className="w-4 h-4 text-gray-400" />
                <LocalizedText en="Edit Profile" ko="프로필 수정" />
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
            <div className="bg-[#111] border border-white/10 rounded-[2.5rem] w-full max-w-md p-8 md:p-12 relative shadow-2xl overflow-hidden">
                {/* Close Button */}
                <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                </button>

                <div className="space-y-8">
                    <div className="text-center">
                        <div className="w-20 s-20 h-20 bg-violet-600/20 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-violet-500/20">
                            <User className="w-10 h-10 text-violet-400" />
                        </div>
                        <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">
                            <LocalizedText en="Edit Profile" ko="프로필 수정" />
                        </h3>
                    </div>

                    {isSuccess ? (
                        <div className="py-12 flex flex-col items-center gap-4 animate-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/20">
                                <Check className="w-8 h-8 text-green-400" />
                            </div>
                            <p className="text-white font-bold"><LocalizedText en="Profile updated successfully!" ko="프로필이 업데이트되었습니다!" /></p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Nickname</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        required
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-violet-500/50 outline-none transition-all font-bold"
                                        placeholder="Enter your nickname"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Avatar URL</label>
                                <div className="relative">
                                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="url"
                                        value={formData.avatar_url}
                                        onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-violet-500/50 outline-none transition-all font-bold"
                                        placeholder="https://..."
                                    />
                                </div>
                                <p className="text-[10px] text-gray-600 pl-1 italic">Link an image URL for your profile picture.</p>
                            </div>

                            <button
                                disabled={isSubmitting}
                                className="w-full h-16 bg-violet-600 hover:bg-violet-500 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-violet-500/20 disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95"
                            >
                                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Settings className="w-5 h-5" />}
                                SAVE CHANGES
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
