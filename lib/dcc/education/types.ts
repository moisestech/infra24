/**
 * Public DCC MIA education records.
 * Code-native this phase — no Stripe checkout, no QuickBooks, no invented seats.
 */

export type DccWorkshopFormat = 'in-person' | 'lab' | 'hybrid' | 'self-paced'

export type DccWorkshopEnrollment = 'inquiry' | 'open-lab' | 'self-serve-handbook'

export type DccWorkshopOfferingImage = {
  src: string
  alt: string
  /** Honest status — conceptual teaching/marketing still vs documentary. */
  caption?: string
}

export type DccWorkshopOffering = {
  id: string
  slug: string
  title: string
  shortDescription: string
  href: string
  syllabusHref?: string
  format: DccWorkshopFormat
  /** People per session. Omit when unknown — do not invent. */
  capacity?: number
  durationMinutes?: number
  enrollment: DccWorkshopEnrollment
  featured?: boolean
  /** Existing workshop banner/still only — do not invent documentary photos. */
  image?: DccWorkshopOfferingImage
}
