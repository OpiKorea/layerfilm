"use client";

import { useState } from "react";
import { X, Trash2, AlertTriangle, Loader2, Check } from "lucide-react";
import { deleteAccount } from "@/app/actions/auth";
import { LocalizedText } from "../common/LocalizedText";

export function DeleteAccountModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [confirmText, setConfirmText] = useState("");

    const canDelete = confirmText === "DELETE" && !isSubmitting;

    const handleDelete = async () => {
        if (!canDelete) return;
        setIsSubmitting(true);
        const result = await deleteAccount();
        if (result?.success) {
            window.location.href = "/?message=Account deleted successfully";
        } else {
            alert(result?.error || "Failed to delete account");
            setIsSubmitting(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-6 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 rounded-full transition-colors font-bold text-sm"
            >
                <Trash2 className="w-4 h-4" />
                <LocalizedText en="Delete Account" ko="계정 탈퇴" />
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6 bg-black/90 backdrop-blur-2xl">
            <div className="bg-[#111] border border-red-500/20 rounded-[2.5rem] w-full max-w-md p-8 md:p-12 relative shadow-2xl overflow-hidden">
                <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                </button>

                <div className="space-y-8">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-red-500/20 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                            <AlertTriangle className="w-10 h-10 text-red-500" />
                        </div>
                        <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">
                            <LocalizedText en="Warning: Account Deletion" ko="경고: 계정 탈퇴" />
                        </h3>
                        <p className="text-gray-500 text-sm mt-2 font-medium">
                            <LocalizedText
                                en="This action is permanent. All your films, comments, profile data, and personal information will be erased forever and cannot be recovered."
                                ko="계정 탈퇴 시 귀하가 게시한 모든 동영상, 댓글, 프로필 데이터 및 개인정보가 영구적으로 삭제되며 복구할 수 없습니다."
                            />
                        </p>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block text-center">
                            Type "DELETE" to confirm
                        </label>
                        <input
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            className="w-full bg-black/40 border border-red-500/20 rounded-2xl py-4 px-6 text-white text-center focus:ring-2 focus:ring-red-500/50 outline-none transition-all font-black"
                            placeholder="Type here..."
                        />
                    </div>

                    <button
                        onClick={handleDelete}
                        disabled={!canDelete}
                        className="w-full h-16 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-red-500/20 disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 grayscale-0 disabled:grayscale"
                    >
                        {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "DELETE PERMANENTLY"}
                    </button>

                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-full text-gray-500 text-xs font-bold hover:text-white transition-colors"
                    >
                        I changed my mind, take me back
                    </button>
                </div>
            </div>
        </div>
    );
}
