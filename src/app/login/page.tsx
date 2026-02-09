import { LoginForm } from '@/components/auth/LoginForm';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ message?: string, error?: string }> }) {
    const { message, error } = await searchParams;
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <LoginForm message={message} error={error} />
        </div>
    )
}
