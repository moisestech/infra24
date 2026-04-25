import type { WorkshopMarketingMetadata } from '@/lib/workshops/marketing-metadata'
import type { WorkshopRow } from '@/components/workshops/marketing/types'

/** Curated `skillsYoullLearn` in metadata, else workshop `what_youll_learn`. */
export function getWorkshopSkillsYoullLearn(
  marketing: WorkshopMarketingMetadata,
  workshop: WorkshopRow
): string[] {
  const fromMeta = marketing.skillsYoullLearn?.map((s) => s.trim()).filter(Boolean) ?? []
  if (fromMeta.length) return fromMeta
  const wyl = workshop.what_youll_learn?.map((s) => s.trim()).filter(Boolean) ?? []
  return wyl
}
