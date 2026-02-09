
import { createClient } from "@/utils/supabase/server";
import { getIdeas, getPurchasedIdeas, getUserSubmissions } from "@/lib/data";
import { IdeaItem } from "@/lib/types";
import { redirect } from "next/navigation";
import { FilmRow } from "@/components/video/FilmRow";
import { UserCircle, Settings, LogOut, Wallet, Upload, Shield } from "lucide-react";
import { signOut } from "@/app/actions/auth";
import { FilmUploadForm } from "@/components/video/FilmUploadForm";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { ChangePasswordModal } from "@/components/profile/ChangePasswordModal";
import { DeleteAccountModal } from "@/components/profile/DeleteAccountModal";
import { MySubmissions } from "@/components/video/MySubmissions";
import { LocalizedText } from "@/components/common/LocalizedText";

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch Profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    // Fetch User Submissions
    const userSubmissions = await getUserSubmissions(user.id);

    // Fetch Moderation Queue if Admin
    let pendingIdeas: IdeaItem[] = [];
    if (profile?.role === 'admin') {
        pendingIdeas = await getIdeas(undefined, undefined, undefined, undefined, undefined, undefined, true);
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-20 px-6 md:px-12">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* 1. Profile Header */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 border-b border-white/5 pb-12">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-accent/20 shadow-2xl shadow-accent/10">
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-4xl font-bold text-gray-500">
                                {profile?.username?.[0]?.toUpperCase() || 'U'}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight">{profile?.username || user.email}</h1>
                            <p className="text-gray-400 text-lg">{user.email}</p>
                            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest">
                                {profile?.role || 'Viewer'}
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                            <EditProfileModal profile={profile} userId={user.id} />
                            <ChangePasswordModal />

                            {profile?.role === 'admin' && (
                                <a
                                    href="/dashboard/moderation"
                                    className="flex items-center gap-2 px-6 py-2 bg-accent/10 hover:bg-accent/20 border border-accent/20 text-accent rounded-full transition-colors font-bold text-sm"
                                >
                                    <Shield className="w-4 h-4" />
                                    <LocalizedText en="Moderation" ko="관리대기" />
                                </a>
                            )}

                            <form action={signOut}>
                                <button className="flex items-center gap-2 px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 rounded-full transition-colors font-bold text-sm">
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </form>

                            <DeleteAccountModal />
                        </div>
                    </div>

                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                        <UserCircle className="w-6 h-6 text-accent" />
                        <LocalizedText en="My Submissions" ko="내 제출 목록" />
                    </h2>
                    <MySubmissions ideas={userSubmissions} />
                </div>

                {/* 3. Film Submission Section */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                        <Upload className="w-6 h-6 text-accent" />
                        Film Submission
                    </h2>
                    <FilmUploadForm userId={user.id} />
                </div>

            </div>
        </div>
    );
}
