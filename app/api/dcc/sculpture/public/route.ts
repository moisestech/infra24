import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { atlasReadConfigured, readPublicAtlas } from '@/lib/dcc/community/airtable-atlas'
import { PILOT_PREVIEWS } from '@/lib/dcc/community/atlas'
import { safeWebsitePresenceSnapshot, type PublicSculptureData } from '@/lib/dcc/artwork/public-sculpture'
export const dynamic = 'force-dynamic'
const headers = { 'Cache-Control':'public, max-age=60, stale-while-revalidate=120' }

/**
 * One allowlisted public payload for the directory and the sculpture.
 * Never joins to member profile drafts, webhook data or the People CRM roster.
 * Historical WhatsApp and poll visualization stays independently labeled.
 */
export async function GET() {
  try {
    const mode = atlasReadConfigured() ? 'live' : 'preview'
    const profiles = mode==='live' ? await readPublicAtlas() : PILOT_PREVIEWS
    let websitePresence: PublicSculptureData['websitePresence'] = {
      status:'not_published',markCount:0,snapshotWeek:null,
    }
    if (process.env.DCC_SCULPTURE_SNAPSHOTS_ENABLED === 'true') {
      const url=process.env.NEXT_PUBLIC_SUPABASE_URL
      const secret=process.env.SUPABASE_SERVICE_ROLE_KEY
      if (!url || !secret) throw new Error('Sculpture snapshot store not configured')
      const db=createClient(url,secret,{auth:{autoRefreshToken:false,persistSession:false}})
      const {data,error}=await db.from('dcc_public_sculpture_snapshots')
        .select('snapshot_week,cohort_state,website_presence_marks')
        .order('snapshot_week',{ascending:false}).limit(1).maybeSingle()
      if (error) throw new Error('Snapshot unavailable')
      websitePresence=safeWebsitePresenceSnapshot(data)
    }
    return NextResponse.json({
      mode,profiles,websitePresence,
      reportedWhatsAppMembershipIsSeparate:true,
      pollSelectionsAreSeparate:true,
    } satisfies PublicSculptureData,{headers})
  } catch {
    return NextResponse.json({error:'Public network is temporarily unavailable'},{
      status:503,headers:{'Cache-Control':'no-store'},
    })
  }
}
