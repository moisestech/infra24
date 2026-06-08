/** Stable Airtable record IDs for Oolite knowledge-cluster linking. */
export const OOLITE_PROGRAMMING_RECORD_IDS = {
  fromWithin: 'rec9CNMV5jI8eGfTO',
  sitesOfTheSelf: 'recM68bSWBD40Ikcu',
  fabricOfRemembering: 'recP7sPOfFZ63a5Ld',
  openStudios: 'recvJU9gSU3vneLfA',
} as const

export const OOLITE_PEOPLE_RECORD_IDS = {
  bexMcCharen: 'recuxPqeyh8PBiRky',
  rinaCarvajal: 'recqmAHYNgJPbtLYq',
  melissaWallen: 'recKZruHDi84e4RsX',
  reneMorales: 'recYads2TMkrSA6Ix',
} as const

export const SITES_OF_THE_SELF_ARTIST_NAMES = [
  'Gonzalo Hernandez',
  'Ana Mosquera',
  'Diego Gabaldon',
  'Sheherazade Thénard',
  'José Delgado Zúñiga',
  'Bex McCharen',
  'Shayla Marshall',
  'Pangea Kali Virga',
  'Ricardo E. Zulueta',
  'Sepideh Kalani',
  'Nadia Wolff',
  'Genesis Moreno',
  'Lucía Morales',
] as const

export function parseFeaturedArtistNames(featuredArtists?: string | null): string[] {
  if (!featuredArtists?.trim()) return []
  return featuredArtists
    .split(/[;\n]+/)
    .map((name) => name.trim())
    .filter(Boolean)
}

export function normalizePersonName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function personNameMatchesFeatured(name: string, featured: string): boolean {
  const a = normalizePersonName(name)
  const b = normalizePersonName(featured)
  if (!a || !b) return false
  if (a === b) return true
  return a.includes(b) || b.includes(a)
}
