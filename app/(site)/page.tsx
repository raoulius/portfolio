import Link from "next/link";
import Projects from "@/components/projects";
import { getPosts } from "@/lib/db";

export const dynamic = "force-dynamic";

// Markdown to a plain one-paragraph preview, for posts without an excerpt.
function plain(md: string) {
    return md
        .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/<[^>]+>|[#>*_`~]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
}

async function LatestPost() {
    const [post] = await getPosts()
    if (!post) return null
    return (
        <Link
            href={`/blog/${post.slug}`}
            className="reveal group flex flex-col overflow-hidden rounded-xl border border-(--rule) bg-(--surface) transition-shadow duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] md:flex-row"
        >
            <div className="flex shrink-0 items-center gap-2.5 bg-[#EDF3EC] px-6 py-3 text-[#346538] md:w-60 md:py-0 dark:bg-[#346538]/20 dark:text-[#A8D5A2]">
                <span className="size-1.5 rounded-full bg-current" aria-hidden />
                <span className="font-meta tracking-[0.18em]">Newest blog post</span>
            </div>
            <div className="min-w-0 flex-1 px-6 py-5">
                <h2 className="font-editorial text-xl text-(--ink-strong) transition-opacity group-hover:opacity-60">{post.title}</h2>
                <p className="mt-1.5 line-clamp-3 text-[0.9375rem] leading-relaxed text-(--ink-muted)">
                    {post.excerpt || plain(post.body)}
                </p>
            </div>
            <div className="flex shrink-0 items-center px-6 pb-5 md:pb-0">
                <time dateTime={post.published_at} className="font-mono text-xs text-(--ink-muted)">{post.published_at}</time>
            </div>
        </Link>
    )
}

export default function Home() {
    return (
        <div className="site relative min-h-screen bg-background">
            <main className="relative z-10 flex w-full flex-col pt-6 pb-8 md:pt-10 md:pb-32 px-4 md:px-8 lg:px-16 overflow-x-hidden">
                <div className="w-full max-w-6xl mx-auto">
                    <LatestPost />
                    <Projects openSource={false} title="Projects" />
                    <Projects openSource title="Open Source" subtitle="Projects I maintain or contributed to" />
                </div>
            </main>
        </div>
    );
}
