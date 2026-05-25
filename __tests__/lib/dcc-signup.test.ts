import {
  dccSignupFormSchema,
  getPathwayById,
  mapConsentAnswer,
  mapPublicListingConsent,
  mapSignupToAirtableFields,
} from '@/lib/dcc/signup'
import { DEFAULT_DCC_PEOPLE_FIELD_MAP } from '@/lib/network-builder/field-map'
import {
  GRAPH_LAYER_OPTIONS,
  PUBLIC_PROFILE_CONSENT_OPTIONS,
} from '@/lib/network-builder/people-select-options'

describe('dcc signup mapping', () => {
  const validPayload = {
    fullName: 'Alex Rivera',
    email: 'alex@example.com',
    city: 'Miami',
    contactCategory: 'Artist' as const,
    practiceTags: ['AI Art', 'Video'],
    digitalOrientationStatement:
      'I work with generative video and AI tools to explore Miami street culture online.',
    website: 'https://alexrivera.art',
    instagram: '@alexrivera',
    linkedin: 'https://linkedin.com/in/alexrivera',
    interestTags: ['DCC Index', 'Workshops'],
    consentAnswer: 'yes' as const,
    newsletterOptIn: true,
    publicListingConsent: 'ask' as const,
    source: 'born-digital-era-may',
    pathway: 'join_dcc_index' as const,
  }

  it('validates a complete signup payload', () => {
    const parsed = dccSignupFormSchema.safeParse(validPayload)
    expect(parsed.success).toBe(true)
  })

  it('maps to Airtable People fields with updated defaults', () => {
    const pathway = getPathwayById('join_dcc_index')
    const fields = mapSignupToAirtableFields(validPayload, pathway)
    const F = DEFAULT_DCC_PEOPLE_FIELD_MAP

    expect(fields[F.name]).toBe('Alex Rivera')
    expect(fields[F.email]).toBe('alex@example.com')
    expect(fields[F.practiceTags]).toEqual(['AI Art', 'Video'])
    expect(fields[F.consentStatus]).toBe('Subscribed')
    expect(fields[F.publicProfileConsent]).toBe(PUBLIC_PROFILE_CONSENT_OPTIONS.askBeforePublishing)
    expect(fields[F.source]).toBe('Online (born-digital-era-may)')
    expect(fields[F.signupPathway]).toBe('Join the DCC Index')
    expect(fields[F.dccSignupStatus]).toBe('Signed Up')
    expect(fields[F.followUpCadence]).toBe('60 Days')
    expect(fields[F.recordType]).toBe('Named Person')
    expect(fields[F.graphLayer]).toBe(GRAPH_LAYER_OPTIONS.networkNode)
    expect(fields[F.relationshipStrength]).toBe('Unknown')
    expect(fields[F.agentNotes]).toMatch(/\/network\/signup/)
    expect(fields[F.demoReadiness]).toBe('Needs Review')
    expect(fields[F.researchParticipationStatus]).toBe('Not Asked')
    expect(fields[F.signupSubmittedAt]).toBeTruthy()
    expect(fields[F.miami]).toBe(true)
  })

  it('maps consent and public listing answers correctly', () => {
    const F = DEFAULT_DCC_PEOPLE_FIELD_MAP
    const pathway = getPathwayById('join_dcc_index')

    expect(mapConsentAnswer('specific', false)).toBe('Needs Confirmation')
    expect(mapConsentAnswer('no', false)).toBe('Do Not Contact')
    expect(mapPublicListingConsent('yes')).toBe(PUBLIC_PROFILE_CONSENT_OPTIONS.publicListingOk)

    expect(
      mapSignupToAirtableFields({ ...validPayload, publicListingConsent: 'no' }, pathway)[
        F.publicProfileConsent
      ]
    ).toBe(PUBLIC_PROFILE_CONSENT_OPTIONS.doNotPublish)
  })
})
