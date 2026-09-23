import Link from "next/link";
import { FileText, FolderKanban, NotebookPen } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { db, getSetting } from "@/lib/db";

export default async function AdminHome() {
    await requireAdmin()
    const [{ rows: [counts] }, resumeId] = await Promise.all([
        db.query<{ posts: number; drafts: number; projects: number }>(
            `select (select count(*) from posts where published)::int as posts,
                    (select count(*) from posts where not published)::int as drafts,
                    (select count(*) from projects)::int as projects`),
        getSetting('resume_file_id'),
    ])

    const cards = [
        { href: '/admin/blogs', icon: NotebookPen, title: 'Blogs', detail: `${counts.posts} published, ${counts.drafts} drafts` },
        { href: '/admin/projects', icon: FolderKanban, title: 'Projects', detail: `${counts.projects} projects` },
        { href: '/admin/resume', icon: FileText, title: 'Resume', detail: resumeId ? 'Uploaded PDF in use' : 'Using the bundled resume.pdf' },
    ]

    return (
        <>
            <h1 className="mb-8 text-2xl font-semibold tracking-tight">Content</h1>
            <div className="grid gap-4 sm:grid-cols-3">
                {cards.map(({ href, icon: Icon, title, detail }) => (
                    <Link key={href} href={href} className="rounded-xl border p-5 transition-colors hover:border-foreground">
                        <Icon size={22} aria-hidden />
                        <h2 className="mt-4 font-medium">{title}</h2>
                        <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
                    </Link>
                ))}
            </div>
        </>
    )
}
