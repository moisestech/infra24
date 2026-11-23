import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'node:crypto'
import { reconcileOneVerifiedDccMember } from '@/lib/dcc/membership/reconcile-worker'
export const dynamic='force-dynamic'

function authenticated(req:NextRequest) {
  const secret=process.env.CRON_SECRET
  if(!secret || secret.length<24)return false
  const given=req.headers.get('authorization')?.replace(/^Bearer /i,'')||''
  const a=Buffer.from(secret),b=Buffer.from(given)
  return a.length===b.length&&timingSafeEqual(a,b)
}

/** Controlled one-at-a-time worker; feature OFF by default, no public IDs. */
export async function GET(request:NextRequest) {
  if(!authenticated(request))return NextResponse.json({error:'unauthorized'},{status:401})
  if(process.env.DCC_MEMBER_RECONCILIATION_ENABLED!=='true') {
    return NextResponse.json({error:'not_enabled'},{status:503})
  }
  try {
    const outcome=await reconcileOneVerifiedDccMember()
    return NextResponse.json({status:outcome},{headers:{'Cache-Control':'private, no-store'}})
  }catch {
    return NextResponse.json({error:'reconciliation_unavailable'},{status:503})
  }
}
