/** URL segment and metadata.slug for this workshop bundle. */
export const LEARN_AI_WORKSHOP_SLUG = 'learn-ai-without-losing-yourself' as const

export function learnAiWorkshopBasePath(orgSlug: string): string {
  return `/o/${orgSlug}/workshop/${LEARN_AI_WORKSHOP_SLUG}`
}

export function learnAiWorkshopPaths(orgSlug: string) {
  const base = learnAiWorkshopBasePath(orgSlug)
  return {
    base,
    curriculum: `${base}/curriculum`,
    lab: `${base}/lab`,
    rehearse: `${base}/rehearse`,
  }
}

export function isLearnAiWorkshopSlug(segment: string | undefined | null): boolean {
  return segment === LEARN_AI_WORKSHOP_SLUG
}
