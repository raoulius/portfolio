import Projects from "@/components/projects";

export const dynamic = "force-dynamic";

export default function Home() {
    return (
        <div className="site relative min-h-screen bg-background">
            <main className="relative z-10 flex w-full flex-col py-8 md:py-32 px-4 md:px-8 lg:px-16 overflow-x-hidden">
                <div className="w-full max-w-6xl mx-auto">
                    <Projects />
                </div>
            </main>
        </div>
    );
}