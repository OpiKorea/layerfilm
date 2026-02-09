export default function Loading() {
    return (
        <div className="flex flex-col gap-6 animate-pulse">
            <div className="flex flex-col gap-3 mb-8">
                <div className="h-10 w-64 bg-white/5 rounded-lg" />
                <div className="h-4 w-96 bg-white/5 rounded-lg" />
            </div>

            <div className="flex gap-3 mb-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-9 w-20 bg-white/5 rounded-lg" />
                ))}
            </div>

            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="break-inside-avoid p-4 rounded-2xl bg-white/5 border border-white/5">
                        <div className="aspect-video bg-white/5 rounded-xl mb-4" />
                        <div className="h-4 w-3/4 bg-white/5 rounded-md mb-2" />
                        <div className="h-3 w-1/2 bg-white/5 rounded-md" />
                    </div>
                ))}
            </div>
        </div>
    );
}
