'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { normalizeJoinCode } from '@/lib/workshop-engine/join-code'

export function JoinSessionForm() {
  const router = useRouter()
  const [code, setCode] = useState('')

  return (
    <form
      className="flex flex-wrap items-center gap-2"
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
        className="rounded-md border border-neutral-300 px-3 py-2 text-sm uppercase tracking-widest"
        maxLength={8}
        required
      />
      <button
        type="submit"
        className="rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium"
      >
        Join
      </button>
    </form>
  )
}
