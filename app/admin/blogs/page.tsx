import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getPosts } from "@/lib/db";
import { dateTime, monthYear } from "@/lib/format";
import { PageHeader, buttonClass } from "@/components/admin/ui";

export default async function AdminBlogs() {
    await requireAdmin()
    const posts = await getPosts({ includeDrafts: true })
    return (
        <>
            <PageHeader title="Blogs" back="/admin" action={<Link href="/admin/blogs/new" className={buttonClass}>New post</Link>} />
            {posts.length === 0 ? (
                <p className="text-muted-foreground">No posts yet.</p>
            ) : (
                <ul className="divide-y rounded-xl border">
                    {posts.map((post) => (
                        <li key={post.id}>
                            <Link href={`/admin/blogs/${post.id}`} className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-muted">
                                <span className="min-w-0">
                                    <span className="block truncate font-medium">{post.title}</span>
                                    <span className="block text-xs text-muted-foreground">Updated {dateTime(post.updated_at)}</span>
                                </span>
                                <span className="flex shrink-0 items-center gap-3 text-sm text-muted-foreground">
                                    {!post.published && <span className="rounded border px-1.5 text-xs">Draft</span>}
                                    {monthYear(post.published_at)}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </>
    )
}
