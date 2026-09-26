import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostBySlug } from "@/lib/db";
import { monthYear } from "@/lib/format";
import { renderMarkdown } from "@/lib/markdown";
import { TableOfContents } from "@/components/blog/tableOfContents";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const post = await getPostBySlug((await params).slug)
    return post ? { title: `${post.title} | Rajendra Aurelius Ritmanto`, description: post.excerpt } : {}
}

export default async function PostPage({ params }: Props) {
    const post = await getPostBySlug((await params).slug)
    if (!post) notFound()
    const { html, toc } = renderMarkdown(post.body)

    return (
        <>
        {post.cover_url && (
            <div className="relative h-[30vh] max-h-80 min-h-44 w-full">
                <Image src={post.cover_url} alt="" fill priority sizes="100vw" className="object-cover" />
            </div>
        )}
        <div className="blog mx-auto flex max-w-5xl gap-16 px-4 py-12 md:py-24">
            <article className="min-w-0 max-w-[40rem] flex-1">
                <header className="blog-rise border-b border-(--rule) pb-10">
                    <Link href="/blog" className="font-meta text-(--ink-muted) transition-colors hover:text-(--ink-strong)">
                        Blog
                    </Link>
                    <h1 className="font-editorial mt-10 text-4xl text-(--ink-strong) md:text-[3.25rem]">{post.title}</h1>
                    {post.excerpt && (
                        <p className="mt-5 text-lg leading-relaxed text-(--ink-muted)">{post.excerpt}</p>
                    )}
                    <time dateTime={post.published_at} className="font-meta mt-6 block text-(--ink-muted)">
                        {monthYear(post.published_at)}
                    </time>
                </header>
                <div
                    className="post-body blog-rise mt-10"
                    style={{ '--index': 1 } as React.CSSProperties}
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            </article>
            {toc.length > 0 && (
                <aside className="hidden w-52 shrink-0 xl:block">
                    <div className="sticky top-24">
                        <TableOfContents entries={toc} />
                    </div>
                </aside>
            )}
        </div>
        </>
    )
}
