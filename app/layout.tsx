import type { Metadata } from "next";
import { Roboto, Inter } from "next/font/google";
import "./globals.css";
import Image from 'next/image';
import MukaRajendra from '../public/selfie rajendra.jpeg'
import github from '../public/github-logo.png'
import linkedin from '../public/linkedin.png'

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
            <aside className="w-64 bg-white border-r p-4 fixed h-full top-0 left-0">
                <nav className="flex flex-col gap-2">
                    <Image src={MukaRajendra} alt="Muka gw" priority width={500}
                           height={300}
                           className="rounded-xl object-cover"/>
                    <h2 className="font-bold">Rajendra Aurelius Ritmanto</h2>
                    <h2 className="font-bold mb-4">Software Engineer</h2>
                    <div className="flex items-center gap-2">
                        <Image src={github} alt="github logo" priority width={20}/>
                        <a href="https://github.com/raoulius" className="hover:text-blue-500">Github</a>
                    </div>
                    <div className="flex items-center gap-2">
                        <Image src={linkedin} alt="linkedin logo" priority width={20}/>
                        <a href="https://www.linkedin.com/in/rajendra-aurelius-3406a1217/" className="hover:text-blue-500">LinkedIn</a>
                    </div>
                    <a href="/resume.pdf" target="_blank" className="hover:text-blue-500">Resume</a>
                    <div>rritmanto@gmail.com</div>
                </nav>
            </aside>
            <main className="ml-64 flex-1 overflow-y-auto h-full">
                {children}
            </main>
        </div>
      </body>
    </html>
  );
}
