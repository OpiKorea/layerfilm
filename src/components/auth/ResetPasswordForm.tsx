"use client";

import { updatePassword } from '@/app/actions/auth';
import { useState } from 'react';
import { Logo } from "@/components/ui/Logo";
import { Lock, Check, Loader2, AlertCircle } from 'lucide-react';

export function ResetPasswordForm({ message, error }: { message?: string, error?: string }) {
    const [isPending, setIsPending] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
    const isPasswordValid = passwordRegex.test(password);
    const doPasswordsMatch = password === confirmPassword && confirmPassword.length > 0;
    const canSubmit = isPasswordValid && doPasswordsMatch && !isPending;

    return (
        <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-violet-500 to-transparent" />

            <div className="flex flex-col items-center mb-10">
                <div className="w-16 h-16 bg-violet-600/20 rounded-2xl flex items-center justify-center mb-6 border border-violet-500/20">
                    <Lock className="w-8 h-8 text-violet-400" />
                </div>
                <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Set New Password</h1>
                <p className="text-gray-500 text-sm mt-2 font-medium">Please enter your new secure password below.</p>
            </div>

            <form className="flex flex-col gap-6" action={updatePassword} onSubmit={() => setIsPending(true)}>
                {/* New Password */}
                <div className="space-y-2">
                    <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] ml-1" htmlFor="password">New Password</label>
                    <div className="relative">
                        <input
                            className={`w-full bg-black/40 border ${password && !isPasswordValid ? 'border-red-500/50' : 'border-white/5'} rounded-2xl p-4 pl-12 text-white focus:border-violet-500/50 focus:outline-none transition-all placeholder:text-gray-700`}
                            id="password"
                            name="password"
                            type="password"
                            required
                            placeholder="8-16 chars, 1 num, 1 special"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                    </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                    <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] ml-1" htmlFor="confirmPassword">Confirm Password</label>
                    <div className="relative">
                        <input
                            className={`w-full bg-black/40 border ${confirmPassword && !doPasswordsMatch ? 'border-red-500/50' : 'border-white/5'} rounded-2xl p-4 pl-12 text-white focus:border-violet-500/50 focus:outline-none transition-all placeholder:text-gray-700`}
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <Check className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                    </div>
                </div>

                {/* Password Requirements */}
                <div className="p-4 bg-white/5 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-700'}`} />
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${password.length >= 8 ? 'text-gray-300' : 'text-gray-600'}`}>8-16 Characters</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-700'}`} />
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${/[0-9]/.test(password) ? 'text-gray-300' : 'text-gray-600'}`}>At least 1 Number</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${/[!@#$%^&*]/.test(password) ? 'bg-green-500' : 'bg-gray-700'}`} />
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${/[!@#$%^&*]/.test(password) ? 'text-gray-300' : 'text-gray-600'}`}>1 Special Character</span>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={!canSubmit}
                    className="h-16 bg-violet-600 hover:bg-violet-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-violet-500/20 disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3 tracking-[0.2em] uppercase text-sm active:scale-95"
                >
                    {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : "Update Password"}
                </button>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs text-center font-bold flex items-center justify-center gap-2 animate-shake">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {error}
                    </div>
                )}
            </form>
        </div>
    );
}
