import { getFile, getSetting } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
    const id = await getSetting('resume_file_id')
    const file = id ? await getFile(id) : undefined
    // Nothing uploaded yet: fall back to the resume shipped in /public.
    // Relative Location on purpose: behind a proxy req.url is the internal host (localhost:3000).
    if (!file) return new Response(null, { status: 307, headers: { Location: '/resume.pdf' } })
    return new Response(new Uint8Array(file.data), {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${file.name.replace(/[^\w.-]/g, '_')}"`,
            'Cache-Control': 'no-cache',
        },
    })
}
