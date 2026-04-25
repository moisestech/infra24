import type { Chapter } from '@/lib/course/types'
import { whatIsNetArtAsChapter } from '@/lib/course/overlays/what-is-net-art'
import { remixAppropriationAsChapter } from '@/lib/course/overlays/remix-appropriation-and-internet-vernacular'
import { advancedVibecodingPathwaysAsChapter } from '@/lib/course/overlays/advanced-vibecoding-pathways'
import { finalProjectBuildPublishAsChapter } from '@/lib/course/overlays/final-project-build-publish-and-frame-your-net-artwork'
import { gettingStartedWithVibecodingAsChapter } from '@/lib/course/overlays/getting-started-with-vibecoding'
import { netArtPrimerAsChapter } from '@/lib/course/overlays/net-art-primer'
import { hypertextAndNonlinearNarrativeAsChapter } from '@/lib/course/overlays/hypertext-and-nonlinear-narrative'
import { antiInterfaceJodiAsChapter } from '@/lib/course/overlays/anti-interface-jodi'
import { glitchAsLanguageJodiAsChapter } from '@/lib/course/overlays/glitch-as-language-jodi'
import { interactionMotionAndResponsiveBehaviorAsChapter } from '@/lib/course/overlays/interaction-motion-and-responsive-behavior'
import { identityPresenceAndNetworkedSelvesAsChapter } from '@/lib/course/overlays/identity-presence-and-networked-selves'
import { publishingLivenessAndTheArtworkAsWebsiteAsChapter } from '@/lib/course/overlays/publishing-liveness-and-the-artwork-as-website'
import { theBrowserIsAMediumAsChapter } from '@/lib/course/overlays/the-browser-is-a-medium'
import { systemsCirculationAndInfrastructureAsChapter } from '@/lib/course/overlays/systems-circulation-and-infrastructure'

/**
 * MVP benchmark sequence (overlay `next`/`previous` slugs align for preview).
 * The full `OVERLAYS` map below stays intact so the rest of the course keeps working.
 */
export const BENCHMARK_TRIO_SLUGS = [
  'hypertext-and-nonlinear-narrative',
  'remix-appropriation-and-internet-vernacular',
  'publishing-liveness-and-the-artwork-as-website',
] as const

export function isBenchmarkTrioSlug(slug: string): boolean {
  return (BENCHMARK_TRIO_SLUGS as readonly string[]).includes(slug)
}

const OVERLAYS: Record<string, () => Chapter> = {
  'net-art-primer': netArtPrimerAsChapter,
  'getting-started-with-vibecoding': gettingStartedWithVibecodingAsChapter,
  'hypertext-and-nonlinear-narrative': hypertextAndNonlinearNarrativeAsChapter,
  'anti-interface-jodi': antiInterfaceJodiAsChapter,
  'glitch-as-language-jodi': glitchAsLanguageJodiAsChapter,
  'interaction-motion-and-responsive-behavior': interactionMotionAndResponsiveBehaviorAsChapter,
  'what-is-net-art': whatIsNetArtAsChapter,
  'the-browser-is-a-medium': theBrowserIsAMediumAsChapter,
  'remix-appropriation-and-internet-vernacular': remixAppropriationAsChapter,
  'identity-presence-and-networked-selves': identityPresenceAndNetworkedSelvesAsChapter,
  'systems-circulation-and-infrastructure': systemsCirculationAndInfrastructureAsChapter,
  'publishing-liveness-and-the-artwork-as-website': publishingLivenessAndTheArtworkAsWebsiteAsChapter,
  'advanced-vibecoding-pathways': advancedVibecodingPathwaysAsChapter,
  'final-project-build-publish-and-frame-your-net-artwork': finalProjectBuildPublishAsChapter,
}

/**
 * Returns structured lesson overlay when defined for `slug`.
 * Markdown body still comes from disk via `loadPublicWorkshopChapter`.
 */
export function getChapterOverlay(slug: string): Chapter | null {
  const fn = OVERLAYS[slug]
  return fn ? fn() : null
}

/** Structured overlay for a chapter slug (disk markdown is loaded separately). */
export function getChapterBySlug(slug: string): Chapter | null {
  return getChapterOverlay(slug)
}

/** Slugs that use the rich `VcnVibeNetArtLesson` overlay (thesis, rail, anchors, artifact, etc.). */
export function listVcnLessonOverlaySlugs(): readonly string[] {
  return Object.keys(OVERLAYS).sort()
}

export function getChapterByNumber(number: number): Chapter | null {
  for (const slug of listVcnLessonOverlaySlugs()) {
    const ch = getChapterOverlay(slug)
    if (ch?.number === number) return ch
  }
  return null
}

export function vcnChapterHasLessonOverlay(slug: string): boolean {
  return slug in OVERLAYS
}
