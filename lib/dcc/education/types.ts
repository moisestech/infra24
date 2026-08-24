/**
 * Public DCC MIA education records.
 * Code-native this phase — no Stripe checkout, no QuickBooks, no invented seats.
 */

export type DccWorkshopFormat = 'in-person' | 'lab' | 'hybrid' | 'self-paced'

export type DccWorkshopEnrollment = 'inquiry' | 'open-lab' | 'self-serve-handbook'

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
}
