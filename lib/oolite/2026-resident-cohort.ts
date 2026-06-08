/** Canonical 2026 Oolite studio resident cohort for Sites of the Self. */
export type ResidentCohortEntry = {
  fullName: string
  studio?: string
  primaryImageUrl?: string
  bio?: string
  website?: string
  instagram?: string
  practiceTags?: string[]
}

export const OOLITE_2026_STUDIO_RESIDENTS: ResidentCohortEntry[] = [
  {
    fullName: 'Gonzalo Hernandez',
    studio: '204A',
    primaryImageUrl:
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1779993349/Gonzalo-Hernandez_qlql5o.jpg',
    practiceTags: ['Installation', 'Photography'],
  },
  {
    fullName: 'Ana Mosquera',
    studio: '202',
    primaryImageUrl:
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1779993353/Ana-Mosquera-Headshot-e1713279418772-705x705_smqec5.jpg',
    practiceTags: ['Installation', 'Photography'],
  },
  {
    fullName: 'Diego Gabaldon',
    studio: '102',
    primaryImageUrl:
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1779993350/Diego-Gabaldon-705x705_nfpjhw.jpg',
    instagram: '@threatappraisal',
    practiceTags: ['Installation', 'Photography', 'Social Practice'],
  },
  {
    fullName: 'Sheherazade Thénard',
    studio: '208',
    primaryImageUrl:
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1779993352/Sheherazade-Thenard-705x705_v7shfr.jpg',
    instagram: '@sheherazade.thenard',
    website: 'https://sheherazadeart.com/',
    practiceTags: ['Installation', 'Photography'],
  },
  {
    fullName: 'José Delgado Zúñiga',
    studio: '207',
    primaryImageUrl:
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1779993348/Jose-Zuniga_Headshot-1_athbrd.jpg',
    practiceTags: ['Photography', 'Education'],
  },
  {
    fullName: 'Bex McCharen',
    studio: '108',
    primaryImageUrl:
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1779993573/Bex_McCharen-705x705_qosppg.jpg',
    website: 'https://bexwater.com/',
    instagram: '@waterbbex',
    practiceTags: ['Social Practice', 'Photography', 'Creative Technology'],
  },
  {
    fullName: 'Shayla Marshall',
    studio: '209',
    primaryImageUrl:
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1780452178/Shayla-Marshall-potrait_tb87ju.jpg',
    practiceTags: ['Installation', 'Photography', 'Social Practice'],
  },
  {
    fullName: 'Pangea Kali Virga',
    studio: '203',
    primaryImageUrl:
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1779993351/Pangea-Kali-Virga-705x705_yswfrz.jpg',
    website: 'https://www.pangeakalivirga.com/',
    instagram: '@pangeakalivirga',
    practiceTags: ['Installation', 'Social Practice', 'Design'],
  },
  {
    fullName: 'Ricardo E. Zulueta',
    studio: '109',
    primaryImageUrl:
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1779993351/Ricardo-E.-Zulueta-headshot_2-705x705_x1q8wx.webp',
    website: 'https://www.ricardo-zulueta.com/',
    instagram: '@re_zulueta',
    practiceTags: ['Photography', 'Installation'],
  },
  {
    fullName: 'Sepideh Kalani',
    studio: '204',
    primaryImageUrl:
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1779993352/Sepideh-Kalani-705x705_qnuhew.jpg',
    practiceTags: ['Installation', 'Photography'],
  },
  {
    fullName: 'Nadia Wolff',
    studio: '110',
    primaryImageUrl:
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1779993348/Nadia-Wolff-705x705_gcpwsa.jpg',
    practiceTags: ['Installation', 'Research', 'Writing'],
  },
  {
    fullName: 'Genesis Moreno',
    studio: '210',
    primaryImageUrl:
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1779993573/Genesis-Moreno-705x705_xiecyg.jpg',
    practiceTags: ['Installation', 'Photography'],
  },
  {
    fullName: 'Lucía Morales',
    studio: '101',
    primaryImageUrl:
      'https://res.cloudinary.com/dkod1at3i/image/upload/v1779993349/Lucia-Morales-Headshot-photo-credit_-Diana-Larrea-705x705_eox31z.jpg',
    practiceTags: ['Installation', 'Photography'],
  },
]

export function defaultResidentBio(name: string, studio?: string): string {
  const studioPart = studio ? ` in Studio ${studio}` : ''
  return `${name} is a 2026 Oolite Arts Studio Resident${studioPart}. Included in Sites of the Self at Oolite Arts.`
}
