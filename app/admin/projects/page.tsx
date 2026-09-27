import Link from "next/link";
import Image from "next/image";
import { requireAdmin } from "@/lib/auth";
import { getProjects } from "@/lib/db";
import { dateTime } from "@/lib/format";
import { PageHeader, buttonClass } from "@/components/admin/ui";

export default async function AdminProjects() {
    await requireAdmin()
    const projects = await getProjects()
    return (
        <>
            <PageHeader title="Projects" back="/admin" action={<Link href="/admin/projects/new" className={buttonClass}>New project</Link>} />
            {projects.length === 0 ? (
                <p className="text-muted-foreground">No projects yet.</p>
            ) : (
                <ul className="divide-y rounded-xl border">
                    {projects.map((project) => (
                        <li key={project.id}>
                            <Link href={`/admin/projects/${project.id}`} className="flex items-center gap-4 px-4 py-3 hover:bg-muted">
                                <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded border bg-muted">
                                    {project.image_url && <Image src={project.image_url} alt="" fill sizes="64px" className="object-cover object-left" />}
                                </div>
                                <span className="min-w-0 flex-1">
                                    <span className="flex items-center gap-2">
                                        <span className="truncate font-medium">{project.title}</span>
                                        {project.open_source && <span className="shrink-0 rounded border px-1.5 text-xs text-muted-foreground">Open source</span>}
                                    </span>
                                    <span className="block text-xs text-muted-foreground">Updated {dateTime(project.updated_at)}</span>
                                </span>
                                <span className="text-sm text-muted-foreground">#{project.sort_order}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </>
    )
}
