'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Overview = {
  organization: { id: string; slug: string; name: string }
  screens: Array<{
    id: string
    name: string
    device_key: string
    public_slug: string | null
    status: string
    settings: Record<string, unknown>
  }>
  playlists: Array<{ id: string; name: string; status: string; metadata: Record<string, unknown> }>
  departments: Array<{ id: string; name: string; slug: string }>
  artists?: Array<{ id: string; name: string; is_public?: boolean | null }>
  playlist_items?: Array<{
    id: string
    playlist_id: string
    order_index: number
    item_kind: string
    title_override: string | null
    duration_seconds?: number | null
  }>
}

export function DisplayScreensAdmin({ orgSlug }: { orgSlug: string }) {
  const [data, setData] = useState<Overview | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const load = useCallback(async () => {
    setErr(null)
    const res = await fetch(`/api/display-admin/${encodeURIComponent(orgSlug)}/overview`)
    const j = await res.json()
    if (!res.ok) {
      setErr(j.error || 'Failed to load')
      setData(null)
      return
    }
    setData(j)
  }, [orgSlug])

  useEffect(() => {
    load()
  }, [load])

  async function exec(action: string, payload: Record<string, unknown>) {
    setBusy(true)
    setMsg(null)
    setErr(null)
    try {
      const res = await fetch('/api/control/v1/execute-immediate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organization_slug: orgSlug,
          action,
          payload,
        }),
      })
      const j = await res.json()
      if (!res.ok) {
        setErr(j.error || 'Request failed')
        return
      }
      setMsg('Saved.')
      await load()
    } finally {
      setBusy(false)
    }
  }

  const [screenName, setScreenName] = useState('')
  const [deviceKey, setDeviceKey] = useState('')
  const [publicSlug, setPublicSlug] = useState('')
  const [displayToken, setDisplayToken] = useState('')

  const [playlistName, setPlaylistName] = useState('')

  const [assignScreen, setAssignScreen] = useState('')
  const [assignPlaylist, setAssignPlaylist] = useState('')

  const [filterPlaylist, setFilterPlaylist] = useState('')
  const [filterDept, setFilterDept] = useState<string[]>([])

  const [mediaPlaylist, setMediaPlaylist] = useState('')
  const [mediaUrl, setMediaUrl] = useState('')
  const [mediaTitle, setMediaTitle] = useState('')

  const [spotlightPlaylist, setSpotlightPlaylist] = useState('')
  const [spotlightArtistId, setSpotlightArtistId] = useState('')

  const [digestPlaylist, setDigestPlaylist] = useState('')

  const [reorderPlaylist, setReorderPlaylist] = useState('')
  const [reorderDraftIds, setReorderDraftIds] = useState<string[]>([])

  const sortedItemsForReorderPlaylist = useMemo(() => {
    if (!data?.playlist_items?.length || !reorderPlaylist) return []
    return [...data.playlist_items]
      .filter((i) => i.playlist_id === reorderPlaylist)
      .sort((a, b) => a.order_index - b.order_index)
  }, [data?.playlist_items, reorderPlaylist])

  useEffect(() => {
    setReorderDraftIds(sortedItemsForReorderPlaylist.map((i) => i.id))
  }, [reorderPlaylist, sortedItemsForReorderPlaylist])

  if (err && !data) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-destructive">{err}</p>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return <p className="text-muted-foreground">Loading…</p>
  }

  return (
    <div className="space-y-8">
      {msg ? <p className="text-sm text-green-600 dark:text-green-400">{msg}</p> : null}
      {err ? <p className="text-sm text-destructive">{err}</p> : null}

      <p className="text-sm text-muted-foreground">
        Telegram/OpenClaw identity mapping:{' '}
        <Link href={`/o/${orgSlug}/admin/control-identities`} className="text-primary underline">
          Control identities
        </Link>
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Screens &amp; player URL</CardTitle>
          <CardDescription>
            Public player:{' '}
            <code className="text-xs">
              /display/{orgSlug}/&lt;public_slug_or_device_key&gt;?token=…
            </code>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="text-sm space-y-2">
            {data.screens.map((s) => {
              const key = s.public_slug || s.device_key
              const token =
                typeof s.settings?.display_token === 'string' ? s.settings.display_token : ''
              const href = `/display/${orgSlug}/${encodeURIComponent(key)}${
                token ? `?token=${encodeURIComponent(token)}` : ''
              }`
              return (
                <li key={s.id} className="flex flex-col gap-1 border-b border-border pb-2">
                  <span className="font-medium">{s.name}</span>
                  <span className="text-muted-foreground text-xs">
                    device_key: {s.device_key}
                    {s.public_slug ? ` · slug: ${s.public_slug}` : ''}
                  </span>
                  <Link href={href} className="text-primary text-sm underline w-fit" target="_blank">
                    Open player
                  </Link>
                </li>
              )
            })}
          </ul>
          {data.screens.length === 0 ? (
            <p className="text-sm text-muted-foreground">No screens yet. Create one below.</p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create screen</CardTitle>
          <CardDescription>Registers a display for playlist assignment and kiosk URLs.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="sn">Name</Label>
            <Input id="sn" value={screenName} onChange={(e) => setScreenName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dk">Device key (unique)</Label>
            <Input id="dk" value={deviceKey} onChange={(e) => setDeviceKey(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ps">Public slug (optional)</Label>
            <Input id="ps" value={publicSlug} onChange={(e) => setPublicSlug(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dt">Display token (optional, required on player if set)</Label>
            <Input id="dt" value={displayToken} onChange={(e) => setDisplayToken(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Button
              disabled={busy || !screenName.trim() || !deviceKey.trim()}
              onClick={() =>
                exec('screen.create', {
                  name: screenName.trim(),
                  device_key: deviceKey.trim(),
                  public_slug: publicSlug.trim() || undefined,
                  display_token: displayToken.trim() || undefined,
                })
              }
            >
              Create screen
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create playlist</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4 items-end">
          <div className="space-y-2 flex-1 min-w-[200px]">
            <Label htmlFor="pn">Name</Label>
            <Input id="pn" value={playlistName} onChange={(e) => setPlaylistName(e.target.value)} />
          </div>
          <Button
            disabled={busy || !playlistName.trim()}
            onClick={() => exec('playlist.create', { name: playlistName.trim(), status: 'active' })}
          >
            Create playlist
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assign playlist to screen</CardTitle>
          <CardDescription>Replaces existing assignment for that screen (MVP: one playlist).</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Screen</Label>
            <Select value={assignScreen} onValueChange={setAssignScreen}>
              <SelectTrigger>
                <SelectValue placeholder="Select screen" />
              </SelectTrigger>
              <SelectContent>
                {data.screens.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Playlist</Label>
            <Select value={assignPlaylist} onValueChange={setAssignPlaylist}>
              <SelectTrigger>
                <SelectValue placeholder="Select playlist" />
              </SelectTrigger>
              <SelectContent>
                {data.playlists.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Button
              disabled={busy || !assignScreen || !assignPlaylist}
              onClick={() =>
                exec('screen.assign_playlist', {
                  screen_id: assignScreen,
                  playlist_id: assignPlaylist,
                  priority: 1,
                })
              }
            >
              Assign
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Playlist: live announcements + department filter</CardTitle>
          <CardDescription>
            Adds a slide that pulls published public announcements. Department filter applies to dynamic
            items and can narrow which announcements appear.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Playlist</Label>
            <Select value={filterPlaylist} onValueChange={setFilterPlaylist}>
              <SelectTrigger>
                <SelectValue placeholder="Select playlist" />
              </SelectTrigger>
              <SelectContent>
                {data.playlists.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.departments.map((d) => (
              <label key={d.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={filterDept.includes(d.id)}
                  onChange={() =>
                    setFilterDept((prev) =>
                      prev.includes(d.id) ? prev.filter((x) => x !== d.id) : [...prev, d.id]
                    )
                  }
                />
                {d.name}
              </label>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              disabled={busy || !filterPlaylist}
              variant="secondary"
              onClick={() => exec('playlist.add_dynamic_feed', { playlist_id: filterPlaylist })}
            >
              Add “live announcements” slide
            </Button>
            <Button
              disabled={busy || !filterPlaylist}
              onClick={() =>
                exec('playlist.set_department_filter', {
                  playlist_id: filterPlaylist,
                  department_ids: filterDept,
                })
              }
            >
              Save department filter
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add media slide</CardTitle>
          <CardDescription>Image or direct video URL (same as playlist item kind &quot;media&quot;).</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label>Playlist</Label>
            <Select value={mediaPlaylist} onValueChange={setMediaPlaylist}>
              <SelectTrigger>
                <SelectValue placeholder="Select playlist" />
              </SelectTrigger>
              <SelectContent>
                {data.playlists.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="mu">Media URL</Label>
            <Input id="mu" value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} placeholder="https://..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mt">Title override (optional)</Label>
            <Input id="mt" value={mediaTitle} onChange={(e) => setMediaTitle(e.target.value)} />
          </div>
          <div className="flex items-end">
            <Button
              disabled={busy || !mediaPlaylist || !mediaUrl.trim()}
              onClick={() =>
                exec('playlist.add_media', {
                  playlist_id: mediaPlaylist,
                  media_url: mediaUrl.trim(),
                  ...(mediaTitle.trim() ? { title_override: mediaTitle.trim() } : {}),
                })
              }
            >
              Add media slide
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Artist spotlight</CardTitle>
          <CardDescription>
            Adds a slide featuring a public artist profile (avatar/bio). Uses control action{' '}
            <code className="text-xs">playlist.add_artist_spotlight</code>.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Playlist</Label>
            <Select value={spotlightPlaylist} onValueChange={setSpotlightPlaylist}>
              <SelectTrigger>
                <SelectValue placeholder="Select playlist" />
              </SelectTrigger>
              <SelectContent>
                {data.playlists.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Artist</Label>
            <Select value={spotlightArtistId} onValueChange={setSpotlightArtistId}>
              <SelectTrigger>
                <SelectValue placeholder="Select artist" />
              </SelectTrigger>
              <SelectContent>
                {(data.artists || []).map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Button
              disabled={busy || !spotlightPlaylist || !spotlightArtistId}
              onClick={() =>
                exec('playlist.add_artist_spotlight', {
                  playlist_id: spotlightPlaylist,
                  artist_profile_id: spotlightArtistId,
                })
              }
            >
              Add artist spotlight
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s workshops digest</CardTitle>
          <CardDescription>
            One slide listing this organization&apos;s workshop sessions whose start time falls on the
            current calendar day in the org&apos;s timezone (
            <code className="text-xs">organizations.timezone</code>). Action:{' '}
            <code className="text-xs">playlist.add_workshop_digest</code>.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label>Playlist</Label>
            <Select value={digestPlaylist} onValueChange={setDigestPlaylist}>
              <SelectTrigger>
                <SelectValue placeholder="Select playlist" />
              </SelectTrigger>
              <SelectContent>
                {data.playlists.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Button
              disabled={busy || !digestPlaylist}
              onClick={() => exec('playlist.add_workshop_digest', { playlist_id: digestPlaylist })}
            >
              Add workshop digest slide
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reorder playlist items</CardTitle>
          <CardDescription>
            Choose a playlist, move rows with Up / Down, then apply. Order must include every item in
            that playlist exactly once (same rules as <code className="text-xs">playlist.reorder_items</code>
            ).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Playlist</Label>
            <Select value={reorderPlaylist} onValueChange={setReorderPlaylist}>
              <SelectTrigger>
                <SelectValue placeholder="Select playlist" />
              </SelectTrigger>
              <SelectContent>
                {data.playlists.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {reorderPlaylist && sortedItemsForReorderPlaylist.length === 0 ? (
            <p className="text-sm text-muted-foreground">No items in this playlist yet.</p>
          ) : null}
          {reorderDraftIds.length > 0 ? (
            <ul className="space-y-2 text-sm border border-border rounded-md p-3">
              {reorderDraftIds.map((id, idx) => {
                const row = data.playlist_items?.find((i) => i.id === id)
                const label = row
                  ? `${row.item_kind}${row.title_override ? ` — ${row.title_override}` : ''}`
                  : id
                return (
                  <li
                    key={id}
                    className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2 last:border-0 last:pb-0"
                  >
                    <span className="font-mono text-xs break-all">{label}</span>
                    <div className="flex gap-1 shrink-0">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={busy || idx === 0}
                        onClick={() =>
                          setReorderDraftIds((prev) => {
                            const next = [...prev]
                            if (idx <= 0) return prev
                            ;[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]
                            return next
                          })
                        }
                      >
                        Up
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={busy || idx >= reorderDraftIds.length - 1}
                        onClick={() =>
                          setReorderDraftIds((prev) => {
                            const next = [...prev]
                            if (idx >= next.length - 1) return prev
                            ;[next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]
                            return next
                          })
                        }
                      >
                        Down
                      </Button>
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : null}
          <Button
            disabled={
              busy ||
              !reorderPlaylist ||
              reorderDraftIds.length === 0 ||
              reorderDraftIds.length !== sortedItemsForReorderPlaylist.length
            }
            variant="secondary"
            onClick={() =>
              exec('playlist.reorder_items', { playlist_id: reorderPlaylist, item_ids: reorderDraftIds })
            }
          >
            Apply order
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
