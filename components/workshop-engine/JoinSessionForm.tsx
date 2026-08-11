'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { LogIn } from 'lucide-react'
import { normalizeJoinCode } from '@/lib/workshop-engine/join-code'

export function JoinSessionForm() {
  const router = useRouter()
  const [code, setCode] = useState('')

  return (
    <form
      className="flex flex-wrap items-center gap-2 md:gap-3"
      onSubmit={(e) => {
        e.preventDefault()
        const next = normalizeJoinCode(code)
        if (!next) return
        router.push(`/session/${next}`)
      }}
    >
      <label className="sr-only" htmlFor="join-code">
        Join code
      </label>
      <input
        id="join-code"
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="Join code"
        className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-mono text-sm uppercase tracking-widest text-slate-950 md:px-4 md:py-3 md:text-base 2xl:px-5 2xl:py-3.5 2xl:text-lg"
        maxLength={8}
        required
      />
      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-lg border border-cyan-700 bg-cyan-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-cyan-800 md:px-5 md:py-3 md:text-base 2xl:px-6 2xl:py-3.5 2xl:text-lg"
      >
        <LogIn aria-hidden className="h-4 w-4 md:h-5 md:w-5" />
        Join
      </button>
    </form>
  )
}
