import { NextRequest, NextResponse } from 'next/server'
import { fetchAllRecords } from '@/lib/airtable/client'
import { memberPassportContext, MemberAccessError, PRIVATE_HEADERS,
  readOwnerPassport, saveOwnerPassport } from '@/lib/dcc/membership/profile-store'
import { ownerPassportSchema, mayEditOwnerPassport } from '@/lib/dcc/membership/profile-schema'

export const dynamic = 'force-dynamic'
function failure(error: unknown) {
  if (error instanceof MemberAccessError) {
    return NextResponse.json({ error: error.code }, { status: error.status, headers: PRIVATE_HEADERS })
  }
  return NextResponse.json({ error: 'request_unavailable' }, { status: 503, headers: PRIVATE_HEADERS })
}
export async function GET() {
  try {
    const { db, binding } = await memberPassportContext()
    let currentlyPublic: boolean | null = null
    let publicSlug: string | null = null
    if (binding.airtablePersonId) {
      const base=process.env.AIRTABLE_DCC_ATLAS_BASE_ID
      const table=process.env.AIRTABLE_DCC_ATLAS_PEOPLE_TABLE
      const key=process.env.AIRTABLE_DCC_ATLAS_API_KEY
      if (base && table && key) {
        const records=await fetchAllRecords(base,table,key,{
          filterFormula:'RECORD_ID()="'+binding.airtablePersonId+'"',
        })
        if(records.length!==1 || records[0].fields['DCC Website Member Binding ID']!==binding.id) {
          throw new MemberAccessError(409,'identity_link_requires_review')
        }
        const f=records[0].fields
        currentlyPublic=f['Atlas Publication State']==='Approved' &&
          f['Atlas Public Consent']===true && f['Public Profile?']===true &&
          f['Atlas Identity Verified']===true
        const candidate=f['Profile Slug']
        publicSlug=currentlyPublic && typeof candidate==='string' &&
          candidate.length<=100 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(candidate)
            ? candidate : null
        // A CRM checkbox is NOT a publication grant. Owner-facing status must
        // agree with the same private DB consent and public visibility gate
        // used by anonymous Atlas and sculpture readers.
        currentlyPublic=false
        if(publicSlug && process.env.DCC_PUBLIC_ATLAS_MEMBER_VISIBILITY_ENABLED==='true') {
          const {data:grant,error:grantError}=await db.from('dcc_member_publication_grants')
            .select('binding_id,slug,state,airtable_person_id')
            .eq('binding_id',binding.id).eq('state','approved').maybeSingle()
          if(grantError)throw new MemberAccessError(503,'publication_status_unavailable')
          currentlyPublic=Boolean(grant && grant.slug===publicSlug &&
            grant.airtable_person_id===binding.airtablePersonId)
        }
        if(!currentlyPublic)publicSlug=null
      }
    }
    return NextResponse.json({
      membership: binding.state === 'active' ? 'active' : 'pending_reconciliation',
      profile: await readOwnerPassport(db, binding),
      currentlyPublic,
      publicSlug,
    }, { headers: PRIVATE_HEADERS })
  } catch (e) { return failure(e) }
}
export async function PATCH(request: NextRequest) {
  try {
    const { db, binding } = await memberPassportContext()
    if (!mayEditOwnerPassport(binding.state as 'active' | 'pending_reconciliation')) {
      return NextResponse.json({ error: 'edit_not_allowed' }, { status: 403, headers: PRIVATE_HEADERS })
    }
    if (Number(request.headers.get('content-length') || '0') > 16000) {
      return NextResponse.json({ error: 'too_large' }, { status: 413, headers: PRIVATE_HEADERS })
    }
    const raw = await request.text()
    if (raw.length > 16000) return NextResponse.json({ error: 'too_large' }, { status: 413, headers: PRIVATE_HEADERS })
    let payload: unknown
    try { payload = JSON.parse(raw) } catch {
      return NextResponse.json({ error: 'invalid_json' }, { status: 400, headers: PRIVATE_HEADERS })
    }
    const parsed = ownerPassportSchema.safeParse(payload)
    if (!parsed.success) return NextResponse.json({ error: 'invalid_profile' }, { status: 400, headers: PRIVATE_HEADERS })
    const result = await saveOwnerPassport(db, binding, parsed.data)
    return NextResponse.json(result, { headers: PRIVATE_HEADERS })
  } catch (e) { return failure(e) }
}
