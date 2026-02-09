"use client";

import { completeSignupWithOtp, sendSignupOtp } from '@/app/actions/auth';
import { checkNickname } from '@/app/actions/user';
import { useState, useEffect } from 'react';
import { Logo } from "@/components/ui/Logo";
import Link from 'next/link';
import { useDebounce } from '@/hooks/useDebounce';
import { LocalizedText } from "@/components/common/LocalizedText";
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/providers/LanguageProvider';



export function SignupForm({ message, error: propError }: { message?: string, error?: string }) {
    const router = useRouter();
    const { language } = useLanguage();

    const [isPending, setIsPending] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Form State
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    // Step 1: Signup Form States
    const [nickname, setNickname] = useState('');
    const [nicknameAvailable, setNicknameAvailable] = useState<boolean | null>(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [legalChecked, setLegalChecked] = useState(false);

    const nicknameRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9]{4,12}$/;
    const nicknameValid = nicknameRegex.test(nickname);

    // Debounce nickname check
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (nicknameValid) {
                const available = await checkNickname(nickname);
                setNicknameAvailable(available);
            } else {
                setNicknameAvailable(null);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [nickname, nicknameValid]);

    // Validation (Derived State)
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;

    let passwordError = '';
    if (password && !passwordRegex.test(password)) {
        passwordError = language === 'ko'
            ? '비밀번호는 8-16자이며, 숫자 1개와 특수문자(!@#$%^&*) 1개를 포함해야 합니다.'
            : 'Password must be 8-16 chars, include at least 1 number and 1 special char (!@#$%^&*).';
    }

    const passwordMatch = !confirmPassword || password === confirmPassword;

    const isValid =
        !passwordError &&
        passwordMatch &&
        password.length > 0 &&
        confirmPassword.length > 0 &&
        nicknameValid &&
        nicknameAvailable === true &&
        legalChecked &&
        otp.length === 6;

    // Handlers
    async function handleSendOtp() {
        if (!email) {
            setLocalError(language === 'ko' ? "이메일을 먼저 입력해주세요." : "Please enter your email first.");
            return;
        }
        setIsPending(true);
        setLocalError(null);
        setSuccessMessage(null);

        const result = await sendSignupOtp(email, nickname);

        setIsPending(false);

        if (result.error) {
            setLocalError(result.error);
        } else {
            setOtpSent(true);
            setSuccessMessage(language === 'ko' ? "인증 코드가 발송되었습니다! 이메일을 확인해주세요." : "Verification code sent! Please check your email.");
        }
    }

    async function handleSignupSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsPending(true);
        setLocalError(null);

        const formData = new FormData(e.currentTarget);
        // Ensure OTP is included if not in form (it is in form input name='otp')
        // formData.set('email', email); // Already in input

        const result = await completeSignupWithOtp(formData);

        setIsPending(false);

        if (result?.error) {
            setLocalError(result.error);
        } else if (result?.success) {
            const msg = language === 'ko'
                ? '회원가입이 완료되었습니다!'
                : 'Signup successful!';
            router.push(`/dashboard?message=${encodeURIComponent(msg)}`);
        }
    }

    return (
        <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />

            <div className="flex flex-col items-center mb-8">
                <Logo className="w-12 h-12 text-accent mb-4" />
                <h1 className="text-2xl font-bold text-white">Create Account</h1>
                <p className="text-gray-400 text-sm">Join LayerFilm to unlock exclusive ideas</p>
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleSignupSubmit}>
                {/* Email */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500 font-medium uppercase tracking-wider" htmlFor="email">Email</label>
                    <div className="flex gap-2">
                        <input
                            className="flex-1 bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-accent focus:outline-none transition-colors"
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            readOnly={otpSent}
                        />
                        <button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={isPending || !email || otpSent || !nicknameValid || nicknameAvailable === false}
                            className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 rounded-lg transition-colors border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                            {otpSent ? <LocalizedText en="Sent" ko="발송됨" /> : <LocalizedText en="Send Code" ko="인증번호 발송" />}
                        </button>
                    </div>
                </div>

                {/* Verification Code Input */}
                {otpSent && (
                    <div className="flex flex-col gap-1 p-4 bg-white/5 border border-white/10 rounded-xl mt-2 border-accent/30 shadow-[0_0_15px_rgba(124,58,237,0.1)]">
                        <label className="text-xs text-accent font-semibold uppercase tracking-wider flex justify-between items-center" htmlFor="otp">
                            <LocalizedText en="Verification Code" ko="인증 코드" />
                            <span className="text-[10px] text-gray-500 font-normal normal-case"><LocalizedText en="6-digit code" ko="6자리 숫자" /></span>
                        </label>
                        <input
                            className="bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-accent focus:outline-none transition-colors tracking-[0.5em] text-center font-mono text-xl"
                            id="otp"
                            name="otp"
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            required
                            autoFocus
                            placeholder="000000"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                        />
                        <p className="text-[10px] text-gray-400 mt-1">
                            <LocalizedText
                                en="Check your email for the 6-digit code. It may take a minute."
                                ko="이메일로 전송된 6자리 코드를 입력하세요. 최대 1분이 걸릴 수 있습니다."
                            />
                        </p>
                    </div>
                )}

                {/* Nickname */}
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between">
                        <label className="text-xs text-gray-500 font-medium uppercase tracking-wider" htmlFor="nickname">
                            <LocalizedText en="Nickname" ko="닉네임" />
                        </label>
                        {nickname.length > 0 && (
                            <span className={`text-xs ${nicknameValid && nicknameAvailable === true ? 'text-green-500' : 'text-red-500'}`}>
                                {!nicknameValid ? (
                                    <LocalizedText en="Invalid Format" ko="형식 오류" />
                                ) : (
                                    nicknameAvailable === null ? (
                                        <LocalizedText en="Checking..." ko="확인 중..." />
                                    ) : nicknameAvailable ? (
                                        <LocalizedText en="Available" ko="사용 가능" />
                                    ) : (
                                        <LocalizedText en="Unavailable" ko="중복된 닉네임" />
                                    )
                                )}
                            </span>
                        )}
                    </div>
                    <input
                        className={`bg-black/50 border ${nickname.length > 0 && (!nicknameValid || nicknameAvailable === false) ? 'border-red-500' : 'border-white/10'} rounded-lg p-3 text-white focus:border-accent focus:outline-none transition-colors`}
                        id="nickname"
                        name="nickname"
                        type="text"
                        required
                        placeholder="Enter nickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                    <p className="text-[10px] text-gray-600 mt-1">
                        <LocalizedText
                            en="4-12 characters, Alphanumeric only. English mandatory."
                            ko="4-12자, 영문 필수, 숫자 선택, 특수문자 금지."
                        />
                    </p>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500 font-medium uppercase tracking-wider" htmlFor="password">
                        <LocalizedText en="Password" ko="비밀번호" />
                    </label>
                    <input
                        className={`bg-black/50 border ${passwordError ? 'border-red-500' : 'border-white/10'} rounded-lg p-3 text-white focus:border-accent focus:outline-none transition-colors`}
                        id="password"
                        name="password"
                        type="password"
                        required
                        placeholder="8-16 chars, 1 number, 1 special"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {/* Password Strength Indicator */}
                    {password && (
                        <div className="flex gap-1 mt-1">
                            {[1, 2, 3, 4].map((step) => {
                                const level = (password.length > 8 ? 1 : 0) +
                                    (/[0-9]/.test(password) ? 1 : 0) +
                                    (/[!@#$%^&*]/.test(password) ? 1 : 0) +
                                    (password.length > 12 ? 1 : 0);
                                return (
                                    <div
                                        key={step}
                                        className={`h-1 flex-1 rounded-full transition-all duration-500 ${step <= level ? (level <= 1 ? 'bg-red-500' : level <= 2 ? 'bg-amber-500' : 'bg-green-500') : 'bg-white/5'}`}
                                    />
                                );
                            })}
                        </div>
                    )}
                    {passwordError && <span className="text-xs text-red-500">
                        {passwordError}
                    </span>}
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500 font-medium uppercase tracking-wider" htmlFor="confirmPassword">
                        <LocalizedText en="Confirm Password" ko="비밀번호 확인" />
                    </label>
                    <input
                        className={`bg-black/50 border ${!passwordMatch ? 'border-red-500' : 'border-white/10'} rounded-lg p-3 text-white focus:border-accent focus:outline-none transition-colors`}
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        placeholder="Re-enter password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {!passwordMatch && <span className="text-xs text-red-500">
                        <LocalizedText en="Passwords do not match" ko="비밀번호가 일치하지 않습니다" />
                    </span>}
                </div>


                {/* Legal Checkbox */}
                <div className="flex items-start gap-2 mt-2">
                    <input
                        type="checkbox"
                        id="legal"
                        name="legal"
                        checked={legalChecked}
                        onChange={(e) => setLegalChecked(e.target.checked)}
                        className="mt-1 w-4 h-4 bg-black border-white/10 rounded focus:ring-accent text-accent"
                    />
                    <label htmlFor="legal" className="text-xs text-gray-400 leading-tight cursor-pointer select-none">
                        <LocalizedText
                            en="I agree to the Terms and Privacy Policy."
                            ko="이용약관 및 개인정보 보관 정책에 동의합니다."
                        />
                        {" "}<Link href="/terms" className="text-accent underline">
                            <LocalizedText en="View Details" ko="상세 보기" />
                        </Link>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={isPending || !isValid}
                    className="mt-4 bg-accent hover:bg-accent/80 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:shadow-[0_0_25px_rgba(124,58,237,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? <LocalizedText en="Signing up..." ko="가입 중..." /> : <LocalizedText en="Sign Up" ko="회원가입" />}
                </button>

                {message && (
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 text-sm text-center">
                        {message}
                    </div>
                )}
                {successMessage && (
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm text-center">
                        {successMessage}
                    </div>
                )}
                {(localError || propError) && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                        {(localError || propError)?.toLowerCase().includes('rate limit') ? (
                            <LocalizedText
                                en="Too many attempts. Please try again after a few minutes."
                                ko="요청이 너무 많습니다. 5분 뒤에 다시 시도해주세요."
                            />
                        ) : (
                            (localError || propError)
                        )}
                    </div>
                )}
            </form>

            <div className="mt-6 flex flex-col items-center gap-2 text-sm text-gray-500">
                <div>
                    Already have an account? <Link href="/login" className="text-accent hover:underline">Log In</Link>
                </div>
            </div>
        </div>
    );
}
