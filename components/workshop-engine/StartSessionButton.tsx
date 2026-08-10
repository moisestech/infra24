'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function StartSessionButton({
  venueConfigId = 'oolite',
  label = 'Start live session',
}: {
  venueConfigId?: string
  label?: string
}) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function start() {
    setBusy(true)
    setError(null)
    try {
      const res = await fetch('/api/workshop-live-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workshopSlug: 'resin-printing',
          venueConfigId,
        }),
      })
      const json = (await res.json()) as {
        session?: { joinCode: string }
        error?: string
      }
      if (!res.ok || !json.session) {
        throw new Error(json.error || 'Could not create session')
      }
      router.push(`/facilitate/${json.session.joinCode}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create session')
      setBusy(false)
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={busy}
        onClick={() => void start()}
        className="rounded-md bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
      >
        {busy ? 'Creating…' : label}
      </button>
      {error ? <p className="text-sm text-amber-800">{error}</p> : null}
    </div>
  )
}
