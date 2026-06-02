import type { EdgeZonesNetworkIndexEntry } from '@/lib/marketing/edgezones-network-index'
import {
  mergeEdgeZonesNetworkIndex,
  staticProfilesToArtistProfiles,
} from '@/lib/marketing/edgezones-network-index'
import type { EdgeZonesArtistProfile } from '@/lib/marketing/edgezones-artists'

describe('edgeZonesNetworkIndex', () => {
  const sample: EdgeZonesNetworkIndexEntry[] = [
    {
      slug: 'test-artist',
      name: 'Test Artist',
      bio: 'Static bio',
      instagram: 'testartist',
      website: 'example.com',
    },
  ]

  it('maps static entries to artist profiles', () => {
    const profiles = staticProfilesToArtistProfiles(sample)
    expect(profiles).toHaveLength(1)
    expect(profiles[0].name).toBe('Test Artist')
    expect(profiles[0].instagram).toBe('https://instagram.com/testartist')
    expect(profiles[0].website).toBe('https://example.com')
    expect(profiles[0].id).toBe('edgezones-static-test-artist')
  })

  it('merges Airtable data over static by name', () => {
    const airtable: EdgeZonesArtistProfile[] = [
      {
        id: 'recAirtable',
        name: 'Test Artist',
        bio: 'Airtable bio',
        practiceTags: ['net art'],
      },
    ]
    const merged = mergeEdgeZonesNetworkIndex(sample, airtable)
    expect(merged[0].bio).toBe('Airtable bio')
    expect(merged[0].id).toBe('recAirtable')
    expect(merged[0].instagram).toBe('https://instagram.com/testartist')
  })
})
