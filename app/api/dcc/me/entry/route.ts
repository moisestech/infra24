import { NextRequest, NextResponse } from 'next/server'
import { memberPassportContext, MemberAccessError, PRIVATE_HEADERS } from '@/lib/dcc/membership/profile-store'
import { normalizeCampaignId, normalizeEntrySource } from '@/lib/dcc/membership/clerk-event'

export const dynamic='force-dynamic'
/** Authenticated private entry context. Values are untrusted hints, NOT proof of membership. */
export async function POST(request:NextRequest) {
  try {
    if(Number(request.headers.get('content-length')||0)>1000) {
      return NextResponse.json({error:'too_large'},{status:413,headers:PRIVATE_HEADERS})
    }
    const raw=await request.text()
    if(raw.length>1000) return NextResponse.json({error:'too_large'},{status:413,headers:PRIVATE_HEADERS})
    let payload:Record<string,unknown>
    try {
      const input:unknown=JSON.parse(raw)
      if(!input || typeof input!=='object' || Array.isArray(input))throw Error()
      payload=input as Record<string,unknown>
    } catch {
      return NextResponse.json({error:'invalid_source'},{status:400,headers:PRIVATE_HEADERS})
    }
    const source=normalizeEntrySource(payload.source)
    const campaign=normalizeCampaignId(payload.campaign)
    const {db,binding}=await memberPassportContext()
    const {error}=await db.rpc('dcc_capture_member_entry',{
      p_binding:binding.id,p_source:source,p_campaign:campaign,
    })
    if(error)throw new MemberAccessError(503,'source_write_unavailable')
    return NextResponse.json({recorded:true},{headers:PRIVATE_HEADERS})
  }catch(e){
    return NextResponse.json({error:e instanceof MemberAccessError?e.code:'source_write_unavailable'},{
      status:e instanceof MemberAccessError?e.status:503,headers:PRIVATE_HEADERS,
    })
  }
}
