'use client'
import { useEffect, useState } from "react";
import type { TocEntry } from "@/lib/markdown";

export function TableOfContents({ entries }: { entries: TocEntry[] }) {
    const [active, setActive] = useState(entries[0]?.id)

    useEffect(() => {
        const headings = entries.map((e) => document.getElementById(e.id)).filter((el): el is HTMLElement => !!el)
        const observer = new IntersectionObserver(
            (items) => {
                const visible = items.filter((i) => i.isIntersecting)
                if (visible.length) setActive(visible[0].target.id)
            },
            { rootMargin: '0px 0px -70% 0px' },
        )
        headings.forEach((h) => observer.observe(h))
        return () => observer.disconnect()
    }, [entries])

    if (!entries.length) return null
    return (
        <nav aria-label="On this page" className="text-sm">
            <p className="font-meta mb-4 text-(--ink-muted)">On this page</p>
            <ul className="border-l border-(--rule)">
                {entries.map((e) => (
                    <li key={e.id}>
                        <a
                            href={`#${e.id}`}
                            className={`-ml-px block border-l py-1.5 pl-4 leading-snug transition-colors duration-200 ${
                                active === e.id
                                    ? 'border-(--ink-strong) text-(--ink-strong)'
                                    : 'border-transparent text-(--ink-muted) hover:text-(--ink-strong)'
                            }`}
                        >
                            {e.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    )
}
