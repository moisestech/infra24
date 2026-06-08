import {
  applyProgrammingQuestionFilters,
  rankProgrammingForQuestion,
  selectProgrammingContextRows,
} from '@/lib/memory-agent/programming'
import { mapAirtableProgrammingFixtures } from '@/lib/memory-agent/airtable-programming'
import { OOLITE_PROGRAMMING_AIRTABLE_FIXTURES } from '@/lib/memory-agent/programming-fixtures'
import {
  indexProgrammingRowsByUpsertKey,
  mergeLinkedRecordIds,
  programmingUpsertKey,
} from '@/lib/oolite/programming-import'
import { workshopSeedToAirtableFields } from '@/lib/oolite/workshops-seed'
import { DEFAULT_PROGRAMMING_FIELD_MAP } from '@/lib/memory-agent/airtable-programming'

describe('programming upsert keys', () => {
  it('uses normalized title + start date', () => {
    expect(programmingUpsertKey('Fabric Workshop', '2026-07-14')).toBe(
      'fabric workshop::2026-07-14'
    )
  })

  it('indexes rows without colliding on title alone', () => {
    const rows = [
      {
        id: 'recA',
        fields: { Title: 'Intro to Print', 'Start Date': '2026-08-01' },
      },
      {
        id: 'recB',
        fields: { Title: 'Intro to Print', 'Start Date': '2026-09-01' },
      },
    ]
    const map = indexProgrammingRowsByUpsertKey(rows, 'Title', 'Start Date')
    expect(map.get('intro to print::2026-08-01')).toBe('recA')
    expect(map.get('intro to print::2026-09-01')).toBe('recB')
  })

  it('merges linked artist ids without dropping existing links', () => {
    expect(mergeLinkedRecordIds(['rec1', 'rec2'], 'rec2', 'rec3')).toEqual([
      'rec1',
      'rec2',
      'rec3',
    ])
  })
})

describe('workshop seed mapping', () => {
  it('maps workshop fields and artist links', () => {
    const fields = workshopSeedToAirtableFields(
      {
        title: 'The Fabric of Remembering: Cyanotype & Quilting',
        recordType: 'workshop',
        startDate: '2026-07-14',
        instructorName: 'Bex McCharen',
        bookable: true,
      },
      'recRiKB2W96uzTfY0',
      ['recuxPqeyh8PBiRky']
    )
    expect(fields[DEFAULT_PROGRAMMING_FIELD_MAP.recordType]).toBe('workshop')
    expect(fields[DEFAULT_PROGRAMMING_FIELD_MAP.instructor]).toBe('Bex McCharen')
    expect(fields[DEFAULT_PROGRAMMING_FIELD_MAP.artists]).toEqual(['recuxPqeyh8PBiRky'])
  })
})

describe('workshop QA ranking', () => {
  const records = mapAirtableProgrammingFixtures(OOLITE_PROGRAMMING_AIRTABLE_FIXTURES, 'oolite')
  const fabric = {
    ...records[1]!,
    id: 'airtable_programming:recFabric',
    recordKind: 'workshop' as const,
    title: 'The Fabric of Remembering: Cyanotype & Quilting',
    instructor: 'Bex McCharen',
    bookable: true,
    bookingCta: {
      label: 'Register',
      url: 'https://oolitearts.org/event/the-fabric-of-remembering-cyanotype-and-digital-photo-quilting/',
      grounded: true,
    },
    description: 'All skill levels welcome.',
    startsAt: '2026-07-14T00:00:00.000Z',
    endsAt: '2026-07-28T00:00:00.000Z',
  }
  const pool = [...records, fabric]

  it('prioritizes workshops for upcoming workshop questions', () => {
    const filtered = applyProgrammingQuestionFilters(pool, 'What workshops are coming up?')
    expect(filtered[0]?.recordKind).toBe('workshop')
  })

  it('prioritizes bookable workshops for registration questions', () => {
    const filtered = applyProgrammingQuestionFilters(
      pool,
      'What can I register for this summer?',
      new Date('2026-06-01T12:00:00Z')
    )
    const ranked = rankProgrammingForQuestion(
      filtered,
      'What can I register for this summer?',
      null,
      new Map()
    )
    const top = selectProgrammingContextRows(ranked, 1)[0]
    expect(top?.title).toContain('Fabric of Remembering')
  })

  it('surfaces beginner-friendly workshops', () => {
    const filtered = applyProgrammingQuestionFilters(
      pool,
      'Which workshops are beginner-friendly?'
    )
    expect(filtered[0]?.title).toContain('Fabric of Remembering')
  })
})

describe('oolite workshops seed file', () => {
  it('defines workshops with required upsert keys', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const seed = require('../../data/oolite-workshops-seed.json') as {
      organizationRecordId: string
      workshops: Array<{ title: string; startDate: string; recordType: string }>
    }
    expect(seed.organizationRecordId).toBe('recRiKB2W96uzTfY0')
    expect(seed.workshops.length).toBeGreaterThan(0)
    for (const row of seed.workshops) {
      expect(row.title.trim()).toBeTruthy()
      expect(row.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(row.recordType).toBe('workshop')
    }
  })
})
