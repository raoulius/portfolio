import type { Metadata } from "next";
import { Roboto, Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";

const roboto = Roboto({
    weight : '400',
    subsets: ['latin'],
})

const inter = Inter({
    weight : '400',
    subsets: ['latin'],
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
        <html lang="en" className={inter.className}>
        <body>
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="ml-64 flex-1 overflow-y-auto h-full">
                {children}
            </main>
        </div>
        </body>
        </html>
    );
}