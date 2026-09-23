import { Sidebar } from "@/components/sidebar";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Sidebar />
            <main className="md:ml-64">
                {children}
            </main>
        </>
    );
}
