import type { MemoryAgentEventCard } from '@/types/memory-agent'

/** Deep link into the public alumni directory (prefills search when name is known). */
export function memoryAgentAlumniProfileUrl(
  orgSlug: string,
  options?: { name?: string; id?: string }
): string {
  const base = `/o/${encodeURIComponent(orgSlug)}/alumni`
  const name = options?.name?.trim()
  if (name) {
    return `${base}?q=${encodeURIComponent(name)}`
  }
  if (options?.id?.trim()) {
    return `${base}?id=${encodeURIComponent(options.id.trim())}`
  }
  return base
}

/** Best public on-site URL for a programming / experience card. */
export function memoryAgentEventPublicUrl(
  orgSlug: string,
  event: Pick<MemoryAgentEventCard, 'source' | 'publicUrl' | 'sourceRecordId' | 'title'>
): string | undefined {
  const direct = event.publicUrl?.trim()
  if (direct) return direct

  if (event.source === 'announcement' && event.sourceRecordId?.trim()) {
    return `/o/${encodeURIComponent(orgSlug)}/announcements/${encodeURIComponent(event.sourceRecordId.trim())}`
  }

  if (event.source === 'workshop') {
    return `/o/${encodeURIComponent(orgSlug)}/workshops`
  }

  if (event.source === 'announcement') {
    return `/o/${encodeURIComponent(orgSlug)}/announcements`
  }

  return undefined
}

/** Org programming hub when no record-level page exists. */
export function memoryAgentProgrammingHubUrl(orgSlug: string): string {
  return `/o/${encodeURIComponent(orgSlug)}/announcements`
}
