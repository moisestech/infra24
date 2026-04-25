import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { mergeWorkshopMetadata } from '@/lib/workshops/marketing-metadata'
import { canonicalWorkshopMarketingSlug } from '@/lib/workshops/workshop-metadata-slug-aliases'
import { isWorkshopUuid } from '@/lib/workshops/workshop-routing'

export type LearnWorkshopResolution = {
  folderSlug: string
  workshopTitle: string
}

/**
 * Map `/learn/[workshopId]/…` segment to the on-disk workshop folder under
 * `content/workshops/<folderSlug>/chapters`. UUIDs resolve via Supabase
 * `workshops.metadata.slug`; otherwise `workshopId` is treated as the folder slug (dev).
 */
export async function resolveLearnWorkshopFolderSlug(
  workshopId: string
): Promise<LearnWorkshopResolution | null> {
  const id = workshopId?.trim()
  if (!id) return null

  if (isWorkshopUuid(id)) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('workshops')
      .select('id, title, metadata')
      .eq('id', id)
      .maybeSingle()

    if (error || !data) return null
    const merged = mergeWorkshopMetadata(data.metadata ?? undefined, {
      title: data.title,
      id: data.id,
    })
    return {
      folderSlug: canonicalWorkshopMarketingSlug(merged.slug),
      workshopTitle: data.title ?? merged.slug,
    }
  }

  return {
    folderSlug: canonicalWorkshopMarketingSlug(id),
    workshopTitle: id,
  }
}
