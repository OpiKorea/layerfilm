import "./globals.css"; 

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="notranslate" suppressHydrationWarning>
      <head><meta name="google" content="notranslate" /></head>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}