import { useFormStatus } from "react-dom"

import { Button } from "@/components/ui/button"

export default function ResendButton() {
    const { pending } = useFormStatus()

    return <Button type="submit" className="bg-white text-black py-2 px-4 rounded disabled:bg-slate-50 disabled:text-slate-500" disabled={pending ? true : false}>Send verification link {pending ? '...' : ''}</Button>
}
