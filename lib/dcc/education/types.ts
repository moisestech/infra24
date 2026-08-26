/**
 * Public DCC MIA education records.
 * Code-native this phase — no Stripe checkout, no QuickBooks, no invented seats.
 */

export type DccWorkshopFormat = 'in-person' | 'lab' | 'hybrid' | 'self-paced'

export type DccWorkshopEnrollment =
  | 'inquiry'
  | 'open-lab'
  | 'self-serve-handbook'
  | 'interest'

export type DccWorkshopOfferingStatus = 'live' | 'in-development'

/** Track grouping for the in-development row — not Oolite tenant labels. */
export type DccWorkshopTrackGroup =
  | 'presence'
  | 'ai-literacy'
  | 'practice-language'
  | 'archives'

export type DccWorkshopOfferingImage = {
  src: string
  alt: string
  /** Honest status — conceptual teaching/marketing still vs documentary. */
  caption?: string
}

export type DccWorkshopOfferingIcon = {
  src: string
  alt: string
}

export type DccWorkshopOffering = {
  id: string
  slug: string
  title: string
  shortDescription: string
  /** Live sessions only — omit for in-development (no invented DCC syllabus URL). */
  href?: string
  syllabusHref?: string
  format: DccWorkshopFormat
  status: DccWorkshopOfferingStatus
  trackGroup?: DccWorkshopTrackGroup
  /** People per session. Omit when unknown — do not invent. */
  capacity?: number
  durationMinutes?: number
  enrollment: DccWorkshopEnrollment
  featured?: boolean
  /**
   * Existing workshop stills only — do not invent documentary photos.
   * Empty when the curriculum has no still yet (gradient + icon fallback).
   */
  images: DccWorkshopOfferingImage[]
  /** First still convenience — same as `images[0]` when present. */
  image?: DccWorkshopOfferingImage
  icon?: DccWorkshopOfferingIcon
  /** Partners paint overlay hues (CSS custom properties). */
  hue: number
  hueAccent: number
}
