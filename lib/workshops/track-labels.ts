import type { WorkshopMarketingMetadata } from '@/lib/workshops/marketing-metadata'

export type WorkshopTrackId = NonNullable<WorkshopMarketingMetadata['track']>

export const WORKSHOP_TRACK_LABELS: Record<WorkshopTrackId, string> = {
  presence: 'Presence',
  ai_literacy: 'AI literacy',
  creative_coding: 'Creative coding',
  systems_archive: 'Systems + archive',
}

export function workshopTrackLabel(
  track: WorkshopMarketingMetadata['track'] | undefined
): string | null {
  if (!track) return null
  return WORKSHOP_TRACK_LABELS[track] ?? null
}
