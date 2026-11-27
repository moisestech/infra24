import { NextRequest, NextResponse } from 'next/server'
import { requireDccSteward } from '@/lib/dcc/membership/steward-access'
import { MemberAccessError, PRIVATE_HEADERS } from '@/lib/dcc/membership/profile-store'
import { stewardDecisionSchema } from '@/lib/dcc/membership/steward-publication-schema'
import { decideStewardPublication } from '@/lib/dcc/membership/steward-publication'

export const dynamic='force-dynamic'

/** Steward-only, consent-revision-gated state machine.
 * This route NEVER accepts a public Airtable ID or user-supplied reviewer role.
 */
export async function POST(request:NextRequest) {
  try {
    const reviewer=await requireDccSteward()
    if(process.env.DCC_STEWARD_PUBLICATION_ENABLED!=='true')
      throw new MemberAccessError(503,'publication_not_enabled')
    // Fail-closed cross-site submission guard for cookie-authenticated admin actions.
    const origin=request.headers.get('origin')
    if(!origin||origin!==new URL(request.url).origin)
      throw new MemberAccessError(403,'origin_not_allowed')
    if(Number(request.headers.get('content-length')||0)>2000)
      throw new MemberAccessError(413,'review_request_too_large')
    const raw=await request.text()
    if(raw.length>2000)throw new MemberAccessError(413,'review_request_too_large')
    let payload:unknown
    try{payload=JSON.parse(raw)}catch{throw new MemberAccessError(400,'invalid_json')}
    const parsed=stewardDecisionSchema.safeParse(payload)
    if(!parsed.success)throw new MemberAccessError(400,'invalid_review_action')
    const result=await decideStewardPublication(parsed.data,reviewer)
    return NextResponse.json(result,{headers:PRIVATE_HEADERS})
  }catch(e){
    return NextResponse.json({
      error:e instanceof MemberAccessError?e.code:'review_action_unavailable',
    },{
      status:e instanceof MemberAccessError?e.status:503,headers:PRIVATE_HEADERS,
    })
  }
}
