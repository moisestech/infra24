import { z } from 'zod'
import { isInterestId, type AtlasProfile, type InterestId } from './atlas'

export const ATLAS_DISCLOSURE_VERSION = 'dcc-atlas-public-v1-2026-11-15'
export const ATLAS_PUBLIC_CONSENT = 'I ask DCC to publish my approved name, summary, practice, interests and links in its public network, including search engines. My email stays private. DCC will review my submission and confirm my identity before publishing. I can ask DCC to change or remove my profile. This does not subscribe me to updates or authorize introductions.'
export type ProfileLink = { label: string; url: string }

export function publicHttpsUrl(raw: string): string | null {
  try {
    const url = new URL(raw)
    if (url.protocol !== 'https:' || url.username || url.password || !url.hostname.includes('.') || url.hostname.endsWith('.local')) return null
    return url.toString()
  } catch { return null }
}
const linkSchema = z.object({
  label: z.string().trim().min(1).max(40),
  url: z.string().trim().max(600).refine((url) => publicHttpsUrl(url) !== null, 'Use a full https:// link.'),
}).strict()

export const atlasIntakeSchema = z.object({
  submissionKey: z.string().uuid(),
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(254),
  summary: z.string().trim().min(10).max(280),
  practice: z.string().trim().min(2).max(200),
  interests: z.array(z.string().refine(isInterestId)).max(6),
  links: z.array(linkSchema).min(1).max(5),
  publicConsent: z.literal(true),
  disclosureVersion: z.literal(ATLAS_DISCLOSURE_VERSION),
  company: z.string().max(0),
}).strict()
export type AtlasIntake = z.infer<typeof atlasIntakeSchema>

export function approvedLinks(value: unknown): ProfileLink[] {
  let candidate = value
  if (typeof value === 'string') {
    try { candidate = JSON.parse(value) } catch { return [] }
  }
  if (!Array.isArray(candidate)) return []
  return candidate.slice(0, 5).flatMap((item) => {
    const parsed = linkSchema.safeParse(item)
    return parsed.success ? [{ label: parsed.data.label, url: publicHttpsUrl(parsed.data.url)! }] : []
  })
}

/** Public data can only come from explicitly reviewed People fields. */
export function approvedAirtableProfile(fields: Record<string, unknown>): (AtlasProfile & { links: ProfileLink[] }) | null {
  if (fields['Atlas Publication State'] !== 'Approved' || fields['Atlas Public Consent'] !== true || fields['Atlas Identity Verified'] !== true || fields['Public Profile?'] !== true) return null
  const slug = typeof fields['Profile Slug'] === 'string' ? fields['Profile Slug'] : ''
  const name = typeof fields['Display Name'] === 'string' ? fields['Display Name'].trim() : ''
  const summary = typeof fields['Short Bio'] === 'string' ? fields['Short Bio'].trim() : ''
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || !name || !summary) return null
  const practice = Array.isArray(fields['Public Skills']) ? fields['Public Skills'].filter((v): v is string => typeof v === 'string').slice(0, 10) : []
  const interests = Array.isArray(fields['Atlas Interests']) ? fields['Atlas Interests'].filter((v): v is InterestId => typeof v === 'string' && isInterestId(v)) : []
  const links = approvedLinks(fields['Atlas Public Links'])
  // A portfolio link is helpful but not required for an approved public profile.
  // Member onboarding should not demand a website before someone is discoverable.
  return { slug, name: name.slice(0, 80), summary: summary.slice(0, 280), practice, interests, links, ...(links[0] ? { website: links[0].url } : {}) }
}
