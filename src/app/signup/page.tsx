import { SignupForm } from '@/components/auth/SignupForm';

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ message?: string, error?: string }> }) {
    const { message, error } = await searchParams;
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <SignupForm message={message} error={error} />
        </div>
    )
}
