// "2026-05-14" -> "May 2026"
export function monthYear(date: string) {
    return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

// SQLite current_timestamp (UTC, "2026-09-25 07:48:43") -> "25 Sep 2026, 07:48" in the server's timezone
export function dateTime(utc: string) {
    return new Date(`${utc.replace(' ', 'T')}Z`).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })
}
