import { IdeaCard } from "./IdeaCard";
import { getIdeas } from "@/lib/data";
import { Search, RotateCcw } from "lucide-react";
import { LocalizedText } from "../common/LocalizedText";
import Link from "next/link";

interface IdeaGridProps {
    query?: string;
    genre?: string;
    role?: string;
    mood?: string;
    aiTool?: string;
}

export async function IdeaGrid({ query, genre, role, mood, aiTool }: IdeaGridProps) {
    const ideas = await getIdeas(query, genre, role, undefined, mood, aiTool);

    if (ideas.length === 0) {
        return (
            <div className="py-24 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/5">
                    <Search className="w-10 h-10 text-gray-700" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-black text-white"><LocalizedText en="No films found" ko="검색 결과가 없습니다" /></h3>
                    <p className="text-gray-500 max-w-xs mx-auto">
                        <LocalizedText en="Try adjusting your filters or search keywords to find what you're looking for." ko="필터를 조정하거나 다른 키워드로 검색해 보세요." />
                    </p>
                </div>
                {(query || genre || role) && (
                    <Link
                        href="/explore"
                        className="flex items-center gap-2 px-6 py-2 bg-accent hover:bg-accent/80 text-black rounded-full font-bold transition-all shadow-lg shadow-accent/20"
                    >
                        <RotateCcw className="w-4 h-4" />
                        <LocalizedText en="Clear All Filters" ko="필터 초기화" />
                    </Link>
                )}
            </div>
        );
    }

    return (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {ideas.map((idea) => (
                <div key={idea.id} className="break-inside-avoid">
                    <IdeaCard idea={idea} />
                </div>
            ))}
        </div>
    );
}
