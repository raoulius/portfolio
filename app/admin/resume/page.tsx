import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { uploadResumeAction } from "../actions";
import { Field, Notice, PageHeader, buttonClass, secondaryButtonClass } from "@/components/admin/ui";

export default async function AdminResume({ searchParams }: { searchParams: Promise<{ error?: string; saved?: string }> }) {
    await requireAdmin()
    const { error, saved } = await searchParams
    const { rows: [current] } = await db.query<{ name: string; uploaded: string; kb: number }>(
        `select f.name, f.created_at as uploaded, length(f.data) / 1024 as kb
         from settings s join files f on f.id = s.value where s.key = 'resume_file_id'`)

    return (
        <>
            <PageHeader title="Resume" back="/admin" />
            <Notice error={error} saved={saved} />
            <div className="mb-8 flex items-center justify-between gap-4 rounded-xl border p-4">
                <div className="text-sm">
                    <p className="font-medium">{current ? current.name : 'resume.pdf (bundled with the site)'}</p>
                    <p className="text-muted-foreground">
                        {current ? `Uploaded ${new Date(`${current.uploaded}Z`).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}, ${current.kb} KB` : 'No resume uploaded yet'}
                    </p>
                </div>
                <a href="/resume" target="_blank" className={secondaryButtonClass}>Open</a>
            </div>
            <form action={uploadResumeAction} className="space-y-5">
                <Field label="Replace resume" hint="PDF, up to 10 MB. The sidebar's Resume link serves it immediately.">
                    <input type="file" name="resume" accept="application/pdf" required className="text-sm" />
                </Field>
                <button className={buttonClass}>Upload</button>
            </form>
        </>
    )
}
