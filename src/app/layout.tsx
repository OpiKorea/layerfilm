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
import { Footer } from "@/components/layout/Footer";
import { MainLoader } from "@/components/layout/MainLoader";

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
            <MainLoader />
            <Navbar />
            <main className="flex-1 pt-36 pb-12 w-full">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster invert richColors position="bottom-right" />
        </LanguageProvider>
      </body>
    </html>
  );
}
