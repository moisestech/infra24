import 'server-only'
import { createClient } from '@supabase/supabase-js'
import { approvedAirtableProfile, ATLAS_PUBLIC_CONSENT, type AtlasIntake } from './intake'

const PUBLIC_FIELDS = ['Display Name', 'Profile Slug', 'Short Bio', 'Public Skills', 'Public Profile?', 'Atlas Publication State', 'Atlas Public Consent', 'Atlas Identity Verified', 'Atlas Interests', 'Atlas Public Links', 'DCC Website Member Binding ID']
const credential = () => process.env.AIRTABLE_DCC_ATLAS_API_KEY?.trim()
const base = () => process.env.AIRTABLE_DCC_ATLAS_BASE_ID?.trim()
const people = () => process.env.AIRTABLE_DCC_ATLAS_PEOPLE_TABLE?.trim()
const intake = () => process.env.AIRTABLE_DCC_ATLAS_INTAKE_TABLE?.trim()
export const atlasReadConfigured = () => Boolean(credential() && base() && people())
export const atlasIntakeConfigured = () => Boolean(process.env.DCC_ATLAS_INTAKE_ENABLED === 'true' && credential() && base() && people() && intake())

function tableUrl(table: string) {
  return new URL(`https://api.airtable.com/v0/${encodeURIComponent(base()!)}/${encodeURIComponent(table)}`)
}
async function request(url: URL, init: RequestInit = {}) {
  const response = await fetch(url, { ...init, cache: 'no-store', signal: AbortSignal.timeout(10000), headers: { Authorization: `Bearer ${credential()}`, 'Content-Type': 'application/json' } })
  // Never include upstream bodies: they may contain private data or provider details.
  if (!response.ok) throw new Error('ATLAS_PROVIDER_UNAVAILABLE')
  return response.json() as Promise<{ records: Array<{ id: string; fields: Record<string, unknown> }>; offset?: string }>
}

