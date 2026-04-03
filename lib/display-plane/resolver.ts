import type { SupabaseClient } from '@supabase/supabase-js'
import type { ResolvedPlaylist, ResolvedSlide, PlaylistDepartmentFilter } from '@/lib/display-plane/types'
import { calendarDateInTimeZone, formatTimeInTimeZone } from '@/lib/display-plane/org-timezone'

/** Public-facing announcement filters aligned with org public announcements API */
function baseAnnouncementQuery(supabase: SupabaseClient, organizationId: string) {
  return supabase
    .from('announcements')
    .select(
      `
      id, title, body, content, image_url, image_layout, visibility, is_active, status,
      published_at, expires_at, starts_at, ends_at, start_date, end_date,
      org_id, organization_id, department_id
    `
    )
    .or(`organization_id.eq.${organizationId},org_id.eq.${organizationId}`)
    .in('visibility', ['public', 'both'])
    .eq('is_active', true)
}

function passesSchedule(row: Record<string, unknown>, now: Date): boolean {
  const t = now.getTime()
  const afterStart = (d: unknown) =>
    !d || (typeof d === 'string' && new Date(d).getTime() <= t)
  const beforeEnd = (d: unknown) =>
    !d || (typeof d === 'string' && new Date(d).getTime() >= t)
  if (!afterStart(row.starts_at ?? row.start_date)) return false
  if (!beforeEnd(row.ends_at ?? row.end_date)) return false
  if (!beforeEnd(row.expires_at)) return false
  const st = row.status
  if (st === 'draft' || st === 'rejected' || st === 'pending') return false
  return true
}

function passesDepartment(
  row: { department_id?: string | null },
  filter: PlaylistDepartmentFilter
): boolean {
  const ids = filter.department_ids
  if (!ids || ids.length === 0) return true
  if (!row.department_id) return false
  return ids.includes(row.department_id)
}

function announcementBody(row: Record<string, unknown>): string {
  const b = row.body ?? row.content
  return typeof b === 'string' ? b : ''
}

function mapAnnouncementRow(
  row: Record<string, unknown>,
  durationSeconds: number,
  suffix: string
): ResolvedSlide {
  return {
    kind: 'announcement',
    id: `ann-${row.id}-${suffix}`,
    durationSeconds,
    title: typeof row.title === 'string' ? row.title : '',
    body: announcementBody(row),
    imageUrl: typeof row.image_url === 'string' ? row.image_url : undefined,
    announcementId: String(row.id),
    meta: { image_layout: row.image_layout },
  }
}

