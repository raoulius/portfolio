import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getPost } from "@/lib/db";
import { deletePostAction, savePostAction } from "../../actions";
import { ConfirmButton } from "@/components/admin/confirmButton";
import { MarkdownEditor } from "@/components/admin/markdownEditor";
import { Field, Notice, PageHeader, buttonClass, inputClass, secondaryButtonClass } from "@/components/admin/ui";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string; saved?: string }> }

export default async function EditPost({ params, searchParams }: Props) {
    await requireAdmin()
    const { id } = await params
    const { error, saved } = await searchParams
    const post = id === 'new' ? null : await getPost(Number(id))
    if (id !== 'new' && !post) notFound()

    return (
        <>
            <PageHeader
                title={post ? 'Edit post' : 'New post'}
                back="/admin/blogs"
                action={post?.published && (
                    <Link href={`/blog/${post.slug}`} target="_blank" className={secondaryButtonClass}>View post</Link>
                )}
            />
            <Notice error={error} saved={saved} />
            <form action={savePostAction} className="space-y-5">
                {post && <input type="hidden" name="id" value={post.id} />}
                <Field label="Title">
                    <input name="title" required defaultValue={post?.title} className={inputClass} />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Slug" hint="The URL: /blog/your-slug. Leave empty to generate it from the title.">
                        <input name="slug" defaultValue={post?.slug} pattern="[a-z0-9]+(-[a-z0-9]+)*" className={inputClass} />
                    </Field>
                    <Field label="Date">
                        <input type="date" name="published_at" required
                               defaultValue={post?.published_at ?? new Date().toISOString().slice(0, 10)} className={inputClass} />
                    </Field>
                </div>
                <Field label="Excerpt" hint="Shown under the title in the blog list.">
                    <textarea name="excerpt" rows={3} defaultValue={post?.excerpt} className={inputClass} />
                </Field>
                <div>
                    <MarkdownEditor name="body" defaultValue={post?.body} />
                    <p className="mt-1 text-xs text-muted-foreground">
                        Markdown. Select text and use the buttons or shortcuts to format it. ## headings appear in the
                        &apos;On this page&apos; list. HTML such as &lt;figure&gt; also works.
                    </p>
                </div>
                <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="published" defaultChecked={post?.published} className="size-4" />
                    Published (visible on the site)
                </label>
                <button className={buttonClass}>Save</button>
            </form>
            {post && (
                <form action={deletePostAction} className="mt-10 border-t pt-6">
                    <input type="hidden" name="id" value={post.id} />
                    <ConfirmButton message={`Delete "${post.title}"? This can't be undone.`} className="cursor-pointer text-sm text-destructive hover:underline">
                        Delete post
                    </ConfirmButton>
                </form>
            )}
        </>
    )
}
