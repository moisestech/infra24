import { NextRequest, NextResponse } from 'next/server'
import { fetchDccCrmGraphPayload } from '@/lib/airtable/crm-graph-service'
import type { DccNetworkGraphSurface } from '@/lib/marketing/dcc-crm-graph-types'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const surfaceParam = request.nextUrl.searchParams.get('surface') ?? 'home'
    const surface: DccNetworkGraphSurface =
      surfaceParam === 'explorer' ? 'explorer' : 'home'

    const payload = await fetchDccCrmGraphPayload(surface)
    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': 'private, max-age=60, stale-while-revalidate=120',
      },
    })
  } catch (e) {
    console.error('dcc-network-graph:', e)
    return NextResponse.json({ error: 'Failed to build graph' }, { status: 500 })
  }
}
