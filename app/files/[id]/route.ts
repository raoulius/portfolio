import { getFile } from "@/lib/db";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const file = UUID.test(id) ? await getFile(id) : undefined
    if (!file) return new Response('Not found', { status: 404 })
    return new Response(new Uint8Array(file.data), {
        headers: {
            'Content-Type': file.content_type,
            // ids are never reused: a new upload gets a new id
            'Cache-Control': 'public, max-age=31536000, immutable',
            'X-Content-Type-Options': 'nosniff',
        },
    })
}
