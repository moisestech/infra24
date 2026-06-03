import {
  dedupeDirectoryArtists,
  enrichAlumniWithDirectoryArtists,
  galleryUrlsFromArtistMetadata,
  matchesStudioResidents2026,
  normalizeDirectoryPersonName,
} from '@/lib/organization/artist-alumni-bridge'
import type { AlumniAirtableRow } from '@/lib/airtable/alumni-service'

const baseAlumni = (overrides: Partial<AlumniAirtableRow>): AlumniAirtableRow => ({
  id: 'rec1',
  name: 'Bex McCharen',
  artistName: 'Bex McCharen',
  topics: [],
  themes: [],
  ...overrides,
})

describe('normalizeDirectoryPersonName', () => {
  it('folds case and punctuation', () => {
    expect(normalizeDirectoryPersonName('  Bex McCharen ')).toBe('bex mccharen')
  })
})

describe('dedupeDirectoryArtists', () => {
  it('keeps the richer profile for duplicate names', () => {
    const out = dedupeDirectoryArtists([
      { id: 'a', name: 'Ana Mosquera' },
      {
        id: 'b',
        name: 'Ana Mosquera',
        profile_image: 'https://example.com/ana.jpg',
        metadata: { source: 'seed_oolite_studio_residents_2026', residency_cohort: '2026' },
      },
    ])
    expect(out).toHaveLength(1)
    expect(out[0]?.id).toBe('b')
  })
})

describe('enrichAlumniWithDirectoryArtists', () => {
  it('merges headshot from artist_profiles when Airtable has no image', () => {
    const enriched = enrichAlumniWithDirectoryArtists(
      [baseAlumni({})],
      [
        {
          id: 'uuid-bex',
          name: 'Bex McCharen',
          profile_image:
            'https://res.cloudinary.com/dkod1at3i/image/upload/v1779993573/Bex_McCharen-705x705_qosppg.jpg',
          metadata: {
            residency_type: 'Studio Resident',
            residency_cohort: '2026',
            medium: 'Photography',
          },
        },
      ],
      'oolite'
    )
    expect(enriched[0]?.photoUrl).toContain('cloudinary')
    expect(enriched[0]?.medium).toBe('Photography')
    expect(enriched[0]?.residencyYear).toBe('2026')
    expect(enriched[0]?.linkedArtist?.artistId).toBe('uuid-bex')
  })
})

describe('galleryUrlsFromArtistMetadata', () => {
  it('collects artwork_urls and portrait frame URLs', () => {
    const urls = galleryUrlsFromArtistMetadata({
      artwork_urls: ['https://example.com/a.jpg'],
      portraits: { full_width_landscape: ['https://example.com/b.jpg'] },
    })
    expect(urls).toHaveLength(2)
  })
})

describe('matchesStudioResidents2026', () => {
  it('matches seed studio resident rows', () => {
    expect(
      matchesStudioResidents2026({
        id: 'x',
        name: 'Test',
        metadata: { residency_type: 'Studio Resident', residency_cohort: '2026' },
      })
    ).toBe(true)
  })
})
