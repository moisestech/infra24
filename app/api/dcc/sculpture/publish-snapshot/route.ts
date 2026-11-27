import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { timingSafeEqual } from 'node:crypto'
import { prepareWeeklyPresenceSnapshot } from '@/lib/dcc/membership/public-snapshot'

export const dynamic = 'force-dynamic'
const headers = { 'Cache-Control':'private, no-store' }
function authorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret || secret.length<24) return false
  const provided = req.headers.get('authorization')?.replace(/^Bearer /i,'') ?? ''
  const expected=Buffer.from(secret)
  const actual=Buffer.from(provided)
  return expected.length===actual.length && timingSafeEqual(expected,actual)
}
/**
 * An independently scheduled, SERVER-ONLY batch.
 * No route from signup, member editor or public viewer can trigger this.
 * Run weekly only AFTER privacy review and tested verified active membership sync.
 */
export async function POST(request:NextRequest) {
  if (!authorized(request)) return NextResponse.json({error:'unauthorized'}, {status:401,headers})
  if (process.env.DCC_SCULPTURE_SNAPSHOT_PUBLISH_ENABLED !== 'true' ||
      process.env.DCC_SCULPTURE_SNAPSHOTS_ENABLED !== 'true' ||
      process.env.DCC_MEMBER_EVENT_CAPTURE_ENABLED !== 'true') {
    return NextResponse.json({error:'publisher_not_enabled'}, {status:503,headers})
  }
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL
  const key=process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return NextResponse.json({error:'snapshot_store_unavailable'},{status:503,headers})
  try {
    const db=createClient(url,key,{auth:{autoRefreshToken:false,persistSession:false}})
    const publishAt=new Date()
    // A delay measured from verified ACTIVE membership, not Clerk signup/email verification.
    const cutoff=new Date(publishAt.getTime()-8*24*60*60*1000)
    const { count,error }=await db.from('dcc_platform_member_bindings')
      .select('id',{count:'exact',head:true})
      .eq('state','active').not('airtable_person_id','is',null)
      .lte('activated_at',cutoff.toISOString())
    if (error || count===null) throw new Error('active_member_count_unavailable')
    const decision=prepareWeeklyPresenceSnapshot({
      verifiedActiveMemberCount:count,
      aggregateCutoff:cutoff.toISOString(),
      publishAt:publishAt.toISOString(),
    })
    if(decision.action!=='publish') {
      return NextResponse.json({status:'deferred'}, {headers})
    }
    const p=decision.snapshot
    const row={
      snapshot_week:p.snapshotWeek,
      cohort_state:p.verifiedWebsiteMemberPresence.status,
      website_presence_marks:p.verifiedWebsiteMemberPresence.markCount,
      aggregate_cutoff_at:cutoff.toISOString(),
      published_at:publishAt.toISOString(),
      approved_by:'controlled-weekly-publisher',
    }
    const { error:writeError }=await db.from('dcc_public_sculpture_snapshots')
      .upsert(row,{onConflict:'snapshot_week',ignoreDuplicates:true})
    if (writeError) throw new Error('snapshot_write_failed')
    return NextResponse.json({status:'recorded',snapshotWeek:p.snapshotWeek}, {headers})
  } catch {
    return NextResponse.json({error:'snapshot_unavailable'}, {status:503,headers})
  }
}
