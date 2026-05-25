/**
 * @deprecated Import from `@/lib/dcc/signup` instead.
 */
export { DCC_SIGNUP_COPY, DCC_SIGNUP_COPY as DCC_INDEX_FORM_COPY } from '@/lib/dcc/signup/copy'
export { dccSignupFormSchema, type DccSignupFormInput } from '@/lib/dcc/signup/schema'
export { mapSignupToAirtableFields, mapConsentAnswer, mapPublicListingConsent } from '@/lib/dcc/signup/map-to-airtable'
export { getPathwayById, SIGNUP_PATHWAYS } from '@/lib/dcc/signup/pathways'

import { getPathwayById } from '@/lib/dcc/signup/pathways'
import { mapSignupToAirtableFields } from '@/lib/dcc/signup/map-to-airtable'
import type { DccSignupFormInput } from '@/lib/dcc/signup/schema'

/** @deprecated use dccSignupFormSchema */
export { dccSignupFormSchema as dccIndexSignupSchema }

/** @deprecated use DccSignupFormInput */
export type DccIndexSignupInput = DccSignupFormInput

/** @deprecated use mapSignupToAirtableFields */
export function mapDccIndexSignupToAirtableFields(
  input: Omit<DccSignupFormInput, 'pathway' | 'publicListingConsent'> & {
    publicListingConsent?: DccSignupFormInput['publicListingConsent']
    sourceTag?: string
  }
): Record<string, unknown> {
  return mapSignupToAirtableFields(
    {
      ...input,
      source: input.source ?? input.sourceTag,
      publicListingConsent: input.publicListingConsent ?? 'ask',
      pathway: 'join_dcc_index',
    },
    getPathwayById('join_dcc_index')
  )
}

/** @deprecated */
export const DCC_INDEX_FORM_QUESTIONS = {} as const
