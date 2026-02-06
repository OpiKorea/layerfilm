'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

// 1. 영상 카드 컴포넌트 (동일 유지)
const VideoCard = ({ video, index, lang }: { video?: any, index: number, lang: string }) => {
  const title = video?.title || (lang === 'ko' ? `레이어 필름 #${index}` : `Layer Film #${index}`);
  const nickname = video?.profiles?.nickname || (lang === 'ko' ? '작가 미상' : 'Unknown Artist');

  const getSafeUrl = (path: string) => {
    if (!path) return "";
    const baseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/videos/`;
    return baseUrl + path.split('/').map(p => encodeURIComponent(p)).join('/');
  };

  const safePlay = async (videoElement: HTMLVideoElement) => {
    try { if (videoElement.paused) await videoElement.play(); } catch (err) {}
  };

  return (
    <div className="flex-none w-[220px] md:w-[280px] select-none group cursor-pointer mb-10">
      <Link href={video ? `/watch/${video.id}` : "#"} className="block">
        <div className="relative aspect-[2/3] bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/5 group-hover:border-[#A78BFA]/50 transition-all flex items-center justify-center shadow-2xl">
          <span className="text-[#222] font-black text-8xl absolute inset-0 flex items-center justify-center select-none tracking-tighter italic">{index}</span>
          {video?.video_url ? (
            <video 
              src={getSafeUrl(video.video_url)}
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500"
              muted playsInline loop
              poster={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/thumbnails/${video.thumbnail_url}`}
              onMouseEnter={(e) => safePlay(e.currentTarget)}
              onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
            />
          ) : (
            <div className="w-full h-full bg-[#111] flex items-center justify-center italic text-slate-800 text-[10px] font-black uppercase tracking-widest text-center px-4">No Clip</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />
        </div>
        <div className="mt-4 px-2 text-center md:text-left">
          <h4 className="font-black text-sm text-slate-200 truncate group-hover:text-[#A78BFA] transition-colors tracking-tighter uppercase italic">{title}</h4>
          <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-widest italic">{nickname}</p>
          {video && <p className="text-[9px] text-[#A78BFA] font-bold italic uppercase mt-1">Loves: {video?.likes || 0}</p>}
        </div>
      </Link>
    </div>
  );
};

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [lang, setLang] = useState('ko'); 
  const [allVideos, setAllVideos] = useState<any[]>([]); 
  const [activeGenre, setActiveGenre] = useState('전체');
  const [videos, setVideos] = useState<any>({ popular: [], sale: [], notSale: [] });
  
  const [isGenreOpen, setIsGenreOpen] = useState(false);
  // 📍 [추가] 섹션 전체보기 모달 상태 ㅡㅡ
  const [viewAllType, setViewAllType] = useState<string | null>(null);

  const t: any = {
    ko: { 
      login: "로그인", board: "자유게시판", 
      genres: ['전체', '드라마', '공포/호러', 'SF/판타지', '스릴러', '애니메이션', '기타', '성인(19)'], 
      sections: ['실시간 인기 (Trending Now)', '프롬프트 판매 중 (For Sale)', '미판매/감상용 (Not for Sale)'],
      genreTitle: "장르를 선택하세요 (Select Genre)",
      viewAll: "전체보기 (View All)"
    },
    en: { 
      login: "Login", board: "COMMUNITY", 
      genres: ['All', 'Drama', 'Horror', 'SF/Fantasy', 'Thriller', 'Animation', 'ETC', 'Adult(19)'], 
      sections: ['Trending Now', 'Prompts for Sale', 'Not for Sale'],
      genreTitle: "Select Genre",
      viewAll: "View All"
    }
  };

  const applyFilter = useCallback((genre: string, data: any[]) => {
    const isAll = genre === '전체' || genre === 'All';
    const filtered = isAll ? data : data.filter(v => v.main_genre === genre);

    setVideos({
      popular: [...filtered].sort((a, b) => (b.likes || 0) - (a.likes || 0)),
      sale: filtered.filter(v => v.apply_role === '판매'),
      notSale: filtered.filter(v => v.apply_role !== '판매')
    });
  }, []);

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem('site_lang') || 'ko';
    setLang(savedLang);

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data: pData } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (pData) setProfile(pData);
      }
      const { data: vData } = await supabase.from('videos').select('*, profiles(nickname)').eq('status', 'APPROVED');
      if (vData) { setAllVideos(vData); applyFilter('전체', vData); }
    };
    init();
  }, [applyFilter]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#080808] text-white font-sans pb-32">
      <header className="fixed top-0 w-full h-16 bg-[#080808]/80 backdrop-blur-xl flex items-center justify-between px-8 z-50 border-b border-white/5">
        <Link href="/" className="text-2xl font-black text-[#A78BFA] tracking-tighter uppercase italic shadow-purple-500/20">LayerFilm</Link>
        <div className="flex items-center gap-8">
          <Link href="/board" className="text-[11px] font-black text-slate-400 hover:text-white transition-colors uppercase tracking-widest">{t[lang]?.board}</Link>
          {user ? (
            <div className="flex items-center gap-6 border-l border-white/10 pl-8">
              <Link href="/mypage" className="group">
                <p className="text-[10px] text-slate-500 font-black group-hover:text-[#A78BFA] transition-colors">{profile?.nickname || user.email?.split('@')[0]}{lang === 'ko' ? '님' : ''}</p>
              </Link>
              <button onClick={() => supabase.auth.signOut().then(() => window.location.href='/')} className="text-[10px] text-slate-600 hover:text-red-500 uppercase font-black tracking-tighter transition-colors italic">Logout</button>
            </div>
          ) : (
            <Link href="/login" className="bg-[#A78BFA] text-black text-[10px] font-black px-6 py-2 rounded-full shadow-lg uppercase tracking-widest hover:bg-white transition-all italic">Login</Link>
          )}
        </div>
      </header>

      <main className="pt-32 max-w-[1600px] mx-auto">
        <nav className="flex justify-center gap-3 overflow-x-auto px-6 no-scrollbar mb-20">
          {t[lang].genres.slice(0, 1).map((cat: string) => (
            <button key={cat} onClick={() => setIsGenreOpen(true)}
              className="whitespace-nowrap border-2 border-[#A78BFA] px-10 py-2 rounded-full text-[12px] font-black transition-all uppercase tracking-widest italic bg-[#A78BFA] text-black shadow-[0_0_20px_rgba(167,139,250,0.3)] hover:scale-105 active:scale-95"
            >
              {activeGenre} ▽
            </button>
          ))}
          <div className="w-[1px] h-10 bg-white/10 mx-4 hidden md:block" />
          {t[lang].genres.slice(1, 5).map((cat: string) => (
            <button key={cat} onClick={() => { setActiveGenre(cat); applyFilter(cat, allVideos); }}
              className={`whitespace-nowrap border px-6 py-2 rounded-full text-[10px] font-black transition-all uppercase tracking-widest italic ${activeGenre === cat ? 'bg-white text-black border-white' : 'bg-white/5 border-white/5 text-slate-400 hover:border-[#A78BFA]'}`}
            >
              {cat}
            </button>
          ))}
        </nav>

        {/* 장르 선택 모달 (동일 유지) */}
        {isGenreOpen && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="max-w-4xl w-full text-center">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-[#A78BFA] mb-12 animate-in slide-in-from-top-5">{t[lang].genreTitle}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {t[lang].genres.map((cat: string) => (
                  <button key={cat} onClick={() => { setActiveGenre(cat); applyFilter(cat, allVideos); setIsGenreOpen(false); }}
                    className={`py-8 rounded-3xl text-sm font-black uppercase tracking-widest transition-all border-2 border-white/5 hover:border-[#A78BFA] hover:text-[#A78BFA] hover:bg-[#A78BFA]/5 ${activeGenre === cat ? 'bg-[#A78BFA] text-black border-[#A78BFA]' : 'bg-white/5 text-slate-400'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <button onClick={() => setIsGenreOpen(false)} className="mt-16 text-[10px] font-black text-slate-600 hover:text-white uppercase tracking-[0.5em] italic">CLOSE [ESC]</button>
            </div>
          </div>
        )}

        {/* 📍 [추가] 섹션별 전체보기 모달 ㅡㅡ */}
        {viewAllType && (
          <div className="fixed inset-0 z-[110] bg-[#080808] overflow-y-auto animate-in slide-in-from-bottom-10 duration-500">
            <div className="max-w-[1600px] mx-auto px-10 py-20">
              <div className="flex justify-between items-center mb-20">
                <h2 className="text-4xl font-black italic uppercase tracking-tighter text-[#A78BFA]">
                   {viewAllType === 'popular' && t[lang].sections[0]}
                   {viewAllType === 'sale' && t[lang].sections[1]}
                   {viewAllType === 'notSale' && t[lang].sections[2]}
                </h2>
                <button onClick={() => setViewAllType(null)} className="text-sm font-black text-white hover:text-[#A78BFA] transition-colors tracking-widest uppercase italic border-b-2 border-[#A78BFA] pb-1">BACK TO LOBBY</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
                {videos[viewAllType].map((v: any, i: number) => (
                  <div key={v.id} className="flex justify-center">
                    <VideoCard index={i + 1} video={v} lang={lang} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 📍 섹션 렌더링 (전체보기 버튼 추가) ㅡㅡ */}
        {t[lang].sections.map((title: string, idx: number) => {
          const sectionKeys = ['popular', 'sale', 'notSale'];
          const sectionData = videos[sectionKeys[idx]]?.slice(0, 10) || [];
          return (
            <section key={title} className="mb-24 px-4">
              <div className="px-6 mb-8 flex justify-between items-end">
                <h3 className="text-xl font-black flex items-center gap-3 tracking-tighter uppercase italic text-white/90">
                  <div className="w-1.5 h-6 bg-[#A78BFA] rounded-full shadow-[0_0_15px_rgba(167,139,250,0.5)]"></div>{title}
                </h3>
                {/* 📍 [수정] 전체보기 버튼 연결 ㅡㅡ */}
                <button 
                  onClick={() => setViewAllType(sectionKeys[idx])}
                  className="text-[10px] font-black text-slate-500 hover:text-[#A78BFA] uppercase tracking-widest italic transition-colors border-b border-slate-800 hover:border-[#A78BFA] pb-1"
                >
                  {t[lang].viewAll}
                </button>
              </div>
              <div className="flex gap-6 overflow-x-auto px-6 no-scrollbar pb-6 scroll-smooth">
                <div className="flex gap-6 mx-auto"> 
                  {sectionData.length > 0 
                    ? sectionData.map((v: any, i: number) => <VideoCard key={v.id} index={i + 1} video={v} lang={lang} />)
                    : Array.from({ length: 10 }).map((_, i) => <VideoCard key={i} index={i + 1} lang={lang} />)
                  }
                </div>
              </div>
            </section>
          );
        })}
      </main>
      <style jsx global>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
}