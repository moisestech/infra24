import { seedRecordToAirtableFields } from '@/lib/oolite/programming-seed'
import { DEFAULT_PROGRAMMING_FIELD_MAP } from '@/lib/memory-agent/airtable-programming'

describe('seedRecordToAirtableFields', () => {
  it('maps From Within seed row to Airtable field names', () => {
    const fields = seedRecordToAirtableFields(
      {
        title: 'From Within',
        recordType: 'exhibition',
        status: 'coming_soon',
        visibility: 'public',
        startDate: '2026-07-08',
        endDate: '2026-10-04',
        locationName: 'Oolite Arts Vitrine',
        summary: 'Youth Residents exhibition',
        featuredArtists: 'Ana Blanco; Noa Garcia',
        imageUrl: 'https://example.com/from-within.jpg',
        smartSignEligible: true,
        publicAiApproved: true,
        priority: 8,
        tags: ['exhibition', 'youth residents'],
      },
      'recRiKB2W96uzTfY0'
    )

    expect(fields[DEFAULT_PROGRAMMING_FIELD_MAP.title]).toBe('From Within')
    expect(fields[DEFAULT_PROGRAMMING_FIELD_MAP.organization]).toEqual(['recRiKB2W96uzTfY0'])
    expect(fields[DEFAULT_PROGRAMMING_FIELD_MAP.recordType]).toBe('exhibition')
    expect(fields[DEFAULT_PROGRAMMING_FIELD_MAP.status]).toBe('coming_soon')
    expect(fields[DEFAULT_PROGRAMMING_FIELD_MAP.visibility]).toBe('public')
  })
})

describe('oolite programming seed file', () => {
  it('includes From Within and Sites of the Self', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const seed = require('../../data/oolite-programming-seed.json') as {
      organizationRecordId: string
      records: Array<{ title: string }>
    }
    expect(seed.organizationRecordId).toBe('recRiKB2W96uzTfY0')
    expect(seed.records.map((r) => r.title)).toEqual(
      expect.arrayContaining([
        'From Within',
        'Sites of the Self',
        'Our New Home — Little River Campus',
      ])
    )
    expect(seed.records.some((r) => r.title === 'Our New Home — Little River Campus')).toBe(true)
  })
})
