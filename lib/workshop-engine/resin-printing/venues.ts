import type { VenueConfig } from '@/lib/workshop-engine/types'

export const RESIN_VENUES: Record<string, VenueConfig> = {
  oolite: {
    id: 'oolite',
    organization: 'Oolite Arts',
    venueName: 'Oolite Arts Digital Lab',
    roomName: 'Studio 106',
    printerModel: 'Anycubic Photon Mono M7 Max',
    washCureModel: 'Anycubic Wash & Cure 3 Plus',
    validatedSlicer: 'TBD — enter before publish',
    validatedProfileLabel: 'TBD — enter before publish',
    resinLabel: 'TBD — enter before publish',
    safetyContact: 'TBD — Digital Lab staff contact',
    appointmentUrl: undefined,
    themeAccentId: 'oolite-teal',
    brandMediaId: 'resin-oolite-brand-01',
    zoneNotes: [
      'Clean participant zone for laptops, notes, and cured-sample inspection.',
      'Controlled resin zone for printer, vat, wash/cure, and uncured materials — instructors only during live demo.',
      'Capacity: 8 participants · 180 minutes.',
    ],
    stopWorkConditions: [
      'Missing or damaged PPE / spill kit',
      'Suspected vat-film puncture or screen risk',
      'Unventilated odor concern or spill beyond contained mats',
      'Any participant skin exposure requiring SDS response',
    ],
  },
  bakehouse: {
    id: 'bakehouse',
    organization: 'DCC.MIAMI at Bakehouse Art Complex',
    venueName: 'Bakehouse Art Complex (DCC.MIAMI program)',
    roomName: 'TBD — confirm room before session publish',
    printerModel: 'TBD — confirm printer before session publish',
    washCureModel: 'TBD — confirm wash/cure before session publish',
    validatedSlicer: 'TBD — enter before publish',
    validatedProfileLabel: 'TBD — enter before publish',
    resinLabel: 'TBD — enter before publish',
    safetyContact: 'TBD — DCC.MIAMI / Bakehouse technical contact',
    appointmentUrl: undefined,
    themeAccentId: 'bakehouse-copper',
    brandMediaId: 'resin-bakehouse-brand-01',
    namingNote:
      'Do not market this as a “Bakehouse Digital Lab” unless Bakehouse explicitly approves that name. Use DCC.MIAMI at Bakehouse Art Complex.',
    zoneNotes: [
      'Reuse the same curriculum; replace only venue equipment, safety, contacts, and branding.',
      'Confirm clean vs controlled zones on site before the pilot.',
      'Local PPE, ventilation, waste, and spill procedures must be verified before teaching.',
    ],
    stopWorkConditions: [
      'Venue-specific stop-work list not yet verified — do not run live resin demo until filled in',
      'Missing local SDS / waste pathway',
      'Unconfirmed equipment profile',
    ],
  },
}

export function getResinVenue(id: string): VenueConfig | undefined {
  return RESIN_VENUES[id]
}
