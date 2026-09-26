import Link from "next/link";
import { dateTime } from "@/lib/format";

export const inputClass = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
export const buttonClass = "cursor-pointer rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
export const secondaryButtonClass = "cursor-pointer rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"

export function Notice({ error, saved }: { error?: string; saved?: string }) {
    if (error) return <p role="alert" className="mb-6 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
    if (saved) return <p role="status" className="mb-6 rounded-md border px-3 py-2 text-sm text-muted-foreground">Saved.</p>
    return null
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-sm font-medium">{label}</span>
            {children}
            {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
        </label>
    )
}

export function PageHeader({ title, back, action }: { title: string; back?: string; action?: React.ReactNode }) {
    return (
        <div className="mb-8">
            {back && <Link href={back} className="text-sm text-muted-foreground hover:text-foreground">Back</Link>}
            <div className="mt-2 flex items-center justify-between gap-4">
                <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                {action}
            </div>
        </div>
    )
}

export function Timestamps({ created, updated }: { created: string; updated: string }) {
    return (
        <p className="mb-6 text-xs text-muted-foreground">
            Created {dateTime(created)} · Updated {dateTime(updated)}
        </p>
    )
}
