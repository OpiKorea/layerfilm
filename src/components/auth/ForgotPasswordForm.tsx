"use client";

import { requestPasswordReset } from '@/app/actions/auth';
import { useState } from 'react';
import { Logo } from "@/components/ui/Logo";
import Link from 'next/link';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';

export function ForgotPasswordForm({ message, error }: { message?: string, error?: string }) {
    const [isPending, setIsPending] = useState(false);

    return (
        <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />

            <div className="flex flex-col items-center mb-8">
                <Logo className="w-12 h-12 text-accent mb-4" />
                <h1 className="text-2xl font-bold text-white tracking-tight">Reset Password</h1>
                <p className="text-gray-400 text-sm text-center mt-2">Enter your email and we&apos;ll send you a link to reset your password.</p>
            </div>

            <form className="flex flex-col gap-6" action={requestPasswordReset} onSubmit={() => setIsPending(true)}>
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]" htmlFor="email">Email Address</label>
                    <div className="relative">
                        <input
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-4 pl-12 text-white focus:border-accent focus:outline-none transition-all placeholder:text-gray-600"
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="you@example.com"
                        />
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-accent hover:bg-accent/80 text-white font-black py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:shadow-[0_0_25px_rgba(124,58,237,0.5)] disabled:opacity-50 flex items-center justify-center gap-2 tracking-widest uppercase text-xs"
                >
                    {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Link"}
                </button>

                {message && (
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm text-center font-bold">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center font-bold">
                        {error}
                    </div>
                )}
            </form>

            <div className="mt-8 text-center pt-6 border-t border-white/5">
                <Link href="/login" className="text-gray-400 hover:text-white text-sm font-bold flex items-center justify-center gap-2 group transition-colors">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Login
                </Link>
            </div>
        </div>
    );
}
