import { Marked } from 'marked'

export type TocEntry = { id: string; text: string }

function slugify(text: string) {
    return text.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'section'
}

// Post bodies are written only by the authenticated admin, so raw HTML in
// markdown is allowed on purpose (embeds, figures). Sanitize if that changes.
export function renderMarkdown(md: string) {
    const toc: TocEntry[] = []
    const seen = new Map<string, number>()
    const marked = new Marked({
        renderer: {
            heading({ tokens, depth }) {
                const html = this.parser.parseInline(tokens)
                const text = html.replace(/<[^>]+>/g, '')
                const base = slugify(text)
                const n = seen.get(base) ?? 0
                seen.set(base, n + 1)
                const id = n ? `${base}-${n}` : base
                if (depth === 2) toc.push({ id, text })
                return `<h${depth} id="${id}">${html}</h${depth}>`
            },
        },
    })
    return { html: marked.parse(md, { async: false }), toc }
}
