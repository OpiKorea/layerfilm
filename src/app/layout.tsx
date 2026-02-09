import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import Link from "next/link";
import { LanguageProvider } from "@/components/providers/LanguageProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LayerFilm | AI-First Idea Marketplace",
  description: "Join LayerFilm to unlock exclusive ideas, collaborate with AI, and shape the future of storytelling.",
  keywords: ["AI", "Film", "Marketplace", "Ideas", "Storytelling", "LayerFilm"],
};

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground scroll-smooth`}
      >
        <LanguageProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 pt-36 pb-12 w-full">
              {children}
            </main>

            <footer className="border-t border-white/5 py-12 px-6 bg-black/20 backdrop-blur-md mt-20">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-slate-500 text-sm">
                <div className="flex flex-col items-center md:items-start gap-2">
                  <span className="font-black text-white tracking-widest text-lg">LAYERFILM</span>
                  <p>© 2026 AI-First Idea Marketplace | layerfilm@gmail.com</p>
                </div>
                <div className="flex gap-10 font-bold">
                  <Link href="/terms" className="hover:text-accent transition-colors">Terms of Service</Link>
                  <Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link>
                  <Link href="/support" className="hover:text-accent transition-colors">Support</Link>
                </div>
              </div>
            </footer>
          </div>
          <Toaster invert richColors position="bottom-right" />
        </LanguageProvider>
      </body>
    </html>
  );
}
