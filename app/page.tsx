import Projects from "@/components/projects";

export default function Home() {
    return (
        <div className="relative min-h-screen bg-white">
            <main className="relative z-10 flex w-full flex-col py-32 px-6 md:px-16 overflow-x-hidden">
                <div className="w-full max-w-6xl mx-auto">
                    <Projects />
                </div>
            </main>
        </div>
    );
}