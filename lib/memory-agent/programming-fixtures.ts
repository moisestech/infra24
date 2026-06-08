import type { AirtableRecord } from '@/lib/airtable/client'

/** Test / dev fixtures mirroring Oolite Airtable Programming rows. */
export const FROM_WITHIN_AIRTABLE_FIXTURE: AirtableRecord = {
  id: 'recFromWithinFixture',
  fields: {
    Title: 'From Within',
    Organization: ['recOoliteArtsFixture'],
    'Record Type': 'exhibition',
    Status: 'coming_soon',
    Visibility: 'public',
    'Start Date': '2026-07-08',
    'End Date': '2026-10-04',
    'Location Name': 'Oolite Arts Vitrine',
    Address: '924 Lincoln Rd., Miami Beach, FL 33139',
    Summary:
      'From Within brings together the work of the Oolite Arts Youth Residents, reflecting on the experiences, memories, and environments that shape their creative lives.',
    Description:
      'From Within brings together the work of the Oolite Arts Youth Residents, offering a reflection on the experiences, memories, and environments that shape their creative lives.\n\nDeveloped throughout the residency, the exhibition marks a moment of both reflection and growth.',
    'Featured Artists': 'Ana Blanco; Noa Garcia; Emely Yanji; Melina Walsh; TJ Wright',
    'Image URL':
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1780505821/teens-resident-TJ-PHOTO-scaled_diiopj.jpg',
    'Smart Sign Eligible': true,
    'Public AI Approved': true,
    Priority: 8,
    Tags: ['exhibition', 'youth residents', 'identity', 'creative practice', 'vitrine'],
  },
}

export const SITES_OF_THE_SELF_AIRTABLE_FIXTURE: AirtableRecord = {
  id: 'recSitesOfTheSelfFixture',
  fields: {
    Title: 'Sites of the Self',
    Organization: ['recOoliteArtsFixture'],
    'Record Type': 'exhibition',
    Status: 'coming_soon',
    Visibility: 'public',
    'Start Date': '2026-07-08',
    'End Date': '2026-10-04',
    'Location Name': 'Oolite Arts Vitrine',
    Address: '924 Lincoln Rd., Miami Beach, FL 33139',
    Summary:
      'Sites of the Self brings together works by Oolite Arts resident artists to explore how selfhood is forged, shaped, and understood.',
    Description:
      'Sites of the Self brings together works by Oolite Art’s current cohort of resident artists to explore how selfhood is forged and understood.',
    Curator: 'René Morales, Senior Curatorial Fellow, Bakehouse Art Complex',
    'Featured Artists':
      'Diego Gabaldon; Gonzalo Hernández; Pangea Kali Virga; Sepideh Kalani; Shayla Marshall; Bex McCharen; Lucía Morales; Genesis Moreno; Ana Mosquera; Sheherazade Thénard; Nadia Wolff; Ricardo Zulueta; José Delgado Zúñiga',
    'Image URL':
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1780506079/sites-of-the-self-28A69007-7EDE-4518-9C0F-DE5D25C9098E_jy7j09.jpg',
    'Smart Sign Eligible': true,
    'Public AI Approved': true,
    Priority: 10,
    Tags: ['exhibition', 'resident artists', 'identity', 'selfhood', 'contemporary theory', 'vitrine'],
  },
}

export const OOLITE_PROGRAMMING_AIRTABLE_FIXTURES: AirtableRecord[] = [
  FROM_WITHIN_AIRTABLE_FIXTURE,
  SITES_OF_THE_SELF_AIRTABLE_FIXTURE,
]
