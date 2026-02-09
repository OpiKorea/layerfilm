"use client";

import { useState } from "react";
import { X, Lock, Loader2, Check, AlertCircle } from "lucide-react";
import { changePassword } from "@/app/actions/auth";
import { LocalizedText } from "../common/LocalizedText";

export function ChangePasswordModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
    const isPasswordValid = passwordRegex.test(password);
    const doPasswordsMatch = password === confirmPassword && confirmPassword.length > 0;
    const canSubmit = isPasswordValid && doPasswordsMatch && !isSubmitting;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;

        setIsSubmitting(true);
        setError("");

        const result = await changePassword(password);

        if (result.success) {
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                setIsOpen(false);
                setPassword("");
                setConfirmPassword("");
            }, 2000);
        } else {
            setError(result.error || "An error occurred");
        }
        setIsSubmitting(false);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-colors font-bold text-sm"
            >
                <Lock className="w-4 h-4 text-gray-400" />
                <LocalizedText en="Password" ko="비밀번호 변경" />
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
            <div className="bg-[#111] border border-white/10 rounded-[2.5rem] w-full max-w-md p-8 md:p-12 relative shadow-2xl overflow-hidden">
                <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                </button>

                <div className="space-y-8">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-accent/20 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-accent/20">
                            <Lock className="w-10 h-10 text-accent" />
                        </div>
                        <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">
                            <LocalizedText en="Change Password" ko="비밀번호 변경" />
                        </h3>
                    </div>

                    {isSuccess ? (
                        <div className="py-12 flex flex-col items-center gap-4 animate-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/20">
                                <Check className="w-8 h-8 text-green-400" />
                            </div>
                            <p className="text-white font-bold text-center">
                                <LocalizedText en="Password updated successfully!" ko="비밀번호가 성공적으로 변경되었습니다!" />
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        required
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-accent/50 outline-none transition-all font-bold placeholder:text-gray-700"
                                        placeholder="Min 8 chars, 1 num, 1 spec"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Confirm Password</label>
                                <div className="relative">
                                    <Check className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        required
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-accent/50 outline-none transition-all font-bold placeholder:text-gray-700"
                                        placeholder="Confirm new password"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold flex items-center gap-2 animate-shake">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    {error}
                                </div>
                            )}

                            <button
                                disabled={!canSubmit}
                                className="w-full h-16 bg-accent hover:bg-accent/80 text-black rounded-2xl font-black text-lg transition-all shadow-xl shadow-accent/20 disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 grayscale-0 disabled:grayscale"
                            >
                                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "UPDATE PASSWORD"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
