'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function NotFoundActions() {
    const router = useRouter()
    const [seconds, setSeconds] = useState(3)

    useEffect(() => {
        if (seconds === 0) {
            router.push('/')
            return
        }
        const t = setTimeout(() => setSeconds((s) => s - 1), 1000)
        return () => clearTimeout(t)
    }, [seconds, router])

    return (
        <>
            <div className="mt-8 flex gap-3">
                <button onClick={() => router.push('/')} className="cursor-pointer rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90">
                    Go home
                </button>
                <button onClick={() => router.back()} className="cursor-pointer rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">
                    Go back
                </button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
                Heading home in {seconds}...
            </p>
        </>
    )
}
