import { getFile, getSetting } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    const id = await getSetting('resume_file_id')
    const file = id ? await getFile(id) : undefined
    // Nothing uploaded yet: fall back to the resume shipped in /public.
    if (!file) return Response.redirect(new URL('/resume.pdf', req.url))
    return new Response(new Uint8Array(file.data), {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${file.name.replace(/[^\w.-]/g, '_')}"`,
            'Cache-Control': 'no-cache',
        },
    })
}
