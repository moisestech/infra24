import { createClient } from '@supabase/supabase-js'

import type { DirectoryArtistProfile } from '@/lib/organization/artist-alumni-bridge'

function getServiceSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

/** Server-only: active public artist_profiles for an org slug (directory bridge). */
export async function fetchDirectoryArtistsForOrgSlug(
  orgSlug: string
): Promise<DirectoryArtistProfile[]> {
  const supabase = getServiceSupabase()
  if (!supabase) return []

  const { data: organization, error: orgError } = await supabase
    .from('organizations')
    .select('id')
    .eq('slug', orgSlug.trim().toLowerCase())
    .maybeSingle()

  if (orgError || !organization?.id) return []

  const { data: artists, error } = await supabase
    .from('artist_profiles')
    .select(
      'id, name, bio, avatar_url, profile_image, studio_type, studio_location, metadata, mediums'
    )
    .eq('organization_id', organization.id)
    .eq('is_active', true)
    .or('is_public.eq.true,is_public.is.null')
    .order('name')

  if (error || !artists) return []

  return artists.map((a) => ({
    id: a.id,
    name: a.name,
    bio: a.bio,
    avatar_url: a.avatar_url,
    profile_image: a.profile_image ?? a.avatar_url,
    studio_type: a.studio_type,
    studio_location: a.studio_location,
    metadata: (a.metadata as Record<string, unknown> | null) ?? null,
    mediums: Array.isArray(a.mediums) ? a.mediums : null,
  }))
}
