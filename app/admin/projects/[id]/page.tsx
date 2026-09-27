import Image from "next/image";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getProject } from "@/lib/db";
import { STACK_GROUPS } from "@/lib/stack";
import { deleteProjectAction, saveProjectAction } from "../../actions";
import { ConfirmButton } from "@/components/admin/confirmButton";
import { Field, Notice, PageHeader, Timestamps, buttonClass, inputClass } from "@/components/admin/ui";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string; saved?: string }> }

export default async function EditProject({ params, searchParams }: Props) {
    await requireAdmin()
    const { id } = await params
    const { error, saved } = await searchParams
    const project = id === 'new' ? null : await getProject(Number(id))
    if (id !== 'new' && !project) notFound()

    return (
        <>
            <PageHeader title={project ? 'Edit project' : 'New project'} back="/admin/projects" />
            {project && <Timestamps created={project.created_at} updated={project.updated_at} />}
            <Notice error={error} saved={saved} />
            <form action={saveProjectAction} className="space-y-5">
                {project && <input type="hidden" name="id" value={project.id} />}
                <Field label="Title">
                    <input name="title" required defaultValue={project?.title} className={inputClass} />
                </Field>
                <Field label="Description">
                    <textarea name="description" rows={5} defaultValue={project?.description} className={inputClass} />
                </Field>
                <div className="grid gap-5 sm:grid-cols-[1fr_8rem]">
                    <Field label="Link" hint="Optional. Clicking the card image opens this.">
                        <input type="url" name="link_url" placeholder="https://" defaultValue={project?.link_url ?? ''} className={inputClass} />
                    </Field>
                    <Field label="Order" hint="Lower shows first.">
                        <input type="number" name="sort_order" step={1} defaultValue={project?.sort_order ?? 0} className={inputClass} />
                    </Field>
                </div>
                <Field label="Image" hint="PNG, JPG, WebP or GIF, up to 10 MB. Leave empty to keep the current image.">
                    {project?.image_url && (
                        <div className="relative mb-3 h-40 w-64 overflow-hidden rounded-lg border">
                            <Image src={project.image_url} alt="Current image" fill sizes="256px" className="object-cover object-left" />
                        </div>
                    )}
                    <input type="file" name="image" accept="image/png,image/jpeg,image/webp,image/gif" className="text-sm" />
                </Field>
                <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="open_source" defaultChecked={project?.open_source} className="size-4" />
                    Open source (shown under &quot;Open Source&quot; on the homepage instead of &quot;Projects&quot;)
                </label>
                <fieldset className="space-y-4">
                    <legend className="mb-2 text-sm font-medium">Stack</legend>
                    {Object.entries(STACK_GROUPS).map(([group, icons]) => (
                        <div key={group}>
                            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">{group}</p>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3 md:grid-cols-4">
                                {Object.entries(icons).map(([key, { label, src, mono }]) => (
                                    <label key={key} className="flex cursor-pointer items-center gap-2 text-sm">
                                        <input type="checkbox" name="stack" value={key} defaultChecked={project?.stack.includes(key)} className="size-4" />
                                        <Image src={src} alt="" width={18} height={18} className={`object-contain ${mono ? 'dark:invert' : ''}`} />
                                        {label}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </fieldset>
                <button className={buttonClass}>Save</button>
            </form>
            {project && (
                <form action={deleteProjectAction} className="mt-10 border-t pt-6">
                    <input type="hidden" name="id" value={project.id} />
                    <ConfirmButton message={`Delete "${project.title}"? This can't be undone.`} className="cursor-pointer text-sm text-destructive hover:underline">
                        Delete project
                    </ConfirmButton>
                </form>
            )}
        </>
    )
}
