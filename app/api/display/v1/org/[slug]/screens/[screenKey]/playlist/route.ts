import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { findScreenByOrgAndKey, resolvePlaylistForScreen } from '@/lib/display-plane/resolver'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; screenKey: string }> }
) {
  try {
    const { slug, screenKey } = await params
    const token = request.nextUrl.searchParams.get('token')
    const supabase = createClient()

    const screen = await findScreenByOrgAndKey(supabase, slug, decodeURIComponent(screenKey))
    if (!screen) {
      return NextResponse.json({ error: 'Screen not found' }, { status: 404 })
    }

    const expected = typeof screen.settings.display_token === 'string' ? screen.settings.display_token : null
    if (expected && token !== expected) {
      return NextResponse.json({ error: 'Invalid display token' }, { status: 403 })
    }

    const resolved = await resolvePlaylistForScreen(supabase, screen.id, {
      displayToken: token,
    })

    if (!resolved) {
      return NextResponse.json({ error: 'Failed to resolve playlist' }, { status: 500 })
    }

    return NextResponse.json(resolved)
  } catch (e) {
    console.error('display org playlist error', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
