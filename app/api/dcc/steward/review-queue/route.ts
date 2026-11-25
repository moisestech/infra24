import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireDccSteward } from '@/lib/dcc/membership/steward-access'
import { MemberAccessError, PRIVATE_HEADERS } from '@/lib/dcc/membership/profile-store'
import { ownerPassportSchema, DCC_PUBLIC_PROFILE_DISCLOSURE } from '@/lib/dcc/membership/profile-schema'

export const dynamic='force-dynamic'

/**
 * Auth-only read of pending publication requests.
 * Does not expose email, Clerk subject, private People ID or public CRM payload.
 * Review is NOT approval. Staff approval must run through a separate
 * transactionally gated workflow after database validation.
 */
export async function GET() {
  try {
    requireDccSteward()
    const url=process.env.NEXT_PUBLIC_SUPABASE_URL
    const key=process.env.SUPABASE_SERVICE_ROLE_KEY
    if(!url||!key)throw new MemberAccessError(503,'review_store_unavailable')
    const db=createClient(url,key,{auth:{autoRefreshToken:false,persistSession:false}})
    const {data,error}=await db.from('dcc_member_profile_drafts')
      .select('binding_id,display_name,summary,practices,interests,public_links,revision,public_requested_at,request_disclosure_version')
      .eq('public_request_state','pending_review')
      .order('public_requested_at',{ascending:true}).limit(50)
    if(error)throw new MemberAccessError(503,'review_store_unavailable')
    const ids=(data??[]).map(x=>x.binding_id)
    if(!ids.length)return NextResponse.json({requests:[]},{headers:PRIVATE_HEADERS})
    const {data:bindings,error:bindingError}=await db.from('dcc_platform_member_bindings')
      .select('id,state,airtable_person_id,verified_at')
      .in('id',ids)
    if(bindingError)throw new MemberAccessError(503,'review_store_unavailable')
    const lookup=new Map((bindings??[]).map(b=>[b.id,b]))
    const requests=(data??[]).map(d=>{
      const b=lookup.get(d.binding_id)
      const parsed=ownerPassportSchema.safeParse({
        displayName:d.display_name,summary:d.summary,practices:d.practices,
        interests:d.interests,links:d.public_links,
      })
      return {
        requestId:d.binding_id,revision:d.revision,
        requestedAt:d.public_requested_at,
        disclosureVersion:d.request_disclosure_version,
        memberVerified:b?.state==='active'&&Boolean(b.verified_at)&&Boolean(b.airtable_person_id),
        preview:parsed.success ? parsed.data : null,
        needsReview:!parsed.success||b?.state!=='active'||!b.airtable_person_id||!b.verified_at||
          d.request_disclosure_version!==DCC_PUBLIC_PROFILE_DISCLOSURE||
          (typeof d.summary==='string'&&d.summary.trim().length<10),
      }
    })
    return NextResponse.json({requests},{headers:PRIVATE_HEADERS})
  } catch(e) {
    return NextResponse.json({error:e instanceof MemberAccessError?e.code:'review_unavailable'},{
      status:e instanceof MemberAccessError?e.status:503,headers:PRIVATE_HEADERS,
    })
  }
}
