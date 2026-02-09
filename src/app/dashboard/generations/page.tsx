
import { createClient } from "@/utils/supabase/server";
import { LocalizedText } from "@/components/common/LocalizedText";
import { Clock, CheckCircle2, AlertCircle, Loader2, Play } from "lucide-react";
import Link from "next/link";
import { getMediaUrl } from "@/lib/media";

export default async function GenerationsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: generations } = await supabase
        .from('generations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    return (
        <div className="min-h-screen bg-[#141414] pt-24 pb-20 px-6 md:px-16 text-white">
            <div className="max-w-6xl mx-auto space-y-12">
                <header className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase line-clamp-1">
                        <LocalizedText en="Creation Studio" ko="크리에이션 스튜디오" />
                    </h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">
                        <LocalizedText en="Track your AI Film generations" ko="AI 영화 생성 상태를 확인하세요" />
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {generations?.map((gen) => (
                        <div key={gen.id} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden flex flex-col group hover:border-violet-500/50 transition-all duration-500 shadow-2xl">
                            {/* Preview area */}
                            <div className="aspect-video relative bg-black/40 flex items-center justify-center">
                                {gen.status === 'completed' && gen.video_url ? (
                                    <>
                                        <img src={gen.thumbnail_url || ''} alt="" className="w-full h-full object-cover opacity-50" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center">
                                                <Play className="fill-current w-5 h-5 ml-1" />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center gap-4 text-gray-500">
                                        {gen.status === 'failed' ? (
                                            <AlertCircle className="w-12 h-12 text-red-500" />
                                        ) : (
                                            <Loader2 className="w-12 h-12 animate-spin text-violet-500" />
                                        )}
                                        <span className="text-xs font-black uppercase tracking-widest">{gen.status}</span>
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                                <div className="space-y-2">
                                    <h3 className="font-black italic text-lg line-clamp-2 uppercase leading-tight tracking-tight">
                                        {gen.prompt}
                                    </h3>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                                        <Clock className="w-3 h-3" />
                                        <span>{new Date(gen.created_at).toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-2">
                                        {gen.status === 'completed' ? (
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        ) : gen.status === 'failed' ? (
                                            <AlertCircle className="w-4 h-4 text-red-500" />
                                        ) : (
                                            <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
                                        )}
                                        <span className={`text-xs font-black uppercase tracking-widest ${gen.status === 'completed' ? 'text-green-500' :
                                                gen.status === 'failed' ? 'text-red-500' : 'text-violet-500'
                                            }`}>
                                            {gen.status}
                                        </span>
                                    </div>

                                    {gen.status === 'completed' && (
                                        <button className="text-[10px] font-black uppercase tracking-tighter bg-white text-black px-4 py-2 rounded-lg hover:bg-violet-500 hover:text-white transition-all">
                                            <LocalizedText en="Publish" ko="개봉하기" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Empty State */}
                    {(!generations || generations.length === 0) && (
                        <div className="col-span-full py-32 text-center space-y-6">
                            <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto border border-white/10">
                                <Plus className="w-10 h-10 text-gray-700" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-black italic tracking-tighter uppercase">
                                    <LocalizedText en="No films created yet" ko="생성된 영화가 없습니다" />
                                </h2>
                                <p className="text-gray-500 font-medium">
                                    <LocalizedText en="Start your first AI journey now" ko="지금 첫 번째 AI 영화 여행을 시작하세요" />
                                </p>
                            </div>
                            <Link href="/generate" className="inline-block bg-white text-black px-12 py-4 rounded-2xl font-black text-lg hover:bg-violet-600 hover:text-white transition-all shadow-2xl">
                                <LocalizedText en="Start Creating" ko="제작 시작하기" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function Plus(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    )
}
