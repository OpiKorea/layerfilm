
import { createClient } from "@/utils/supabase/server";
import { getIdeas } from "@/lib/data";
import { redirect } from "next/navigation";
import { Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ModerationQueue } from "@/components/video/ModerationQueue";
import { LocalizedText } from "@/components/common/LocalizedText";

export default async function ModerationPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Role Check
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') {
        redirect("/dashboard");
    }

    // Fetch Pending & Reported Ideas
    const pendingIdeas = await getIdeas(undefined, undefined, undefined, undefined, true);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20 px-6 md:px-12 font-sans">
            <div className="max-w-7xl mx-auto space-y-12">
                <div className="flex flex-col gap-4">
                    <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </Link>

                    <div className="flex items-center gap-4 border-b border-white/5 pb-8">
                        <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/20">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight uppercase">Moderation Console</h1>
                            <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">Administrator View</p>
                        </div>
                    </div>
                </div>

                <ModerationQueue pendingIdeas={pendingIdeas} />
            </div>
        </div>
    );
}
