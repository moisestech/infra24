import type { ExternalLink, LessonEnrichment, TemplateLink, VibecodingChapterBridge } from '@/lib/course/types'

function externalLinksToTemplateLinks(links: ExternalLink[]): TemplateLink[] {
  return links.map((l) => ({
    label: l.label,
    href: l.href,
    kind: 'download' as const,
  }))
}

function isTemplateLink(x: unknown): x is TemplateLink {
  return Boolean(x && typeof x === 'object' && 'kind' in x && typeof (x as TemplateLink).kind === 'string')
}

/** Normalize overlay `lessonEnrichment.vibecoding` into the card’s bridge type. */
export function toVibecodingChapterBridge(
  v: NonNullable<LessonEnrichment['vibecoding']>,
): VibecodingChapterBridge {
  const raw = v.templateLinks
  let templateLinks: TemplateLink[] = []
  if (Array.isArray(raw) && raw.length) {
    templateLinks = raw.map((x) =>
      isTemplateLink(x) ? x : { label: (x as ExternalLink).label, href: (x as ExternalLink).href, kind: 'download' as const },
    )
  }
  return {
    buildMove: v.buildMove,
    promptMove: v.promptMove,
    codepenPath: v.codepenPath,
    githubCursorPath: v.githubCursorPath,
    templateLinks,
    output: v.output,
  }
}
