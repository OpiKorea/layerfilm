"use client";

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div className={`animate-pulse bg-white/5 rounded-xl ${className}`} />
    );
}

export function FilmRowSkeleton() {
    return (
        <div className="px-6 md:px-12 py-8 space-y-4">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="flex gap-4 overflow-hidden">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex-shrink-0 w-[160px] md:w-[280px] aspect-video">
                        <Skeleton className="w-full h-full rounded-xl" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function IdeaGridSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="space-y-4">
                    <Skeleton className="aspect-video w-full rounded-2xl" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            ))}
        </div>
    );
}
