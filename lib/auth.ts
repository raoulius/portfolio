import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createHmac, timingSafeEqual } from 'node:crypto'

// ponytail: single admin, password from env, no login rate limit.
// Add attempt throttling if this ever sits behind a guessable password.
const COOKIE = 'admin_session'

function sessionToken() {
    const secret = process.env.SESSION_SECRET
    if (!secret) throw new Error('SESSION_SECRET is not set')
    return createHmac('sha256', secret).update('admin').digest('hex')
}

function safeEqual(a: string, b: string) {
    const x = Buffer.from(a), y = Buffer.from(b)
    return x.length === y.length && timingSafeEqual(x, y)
}

export async function isAdmin() {
    const value = (await cookies()).get(COOKIE)?.value
    return !!value && safeEqual(value, sessionToken())
}

export async function requireAdmin() {
    if (!(await isAdmin())) redirect('/admin/login')
}

export async function signIn(password: string) {
    const expected = process.env.ADMIN_PASSWORD
    if (!expected) throw new Error('ADMIN_PASSWORD is not set')
    if (!safeEqual(password, expected)) return false
    ;(await cookies()).set(COOKIE, sessionToken(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
    })
    return true
}

export async function signOut() {
    (await cookies()).delete(COOKIE)
}
