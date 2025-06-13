import Hero from "@/components/Hero";
import Grid from "@/components/Grid";
import Tech from "@/components/Tech";
import Projects from "@/components/Projects";
import AboutMe from "@/components/AboutMe";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative bg-black min-h-screen flex justify-center items-center flex-col overflow-hidden mx-auto">
      <div className="w-screen">
        <Hero />
        <Tech />
        <Grid />
        <Projects />
        <AboutMe />
        <Footer />
      </div>
    </main>
  );
}
