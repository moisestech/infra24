import 'server-only'
import { createClient } from '@supabase/supabase-js'
import { clerkClient } from '@clerk/nextjs/server'
import {
  createAirtableRecords, fetchAllRecords,
} from '@/lib/airtable/client'

type Claim = { binding_id:string; clerk_subject:string; claim_token:string }
type AirtablePerson = { id:string; fields:Record<string,unknown> }

export type ReconcileOutcome = 'no_pending' | 'activated' | 'review_required'

/**
 * Runs only from a protected single-member-at-a-time worker.
 * The SQL claim serializes all automatic cross-provider writes. A crash after
 * an uncertain Airtable result leaves its job in PROCESSING for staff review.
 */
export async function reconcileOneVerifiedDccMember():Promise<ReconcileOutcome> {
  if (process.env.DCC_MEMBER_RECONCILIATION_ENABLED!=='true' ||
      process.env.DCC_MEMBER_EVENT_CAPTURE_ENABLED!=='true') {
    throw new Error('DCC reconciliation is not enabled')
  }
  const baseId=process.env.AIRTABLE_DCC_ATLAS_BASE_ID
  const tableId=process.env.AIRTABLE_DCC_ATLAS_PEOPLE_TABLE
  const pat=process.env.AIRTABLE_DCC_ATLAS_API_KEY
  const dbUrl=process.env.NEXT_PUBLIC_SUPABASE_URL
  const dbSecret=process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!baseId || !tableId || !pat || !dbUrl || !dbSecret) {
    throw new Error('Reconciliation providers not configured')
  }
  const db=createClient(dbUrl,dbSecret,{auth:{autoRefreshToken:false,persistSession:false}})
  const claimed=await db.rpc('dcc_claim_member_reconcile')
  if (claimed.error) throw new Error('Member claim unavailable')
  const claim=(claimed.data as Claim[]|null)?.[0]
  if(!claim) return 'no_pending'
  const id=claim.binding_id
  const token=claim.claim_token
  const finish=async(action:'active'|'review_required',recordId?:string,reason?:string)=>{
    const {error}=await db.rpc('dcc_finalize_member_reconcile',{
      p_binding:id,p_token:token,p_action:action,
      p_airtable_person_id:recordId ?? null,p_audit_reason:reason ?? null,
    })
    if(error) throw new Error('Member finalization unavailable')
  }

  try {
    // Clerk is the authority for ownership, not a webhook's archived email.
    // This provider request is intentionally after the database's unique claim.
    const user=await clerkClient.users.getUser(claim.clerk_subject)
    const emailAddress=user.emailAddresses.find(e=>e.id===user.primaryEmailAddressId)
    if(emailAddress?.verification?.status!=='verified' || !emailAddress.emailAddress) {
      await finish('review_required',undefined,'clerk_verified_email_missing')
      return 'review_required'
    }
    const email=emailAddress.emailAddress.trim().toLowerCase()
    if(!email || email.length>254) {
      await finish('review_required',undefined,'invalid_verified_email')
      return 'review_required'
    }
    // UUID originates exclusively from the internal database. Never accept a
    // client-supplied People record ID, binding UUID or email claim.
    if(!/^[0-9a-f-]{36}$/i.test(id))throw new Error('invalid_internal_binding')
    const findBinding=()=>fetchAllRecords(baseId,tableId,pat,{
      filterFormula:'{DCC Website Member Binding ID}="'+id+'"',
    })
    const bound=await findBinding()
    if(bound.length>1){
      await finish('review_required',undefined,'duplicate_external_binding')
      return 'review_required'
    }

    let person:AirtablePerson | undefined=bound[0]
    if(person){
      const existingEmail=person.fields.Email
      if(typeof existingEmail!=='string' || existingEmail.trim().toLowerCase()!==email){
        await finish('review_required',undefined,'bound_email_mismatch')
        return 'review_required'
      }
    }else{
      // Any unbound legacy candidate is HUMAN review, not email-based takeover.
      // Airtable formula dialect is not SQL. Compare the legacy roster
      // locally so quoting/case/blank fields cannot silently hide collisions.
      // This CRM is small; pagination also handles future growth.
      const allPeople=await fetchAllRecords(baseId,tableId,pat)
      const matches=allPeople.filter(record=>
        typeof record.fields.Email==='string' &&
        record.fields.Email.trim().toLowerCase()===email
      )
      if(matches.length){
        await finish('review_required',undefined,'legacy_people_email_collision')
        return 'review_required'
      }
      const name=[user.firstName,user.lastName].filter(Boolean).join(' ').trim()
        || 'DCC website member'
      // Before this call, one global DB lease is held. On any subsequent
      // uncertainty, a durable job remains for manual review; never auto-retry.
      const created=await createAirtableRecords(baseId,tableId,pat,[{fields:{
        Name:name.slice(0,80),
        Email:email,
        'DCC Website Member Binding ID':id,
        'Atlas Identity Verified':true,
        // Never set Atlas Public Consent / Public Profile? / publication state.
      }}])
      if(created.length!==1)throw new Error('airtable_write_unconfirmed')
      person=created[0]
      const check=await findBinding()
      if(check.length!==1 || check[0].id!==person.id){
        await finish('review_required',undefined,'external_binding_confirmation_failed')
        return 'review_required'
      }
    }
    await finish('active',person.id)
    return 'activated'
  } catch {
    // The upstream Airtable write might have succeeded despite a timeout.
    // SQL job remains PROCESSING if finalization is unavailable. Never let
    // another worker automatically retry a potentially duplicated create.
    try { await finish('review_required',undefined,'provider_outcome_uncertain') }
    catch { /* Hold the claim; review the processing job manually. */ }
    return 'review_required'
  }
}
