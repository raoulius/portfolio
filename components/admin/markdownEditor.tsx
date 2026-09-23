'use client'
import { useRef, useState } from "react";
import { Bold, Code, Italic, Link } from "lucide-react";

type Format = 'bold' | 'italic' | 'code' | 'link'

const MARKERS: Record<Exclude<Format, 'link'>, [string, string]> = {
    bold: ['**', '**'],
    italic: ['_', '_'],
    code: ['`', '`'],
}

const LINK = /^\[([^\]]*)\]\(([^)]*)\)$/

/** Returns the marker pair wrapping the selection (either just outside or included in it), if any. */
function wrapping(value: string, start: number, end: number, [before, after]: [string, string]) {
    if (value.slice(start - before.length, start) === before && value.slice(end, end + after.length) === after) return 'outside'
    const sel = value.slice(start, end)
    if (sel.length >= before.length + after.length && sel.startsWith(before) && sel.endsWith(after)) return 'inside'
    return null
}

function fence(value: string, start: number, end: number) {
    return value.slice(start, end).includes('\n') ? ['```\n', '\n```'] as [string, string] : MARKERS.code
}

export function MarkdownEditor({ name, defaultValue }: { name: string; defaultValue?: string }) {
    const ref = useRef<HTMLTextAreaElement>(null)
    const [active, setActive] = useState<Record<Format, boolean>>({ bold: false, italic: false, code: false, link: false })

    function refreshActive() {
        const t = ref.current
        if (!t) return
        const { value, selectionStart: s, selectionEnd: e } = t
        setActive({
            bold: !!wrapping(value, s, e, MARKERS.bold),
            italic: !!wrapping(value, s, e, MARKERS.italic),
            code: !!wrapping(value, s, e, fence(value, s, e)),
            link: LINK.test(value.slice(s, e)),
        })
    }

    // Replace [from, to) and select [selStart, selEnd); execCommand keeps the browser's undo history.
    function replace(from: number, to: number, text: string, selStart: number, selEnd: number) {
        const t = ref.current!
        t.focus()
        t.setSelectionRange(from, to)
        if (!document.execCommand('insertText', false, text)) t.setRangeText(text, from, to, 'end')
        t.setSelectionRange(selStart, selEnd)
        refreshActive()
    }

    function toggle(format: Format) {
        const t = ref.current
        if (!t) return
        const { value, selectionStart: s, selectionEnd: e } = t
        const selected = value.slice(s, e)

        if (format === 'link') {
            const match = selected.match(LINK)
            if (match) return replace(s, e, match[1], s, s + match[1].length)
            const url = window.prompt('Link URL', 'https://')
            if (!url) return t.focus()
            const text = selected || 'link text'
            return replace(s, e, `[${text}](${url})`, s + 1, s + 1 + text.length)
        }

        const markers = format === 'code' ? fence(value, s, e) : MARKERS[format]
        const [before, after] = markers
        const where = wrapping(value, s, e, markers)
        if (where === 'outside') {
            return replace(s - before.length, e + after.length, selected, s - before.length, e - before.length)
        }
        if (where === 'inside') {
            const inner = selected.slice(before.length, selected.length - after.length)
            return replace(s, e, inner, s, s + inner.length)
        }
        const text = selected || (format === 'code' ? 'code' : 'text')
        replace(s, e, before + text + after, s + before.length, s + before.length + text.length)
    }

    function onKeyDown(e: React.KeyboardEvent) {
        if (!(e.metaKey || e.ctrlKey) || e.shiftKey || e.altKey) return
        const format = ({ b: 'bold', i: 'italic', k: 'link', e: 'code' } as Record<string, Format>)[e.key.toLowerCase()]
        if (!format) return
        e.preventDefault()
        toggle(format)
    }

    const buttons: { format: Format; label: string; keys: string; Icon: typeof Bold }[] = [
        { format: 'bold', label: 'Bold', keys: '⌘B', Icon: Bold },
        { format: 'italic', label: 'Italic', keys: '⌘I', Icon: Italic },
        { format: 'link', label: 'Link', keys: '⌘K', Icon: Link },
        { format: 'code', label: 'Code', keys: '⌘E', Icon: Code },
    ]

    return (
        <div className="rounded-md border focus-within:ring-2 focus-within:ring-ring/50">
            <div className="sticky top-0 z-10 flex items-center justify-between gap-2 rounded-t-md border-b bg-background px-3 py-1.5">
                <label htmlFor={`${name}-editor`} className="text-sm font-medium">Body</label>
                <div role="toolbar" aria-label="Formatting" className="flex gap-1">
                    {buttons.map(({ format, label, keys, Icon }) => (
                        <button
                            key={format}
                            type="button"
                            title={`${label} (${keys})`}
                            aria-label={label}
                            aria-pressed={active[format]}
                            // keep the textarea's selection when clicking a button
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => toggle(format)}
                            className={`cursor-pointer rounded p-1.5 transition-colors hover:bg-muted ${
                                active[format] ? 'bg-muted text-foreground' : 'text-muted-foreground'
                            }`}
                        >
                            <Icon size={16} strokeWidth={2.25} aria-hidden />
                        </button>
                    ))}
                </div>
            </div>
            <textarea
                ref={ref}
                id={`${name}-editor`}
                name={name}
                rows={24}
                defaultValue={defaultValue}
                onKeyDown={onKeyDown}
                onSelect={refreshActive}
                className="block w-full resize-y rounded-b-md bg-background px-3 py-2 font-mono text-sm leading-relaxed [font-variant-ligatures:none] outline-none"
            />
        </div>
    )
}
