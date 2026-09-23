import { NotFoundActions } from "@/components/notFoundActions";

export default function NotFound() {
    return (
        <main className="flex min-h-screen items-center justify-center px-4">
            <div>
                <p className="text-5xl font-semibold text-muted-foreground">404</p>
                <h1 className="mt-3 text-lg font-medium">There&apos;s nothing at this address.</h1>
                <NotFoundActions />
            </div>
        </main>
    )
}
