import Image from "next/image";
import Hero from "@/components/Hero";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { FaEnvelope, FaHome, FaProjectDiagram } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import Grid from "@/components/Grid";

export default function Home() {
  return (
    <main className="relative bg-black flex justify-center items-center flex-col overflow-hidden mx-auto">
      <div className="w-screen">
        <FloatingNav 
          navItems={[
            {name: "Home", link: "/", icon: <FaHome />},
            {name: "About", link: "/about", icon: <FaUser />},
            {name: "Projects", link: "/projects", icon: <FaProjectDiagram />},
            {name: "Contact", link: "/contact", icon: <FaEnvelope />},
          ]}
        />
        <Hero />
        <Grid />
      </div>
    </main>
  );
}
