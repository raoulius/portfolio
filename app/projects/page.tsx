import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Projects from "@/components/projects";

export default function Home() {
    return (
        <div className="min-h-screen bg-white">
            <main className="relative z-10 flex flex-col py-32 px-16">
                <Projects />
            </main>
        </div>
    );
}