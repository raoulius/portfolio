import { Pool } from 'pg'

// Reuse one pool across dev hot-reloads.
const g = globalThis as unknown as { pgPool?: Pool }
export const db = (g.pgPool ??= new Pool({ connectionString: process.env.DATABASE_URL }))

export type Project = {
    id: number
    title: string
    description: string
    image_url: string | null
    link_url: string | null
    stack: string[]
    sort_order: number
}

export type Post = {
    id: number
    slug: string
    title: string
    excerpt: string
    body: string
    published: boolean
    published_at: string // YYYY-MM-DD
}

const POST_COLS = "id, slug, title, excerpt, body, published, to_char(published_at, 'YYYY-MM-DD') as published_at"

export async function getProjects() {
    return (await db.query<Project>('select * from projects order by sort_order, id')).rows
}

export async function getProject(id: number) {
    return (await db.query<Project>('select * from projects where id = $1', [id])).rows[0]
}

export async function getPosts({ includeDrafts = false, oldestFirst = false } = {}) {
    return (await db.query<Post>(
        `select ${POST_COLS} from posts ${includeDrafts ? '' : 'where published'}
         order by published_at ${oldestFirst ? 'asc' : 'desc'}, id ${oldestFirst ? 'asc' : 'desc'}`,
    )).rows
}

export async function getPostBySlug(slug: string) {
    return (await db.query<Post>(`select ${POST_COLS} from posts where slug = $1 and published`, [slug])).rows[0]
}

export async function getPost(id: number) {
    return (await db.query<Post>(`select ${POST_COLS} from posts where id = $1`, [id])).rows[0]
}

export async function getSetting(key: string) {
    return (await db.query<{ value: string }>('select value from settings where key = $1', [key])).rows[0]?.value
}

export async function getFile(id: string) {
    return (await db.query<{ name: string; content_type: string; data: Buffer }>(
        'select name, content_type, data from files where id = $1', [id],
    )).rows[0]
}
