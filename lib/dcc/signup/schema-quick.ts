import { z } from 'zod'
import { CONTACT_CATEGORY_OPTIONS } from '@/lib/network-builder/people-select-options'
import { parsePathwayParam } from '@/lib/dcc/signup/pathways'
import { dccAttributionPayloadSchema } from '@/lib/dcc/signup/schema-attribution'

const categoryTuple = CONTACT_CATEGORY_OPTIONS as unknown as [string, ...string[]]

/** Campaign / QR signup — minimal fields for mobile conversion. */
export const QUICK_INTEREST_OPTIONS = [
  'Join the DCC Index',
  'Attend public programs',
  'Book / attend workshops',
  'Collaborate with DCC',
  'Partner as an organization',
  'Receive exhibition updates',
  'Learn about AI + digital tools',
  'Volunteer / support',
] as const

export const dccSignupQuickSchema = z
  .object({
    formMode: z.literal('quick'),
    pathway: z
      .string()
      .optional()
      .transform((v) => parsePathwayParam(v)),
    fullName: z.string().trim().min(2, 'Full name is required'),
    email: z.string().trim().email('Valid email is required'),
    contactCategory: z.enum(categoryTuple),
    interestTags: z.array(z.string()).min(1, 'Select at least one interest'),
    consentAnswer: z.enum(['yes', 'specific', 'no']),
    newsletterOptIn: z.boolean().optional(),
    instagram: z.string().trim().optional(),
    website: z.string().trim().optional(),
    organization: z.string().trim().optional(),
    message: z.string().trim().optional(),
    source: z.string().trim().optional(),
    campaignKey: z.string().trim().optional(),
  })
  .merge(dccAttributionPayloadSchema)

export type DccSignupQuickInput = z.infer<typeof dccSignupQuickSchema>
