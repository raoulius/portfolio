import Link from "next/link";
import type { Metadata } from "next";
import { isAdmin } from "@/lib/auth";
import { logoutAction } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin", robots: { index: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const signedIn = await isAdmin()
    return (
        <div className="min-h-screen">
            <header className="border-b">
                <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 text-sm">
                    <Link href="/admin" className="font-semibold">Admin</Link>
                    <div className="flex items-center gap-5 text-muted-foreground">
                        <Link href="/" className="hover:text-foreground">View site</Link>
                        {signedIn && (
                            <form action={logoutAction}>
                                <button className="cursor-pointer hover:text-foreground">Sign out</button>
                            </form>
                        )}
                    </div>
                </div>
            </header>
            <main className="mx-auto max-w-4xl px-4 py-10">{children}</main>
        </div>
    )
}
