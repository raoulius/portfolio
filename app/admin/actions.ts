'use server'

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { randomUUID } from "node:crypto";
import { db, UNIQUE_VIOLATION } from "@/lib/db";
import { requireAdmin, signIn, signOut } from "@/lib/auth";
import { STACK_ICONS } from "@/lib/stack";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

// Content-Type comes from the browser, so also check the file's magic bytes.
const SIGNATURES: Record<string, (b: Buffer) => boolean> = {
    'application/pdf': (b) => b.subarray(0, 5).toString('latin1') === '%PDF-',
    'image/png': (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
    'image/jpeg': (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
    'image/webp': (b) => b.subarray(0, 4).toString('latin1') === 'RIFF' && b.subarray(8, 12).toString('latin1') === 'WEBP',
    'image/gif': (b) => b.subarray(0, 4).toString('latin1') === 'GIF8',
}

function fail(path: string, message: string): never {
    redirect(`${path}${path.includes('?') ? '&' : '?'}error=${encodeURIComponent(message)}`)
}

function text(form: FormData, key: string) {
    return String(form.get(key) ?? '').trim()
}

function uploadedFile(form: FormData, key: string) {
    const file = form.get(key)
    return file instanceof File && file.size > 0 ? file : null
}

/** Validates and stores an upload, returning its new file id, or an error message. */
async function storeFile(file: File, allowed: string[]): Promise<{ id: string } | { error: string }> {
    if (file.size > MAX_UPLOAD_BYTES) return { error: 'File is larger than 10 MB.' }
    const data = Buffer.from(await file.arrayBuffer())
    const type = allowed.find((t) => t === file.type && SIGNATURES[t](data))
    if (!type) return { error: `File must be one of: ${allowed.map((t) => t.split('/')[1]).join(', ')}.` }
    const id = randomUUID()
    db.query('insert into files (id, name, content_type, data) values (?1, ?2, ?3, ?4)', [id, file.name.slice(0, 200), type, data])
    return { id }
}

const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']

async function deleteStoredFile(url: string | null | undefined) {
    const id = url?.match(/^\/files\/([0-9a-f-]{36})$/)?.[1]
    if (id) await db.query('delete from files where id = ?1', [id])
}

function refreshSite() {
    revalidatePath('/', 'layout')
}

// ---- auth ----

export async function loginAction(form: FormData) {
    if (!(await signIn(String(form.get('password') ?? '')))) fail('/admin/login', 'Wrong password.')
    redirect('/admin')
}

export async function logoutAction() {
    await signOut()
    redirect('/admin/login')
}

// ---- posts ----

export async function savePostAction(form: FormData) {
    await requireAdmin()
    const id = Number(form.get('id')) || null
    const back = `/admin/blogs/${id ?? 'new'}`

    const title = text(form, 'title')
    const slug = text(form, 'slug') || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const excerpt = text(form, 'excerpt')
    const body = String(form.get('body') ?? '')
    const published = form.get('published') === 'on'
    const date = text(form, 'published_at')

    if (!title) fail(back, 'Title is required.')
    if (!SLUG.test(slug)) fail(back, 'Slug may only contain lowercase letters, numbers and single dashes.')
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) fail(back, 'Date is invalid.')

    const oldCover = id
        ? (await db.query<{ cover_url: string | null }>('select cover_url from posts where id = ?1', [id])).rows[0]?.cover_url ?? null
        : null
    let cover = form.get('remove_cover') === 'on' ? null : oldCover
    const coverFile = uploadedFile(form, 'cover')
    if (coverFile) {
        const stored = await storeFile(coverFile, IMAGE_TYPES)
        if ('error' in stored) fail(back, stored.error)
        cover = `/files/${stored.id}`
    }

    try {
        const values = [title, slug, excerpt, body, published ? 1 : 0, date, cover]
        if (id) {
            await db.query(
                `update posts set title=?1, slug=?2, excerpt=?3, body=?4, published=?5, published_at=?6, cover_url=?7,
                 updated_at=current_timestamp where id=?8`, [...values, id])
            if (oldCover !== cover) await deleteStoredFile(oldCover)
        } else {
            const { rows } = await db.query<{ id: number }>(
                `insert into posts (title, slug, excerpt, body, published, published_at, cover_url)
                 values (?1,?2,?3,?4,?5,?6,?7) returning id`, values)
            refreshSite()
            redirect(`/admin/blogs/${rows[0].id}?saved=1`)
        }
    } catch (e) {
        if ((e as { errcode?: number }).errcode === UNIQUE_VIOLATION) fail(back, 'Another post already uses that slug.')
        throw e
    }
    refreshSite()
    redirect(`${back}?saved=1`)
}

export async function deletePostAction(form: FormData) {
    await requireAdmin()
    const { rows } = await db.query<{ cover_url: string | null }>(
        'delete from posts where id = ?1 returning cover_url', [Number(form.get('id'))])
    await deleteStoredFile(rows[0]?.cover_url)
    refreshSite()
    redirect('/admin/blogs')
}

/** Called from the markdown editor; the returned url is inserted into the post body. */
// ponytail: images removed from a body stay in `files`; sweep ids no post references if it ever matters.
export async function uploadPostImageAction(form: FormData): Promise<{ url: string } | { error: string }> {
    await requireAdmin()
    const file = uploadedFile(form, 'image')
    if (!file) return { error: 'Choose an image to upload.' }
    const stored = await storeFile(file, IMAGE_TYPES)
    return 'error' in stored ? stored : { url: `/files/${stored.id}` }
}

// ---- projects ----

export async function saveProjectAction(form: FormData) {
    await requireAdmin()
    const id = Number(form.get('id')) || null
    const back = `/admin/projects/${id ?? 'new'}`

    const title = text(form, 'title')
    const description = text(form, 'description')
    const link = text(form, 'link_url') || null
    const sortOrder = Number(text(form, 'sort_order') || 0)
    const stack = form.getAll('stack').map(String).filter((key) => key in STACK_ICONS)
    const openSource = form.get('open_source') === 'on' ? 1 : 0

    if (!title) fail(back, 'Title is required.')
    if (link && !/^https?:\/\/\S+$/i.test(link)) fail(back, 'Link must start with http:// or https://')
    if (!Number.isInteger(sortOrder)) fail(back, 'Order must be a whole number.')

    const existing = id
        ? (await db.query<{ image_url: string | null }>('select image_url from projects where id = ?1', [id])).rows[0]
        : undefined
    if (id && !existing) fail('/admin/projects', 'Project not found.')

    let imageUrl = existing?.image_url ?? null
    const image = uploadedFile(form, 'image')
    if (image) {
        const stored = await storeFile(image, IMAGE_TYPES)
        if ('error' in stored) fail(back, stored.error)
        await deleteStoredFile(imageUrl)
        imageUrl = `/files/${stored.id}`
    }

    const values = [title, description, imageUrl, link, JSON.stringify(stack), sortOrder, openSource]
    let savedId = id
    if (id) {
        await db.query(
            `update projects set title=?1, description=?2, image_url=?3, link_url=?4, stack=?5, sort_order=?6,
             open_source=?7, updated_at=current_timestamp where id=?8`, [...values, id])
    } else {
        const { rows } = await db.query<{ id: number }>(
            `insert into projects (title, description, image_url, link_url, stack, sort_order, open_source)
             values (?1,?2,?3,?4,?5,?6,?7) returning id`, values)
        savedId = rows[0].id
    }
    refreshSite()
    redirect(`/admin/projects/${savedId}?saved=1`)
}

export async function deleteProjectAction(form: FormData) {
    await requireAdmin()
    const { rows } = await db.query<{ image_url: string | null }>(
        'delete from projects where id = ?1 returning image_url', [Number(form.get('id'))])
    await deleteStoredFile(rows[0]?.image_url)
    refreshSite()
    redirect('/admin/projects')
}

// ---- resume ----

export async function uploadResumeAction(form: FormData) {
    await requireAdmin()
    const file = uploadedFile(form, 'resume')
    if (!file) fail('/admin/resume', 'Choose a PDF to upload.')
    const stored = await storeFile(file, ['application/pdf'])
    if ('error' in stored) fail('/admin/resume', stored.error)

    const { rows } = await db.query<{ value: string }>("select value from settings where key = 'resume_file_id'")
    await db.query(
        `insert into settings (key, value) values ('resume_file_id', ?1)
         on conflict (key) do update set value = excluded.value`, [stored.id])
    // first upload only; each replacement is a new file, so its created_at is the "updated" time
    await db.query(`insert into settings (key, value) values ('resume_created_at', current_timestamp) on conflict (key) do nothing`)
    if (rows[0]) await db.query('delete from files where id = ?1', [rows[0].value])
    redirect('/admin/resume?saved=1')
}
