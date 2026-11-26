import 'server-only'
import { createHash, randomBytes } from 'node:crypto'
import { clerkClient } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { fetchAllRecords, patchAirtableRecord } from '@/lib/airtable/client'
import { clerkMembershipCaptureConfig } from './clerk-event'
import { MemberAccessError, requireOwnerMutationOrigin, PRIVATE_HEADERS } from './profile-store'
import { NextResponse } from 'next/server'

const personId = z.string().regex(/^rec[A-Za-z0-9]{14}$/)
const baseDecision = z.object({ requestId: z.string().uuid(), version: z.number().int().nonnegative() })
export const founderDecision = z.discriminatedUnion('action', [
  baseDecision.extend({ action: z.literal('challenge'), personId, method: z.enum(['in_person','established_channel']) }).strict(),
  baseDecision.extend({ action: z.enum(['approve','recover','hold','return','reject']) }).strict(),
])
export const ownerProof = z.object({ code: z.string().regex(/^[A-Za-z0-9_-]{32}$/) }).strict()
type Decision = z.infer<typeof founderDecision>
type StepFields = { p_person?: string; p_method?: string; p_digest?: string; p_primary?: string; p_existing?: boolean }

export function identityStore() {
  const cfg = clerkMembershipCaptureConfig(process.env)
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!cfg.enabled || !url || !key) throw new MemberAccessError(503,'identity_store_unavailable')
  return { instance: cfg.instance, db: createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}}) }
}
function requireIdentityWrites() {
  if (process.env.DCC_STEWARD_IDENTITY_RESOLUTION_ENABLED !== 'true' ||
      process.env.DCC_STEWARD_REVIEW_ENABLED !== 'true') {
    throw new MemberAccessError(503,'identity_resolution_disabled')
  }
}
function digest(value: string) { return createHash('sha256').update(value).digest('hex') }

async function currentPrimary(subject: string) {
  const user = await (await clerkClient()).users.getUser(subject)
  const primary = user.emailAddresses.find(entry => entry.id === user.primaryEmailAddressId)
  if (user.id !== subject || primary?.verification?.status !== 'verified' || !primary.emailAddress)
    throw new MemberAccessError(409,'verified_primary_required')
  const email = primary.emailAddress.trim().toLowerCase()
  return { email, stamp: digest([subject,primary.id,email].join('\0')) }
}

function peopleProvider() {
  const base = process.env.AIRTABLE_DCC_ATLAS_BASE_ID
  const table = process.env.AIRTABLE_DCC_ATLAS_PEOPLE_TABLE
  const pat = process.env.AIRTABLE_DCC_ATLAS_API_KEY
  if (!base || !table || !pat) throw new MemberAccessError(503,'identity_provider_unavailable')
  return { base, table, pat }
}

async function inspectPerson(id: string, binding: string, email: string) {
  if (!personId.safeParse(id).success || !z.string().uuid().safeParse(binding).success)
    throw new MemberAccessError(409,'identity_candidate_invalid')
  const {base,table,pat} = peopleProvider()
  const [people, links] = await Promise.all([
    fetchAllRecords(base,table,pat,{filterFormula:`RECORD_ID()="${id}"`}),
    fetchAllRecords(base,table,pat,{filterFormula:`{DCC Website Member Binding ID}="${binding}"`}),
  ])
  const row = people[0]
  if (people.length !== 1 || row?.id !== id || links.length > 1 || links.some(link => link.id !== id))
    throw new MemberAccessError(409,'identity_collision')
  const linked = row.fields['DCC Website Member Binding ID']
  const address = row.fields.Email
  if ((linked && linked !== binding) || (address && (typeof address !== 'string' || address.trim().toLowerCase() !== email)))
    throw new MemberAccessError(409,'identity_collision')
  if (Boolean(linked) !== (links.length === 1)) throw new MemberAccessError(409,'provider_reads_disagree')
  return { bound: linked === binding, verified: row.fields['Atlas Identity Verified'] === true }
}

