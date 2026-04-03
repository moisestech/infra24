import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'
import { getOrgBySlug, assertOrgRole, CONTROL_MUTATE_ROLES } from '@/lib/control-plane/auth'

export const dynamic = 'force-dynamic'

/** Session-authenticated read for org display admin UI */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient()
    const org = await getOrgBySlug(supabase, slug)
    if (!org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    const role = await assertOrgRole(supabase, userId, org.id, CONTROL_MUTATE_ROLES)
    if (!role) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const [screens, playlists, departments, artists, playlistItems] = await Promise.all([
      supabase
        .from('screens')
        .select('id, name, location, device_key, public_slug, status, settings, updated_at')
        .eq('organization_id', org.id)
        .order('name', { ascending: true }),
      supabase
        .from('playlists')
        .select('id, name, description, status, metadata, updated_at')
        .eq('organization_id', org.id)
        .order('name', { ascending: true }),
      supabase
        .from('departments')
        .select('id, name, slug, sort_order')
        .eq('organization_id', org.id)
        .order('sort_order', { ascending: true }),
      supabase
        .from('artist_profiles')
        .select('id, name, is_public')
        .eq('organization_id', org.id)
        .order('name', { ascending: true })
        .limit(500),
      supabase
        .from('playlist_items')
        .select('id, playlist_id, order_index, item_kind, title_override, duration_seconds')
        .eq('organization_id', org.id)
        .order('playlist_id', { ascending: true })
        .order('order_index', { ascending: true }),
    ])

    return NextResponse.json({
      organization: org,
      screens: screens.data || [],
      playlists: playlists.data || [],
      departments: departments.data || [],
      artists: artists.data || [],
      playlist_items: playlistItems.data || [],
      errors: {
        screens: screens.error?.message,
        playlists: playlists.error?.message,
        departments: departments.error?.message,
        artists: artists.error?.message,
        playlist_items: playlistItems.error?.message,
      },
    })
  } catch (e) {
    console.error('display-admin overview', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
