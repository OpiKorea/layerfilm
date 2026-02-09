import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
            <div className="relative">
                <h1 className="text-[12rem] font-black text-white/5 select-none">404</h1>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <h2 className="text-4xl font-black text-white mb-2">LOST IN SPACE</h2>
                    <p className="text-slate-400 max-w-md mx-auto mb-8 font-medium">
                        The idea you&apos;re looking for has drifted into a black hole or never existed in this dimension.
                    </p>
                    <Link
                        href="/"
                        className="px-8 py-3 bg-accent hover:bg-accent/80 text-white font-black rounded-full transition-all shadow-lg shadow-accent/20 active:scale-95"
                    >
                        RETURN TO GRID
                    </Link>
                </div>
            </div>

            {/* Decorative stars/particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse" />
                <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-accent rounded-full animate-ping" />
                <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-purple-500 rounded-full animate-pulse" />
            </div>
        </div>
    );
}
