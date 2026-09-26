'use client'
import { useRef, useState } from "react";
import { Bold, Code, ImageIcon, Italic, Link } from "lucide-react";
import { uploadPostImageAction } from "@/app/admin/actions";

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
    const fileRef = useRef<HTMLInputElement>(null)
    const [uploading, setUploading] = useState(false)
    const [text, setText] = useState(defaultValue ?? '')
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
        setText(t.value)
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

    // Uploads the picked image and puts it on its own line, at the line number the author chooses.
    async function insertImage(file: File) {
        const t = ref.current!
        const lines = t.value.split('\n')
        const current = t.value.slice(0, t.selectionStart).split('\n').length
        const answer = window.prompt(`Put the image on which line? (1 to ${lines.length + 1})`, String(current))
        const line = Number(answer)
        if (!answer || !Number.isInteger(line)) return t.focus()

        setUploading(true)
        const form = new FormData()
        form.set('image', file)
        const result = await uploadPostImageAction(form).catch(() => ({ error: 'Upload failed.' }))
        setUploading(false)
        if ('error' in result) return window.alert(result.error)

        const alt = file.name.replace(/\.[^.]+$/, '').replace(/[[\]]/g, '')
        const image = `![${alt}](${result.url})`
        const at = Math.min(Math.max(line - 1, 0), lines.length)
        // blank lines around it so markdown renders it as its own block
        const block = [image]
        if (at > 0 && lines[at - 1].trim()) block.unshift('')
        if (at < lines.length && lines[at].trim()) block.push('')
        lines.splice(at, 0, ...block)
        const row = lines.indexOf(image, at)
        const start = lines.slice(0, row).reduce((n, l) => n + l.length + 1, 0)
        replace(0, t.value.length, lines.join('\n'), start, start + image.length)
        // programmatic edits don't scroll the box to the caret; show the new line once the mirror re-renders
        requestAnimationFrame(() => t.previousElementSibling?.children[row]?.scrollIntoView({ block: 'nearest' }))
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
                    <button
                        type="button"
                        title="Image"
                        aria-label="Insert image"
                        disabled={uploading}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => fileRef.current?.click()}
                        className="cursor-pointer rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted disabled:cursor-wait disabled:opacity-50"
                    >
                        <ImageIcon size={16} strokeWidth={2.25} aria-hidden />
                    </button>
                    {/* no name: stays out of the post form's submission */}
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif"
                        hidden
                        onChange={(e) => {
                            const file = e.target.files?.[0]
                            e.target.value = ''
                            if (file) insertImage(file)
                        }}
                    />
                </div>
            </div>
            {/* The mirror below renders the same text invisibly, one block per line, so each number sits
                beside its line even when it wraps. It also sets the textarea's height; the outer box scrolls both together. */}
            <div className="h-[36rem] min-h-40 resize-y overflow-y-auto rounded-b-md">
            <div className="relative min-h-full font-mono text-sm leading-relaxed [font-variant-ligatures:none]">
                <div aria-hidden className="rounded-b-md py-2 pr-3 pl-12 break-words whitespace-pre-wrap">
                    {text.split('\n').map((line, i) => (
                        <div key={i} className="relative">
                            <span className="absolute -left-12 w-9 text-right text-xs leading-[inherit] text-muted-foreground/60 select-none">{i + 1}</span>
                            <span className="text-transparent">{line || ' '}</span>
                        </div>
                    ))}
                </div>
                <textarea
                    ref={ref}
                    id={`${name}-editor`}
                    name={name}
                    defaultValue={defaultValue}
                    onKeyDown={onKeyDown}
                    onSelect={refreshActive}
                    onInput={(e) => setText(e.currentTarget.value)}
                    className="absolute inset-0 block size-full resize-none overflow-hidden rounded-b-md bg-transparent py-2 pr-3 pl-12 break-words whitespace-pre-wrap outline-none"
                />
            </div>
            </div>
        </div>
    )
}