export async function readPublicAtlas() {
  if (!atlasReadConfigured()) throw new Error('ATLAS_NOT_CONFIGURED')
  const records: Array<{ id: string; fields: Record<string, unknown> }> = []
  let offset: string | undefined
  let pages = 0
  do {
    const url = tableUrl(people()!)
    PUBLIC_FIELDS.forEach((field) => url.searchParams.append('fields[]', field))
    url.searchParams.set('filterByFormula', 'AND({Atlas Publication State}="Approved",{Atlas Public Consent}=1,{Atlas Identity Verified}=1,{Public Profile?}=1)')
    if (offset) url.searchParams.set('offset', offset)
    const page = await request(url)
    records.push(...page.records)
    offset = page.offset
    pages++
    if (offset && pages >= 20) throw new Error('ATLAS_PAGE_LIMIT')
  } while (offset)
  // A website-member's Airtable approval flags are necessary but NOT sufficient.
  // DB grants are the revocation-first authoritative gate, preventing an external
  // provider update from re-publishing an owner who withdrew during review.
  // Legacy editorial people without a DCC website binding continue under their
  // separately reviewed Airtable flags until explicitly migrated.
  const guarded = new Set<string>()
  // Separate emergency public visibility switch. Staff may stage/review a grant
  // without enabling public visibility for website-member profiles.
  const websiteProfilesPublic =
    process.env.DCC_PUBLIC_ATLAS_MEMBER_VISIBILITY_ENABLED === 'true'
  const hasWebsiteBindings = records.some(r =>
    typeof r.fields['DCC Website Member Binding ID'] === 'string')
  if (hasWebsiteBindings || process.env.DCC_STEWARD_PUBLICATION_ENABLED === 'true') {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) throw new Error('ATLAS_PUBLICATION_GUARD_UNAVAILABLE')
    const db = createClient<any>(url,key,{auth:{persistSession:false,autoRefreshToken:false}})
    const bindings: Array<{id:string;state:string;airtable_person_id:string|null}> = []
    for(let i=0;i<records.length;i+=40) {
      const recordIds = records.slice(i,i+40).map(record=>record.id)
      const {data,error} = await db.from('dcc_platform_member_bindings')
        .select('id,state,airtable_person_id').in('airtable_person_id',recordIds)
      if(error) throw new Error('ATLAS_PUBLICATION_GUARD_UNAVAILABLE')
      bindings.push(...(data??[]))
    }
    const ids=bindings.map(b=>b.id)
    const grants: Array<{binding_id:string;state:string;slug:string;airtable_person_id:string}> = []
    for(let i=0;i<ids.length;i+=40) {
      const {data,error} = await db.from('dcc_member_publication_grants')
        .select('binding_id,state,slug,airtable_person_id')
        .in('binding_id',ids.slice(i,i+40)).eq('state','approved')
      if(error) throw new Error('ATLAS_PUBLICATION_GUARD_UNAVAILABLE')
      grants.push(...(data??[]))
    }
    const byRecord=new Map(bindings.map(b=>[b.airtable_person_id,b]))
    const byBinding=new Map(grants.map(g=>[g.binding_id,g]))
    for(const record of records) {
      const binding=byRecord.get(record.id)
      const fieldId=record.fields['DCC Website Member Binding ID']
      if (typeof fieldId === 'string' && !websiteProfilesPublic) continue
      if(!binding) {
        // Legacy reviewed People are not website memberships; never accept a
        // stray unresolved binding from the CRM as a public identity.
        if(typeof fieldId !== 'string') guarded.add(record.id)
        continue
      }
      const grant=byBinding.get(binding.id)
      if(binding.state==='active' && fieldId===binding.id &&
        grant?.state==='approved' && grant.airtable_person_id===record.id &&
        grant.slug===record.fields['Profile Slug']) guarded.add(record.id)
    }
  } else {
    for(const record of records) {
      if(typeof record.fields['DCC Website Member Binding ID'] !== 'string')
        guarded.add(record.id)
    }
  }
  const projected = records.filter(r=>guarded.has(r.id))
    .map(record => approvedAirtableProfile(record.fields))
    .filter((profile): profile is NonNullable<typeof profile> => profile !== null)
  const counts = new Map<string, number>()
  projected.forEach((profile) => counts.set(profile.slug, (counts.get(profile.slug) ?? 0) + 1))
  // A slug collision must not silently attach the wrong person's public URL.
  return projected.filter((profile) => counts.get(profile.slug) === 1)
}

export async function stageAtlasSubmission(submission: AtlasIntake) {
  if (!atlasIntakeConfigured()) throw new Error('ATLAS_NOT_CONFIGURED')
  // UUID-only input permits a constant, non-user-programmable formula. A retry stays pending.
  const lookup = tableUrl(intake()!)
  lookup.searchParams.set('filterByFormula', `{Submission Key}="${submission.submissionKey}"`)
  lookup.searchParams.set('maxRecords', '1')
  lookup.searchParams.append('fields[]', 'Submission Key')
  const existing = await request(lookup)
  if (existing.records.length) return
  const saved = await request(tableUrl(intake()!), { method: 'POST', body: JSON.stringify({ records: [{ fields: {
    Submission: `Profile request — ${submission.name}`,
    'Submission Key': submission.submissionKey,
    'Display Name': submission.name,
    'Verification Email': submission.email,
    Summary: submission.summary,
    Practice: submission.practice,
    Interests: Array.from(new Set(submission.interests)),
    'Links JSON': JSON.stringify(submission.links),
    'Public Profile Consent': true,
    'Disclosure Version': submission.disclosureVersion,
    'Consent Text': ATLAS_PUBLIC_CONSENT,
    'Submitted At': new Date().toISOString(),
    'Review State': 'Pending',
  } }] }) })
  if (!saved.records?.length) throw new Error('ATLAS_SAVE_UNCONFIRMED')
}
