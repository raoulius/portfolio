import type { Metadata } from "next";
import { Newsreader, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Geist is the site font; Newsreader for editorial headings, Geist Mono for code.
const newsreader = Newsreader({
    subsets: ['latin'],
    style: ['normal', 'italic'],
    variable: '--font-newsreader',
})

const geist = Geist({
    subsets: ['latin'],
    variable: '--font-geist',
})

const geistMono = Geist_Mono({
    subsets: ['latin'],
    variable: '--font-geist-mono',
})

export const metadata: Metadata = {
    title: "Rajendra Aurelius Ritmanto | Portfolio Website",
    description: "Portfolio Website",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${geist.className} ${newsreader.variable} ${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
        <head>
            {/* runs before paint so a saved dark theme doesn't flash white */}
            <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}` }} />
        </head>
        <body>
        {children}
        </body>
        </html>
    );
}