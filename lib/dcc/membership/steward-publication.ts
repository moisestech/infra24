import 'server-only'
import { createClient } from '@supabase/supabase-js'
import { fetchAllRecords, patchAirtableRecord } from '@/lib/airtable/client'
import { MemberAccessError } from './profile-store'
import { ownerPassportSchema } from './profile-schema'
import {
  proposedPublicFields,STEWARD_CONSENT_VERSION,type StewardDecision,
} from './steward-publication-schema'

type PrivateDraft={
  binding_id:string; revision:number; public_request_state:string;
  request_disclosure_version:string|null; public_requested_at:string|null;
  display_name:string;summary:string;practices:unknown;interests:unknown;public_links:unknown;
}
type MemberBinding={
  id:string;state:string;verified_at:string|null;airtable_person_id:string|null;
}

function config() {
  if(process.env.DCC_STEWARD_PUBLICATION_ENABLED!=='true')
    throw new MemberAccessError(503,'publication_not_enabled')
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRole=process.env.SUPABASE_SERVICE_ROLE_KEY
  const base=process.env.AIRTABLE_DCC_ATLAS_BASE_ID
  const table=process.env.AIRTABLE_DCC_ATLAS_PEOPLE_TABLE
  const key=process.env.AIRTABLE_DCC_ATLAS_API_KEY
  if(!url||!serviceRole||!base||!table||!key)
    throw new MemberAccessError(503,'publication_configuration_missing')
  return {
    db:createClient<any>(url,serviceRole,{auth:{autoRefreshToken:false,persistSession:false}}),
    base,table,key,
  }
}

async function validatedRequest(
  db:ReturnType<typeof createClient<any>>,input:StewardDecision,
) {
  const {data:draft,error:e1}=await db.from('dcc_member_profile_drafts')
    .select('binding_id,revision,public_request_state,request_disclosure_version,public_requested_at,display_name,summary,practices,interests,public_links')
    .eq('binding_id',input.requestId).maybeSingle()
  const {data:binding,error:e2}=await db.from('dcc_platform_member_bindings')
    .select('id,state,verified_at,airtable_person_id')
    .eq('id',input.requestId).maybeSingle()
  if(e1||e2)throw new MemberAccessError(503,'review_store_unavailable')
  const member=binding as MemberBinding|null
  const request=draft as PrivateDraft|null
  if(!member||!request||member.state!=='active'||!member.verified_at||
    !member.airtable_person_id||request.revision!==input.revision||
    request.public_request_state!=='pending_review'||
    request.request_disclosure_version!==STEWARD_CONSENT_VERSION||
    !request.public_requested_at)
    throw new MemberAccessError(409,'review_request_changed')
  const parsed=ownerPassportSchema.safeParse({
    displayName:request.display_name,summary:request.summary,practices:request.practices,
    interests:request.interests,links:request.public_links,
  })
  if(!parsed.success)throw new MemberAccessError(409,'review_content_invalid')
  return {member,request,profile:parsed.data}
}

async function verifyPeopleRecord(
  cfg:ReturnType<typeof config>,binding:MemberBinding,slug:string,
) {
  const matches=await fetchAllRecords(cfg.base,cfg.table,cfg.key,{
    filterFormula:'RECORD_ID()="'+binding.airtable_person_id+'"',
  })
  if(matches.length!==1 ||
    matches[0].id!==binding.airtable_person_id ||
    matches[0].fields['DCC Website Member Binding ID']!==binding.id)
    throw new MemberAccessError(409,'identity_link_requires_review')
  const duplicates=await fetchAllRecords(cfg.base,cfg.table,cfg.key,{
    filterFormula:'{Profile Slug}="'+slug+'"',
  })
  if(duplicates.some(r=>r.id!==binding.airtable_person_id))
    throw new MemberAccessError(409,'public_slug_already_used')
}

export async function decideStewardPublication(
  input:StewardDecision,reviewerSubject:string,
) {
  const cfg=config()
  const {member,profile}=await validatedRequest(cfg.db,input)
  if(input.action!=='approve') {
    const {data,error}=await cfg.db.rpc('dcc_return_steward_publication',{
      p_binding:input.requestId,p_revision:input.revision,
      p_reviewer:reviewerSubject,p_action:input.action==='reject'?'rejected':'returned',
    })
    if(error)throw new MemberAccessError(409,'review_request_changed')
    return {state:data,public:false} as const
  }

  const slug=input.slug!
  // Verify both the private claim and public namespace before reserving a slug.
  await verifyPeopleRecord(cfg,member,slug)
  let publicFields:ReturnType<typeof proposedPublicFields>
  try {publicFields=proposedPublicFields(profile,slug)}
  catch {throw new MemberAccessError(409,'review_content_invalid')}

  const {data:claimToken,error:claimError}=await cfg.db.rpc('dcc_claim_steward_publication',{
    p_binding:input.requestId,p_revision:input.revision,p_slug:slug,p_reviewer:reviewerSubject,
  })
  if(claimError||typeof claimToken!=='string')
    throw new MemberAccessError(409,'review_request_changed_or_slug_taken')

  let patched=false
  try {
    // Airtable is an external writer. Its approval flags are NOT enough to
    // publish: the public reader also requires a final DB 'approved' grant.
    const updated=await patchAirtableRecord(cfg.base,cfg.table,cfg.key,
      member.airtable_person_id!,publicFields)
    patched=updated.id===member.airtable_person_id
      && updated.fields['DCC Website Member Binding ID']===member.id
      && updated.fields['Profile Slug']===slug
      && updated.fields['Display Name']===publicFields['Display Name']
      && updated.fields['Short Bio']===publicFields['Short Bio']
      && updated.fields['Atlas Publication State']==='Approved'
      && updated.fields['Atlas Identity Verified']===true
      && updated.fields['Public Profile?']===true
      && updated.fields['Atlas Public Consent']===true
    if(!patched)throw Error('provider_write_unconfirmed')
  }catch {
    // Failed/ambiguous provider writes are held for manual reconciliation.
    // Do not retry automatically, never declare a public profile here.
    await cfg.db.rpc('dcc_finalize_steward_publication',{
      p_binding:input.requestId,p_token:claimToken,p_success:false,
    })
    throw new MemberAccessError(503,'publication_provider_uncertain')
  }

  const {data:finalState,error:finalError}=await cfg.db.rpc('dcc_finalize_steward_publication',{
    p_binding:input.requestId,p_token:claimToken,p_success:true,
  })
  if(finalError||finalState!=='approved') {
    // A concurrent owner edit/withdrawal invalidates the claim.
    // The DB public grant remains closed. Best-effort clear stale Airtable flag.
    try {
      await patchAirtableRecord(cfg.base,cfg.table,cfg.key,member.airtable_person_id!,{
        'Atlas Public Consent':false,'Public Profile?':false,
        'Atlas Publication State':'Hidden',
      })
    }catch { /* DB gate remains closed even if provider is unreachable. */ }
    throw new MemberAccessError(409,'publication_review_stale_or_uncertain')
  }
  return {state:'approved' as const,public:true,slug,url:'/network/community/'+slug}
}