export async function resolvePlaylistForScreen(
  supabase: SupabaseClient,
  screenId: string,
  options?: { now?: Date; displayToken?: string | null; bypassDisplayToken?: boolean }
): Promise<ResolvedPlaylist | null> {
  const now = options?.now ?? new Date()

  const { data: screen, error: screenErr } = await supabase
    .from('screens')
    .select('id, name, organization_id, settings')
    .eq('id', screenId)
    .maybeSingle()

  if (screenErr || !screen) return null

  const settings = (screen.settings || {}) as Record<string, unknown>
  const expectedToken = typeof settings.display_token === 'string' ? settings.display_token : null
  if (
    expectedToken &&
    !options?.bypassDisplayToken &&
    options?.displayToken !== expectedToken
  ) {
    return null
  }

  const orgId = screen.organization_id as string

  const { data: orgTzRow } = await supabase
    .from('organizations')
    .select('timezone')
    .eq('id', orgId)
    .maybeSingle()
  const orgTz =
    typeof orgTzRow?.timezone === 'string' && orgTzRow.timezone.trim()
      ? orgTzRow.timezone.trim()
      : 'UTC'

  const { data: assignments } = await supabase
    .from('screen_assignments')
    .select('playlist_id, priority')
    .eq('screen_id', screenId)
    .order('priority', { ascending: false })
    .limit(1)

  const top = assignments?.[0]
  if (!top?.playlist_id) {
    return {
      screenId: screen.id,
      screenName: screen.name,
      playlistId: null,
      playlistName: null,
      resolvedAt: now.toISOString(),
      slides: [],
    }
  }

  const { data: playlist } = await supabase
    .from('playlists')
    .select('id, name, metadata, status')
    .eq('id', top.playlist_id)
    .maybeSingle()

  if (!playlist || playlist.status === 'inactive') {
    return {
      screenId: screen.id,
      screenName: screen.name,
      playlistId: top.playlist_id,
      playlistName: null,
      resolvedAt: now.toISOString(),
      slides: [],
    }
  }

  const meta = (playlist.metadata || {}) as PlaylistDepartmentFilter

  const { data: items, error: itemsErr } = await supabase
    .from('playlist_items')
    .select(
      `
      id, order_index, duration_seconds, item_kind, announcement_id, workshop_id, artist_profile_id, media_url, title_override, payload
    `
    )
    .eq('playlist_id', top.playlist_id)
    .order('order_index', { ascending: true })

  if (itemsErr || !items?.length) {
    return {
      screenId: screen.id,
      screenName: screen.name,
      playlistId: playlist.id,
      playlistName: playlist.name,
      resolvedAt: now.toISOString(),
      slides: [],
    }
  }

  const slides: ResolvedSlide[] = []

  for (const item of items) {
    const dur = item.duration_seconds ?? 12

    if (item.item_kind === 'announcement' && item.announcement_id) {
      const { data: ann } = await supabase
        .from('announcements')
        .select(
          `
          id, title, body, content, image_url, image_layout, visibility, is_active, status,
          published_at, expires_at, starts_at, ends_at, start_date, end_date,
          org_id, organization_id, department_id
        `
        )
        .eq('id', item.announcement_id)
        .maybeSingle()

      if (!ann) continue
      const row = ann as Record<string, unknown>
      if (!passesSchedule(row, now)) continue
      if (!passesDepartment({ department_id: ann.department_id as string | null }, meta)) continue
      slides.push(mapAnnouncementRow(row, dur, String(item.id)))
      continue
    }

    if (item.item_kind === 'media' && item.media_url) {
      slides.push({
        kind: 'media',
        id: `media-${item.id}`,
        durationSeconds: dur,
        title: item.title_override || 'Media',
        mediaUrl: item.media_url,
        meta: (item.payload || {}) as Record<string, unknown>,
      })
      continue
    }

    if (item.item_kind === 'dynamic_announcements') {
      const { data: rows } = await baseAnnouncementQuery(supabase, orgId)
        .order('published_at', { ascending: false })
        .limit(20)

      for (const ann of rows || []) {
        const row = ann as Record<string, unknown>
        if (!passesSchedule(row, now)) continue
        if (!passesDepartment({ department_id: ann.department_id as string | null }, meta)) continue
        slides.push(mapAnnouncementRow(row, dur, `dyn-${item.id}-${ann.id}`))
      }
      continue
    }

    if (item.item_kind === 'workshop_promo' && item.workshop_id) {
      const { data: ws } = await supabase
        .from('workshops')
        .select('id, title, description, metadata')
        .eq('id', item.workshop_id)
        .eq('organization_id', orgId)
        .maybeSingle()

      if (ws) {
        slides.push({
          kind: 'workshop_promo',
          id: `ws-${item.id}`,
          durationSeconds: dur,
          title: item.title_override || ws.title,
          body: ws.description || undefined,
          workshopId: ws.id,
          meta: (ws.metadata || {}) as Record<string, unknown>,
        })
      }
      continue
    }

    if (item.item_kind === 'workshop_digest') {
      const todayLocal = calendarDateInTimeZone(now, orgTz)
      const windowStart = new Date(now.getTime() - 2 * 86400000).toISOString()
      const windowEnd = new Date(now.getTime() + 21 * 86400000).toISOString()
      const { data: wsList } = await supabase.from('workshops').select('id').eq('organization_id', orgId)
      const wids = (wsList || []).map((w) => w.id)
      type DigestLine = { time: string; title: string; location?: string }
      const lines: DigestLine[] = []
      if (wids.length) {
        const { data: sess } = await supabase
          .from('workshop_sessions')
          .select(
            `
            id,
            session_date,
            session_end_date,
            location,
            workshop_id,
            workshops ( title )
          `
          )
          .in('workshop_id', wids)
          .eq('is_active', true)
          .gte('session_date', windowStart)
          .lte('session_date', windowEnd)
          .order('session_date', { ascending: true })
        for (const row of sess || []) {
          const sd = row.session_date as string | null
          if (!sd || calendarDateInTimeZone(sd, orgTz) !== todayLocal) continue
          const w = row.workshops as { title?: string } | null
          const title = w?.title || 'Workshop'
          lines.push({
            time: formatTimeInTimeZone(sd, orgTz),
            title,
            location: typeof row.location === 'string' && row.location.trim() ? row.location : undefined,
          })
        }
      }
      const body =
        lines.length === 0
          ? 'No workshops scheduled today.'
          : lines
              .map((l) => `${l.time} — ${l.title}${l.location ? ` · ${l.location}` : ''}`)
              .join('\n')
      slides.push({
        kind: 'workshop_digest',
        id: `wsdig-${item.id}`,
        durationSeconds: dur,
        title: item.title_override || "Today's workshops",
        body,
        meta: { date_local: todayLocal, timezone: orgTz, sessions: lines },
      })
      continue
    }

    if (item.item_kind === 'artist_spotlight' && item.artist_profile_id) {
      const { data: artist } = await supabase
        .from('artist_profiles')
        .select(
          'id, name, bio, avatar_url, cover_image_url, portfolio_url, instagram, website, is_public'
        )
        .eq('id', item.artist_profile_id)
        .eq('organization_id', orgId)
        .maybeSingle()

      if (artist && artist.is_public !== false) {
        const img = artist.avatar_url || artist.cover_image_url
        slides.push({
          kind: 'artist_spotlight',
          id: `art-${item.id}`,
          durationSeconds: dur,
          title: item.title_override || artist.name,
          body: artist.bio || undefined,
          imageUrl: img || undefined,
          artistProfileId: artist.id,
          meta: {
            portfolio_url: artist.portfolio_url,
            instagram: artist.instagram,
            website: artist.website,
          },
        })
      }
    }
  }

  return {
    screenId: screen.id,
    screenName: screen.name,
    playlistId: playlist.id,
    playlistName: playlist.name,
    resolvedAt: now.toISOString(),
    slides,
  }
}

export async function findScreenByOrgAndKey(
  supabase: SupabaseClient,
  orgSlug: string,
  screenKey: string
): Promise<{ id: string; settings: Record<string, unknown> } | null> {
  const { data: org } = await supabase.from('organizations').select('id').eq('slug', orgSlug).maybeSingle()
  if (!org) return null

  const { data: bySlug } = await supabase
    .from('screens')
    .select('id, settings')
    .eq('organization_id', org.id)
    .eq('public_slug', screenKey)
    .maybeSingle()

  if (bySlug) return { id: bySlug.id, settings: (bySlug.settings || {}) as Record<string, unknown> }

  const { data: byDevice } = await supabase
    .from('screens')
    .select('id, settings')
    .eq('organization_id', org.id)
    .eq('device_key', screenKey)
    .maybeSingle()

  return byDevice
    ? { id: byDevice.id, settings: (byDevice.settings || {}) as Record<string, unknown> }
    : null
}
