/**
 * Public cultural records for DCC MIA.
 * Code-native in this phase — no Airtable schema, no private operating data.
 */

export type DccPublishStatus = 'draft' | 'published' | 'archived'

export type DccProgramStatus = 'upcoming' | 'current' | 'past' | 'draft'

export type DccNode = 'DCC MIA'

export type DccProgramType =
  | 'exhibition'
  | 'art-fair'
  | 'event'
  | 'talk'
  | 'workshop'
  | 'activation'
  | 'screening'
  | 'open-studio'
  | 'other'

export type DccEditorialType =
  | 'conversation'
  | 'interview'
  | 'studio-visit'
  | 'field-note'
  | 'essay'
  | 'program-recap'
  | 'tool'
  | 'news'

/**
 * Precise relationship language. "Partner" only when the relationship is formal.
 * Do not label Bakehouse, Oolite, FIU, NWSA, Moonlighter, or ITS3D NYC as partners
 * merely because of conversation, teaching, research, or a visit.
 */
export type DccRelationRole =
  | 'host'
  | 'venue'
  | 'teaching-venue'
  | 'collaborator'
  | 'client'
  | 'peer'
  | 'research-visit'
  | 'partner'

export type DccDistribution = {
  instagramPostUrl?: string
  reelUrl?: string
  newsletterUrl?: string
}

/**
 * Operating metrics — never render on public pages.
 * Kept off public record types so private numbers cannot leak into cards.
 */
export type DccInternalMetrics = {
  attendance?: number
  leads?: number
  newsletterSignups?: number
  programRegistrations?: number
  workshopClicks?: number
  fabricationInquiries?: number
  institutionalInquiries?: number
}

export type DccArtist = {
  id: string
  slug: string
  name: string
  location?: string
  shortBio?: string
  bio?: string
  portrait?: string
  portraitAlt?: string
  heroImage?: string
  heroImageAlt?: string
  practiceTags?: string[]
  websiteUrl?: string
  instagramUrl?: string
  programIds?: string[]
  projectIds?: string[]
  editorialIds?: string[]
  featured?: boolean
  status?: DccPublishStatus
  seoTitle?: string
  seoDescription?: string
  distribution?: DccDistribution
}

export type DccProgramRelation = {
  name: string
  role: DccRelationRole
  url?: string
}

export type DccProgram = {
  id: string
  slug: string
  title: string
  subtitle?: string
  type: DccProgramType
  startDate?: string
  endDate?: string
  locationName?: string
  locationAddress?: string
  node?: DccNode
  shortDescription?: string
  description?: string
  artistIds?: string[]
  projectIds?: string[]
  editorialIds?: string[]
  heroImage?: string
  heroImageAlt?: string
  images?: string[]
  externalUrl?: string
  registrationUrl?: string
  relations?: DccProgramRelation[]
  status: DccProgramStatus
  featured?: boolean
  seoTitle?: string
  seoDescription?: string
  distribution?: DccDistribution
}

export type DccEditorial = {
  id: string
  slug: string
  title: string
  dek?: string
  type: DccEditorialType
  publishedAt?: string
  author?: string
  artistIds?: string[]
  programIds?: string[]
  projectIds?: string[]
  heroImage?: string
  heroImageAlt?: string
  images?: string[]
  videoUrl?: string
  audioUrl?: string
  body?: string
  /** Optional disk path under content/journal/ for longer MD/MDX bodies. */
  bodyPath?: string
  excerpt?: string
  pullQuote?: string
  featured?: boolean
  status?: DccPublishStatus
  seoTitle?: string
  seoDescription?: string
  distribution?: DccDistribution
}

export type DccProjectFabricationData = {
  process?: string[]
  material?: string[]
  machine?: string[]
  machineHours?: number
  humanLaborHours?: number
  finishLevel?: string
}

export type DccProject = {
  id: string
  slug: string
  title: string
  artistIds?: string[]
  programIds?: string[]
  year?: number
  shortDescription?: string
  description?: string
  heroImage?: string
  heroImageAlt?: string
  images?: string[]
  categories?: string[]
  productionType?: string[]
  fabricationData?: DccProjectFabricationData
  challenge?: string
  process?: string
  result?: string
  learning?: string
  editorialIds?: string[]
  featured?: boolean
  status?: DccPublishStatus
  seoTitle?: string
  seoDescription?: string
}

export type CultureRegistry = {
  artists: readonly DccArtist[]
  programs: readonly DccProgram[]
  editorial: readonly DccEditorial[]
  projects: readonly DccProject[]
}
