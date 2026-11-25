import { NextResponse } from 'next/server'
import { memberPassportContext, MemberAccessError, PRIVATE_HEADERS } from '@/lib/dcc/membership/profile-store'
import { fetchAllRecords, patchAirtableRecord } from '@/lib/airtable/client'

export const dynamic = 'force-dynamic'

/**
 * Withdraw public directory/artwork publication independently of membership.
 * Disables Airtable's allowlisted public projection BEFORE acknowledging success.
 * Never accepts a browser-supplied Airtable record identifier or binding ID.
 */
export async function POST() {
  try {
    const { db, binding }=await memberPassportContext()
    if(process.env.DCC_STEWARD_PUBLICATION_ENABLED==='true') {
      // Revoke the authoritative database grant FIRST, before contacting
      // Airtable. Even if its update fails, public projections hide immediately.
      const {data:result,error:revocationError}=await db.rpc(
        'dcc_withdraw_member_publication',{p_binding:binding.id})
      if(revocationError||result!=='withdrawn')
        throw new MemberAccessError(503,'publication_revocation_unavailable')
    }
    const base=process.env.AIRTABLE_DCC_ATLAS_BASE_ID
    const table=process.env.AIRTABLE_DCC_ATLAS_PEOPLE_TABLE
    const key=process.env.AIRTABLE_DCC_ATLAS_API_KEY
    if(binding.airtablePersonId) {
      if(!base||!table||!key)throw new MemberAccessError(503,'publication_store_unavailable')
      const candidates=await fetchAllRecords(base,table,key,{
        filterFormula:'RECORD_ID()="'+binding.airtablePersonId+'"',
      })
      if(candidates.length!==1 ||
         candidates[0].fields['DCC Website Member Binding ID']!==binding.id){
        throw new MemberAccessError(409,'identity_link_requires_review')
      }
      await patchAirtableRecord(base,table,key,binding.airtablePersonId,{
        'Atlas Public Consent':false,
        'Public Profile?':false,
        'Atlas Publication State':'Withdrawn',
      })
    }
    const {error}=await db.from('dcc_member_profile_drafts')
      .update({
        public_request_state:'withdrawal_requested',
        request_disclosure_version:null,
        public_requested_at:null,
        updated_at:new Date().toISOString(),
      })
      .eq('binding_id',binding.id)
    if(error)throw new MemberAccessError(503,'visibility_update_unavailable')
    return NextResponse.json({
      status:'withdrawn',public:false,
      message:'Your public directory and artwork listing is withdrawn. Your private DCC membership remains.',
    },{headers:PRIVATE_HEADERS})
  }catch(e){
    return NextResponse.json({error:e instanceof MemberAccessError?e.code:'visibility_update_unavailable'},{
      status:e instanceof MemberAccessError?e.status:503,headers:PRIVATE_HEADERS,
    })
  }
}
