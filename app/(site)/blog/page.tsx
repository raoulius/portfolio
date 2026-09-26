import Link from "next/link";
import type { Metadata } from "next";
import { getPosts } from "@/lib/db";
import { monthYear } from "@/lib/format";
import { SortSelect } from "@/components/blog/sortSelect";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Blog | Rajendra Aurelius Ritmanto",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const sort = (await searchParams).sort === "oldest" ? "oldest" : "newest";
  const posts = await getPosts({ oldestFirst: sort === "oldest" });

  return (
    <div className="blog mx-auto max-w-2xl px-4 py-12 md:py-28">
      <header className="blog-rise">
        <h1 className="font-editorial mt-4 text-5xl text-(--ink-strong) md:text-6xl">
          Blogs
        </h1>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <p className="max-w-md text-[1.0625rem] leading-relaxed text-(--ink-muted)">
            Personal brain dumps and think pieces
          </p>
          <SortSelect value={sort} />
        </div>
      </header>

      {posts.length === 0 ? (
        <p className="mt-12 border-t border-(--rule) pt-10 text-(--ink-muted)">
          Nothing published yet.
        </p>
      ) : (
        <ul className="mt-12 border-t border-(--rule)">
          {posts.map((post, index) => (
            <li
              key={post.id}
              className="blog-rise border-b border-(--rule)"
              style={{ "--index": index + 1 } as React.CSSProperties}
            >
              <Link href={`/blog/${post.slug}`} className="group block py-7">
                <div className="flex items-baseline justify-between gap-6">
                  <h2 className="font-editorial text-2xl text-(--ink-strong) transition-opacity group-hover:opacity-60">
                    {post.title}
                  </h2>
                  <time
                    dateTime={post.published_at}
                    className="font-meta shrink-0 text-(--ink-muted)"
                  >
                    {monthYear(post.published_at)}
                  </time>
                </div>
                {post.excerpt && (
                  <p className="mt-2.5 max-w-xl text-[0.9375rem] leading-relaxed text-(--ink-muted)">
                    {post.excerpt}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
