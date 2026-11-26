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
  // Website members are served exclusively from the reviewed SQL snapshot,
  // never from mutable Airtable profile fields or the current private draft.
  const websiteProfilesPublic = process.env.DCC_PUBLIC_ATLAS_MEMBER_VISIBILITY_ENABLED === 'true'
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  const mustCheck = websiteProfilesPublic || process.env.DCC_STEWARD_PUBLICATION_ENABLED === 'true'
    || process.env.DCC_MEMBER_EVENT_CAPTURE_ENABLED === 'true'
    || records.some(r => Boolean(r.fields['DCC Website Member Binding ID']))
  if (mustCheck && (!url || !key)) throw new Error('ATLAS_PUBLICATION_GUARD_UNAVAILABLE')
  const boundRecords = new Set<string>()
  const snapshots: NonNullable<ReturnType<typeof approvedAirtableProfile>>[] = []
  if (url && key) {
    const db = createClient<any>(url,key,{auth:{persistSession:false,autoRefreshToken:false}})
    // Check canonical record IDs even when the Airtable marker was erased.
    for (let i=0;i<records.length;i+=40) {
      const {data,error}=await db.from('dcc_platform_member_bindings')
        .select('airtable_person_id').in('airtable_person_id',records.slice(i,i+40).map(r=>r.id))
      if(error) throw new Error('ATLAS_PUBLICATION_GUARD_UNAVAILABLE')
      for (const row of data??[]) if(row.airtable_person_id) boundRecords.add(row.airtable_person_id)
    }
    if (websiteProfilesPublic) {
      const {data,error}=await db.rpc('dcc_list_approved_passports')
      if(error || !Array.isArray(data)) throw new Error('ATLAS_PUBLICATION_GUARD_UNAVAILABLE')
      for (const row of data) {
        const profile=approvedAirtableProfile({
          'Atlas Publication State':'Approved','Atlas Public Consent':true,
          'Atlas Identity Verified':true,'Public Profile?':true,
          'Profile Slug':row.slug,'Display Name':row.display_name,'Short Bio':row.summary,
          'Public Skills':row.practices,'Atlas Interests':row.interests,'Atlas Public Links':row.public_links,
        })
        if(profile) snapshots.push(profile)
      }
    }
  }
  const snapshotSlugs = new Set(snapshots.map(profile=>profile.slug))
  const projected = records.filter(r=>!r.fields['DCC Website Member Binding ID'] && !boundRecords.has(r.id))
    .map(record=>approvedAirtableProfile(record.fields))
    .filter((profile): profile is NonNullable<typeof profile> => profile !== null)
    .filter(profile=>!snapshotSlugs.has(profile.slug))
    .concat(snapshots)
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
