import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ message?: string, error?: string }> }) {
    const { message, error } = await searchParams;
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0a0a0a]">
            {/* The presence of code/token is handled by Supabase when navigating to this page from email */}
            <ResetPasswordForm message={message} error={error} />
        </div>
    );
}
