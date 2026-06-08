import {
  applyProgrammingQuestionFilters,
  knowledgeRecordToContextText,
  rankProgrammingForQuestion,
} from '@/lib/memory-agent/programming'
import { enrichProgrammingRecordsWithPeopleNames } from '@/lib/memory-agent/linked-people-names'
import type { KnowledgeRecord } from '@/lib/memory-agent/knowledge-record'

const sitesRecord: KnowledgeRecord = {
  id: 'airtable_programming:recSites',
  orgSlug: 'oolite',
  source: 'airtable_programming',
  recordKind: 'exhibition',
  title: 'Sites of the Self',
  curator: 'René Morales, Senior Curatorial Fellow, Bakehouse Art Complex',
  artistRecordIds: ['recA', 'recB'],
  curatorRecordIds: ['recCurator'],
  programStaffRecordIds: ['recStaff1', 'recStaff2'],
}

describe('programming relationship context', () => {
  it('includes resolved artist, curator, and staff names in context text', () => {
    const [enriched] = enrichProgrammingRecordsWithPeopleNames([sitesRecord], new Map([
      ['recA', 'Bex McCharen'],
      ['recB', 'Shayla Marshall'],
      ['recCurator', 'René Morales'],
      ['recStaff1', 'Melissa Wallen'],
      ['recStaff2', 'Rina Carvajal'],
    ]))
    const text = knowledgeRecordToContextText(enriched)
    expect(text).toContain('Exhibiting artists: Bex McCharen; Shayla Marshall')
    expect(text).toContain('Curators: René Morales')
    expect(text).toContain('Program staff: Melissa Wallen; Rina Carvajal')
  })

  it('prioritizes Sites of the Self for curator and management questions', () => {
    const workshop: KnowledgeRecord = {
      id: 'airtable_programming:recWorkshop',
      orgSlug: 'oolite',
      source: 'airtable_programming',
      recordKind: 'workshop',
      title: 'The Fabric of Remembering',
      instructor: 'Bex McCharen',
    }
    const enriched = enrichProgrammingRecordsWithPeopleNames(
      [workshop, sitesRecord],
      new Map([
        ['recCurator', 'René Morales'],
        ['recStaff1', 'Melissa Wallen'],
        ['recStaff2', 'Rina Carvajal'],
      ])
    )

    const curated = applyProgrammingQuestionFilters(enriched, 'Who curated Sites of the Self?')
    expect(curated[0]?.title).toBe('Sites of the Self')

    const managed = applyProgrammingQuestionFilters(enriched, 'Who manages the exhibition?')
    expect(managed[0]?.title).toBe('Sites of the Self')

    const textileRanked = rankProgrammingForQuestion(
      enriched,
      'Which artist teaches textile workshops?',
      null,
      new Map()
    )
    expect(textileRanked[0]?.record.title).toBe('The Fabric of Remembering')
  })
})
