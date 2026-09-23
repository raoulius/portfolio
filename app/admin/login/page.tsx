import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { loginAction } from "../actions";
import { Field, Notice, buttonClass, inputClass } from "@/components/admin/ui";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
    if (await isAdmin()) redirect('/admin')
    const { error } = await searchParams
    return (
        <div className="mx-auto max-w-sm pt-10">
            <h1 className="mb-6 text-2xl font-semibold tracking-tight">Sign in</h1>
            <Notice error={error} />
            <form action={loginAction} className="space-y-4">
                <Field label="Password">
                    <input type="password" name="password" required autoFocus autoComplete="current-password" className={inputClass} />
                </Field>
                <button className={buttonClass}>Sign in</button>
            </form>
        </div>
    )
}
