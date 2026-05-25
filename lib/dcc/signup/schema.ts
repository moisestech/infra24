import { z } from 'zod'
import {
  CONTACT_CATEGORY_OPTIONS,
  INTEREST_TAG_OPTIONS,
  PRACTICE_TAG_OPTIONS,
} from '@/lib/network-builder/people-select-options'
import { parsePathwayParam, type SignupPathwayId } from '@/lib/dcc/signup/pathways'

const categoryTuple = CONTACT_CATEGORY_OPTIONS as unknown as [string, ...string[]]

export const dccSignupFormSchema = z.object({
  pathway: z
    .string()
    .optional()
    .transform((v) => parsePathwayParam(v)),
  fullName: z.string().trim().min(2, 'Full name is required'),
  email: z.string().trim().email('Valid email is required'),
  city: z.string().trim().min(2, 'City is required'),
  contactCategory: z.enum(categoryTuple),
  practiceTags: z.array(z.string()).min(1, 'Select at least one practice area'),
  digitalOrientationStatement: z
    .string()
    .trim()
    .min(20, 'Please share at least a short statement about your connection to digital culture'),
  website: z.string().trim().optional(),
  instagram: z.string().trim().optional(),
  linkedin: z.string().trim().optional(),
  interestTags: z.array(z.string()).min(1, 'Select at least one interest'),
  consentAnswer: z.enum(['yes', 'specific', 'no']),
  newsletterOptIn: z.boolean().optional(),
  publicListingConsent: z.enum(['yes', 'ask', 'no']),
  researchContributor: z.boolean().optional(),
  source: z.string().trim().optional(),
  campaignKey: z.string().trim().optional(),
})

export type DccSignupFormInput = z.infer<typeof dccSignupFormSchema> & { pathway: SignupPathwayId }

export { PRACTICE_TAG_OPTIONS, INTEREST_TAG_OPTIONS, CONTACT_CATEGORY_OPTIONS }
