'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import QRCode from '@/components/ui/QRCode'
import { RoomTimer } from '@/components/workshop-engine/SafetyAndTimer'
import {
  RESIN_BREAK_MODULE,
  RESIN_PRINTING_MODULES,
  getResinModuleById,
} from '@/lib/workshop-engine/resin-printing'
import type { WorkshopLiveSession } from '@/lib/workshop-engine/types'
import { cn } from '@/lib/utils'

async function fetchSession(code: string): Promise<WorkshopLiveSession | null> {
  const res = await fetch(`/api/workshop-live-sessions/${encodeURIComponent(code)}`, {
    cache: 'no-store',
  })
  if (!res.ok) return null
  const json = (await res.json()) as { session?: WorkshopLiveSession }
  return json.session ?? null
}

export function TvPresentationClient({
  code,
  initialSession,
  origin,
}: {
  code: string
  initialSession: WorkshopLiveSession
  origin: string
}) {
  const [session, setSession] = useState(initialSession)
  const [connected, setConnected] = useState(true)

  useEffect(() => {
    let cancelled = false
    const poll = async () => {
      const next = await fetchSession(code)
      if (cancelled) return
      if (!next) {
        setConnected(false)
        return
      }
      setConnected(true)
      setSession(next)
    }
    const id = window.setInterval(poll, 1500)
    return () => {
      cancelled = true
      window.clearInterval(id)
    }
  }, [code])

  const module = getResinModuleById(session.liveModuleId) ?? RESIN_PRINTING_MODULES[0]
  const joinUrl = `${origin}/session/${session.joinCode}`

  return (
    <div className="relative flex min-h-screen flex-col bg-neutral-950 text-white">
      <div className="pointer-events-none absolute inset-6 rounded-sm border border-white/10" />
      <header className="flex items-start justify-between gap-6 px-12 pt-10">
        <div>
          <p className="text-2xl uppercase tracking-[0.2em] text-neutral-400">
            Module {String(module.order).padStart(2, '0')}
          </p>
          <h1 className="mt-3 max-w-5xl text-6xl font-semibold leading-tight md:text-7xl">
            {session.tvScreen === 'break' ? RESIN_BREAK_MODULE.title : module.title}
          </h1>
        </div>
        <div className="text-right text-sm text-neutral-400">
          <p className={cn(connected ? 'text-emerald-400' : 'text-amber-300')}>
            {connected ? 'Synced' : 'Reconnecting…'}
          </p>
          <p className="mt-1 font-mono tracking-widest text-neutral-300">{session.joinCode}</p>
        </div>
      </header>

      <main className="flex flex-1 flex-col justify-center px-12 py-10">
        {session.tvScreen === 'join' ? (
          <div className="flex flex-wrap items-center gap-12">
            <div className="rounded-lg bg-white p-4">
              <QRCode value={joinUrl} size={260} />
            </div>
            <div>
              <p className="text-3xl text-neutral-300">Scan to join</p>
              <p className="mt-4 font-mono text-7xl tracking-[0.25em]">{session.joinCode}</p>
              <p className="mt-6 max-w-xl text-2xl text-neutral-400">
                Choose Follow class or My pace. No account needed.
              </p>
            </div>
          </div>
        ) : null}

        {session.tvScreen === 'break' ? (
          <div className="space-y-8">
            <p className="max-w-4xl text-4xl text-neutral-200">{RESIN_BREAK_MODULE.tvPrompt}</p>
            <RoomTimer endsAt={session.timerEndsAt} label={session.timerLabel} large />
          </div>
        ) : null}

        {session.tvScreen === 'resources' ? (
          <div className="flex flex-wrap items-center gap-12">
            <div className="rounded-lg bg-white p-4">
              <QRCode value={`${origin}/workshop/resin-printing/resources`} size={220} />
            </div>
            <div>
              <p className="text-5xl font-semibold">Resources</p>
              <p className="mt-4 max-w-2xl text-3xl text-neutral-300">
                Booklet, checklist, glossary, and follow-up pathway.
              </p>
            </div>
          </div>
        ) : null}

        {session.tvScreen === 'complete' ? (
          <div className="space-y-6">
            <p className="text-5xl font-semibold">Session complete</p>
            <p className="max-w-3xl text-3xl text-neutral-300">
              Ready · Repair · Consultation — then book a supervised print appointment.
            </p>
          </div>
        ) : null}

        {session.tvScreen === 'module' ? (
          <div className="space-y-8">
            <p className="max-w-5xl text-5xl font-medium leading-snug text-neutral-50 md:text-6xl">
              {module.tvPrompt}
            </p>
            <p className="max-w-4xl text-3xl text-neutral-400">{module.physicalSample}</p>
            <RoomTimer endsAt={session.timerEndsAt} label={session.timerLabel} large />
          </div>
        ) : null}
      </main>

      <footer className="px-12 pb-10 text-xl text-neutral-500">
        Not certification · Instructor-led equipment · Infra24 workshop engine
      </footer>
    </div>
  )
}

export function useLiveSessionPolling(code: string, initial: WorkshopLiveSession) {
  const [session, setSession] = useState(initial)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    const next = await fetchSession(code)
    if (!next) {
      setError('Could not refresh session')
      return null
    }
    setSession(next)
    setError(null)
    return next
  }, [code])

  useEffect(() => {
    const id = window.setInterval(() => {
      void refresh()
    }, 1500)
    return () => window.clearInterval(id)
  }, [refresh])

  return useMemo(() => ({ session, setSession, error, refresh }), [session, error, refresh])
}
