'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Row = {
  id: string
  telegram_user_id: string
  clerk_user_id: string
  created_at: string
}

export function ControlIdentitiesAdmin({ orgSlug }: { orgSlug: string }) {
  const [rows, setRows] = useState<Row[]>([])
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [telegramId, setTelegramId] = useState('')
  const [clerkId, setClerkId] = useState('')

  const base = `/api/display-admin/${encodeURIComponent(orgSlug)}/control-identities`

  const load = useCallback(async () => {
    setErr(null)
    const res = await fetch(base)
    const j = await res.json()
    if (!res.ok) {
      setErr(j.error || 'Failed to load')
      setRows([])
      return
    }
    setRows(j.identities || [])
  }, [base])

  useEffect(() => {
    load()
  }, [load])

  async function addMapping() {
    setBusy(true)
    setErr(null)
    try {
      const res = await fetch(base, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegram_user_id: telegramId.trim(),
          clerk_user_id: clerkId.trim(),
        }),
      })
      const j = await res.json()
      if (!res.ok) {
        setErr(j.error || 'Request failed')
        return
      }
      setTelegramId('')
      setClerkId('')
      await load()
    } finally {
      setBusy(false)
    }
  }

  async function remove(id: string) {
    setBusy(true)
    setErr(null)
    try {
      const res = await fetch(`${base}?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
      const j = await res.json()
      if (!res.ok) {
        setErr(j.error || 'Request failed')
        return
      }
      await load()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-8">
      <p className="text-muted-foreground text-sm">
        Maps a Telegram user id to a Clerk user id for the same organization. OpenClaw can send{' '}
        <code className="text-xs">telegram_user_id</code> on propose/commit instead of{' '}
        <code className="text-xs">actor_clerk_id</code> when using the service token.{' '}
        <Link href={`/o/${orgSlug}/admin/screens`} className="text-primary underline">
          Screens &amp; playlists
        </Link>
      </p>
      {err ? <p className="text-sm text-destructive">{err}</p> : null}

      <Card>
        <CardHeader>
          <CardTitle>Add mapping</CardTitle>
          <CardDescription>
            Clerk id must belong to an active org member. Telegram id is the numeric{' '}
            <code className="text-xs">from.id</code> from the Telegram API.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="tg">Telegram user id</Label>
            <Input
              id="tg"
              value={telegramId}
              onChange={(e) => setTelegramId(e.target.value)}
              placeholder="123456789"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ck">Clerk user id</Label>
            <Input
              id="ck"
              value={clerkId}
              onChange={(e) => setClerkId(e.target.value)}
              placeholder="user_..."
            />
          </div>
          <div className="md:col-span-2">
            <Button disabled={busy || !telegramId.trim() || !clerkId.trim()} onClick={addMapping}>
              Save mapping
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current mappings</CardTitle>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">None yet.</p>
          ) : (
            <ul className="space-y-3 text-sm">
              {rows.map((r) => (
                <li
                  key={r.id}
                  className="flex flex-col gap-2 border-b border-border pb-3 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <span className="font-medium">TG</span> {r.telegram_user_id}
                    <span className="mx-2 text-muted-foreground">→</span>
                    <span className="font-medium">Clerk</span> {r.clerk_user_id}
                  </div>
                  <Button variant="secondary" size="sm" disabled={busy} onClick={() => remove(r.id)}>
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
