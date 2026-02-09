export default function TermsPage() {
    return (
        <div className="max-w-3xl mx-auto py-20 px-4">
            <h1 className="text-4xl font-black text-white mb-8">Terms of Service</h1>
            <div className="space-y-6 text-slate-400 leading-relaxed font-medium">
                <section>
                    <h2 className="text-xl font-bold text-white mb-2">1. Acceptance of Terms</h2>
                    <p>By accessing LayerFilm, you agree to be bound by these terms. This is an AI-driven marketplace where digital ideas are traded.</p>
                </section>
                <section>
                    <h2 className="text-xl font-bold text-white mb-2">2. AI Manipulation Disclosure</h2>
                    <p>LayerFilm utilizes artificial intelligence for real-time price stabilization, content curation, and marketplace optimization. As a user, you acknowledge that prices and availability may be dynamically adjusted by the AI system.</p>
                </section>
                <section>
                    <h2 className="text-xl font-bold text-white mb-2">3. Purchases and Digital Content</h2>
                    <p>All sales on LayerFilm are final. Since digital products are immediately accessible upon purchase, refunds are generally not provided except where required by law.</p>
                </section>
                {/* ... More basic terms ... */}
            </div>
        </div>
    );
}
