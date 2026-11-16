import { NextResponse } from 'next/server'
import { atlasIntakeConfigured, atlasReadConfigured, readPublicAtlas } from '@/lib/dcc/community/airtable-atlas'
import { PILOT_PREVIEWS } from '@/lib/dcc/community/atlas'

export const dynamic = 'force-dynamic'
export async function GET() {
  const headers = { 'Cache-Control': 'no-store' }
  const intakeEnabled = atlasIntakeConfigured()
  if (!atlasReadConfigured()) return NextResponse.json({ mode: 'preview', profiles: PILOT_PREVIEWS, intakeEnabled, updatedAt: null }, { headers })
  try {
    const profiles = await readPublicAtlas()
    return NextResponse.json({ mode: 'live', profiles, intakeEnabled, updatedAt: new Date().toISOString() }, { headers })
  } catch {
    return NextResponse.json({ error: 'The network is temporarily unavailable. Please try again.', intakeEnabled: false }, { status: 503, headers })
  }
}
