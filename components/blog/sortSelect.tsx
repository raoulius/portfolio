'use client'
import { useRouter } from "next/navigation";

export function SortSelect({ value }: { value: string }) {
    const router = useRouter()
    return (
        <select
            aria-label="Sort posts"
            value={value}
            onChange={(e) => router.push(e.target.value === 'oldest' ? '/blog?sort=oldest' : '/blog')}
            className="font-meta shrink-0 cursor-pointer rounded-md border border-(--rule) bg-transparent px-2.5 py-1.5 text-(--ink-muted) outline-none transition-colors hover:text-(--ink-strong) focus-visible:ring-2 focus-visible:ring-ring/50"
        >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
        </select>
    )
}
