import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { workshopMarketingSlugLookupKeys } from '@/lib/workshops/workshop-metadata-slug-aliases'

export const dynamic = 'force-dynamic'

/**
 * Public: resolve a workshop by org slug + marketing slug (metadata.slug).
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string; workshopSlug: string }> }
) {
  try {
    const { slug: orgSlug, workshopSlug } = await params
    if (!orgSlug?.trim() || !workshopSlug?.trim()) {
      return NextResponse.json({ error: 'Missing slug' }, { status: 400 })
    }

    const supabase = createClient()

    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id, slug, name')
      .eq('slug', orgSlug)
      .single()

    if (orgError || !org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    const slugKeys = workshopMarketingSlugLookupKeys(workshopSlug)
    const orFilter = slugKeys.map((k) => `metadata->>slug.eq.${k}`).join(',')

    const { data: rows, error } = await supabase
      .from('workshops')
      .select('*')
      .eq('organization_id', org.id)
      .or(orFilter)
      .limit(1)

    if (error) {
      console.error('workshop by slug:', error)
      return NextResponse.json({ error: 'Failed to fetch workshop' }, { status: 500 })
    }

    const workshop = rows?.[0]
    if (!workshop) {
      return NextResponse.json({ error: 'Workshop not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: workshop })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
