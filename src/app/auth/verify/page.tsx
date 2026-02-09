'use client';

import { verifyEmailOtp, resendOtp } from '@/app/actions/auth';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from "@/components/ui/Logo";
import { LocalizedText } from '@/components/common/LocalizedText';
import { Mail, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function VerifyPage() {
    const searchParams = useSearchParams();
    const emailParam = searchParams.get('email');
    const router = useRouter();

    const [otp, setOtp] = useState('');
    const [emailInput, setEmailInput] = useState(emailParam || '');
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Resend Logic
    const [countdown, setCountdown] = useState(0);
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);
        setError('');
        setMessage('');

        const result = await verifyEmailOtp(emailInput, otp);

        if (result.error) {
            setError(result.error);
            setIsPending(false);
        } else {
            router.push('/login?message=Verification successful! Please log in.');
        }
    };

    const handleResend = async () => {
        if (countdown > 0 || isResending) return;

        setIsResending(true);
        setError('');
        setMessage('');

        const result = await resendOtp(emailInput);

        if (result.error) {
            setError(result.error);
            setIsResending(false);
        } else {
            setMessage('A new code has been sent to your email.');
            setCountdown(60); // 60 seconds cooldown
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0a0a0a]">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-900/10 via-black to-black -z-10" />

            <div className="w-full max-w-md bg-[#111]/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-3xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-50" />

                <div className="flex flex-col items-center mb-10">
                    <div className="w-20 h-20 bg-violet-500/10 rounded-full flex items-center justify-center mb-6 border border-violet-500/20 group">
                        <Mail className="w-10 h-10 text-violet-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter mb-2">
                        <LocalizedText en="Verify Account" ko="계정 인증" />
                    </h1>
                    <p className="text-gray-400 text-sm font-medium text-center">
                        <LocalizedText en="Enter the 6-digit code sent to" ko="이메일로 발송된 6자리 코드를 입력하세요:" />
                        <br />
                        {emailInput && <span className="text-violet-400 font-bold">{emailInput}</span>}
                    </p>
                </div>

                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                    {/* Email Input (Manual Entry if missing from URL) */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] ml-1" htmlFor="email-input">
                            Email
                        </label>
                        <input
                            className="bg-black/40 border-2 border-white/5 rounded-2xl p-5 text-white focus:border-violet-500/50 focus:bg-black/60 focus:outline-none transition-all placeholder:text-gray-800"
                            id="email-input"
                            name="email-input"
                            type="email"
                            required
                            placeholder="name@example.com"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            readOnly={!!emailParam} // Read-only if provided via URL
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] ml-1" htmlFor="otp">
                            <LocalizedText en="Verification Code" ko="인증 코드" />
                        </label>
                        <input
                            className="bg-black/40 border-2 border-white/5 rounded-2xl p-5 text-white focus:border-violet-500/50 focus:bg-black/60 focus:outline-none transition-all text-center text-4xl font-black tracking-[0.5em] placeholder:text-gray-800"
                            id="otp"
                            name="otp"
                            type="text"
                            inputMode="numeric"
                            required
                            placeholder="000000"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isPending || otp.length < 6}
                        className="bg-white text-black h-16 rounded-2xl font-black text-lg transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(255,255,255,0.2)] disabled:opacity-30 disabled:grayscale active:scale-95 uppercase tracking-widest"
                    >
                        {isPending ? <LocalizedText en="Verifying..." ko="인증 중..." /> : <LocalizedText en="Verify Piece" ko="코드 인증" />}
                    </button>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-bold flex items-center gap-3 animate-shake">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400 text-sm font-bold flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                            {message}
                        </div>
                    )}
                </form>

                <div className="mt-10 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                        <LocalizedText en="Didn't receive the code?" ko="코드를 받지 못하셨나요?" />
                    </p>
                    <button
                        onClick={handleResend}
                        disabled={countdown > 0 || isResending}
                        className="flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors font-black text-sm uppercase tracking-wider disabled:text-gray-600 group"
                    >
                        <RefreshCw className={`w-4 h-4 ${isResending ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                        {countdown > 0 ? (
                            <span><LocalizedText en="Please wait" ko="잠시만 기다려주세요" /> ({countdown}s)</span>
                        ) : (
                            <LocalizedText en="Resend Code" ko="코드 재전송" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