async function step(store: ReturnType<typeof identityStore>, binding: string, actor: string,
    action: string, version: number, fields: StepFields = {}) {
  const {data,error} = await store.db.rpc('dcc_identity_review_step',{
    p_instance: store.instance, p_binding: binding, p_actor: actor, p_action: action, p_version: version, ...fields,
  })
  if (error && ['23514','23505','40001'].includes(error.code)) throw new MemberAccessError(409,'identity_review_changed')
  if (error || typeof data !== 'number' || data !== version+1) throw new MemberAccessError(503,'identity_confirmation_unavailable')
  return data
}
export async function proveOwnerIdentity(subject: string, code: string) {
  requireIdentityWrites()
  const store = identityStore()
  const {data:binding,error} = await store.db.from('dcc_platform_member_bindings').select('id')
    .eq('clerk_instance',store.instance).eq('clerk_user_id',subject).eq('state','review_required').maybeSingle()
  if (error) throw new MemberAccessError(503,'identity_store_unavailable')
  if (!binding) throw new MemberAccessError(409,'identity_proof_unavailable')
  const {data:review,error:readError} = await store.db.from('dcc_identity_reviews').select('version')
    .eq('binding_id',binding.id).eq('stage','awaiting_proof').maybeSingle()
  if (readError) throw new MemberAccessError(503,'identity_store_unavailable')
  if (!review) throw new MemberAccessError(409,'identity_proof_unavailable')
  const primary = await currentPrimary(subject)
  await step(store,binding.id,subject,'prove',review.version,{p_digest:digest(code),p_primary:primary.stamp})
  return { state:'proven' }
}
export async function decideFounderIdentity(input: Decision, actor: string) {
  requireIdentityWrites()
  const store = identityStore()
  const {requestId,version,action} = input
  if (action==='hold' || action==='return' || action==='reject') {
    await step(store,requestId,actor,action,version)
    return {state: { hold:'held',return:'returned',reject:'rejected' }[action]}
  }
  const {data:b,error} = await store.db.from('dcc_platform_member_bindings').select('id,clerk_user_id,state')
    .eq('clerk_instance',store.instance).eq('id',requestId).maybeSingle()
  if (error) throw new MemberAccessError(503,'identity_store_unavailable')
  if (!b || b.clerk_user_id===actor || !['review_required','pending_reconciliation'].includes(b.state))
    throw new MemberAccessError(409,'identity_review_changed')
  const primary = await currentPrimary(b.clerk_user_id)
  if (input.action==='challenge') {
    const person = await inspectPerson(input.personId,requestId,primary.email)
    const code = randomBytes(24).toString('base64url')
    await step(store,requestId,actor,'challenge',version,{
      p_person:input.personId,p_method:input.method,p_digest:digest(code),p_primary:primary.stamp,p_existing:person.bound,
    })
    return { state:'awaiting_proof',code }
  }

  const {data:review,error:readError} = await store.db.from('dcc_identity_reviews')
    .select('person_id,stage,version,primary_stamp').eq('binding_id',requestId).maybeSingle()
  if (readError) throw new MemberAccessError(503,'identity_store_unavailable')
  if (!review || review.version!==version || review.primary_stamp!==primary.stamp ||
      (action==='approve' ? review.stage!=='proven' : !['uncertain','confirming'].includes(review.stage)))
    throw new MemberAccessError(409,'identity_review_changed')
  const id: string = review.person_id
  let nextVersion = version
  if (action==='approve') {
    await inspectPerson(id,requestId,primary.email)
    nextVersion = await step(store,requestId,actor,'approve',version,{p_person:id,p_primary:primary.stamp})
  }
  try {
    // Re-read after SQL reserves both sides. Recovery never issues another provider write.
    const existing = await inspectPerson(id,requestId,primary.email)
    if (action==='approve' && (!existing.bound || !existing.verified)) {
      const {base,table,pat} = peopleProvider()
      await patchAirtableRecord(base,table,pat,id,{
        'DCC Website Member Binding ID':requestId, 'Atlas Identity Verified':true,
      })
    }
    const confirmed = await inspectPerson(id,requestId,primary.email)
    const fresh = await currentPrimary(b.clerk_user_id)
    if (!confirmed.bound || !confirmed.verified || fresh.stamp!==primary.stamp)
      throw new MemberAccessError(409,'provider_confirmation_needed')
    await step(store,requestId,actor,'confirm',nextVersion,{p_person:id,p_primary:fresh.stamp,p_existing:true})
    return {state:'resolved'}
  } catch (error) {
    if (action==='approve') {
      // If a successful SQL commit lost its response, its CAS rejects this transition.
      // Leave confirming/uncertain claims reserved until a founder obtains a positive readback.
      try { await step(store,requestId,actor,'uncertain',nextVersion) } catch { /* Re-read queue. */ }
    }
    if (error instanceof MemberAccessError) throw error
    throw new MemberAccessError(503,'provider_confirmation_needed')
  }
}

export async function identityRequest<T>(request: Request, schema: z.ZodType<T>) {
  requireOwnerMutationOrigin(request)
  const raw=await request.text()
  if(raw.length>1500) throw new MemberAccessError(413,'identity_request_too_large')
  let value: unknown
  try { value=JSON.parse(raw) } catch { throw new MemberAccessError(400,'invalid_json') }
  const parsed=schema.safeParse(value)
  if(!parsed.success) throw new MemberAccessError(400,'invalid_identity_request')
  return parsed.data
}
export function identityError(error: unknown) {
  return NextResponse.json({error:error instanceof MemberAccessError?error.code:'identity_service_unavailable'},
    {status:error instanceof MemberAccessError?error.status:503,headers:PRIVATE_HEADERS})
}

export async function ownerIdentityCase(subject: string) {
  requireIdentityWrites()
  const store = identityStore()
  const {data,error} = await store.db.from('dcc_platform_member_bindings').select('id,state')
    .eq('clerk_instance',store.instance).eq('clerk_user_id',subject).maybeSingle()
  if (error) throw new MemberAccessError(503,'identity_store_unavailable')
  return { requestId: data && ['pending_reconciliation','review_required'].includes(data.state) ? data.id : null }
}
