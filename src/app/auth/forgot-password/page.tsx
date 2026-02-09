import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<{ message?: string, error?: string }> }) {
    const { message, error } = await searchParams;
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0a0a0a]">
            <ForgotPasswordForm message={message} error={error} />
        </div>
    );
}
