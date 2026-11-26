import { z } from 'zod'
import { isInterestId } from '@/lib/dcc/community/atlas'

const link = z.object({
  label: z.string().trim().min(1).max(40),
  url: z.string().trim().url().max(600).refine(
    value => /^https:\/\//i.test(value) && !new URL(value).username && !new URL(value).password,
    'Use a public https:// link without login credentials',
  ),
}).strict()

/** Editable OWNER-only data. Submission does not make the member discoverable. */
export const ownerPassportSchema = z.object({
  displayName: z.string().trim().min(2).max(80),
  summary: z.string().trim().max(280),
  practices: z.array(z.string().trim().min(2).max(80)).max(12)
    .transform(items => Array.from(new Set(items))),
  interests: z.array(z.string().refine(isInterestId)).max(6)
    .transform(items => Array.from(new Set(items))),
  links: z.array(link).max(5),
}).strict()

export const DCC_PUBLIC_PROFILE_DISCLOSURE = 'dcc-public-profile-request-v1-2026-11-22'
export const requestPublicPassportSchema = z.object({
  revision: z.number().int().min(1).max(2147483646),
  consent: z.literal(true),
  disclosureVersion: z.literal(DCC_PUBLIC_PROFILE_DISCLOSURE),
}).strict()
export const ownerPassportSaveSchema = ownerPassportSchema.extend({ revision: z.number().int().min(0).max(2147483646) })
export type OwnerPassport = z.infer<typeof ownerPassportSchema>

export type OwnerMembershipState =
  'pending_verification' | 'pending_reconciliation' | 'review_required' | 'active'
  | 'withdrawn' | 'suspended' | 'deleted'
export function mayEditOwnerPassport(state: OwnerMembershipState): boolean {
  // A new verified account may prepare a PRIVATE draft while People reconciliation waits.
  return state === 'pending_reconciliation' || state === 'active'
}
export function mayRequestPublicPassport(state: OwnerMembershipState): boolean {
  // Never initiate publication consent until the identity is bound to one People record.
  return state === 'active'
}
