// "2026-05-14" -> "May 2026"
export function monthYear(date: string) {
    return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}
