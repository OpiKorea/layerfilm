export default function PrivacyPage() {
    return (
        <div className="max-w-3xl mx-auto py-20 px-4">
            <h1 className="text-4xl font-black text-white mb-8">Privacy Policy</h1>
            <div className="space-y-6 text-slate-400 leading-relaxed font-medium">
                <section>
                    <h2 className="text-xl font-bold text-white mb-2">Data Collection</h2>
                    <p>We collect minimal data required for authentication via Supabase and purchase tracking. Your purchase history is used by our AI models to improve your personalized recommendations.</p>
                </section>
                <section>
                    <h2 className="text-xl font-bold text-white mb-2">AI Processing</h2>
                    <p>The AI models processing marketplace data do so in an encrypted environment. We do not sell your personal data to third parties.</p>
                </section>
            </div>
        </div>
    );
}
