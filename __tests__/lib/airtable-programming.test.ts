import {
  dedupeProgrammingRecords,
  applyProgrammingQuestionFilters,
  applyIntentTimeFilter,
  rankProgrammingForQuestion,
  selectProgrammingContextRows,
} from '@/lib/memory-agent/programming'
import {
  filterAirtableProgrammingForMemoryAgent,
  mapAirtableProgrammingFixtures,
  mapAirtableProgrammingRow,
} from '@/lib/memory-agent/airtable-programming'
import {
  FROM_WITHIN_AIRTABLE_FIXTURE,
  OOLITE_PROGRAMMING_AIRTABLE_FIXTURES,
  SITES_OF_THE_SELF_AIRTABLE_FIXTURE,
} from '@/lib/memory-agent/programming-fixtures'

describe('mapAirtableProgrammingRow', () => {
  it('maps From Within exhibition fixture', () => {
    const record = mapAirtableProgrammingRow(FROM_WITHIN_AIRTABLE_FIXTURE, 'oolite')
    expect(record).toMatchObject({
      id: 'airtable_programming:recFromWithinFixture',
      source: 'airtable_programming',
      recordKind: 'exhibition',
      title: 'From Within',
      status: 'coming_soon',
      smartSignEligible: true,
      approvedForPublicAi: true,
      priority: 8,
      featuredArtists: expect.stringContaining('Ana Blanco'),
      imageUrl: expect.stringContaining('teens-resident-TJ-PHOTO'),
    })
  })

  it('maps Sites of the Self with curator and linked people roles', () => {
    const record = mapAirtableProgrammingRow(
      {
        ...SITES_OF_THE_SELF_AIRTABLE_FIXTURE,
        fields: {
          ...SITES_OF_THE_SELF_AIRTABLE_FIXTURE.fields,
          Artists: ['recArtist1', 'recArtist2'],
          Curators: ['recCurator1'],
          'Program Staff': ['recStaff1', 'recStaff2'],
        },
      },
      'oolite'
    )
    expect(record?.curator).toContain('René Morales')
    expect(record?.artistRecordIds).toEqual(['recArtist1', 'recArtist2'])
    expect(record?.curatorRecordIds).toEqual(['recCurator1'])
    expect(record?.programStaffRecordIds).toEqual(['recStaff1', 'recStaff2'])
    expect(record?.relatedPeopleIds).toEqual(['recArtist1', 'recArtist2'])
    expect(record?.priority).toBe(10)
    expect(record?.location).toContain('Oolite Arts Vitrine')
  })
})

describe('filterAirtableProgrammingForMemoryAgent', () => {
  const records = mapAirtableProgrammingFixtures(OOLITE_PROGRAMMING_AIRTABLE_FIXTURES, 'oolite')

  it('keeps approved public exhibitions in public mode', () => {
    const filtered = filterAirtableProgrammingForMemoryAgent(records, 'public', {
      recentDays: 365,
      now: new Date('2026-06-01T12:00:00Z'),
    })
    expect(filtered.map((r) => r.title)).toEqual(['From Within', 'Sites of the Self'])
  })

  it('drops non-approved rows in public mode', () => {
    const draft = mapAirtableProgrammingRow(
      {
        id: 'recDraft',
        fields: {
          Title: 'Draft Show',
          'Record Type': 'exhibition',
          Status: 'draft',
          Visibility: 'public',
          'Start Date': '2026-08-01',
          'Public AI Approved': false,
        },
      },
      'oolite'
    )!
    const filtered = filterAirtableProgrammingForMemoryAgent([draft, ...records], 'public', {
      recentDays: 365,
      now: new Date('2026-06-01T12:00:00Z'),
    })
    expect(filtered.some((r) => r.title === 'Draft Show')).toBe(false)
  })
})

describe('dedupeProgrammingRecords', () => {
  it('prefers Airtable over Supabase for same title and start date', () => {
    const airtable = mapAirtableProgrammingRow(FROM_WITHIN_AIRTABLE_FIXTURE, 'oolite')!
    const supabaseDup = {
      ...airtable,
      id: 'announcement:abc123',
      source: 'announcement' as const,
      sourceRecordId: 'abc123',
    }
    const deduped = dedupeProgrammingRecords([supabaseDup, airtable])
    expect(deduped).toHaveLength(1)
    expect(deduped[0]?.source).toBe('airtable_programming')
  })
})

describe('applyProgrammingQuestionFilters', () => {
  const records = mapAirtableProgrammingFixtures(OOLITE_PROGRAMMING_AIRTABLE_FIXTURES, 'oolite')

  it('prioritizes Sites of the Self for smart sign questions', () => {
    const filtered = applyProgrammingQuestionFilters(
      records,
      'What should go on the smart sign this summer?',
      new Date('2026-06-01T12:00:00Z')
    )
    expect(filtered[0]?.title).toBe('Sites of the Self')
  })

  it('surfaces exhibitions for coming up questions', () => {
    const timeFiltered = applyIntentTimeFilter(records, 'upcoming', new Date('2026-06-01T12:00:00Z'))
    const ranked = rankProgrammingForQuestion(
      applyProgrammingQuestionFilters(timeFiltered.records, 'What exhibitions are coming up?'),
      'What exhibitions are coming up?',
      null,
      new Map()
    )
    const selected = selectProgrammingContextRows(ranked, 4)
    expect(selected.map((r) => r.title)).toEqual(
      expect.arrayContaining(['From Within', 'Sites of the Self'])
    )
  })
})
