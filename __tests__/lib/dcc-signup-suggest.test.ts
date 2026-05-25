import { mapSuggestToAirtableFields } from '@/lib/dcc/signup/suggest/map-to-airtable'
import { dccSuggestFormSchema } from '@/lib/dcc/signup/suggest/schema'
import { DEFAULT_SEED_CANDIDATES_FIELD_MAP } from '@/lib/network-builder/seed-candidates-field-map'

describe('dcc suggest pathway', () => {
  const validPayload = {
    suggestedName: 'Locust Projects archive node',
    whySuggest: 'Important Miami media art institution with strong digital culture programming and exhibition history.',
    sourceUrl: 'https://locustprojects.org',
    suggestedRole: 'Institution',
    practiceTags: ['Video', 'Installation'],
    miamiConnectionType: 'Miami institution connection',
    suggesterEmail: 'friend@example.com',
    source: 'network-research',
  }

  it('validates suggest payload', () => {
    expect(dccSuggestFormSchema.safeParse(validPayload).success).toBe(true)
  })

  it('maps to Seed Candidates with research defaults', () => {
    const fields = mapSuggestToAirtableFields(validPayload)
    const F = DEFAULT_SEED_CANDIDATES_FIELD_MAP
    expect(fields[F.candidateName]).toBe('Locust Projects archive node')
    expect(fields[F.graphLayer]).toBe('Research Node')
    expect(fields[F.demoReadiness]).toBe('Needs Review')
    expect(fields[F.reviewStatus]).toBe('To Review')
    expect(fields[F.recommendedBucket]).toBe('Research More')
  })
})
