import { DatabaseSync, type SQLInputValue } from 'node:sqlite'

// Reuse one connection across dev hot-reloads.
const g = globalThis as unknown as { sqlite?: DatabaseSync }

function conn() {
    if (!g.sqlite) {
        // Tables are created by `npm run db:setup`; this only opens the file.
        g.sqlite = new DatabaseSync(process.env.DATABASE_PATH ?? 'data/portfolio.db')
        g.sqlite.exec('pragma journal_mode = wal; pragma busy_timeout = 5000')
    }
    return g.sqlite
}

// Placeholders are ?1, ?2, ... (numbered like pg's $1). ponytail: sync driver, fine for one small site.
export const db = {
    query: <R>(sql: string, values: SQLInputValue[] = []) => ({ rows: conn().prepare(sql).all(...values) as R[] }),
}

// SQLite error code for a unique constraint violation.
export const UNIQUE_VIOLATION = 2067

export type Project = {
    id: number
    title: string
    description: string
    image_url: string | null
    link_url: string | null
    stack: string[]
    sort_order: number
    open_source: boolean
    created_at: string
    updated_at: string
}

export type Post = {
    id: number
    slug: string
    title: string
    excerpt: string
    body: string
    cover_url: string | null
    published: boolean
    published_at: string // YYYY-MM-DD
    created_at: string
    updated_at: string
}

const POST_COLS = 'id, slug, title, excerpt, body, cover_url, published, published_at, created_at, updated_at'

// SQLite has no boolean or array columns: published is 0/1 and stack is JSON text.
const toPost = (p: Post) => ({ ...p, published: Boolean(p.published) })
type ProjectRow = Omit<Project, 'stack' | 'open_source'> & { stack: string; open_source: number }
const toProject = (p: ProjectRow): Project => ({ ...p, stack: JSON.parse(p.stack), open_source: Boolean(p.open_source) })

export async function getProjects() {
    return db.query<ProjectRow>('select * from projects order by sort_order, id').rows.map(toProject)
}

export async function getProject(id: number) {
    const row = db.query<ProjectRow>('select * from projects where id = ?1', [id]).rows[0]
    return row && toProject(row)
}

export async function getPosts({ includeDrafts = false, oldestFirst = false } = {}) {
    return db.query<Post>(
        `select ${POST_COLS} from posts ${includeDrafts ? '' : 'where published'}
         order by published_at ${oldestFirst ? 'asc' : 'desc'}, id ${oldestFirst ? 'asc' : 'desc'}`,
    ).rows.map(toPost)
}

export async function getPostBySlug(slug: string) {
    const row = db.query<Post>(`select ${POST_COLS} from posts where slug = ?1 and published`, [slug]).rows[0]
    return row && toPost(row)
}

export async function getPost(id: number) {
    const row = db.query<Post>(`select ${POST_COLS} from posts where id = ?1`, [id]).rows[0]
    return row && toPost(row)
}

export async function getSetting(key: string) {
    return db.query<{ value: string }>('select value from settings where key = ?1', [key]).rows[0]?.value
}

export async function getFile(id: string) {
    return db.query<{ name: string; content_type: string; data: Uint8Array }>(
        'select name, content_type, data from files where id = ?1', [id],
    ).rows[0]
}
