import { IdeaGridSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
    return (
        <div className="flex flex-col gap-8 min-h-screen bg-background pb-20">
            {/* Title Header Skeleton */}
            <div className="pt-24 px-6 md:px-12 w-full space-y-4">
                <div className="h-10 w-48 bg-white/10 rounded-lg animate-pulse" />
                <div className="h-4 w-64 bg-white/5 rounded-lg animate-pulse" />
            </div>

            {/* Filter Bar Skeleton */}
            <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12 w-full">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="flex gap-2 w-full md:w-auto">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-8 w-20 bg-white/10 rounded-full animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid Skeleton */}
            <div className="px-6 md:px-12 w-full">
                <IdeaGridSkeleton />
            </div>
        </div>
    );
}
