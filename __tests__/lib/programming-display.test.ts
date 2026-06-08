import { buildEventCardFields } from '@/lib/memory-agent/event-card-urls'
import {
  formatProgrammingDateRange,
  programmingStatusLabel,
} from '@/lib/memory-agent/programming-display'
import type { KnowledgeRecord } from '@/lib/memory-agent/knowledge-record'
import {
  indexProgrammingRowsByTitle,
  mergeProgrammingFieldChoices,
} from '@/lib/oolite/programming-import'

describe('programmingStatusLabel', () => {
  it('labels coming_soon for cards and copy', () => {
    expect(programmingStatusLabel('coming_soon')).toBe('Coming soon')
  })
})

describe('formatProgrammingDateRange', () => {
  it('formats exhibition dates without midnight times', () => {
    const label = formatProgrammingDateRange('2026-07-08', '2026-10-04')
    expect(label).toMatch(/Jul/)
    expect(label).toMatch(/Oct/)
    expect(label).toMatch(/2026/)
  })
})

describe('buildEventCardFields status and dates', () => {
  const record: KnowledgeRecord = {
    id: 'airtable_programming:recTest',
    orgSlug: 'oolite',
    source: 'airtable_programming',
    recordKind: 'exhibition',
    title: 'From Within',
    summary: 'Youth Residents exhibition',
    startsAt: '2026-07-08T00:00:00.000Z',
    endsAt: '2026-10-04T00:00:00.000Z',
    status: 'coming_soon',
    visibility: 'public',
    location: 'Oolite Arts Vitrine',
    sourceRecordId: 'recTest',
  }

  it('includes Coming soon and date range on event cards', () => {
    const fields = buildEventCardFields(record, 'public', 'oolite')
    expect(fields.statusLabel).toBe('Coming soon')
    expect(fields.dateLabel).toMatch(/Jul/)
    expect(fields.dateLabel).toMatch(/Oct/)
  })
})

describe('import upsert helpers', () => {
  it('indexes existing rows by normalized title', () => {
    const map = indexProgrammingRowsByTitle(
      [
        {
          id: 'recA',
          fields: { Title: 'From Within' },
        },
      ],
      'Title'
    )
    expect(map.get('from within')).toBe('recA')
  })
})

describe('mergeProgrammingFieldChoices', () => {
  it('merges tag options without dropping existing', () => {
    const merged = mergeProgrammingFieldChoices(['exhibition'], ['youth residents', 'exhibition'])
    expect(merged).toEqual(expect.arrayContaining(['exhibition', 'youth residents']))
  })
})
