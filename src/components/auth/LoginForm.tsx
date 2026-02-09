"use client";

import { login } from '@/app/actions/auth';
import { useState } from 'react';
import { Logo } from "@/components/ui/Logo";
import Link from 'next/link';

export function LoginForm({ message, error }: { message?: string, error?: string }) {
    const [isPending, setIsPending] = useState(false);

    return (
        <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />

            <div className="flex flex-col items-center mb-8">
                <Logo className="w-12 h-12 text-accent mb-4" />
                <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
                <p className="text-gray-400 text-sm">Sign in to access your premium content</p>
            </div>

            <form className="flex flex-col gap-4" action={login} onSubmit={() => setIsPending(true)}>
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500 font-medium uppercase tracking-wider" htmlFor="email">Email</label>
                    <input className="bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-accent focus:outline-none transition-colors" id="email" name="email" type="email" required placeholder="you@example.com" />
                </div>

                <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                        <label className="text-xs text-gray-500 font-medium uppercase tracking-wider" htmlFor="password">Password</label>
                        <Link href="/auth/forgot-password" className="text-[10px] text-accent hover:underline uppercase font-bold tracking-widest opacity-70">
                            Forgot Password?
                        </Link>
                    </div>
                    <input className="bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-accent focus:outline-none transition-colors" id="password" name="password" type="password" required placeholder="••••••••" />
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="mt-4 bg-accent hover:bg-accent/80 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:shadow-[0_0_25px_rgba(124,58,237,0.5)] disabled:opacity-50"
                >
                    {isPending ? "Signing in..." : "Sign In"}
                </button>

                {message && (
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 text-sm text-center">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
                Don&apos;t have an account? <Link href="/signup" className="text-accent hover:underline">Sign Up</Link>
            </div>
        </div>
    );
}
