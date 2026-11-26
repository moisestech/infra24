import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'node:crypto'
import { reconcileOneVerifiedDccMember } from '@/lib/dcc/membership/reconcile-worker'
export const dynamic='force-dynamic'
const PRIVATE_HEADERS = { 'Cache-Control': 'private, no-store, max-age=0' }

function authenticated(req:NextRequest) {
  const secret=process.env.CRON_SECRET
  if(!secret || secret.length<24)return false
  const match=/^Bearer (\S+)$/i.exec(req.headers.get('authorization')||'')
  if(!match)return false
  const given=match[1]
  const a=Buffer.from(secret),b=Buffer.from(given)
  return a.length===b.length&&timingSafeEqual(a,b)
}

/** Controlled one-at-a-time worker; feature OFF by default, no public IDs. */
export async function GET(request:NextRequest) {
  if(!authenticated(request))return NextResponse.json({error:'unauthorized'},{status:401,headers:PRIVATE_HEADERS})
  if(process.env.DCC_MEMBER_RECONCILIATION_ENABLED!=='true') {
    return NextResponse.json({error:'not_enabled'},{status:503,headers:PRIVATE_HEADERS})
  }
  try {
    const outcome=await reconcileOneVerifiedDccMember()
    return NextResponse.json({status:outcome},{headers:PRIVATE_HEADERS})
  }catch {
    return NextResponse.json({error:'reconciliation_unavailable'},{status:503,headers:PRIVATE_HEADERS})
  }
}
