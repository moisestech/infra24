import { parseFeaturedArtistNames, personNameMatchesFeatured } from '@/lib/oolite/knowledge-cluster-ids'
import { rankAlumniForQuestion } from '@/lib/memory-agent/retrieve'
import type { AlumniAirtableRow } from '@/lib/airtable/alumni-service'

describe('exhibition people ranking boost', () => {
  const rows: AlumniAirtableRow[] = [
    {
      id: 'crm_people:recShayla',
      name: 'Shayla Marshall',
      topics: [],
      themes: [],
      publicBio: 'Mixed-media artist in Sites of the Self.',
    },
    {
      id: 'crm_people:recOther',
      name: 'Unrelated Artist',
      topics: [],
      themes: [],
    },
  ]

  it('boosts artists listed in Sites of the Self featured artists', () => {
    const ranked = rankAlumniForQuestion(
      rows,
      'Who is exhibiting in Sites of the Self?',
      null,
      new Map(),
      {
        featuredArtistNames: parseFeaturedArtistNames(
          'Diego Gabaldon; Shayla Marshall; Bex McCharen'
        ),
        relatedPeopleIds: ['recShayla'],
      }
    )
    expect(ranked[0]?.row.name).toBe('Shayla Marshall')
  })

  it('matches accented and unaccented names', () => {
    expect(personNameMatchesFeatured('Jose Delgado Zuniga', 'José Delgado Zúñiga')).toBe(true)
  })
})
