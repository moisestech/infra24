import type { ReactNode } from 'react'
import type { Chapter, ModuleKey } from '@/lib/course/types'
import { extractH2NavFromHtml } from '@/lib/workshops/chapter-heading-nav'
import type { VcnCourseIndexRow } from '@/lib/course/vibe-net-art/types'
import type { DiskNavChapter } from '@/lib/course/vibe-net-art/nav'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChapterHeader } from '@/components/course/ChapterHeader'
import { ChapterHeroShell } from '@/components/course/ChapterHeroShell'
import { ChapterThesisCard } from '@/components/course/ChapterThesisCard'
import { StickyChapterRail, type ChapterRailNavGroup } from '@/components/course/StickyChapterRail'
import { ConceptBlock } from '@/components/course/ConceptBlock'
import { AnchorWorksPanel } from '@/components/course/AnchorWorksPanel'
import { VocabularyRow } from '@/components/course/VocabularyRow'
import { ContextCardsRow } from '@/components/course/ContextCardsRow'
import { ToolBridgeCard } from '@/components/course/ToolBridgeCard'
import { ArtifactPromptCard } from '@/components/course/ArtifactPromptCard'
import { ReflectionCard } from '@/components/course/ReflectionCard'
import { ResourceStrip } from '@/components/course/ResourceStrip'
import { NextChapterCard } from '@/components/course/NextChapterCard'
import { LessonAmbientBackdrop } from '@/components/course/LessonAmbientBackdrop'
import { GettingStartedOfficialHubs } from '@/components/course/GettingStartedOfficialHubs'
import { LessonFullReadingCard } from '@/components/course/LessonFullReadingCard'
import { LessonImageAssetStrip } from '@/components/course/LessonImageAssetStrip'
import { LessonChapterBanner } from '@/components/course/LessonChapterBanner'
import { VibecodingInThisChapterCard } from '@/components/course/VibecodingInThisChapterCard'
import { PromptingTipCard } from '@/components/course/PromptingTipCard'
import { ChapterSpecificComponentRenderer } from '@/components/course/ChapterSpecificComponentRenderer'
import { WhatYouAreMakingBar } from '@/components/course/WhatYouAreMakingBar'
import {
  studioSpecsAfterAnchors,
  studioSpecsAfterArtifact,
  studioSpecsAfterConceptsCore,
  studioSpecsBeforeAnchors,
  studioSpecsPageAsSpaceOnly,
} from '@/lib/course/chapter-studio-specs'
import { toVibecodingChapterBridge } from '@/lib/course/vibecoding-bridge'
import { cn } from '@/lib/utils'

const moduleLabel: Record<string, string> = {
  orientation: 'Orientation',
  'browser-language': 'Browser language',
  'cultural-social-web': 'Cultural and social web',
  'public-work-advanced': 'Public work and advanced pathways',
}

export type VcnVibeNetArtLessonProps = {
  chapterSlug: string
  diskChapter: { html: string; title: string; description: string }
  overlay: Chapter | null
  courseRow: VcnCourseIndexRow | null
  sorted: DiskNavChapter[]
  prev: DiskNavChapter | null
  next: DiskNavChapter | null
  glossaryHref: string
  /** Must end with `/chapters/` (trailing slash). Slugs are appended with encoding. */
  chaptersHrefPrefix: string
  topLinks: ReactNode
}

function chapterHref(prefix: string, slug: string) {
  return `${prefix}${encodeURIComponent(slug)}`
}

export function VcnVibeNetArtLesson({
  chapterSlug,
  diskChapter,
  overlay,
  courseRow,
  sorted,
  prev,
  next,
  glossaryHref,
  chaptersHrefPrefix,
  topLinks,
}: VcnVibeNetArtLessonProps) {
  const prevHref = prev ? chapterHref(chaptersHrefPrefix, prev.slug) : null
  const nextHref = next ? chapterHref(chaptersHrefPrefix, next.slug) : null

  if (overlay) {
    const descriptionLead = diskChapter.description?.trim() ?? ''
    const summaryLead = overlay.summary?.trim() ?? ''
    const showReaderAtAGlance = descriptionLead.length > 0 && descriptionLead !== summaryLead

    const enrichment = overlay.lessonEnrichment
    const presentation = overlay.design?.lessonSkin
    const hasContext =
      overlay.artists.length > 0 || overlay.institutions.length > 0 || overlay.curatorLenses.length > 0
    const hasTools = overlay.tools.length > 0
    const hasVocab = overlay.glossaryTerms.length > 0
    const hasReflect = overlay.reflection.length > 0

    const studioNavItems: { id: string; label: string }[] = []
    if (enrichment?.vibecodingQuadrant?.quadrants?.length) {
      studioNavItems.push({ id: 'vibecoding-quadrant', label: 'Tool landscape' })
    }
    if (enrichment?.learningGuidesStrip?.guides?.length) {
      studioNavItems.push({ id: 'learning-guides-strip', label: 'Learning guides' })
    }
    if (enrichment?.webMaterialsStack?.layers?.length) {
      studioNavItems.push({ id: 'web-materials-stack', label: 'Web materials' })
    }
    if (enrichment?.projectPlanCanvas?.sections?.length) {
      studioNavItems.push({ id: 'project-plan-canvas', label: 'Project plan' })
    }
    if (enrichment?.pathwayChooser?.items?.length) {
      studioNavItems.push({ id: 'pathway-chooser', label: 'Pathways' })
    }
    if (enrichment?.canonIntroStrip?.items?.length) {
      studioNavItems.push({ id: 'canon-intro-strip', label: 'Canon strip' })
    }
    if (enrichment?.localVsLivePreview?.states?.length) {
      studioNavItems.push({ id: 'local-vs-live-preview', label: 'Local vs live' })
    }
    if (enrichment?.vernacularMoodBoard?.tiles?.length) {
      studioNavItems.push({ id: 'vernacular-moodboard', label: 'Vernacular moodboard' })
    }
    if (enrichment?.frameSplitSteps?.length) {
      studioNavItems.push({ id: 'frame-split-demo', label: 'Frame split demo' })
    }
    if (enrichment?.browserFrameAnatomy?.layers?.length) {
      studioNavItems.push({ id: 'browser-frame-anatomy', label: 'Browser frame anatomy' })
    }
    if (enrichment?.systemMapPreview?.nodes?.length) {
      studioNavItems.push({ id: 'system-map-preview', label: 'System map' })
    }
    if (
      enrichment?.interfaceBreakDemo?.left?.points?.length &&
      enrichment?.interfaceBreakDemo?.right?.points?.length
    ) {
      studioNavItems.push({ id: 'interface-break-demo', label: 'Interface break' })
    }
    if (enrichment?.hoverStateDemo?.states?.length) {
      studioNavItems.push({ id: 'hover-state-demo', label: 'Hover demo' })
    }
    if (
      enrichment?.traceVsPortraitDemo?.left?.points?.length &&
      enrichment?.traceVsPortraitDemo?.right?.points?.length
    ) {
      studioNavItems.push({ id: 'trace-vs-portrait-demo', label: 'Trace vs portrait' })
    }
    if (enrichment?.motionRhythmPreview?.rhythms?.length) {
      studioNavItems.push({ id: 'motion-rhythm-preview', label: 'Motion rhythm' })
    }
    if (enrichment?.vibecoding) {
      studioNavItems.push({ id: 'vibecoding-in-chapter', label: 'Vibecoding' })
    }
    if (enrichment?.prompting) {
      studioNavItems.push({ id: 'prompting-tip', label: 'Prompting' })
    }
    if (enrichment?.submissionChecklist?.items?.length) {
      studioNavItems.push({ id: 'submission-checklist', label: 'Submission checklist' })
    }
    if (enrichment?.netArtVsArtOnline?.left && enrichment.netArtVsArtOnline.right) {
      studioNavItems.push({ id: 'net-art-vs-art-online', label: 'Net vs online' })
    }
    if (enrichment?.remixStack?.layers?.length) {
      studioNavItems.push({ id: 'remix-stack', label: 'Remix stack' })
    }
    if (enrichment?.publishFlowDiagram?.steps?.length) {
      studioNavItems.push({ id: 'publish-flow-diagram', label: 'Publish flow' })
    }
    if (enrichment?.toolComparisonGrid?.rows?.length) {
      studioNavItems.push({ id: 'tool-comparison-grid', label: 'Tool compare' })
    }
    if (enrichment?.pageAsSpaceDemo?.variants?.length) {
      studioNavItems.push({ id: 'page-as-space-demo', label: 'Page as space' })
    }
    if (enrichment?.legibilityShiftCard?.stages?.length) {
      studioNavItems.push({ id: 'legibility-shift-card', label: 'Legibility shift' })
    }
    if (
      enrichment?.flowAndFrictionCard?.left?.points?.length &&
      enrichment?.flowAndFrictionCard?.right?.points?.length
    ) {
      studioNavItems.push({ id: 'flow-and-friction-card', label: 'Flow & friction' })
    }
    if (enrichment?.repoSetupChecklist?.items?.length) {
      studioNavItems.push({ id: 'repo-setup-checklist', label: 'Repo setup' })
    }
    if (enrichment?.avatarPresenceCard?.points?.length) {
      studioNavItems.push({ id: 'avatar-presence-card', label: 'Avatar presence' })
    }

    const wrapUpItems: { id: string; label: string }[] = []
    if (hasVocab) wrapUpItems.push({ id: 'vocabulary', label: 'Words to know' })
    if (enrichment?.repoSetupChecklist?.items?.length) {
      wrapUpItems.push({ id: 'repo-setup-checklist', label: 'Repo setup' })
    }
    if (enrichment?.branchPath?.branches?.length) {
      wrapUpItems.push({ id: 'branch-path-preview', label: 'Branch preview' })
    }
    if (enrichment?.publishFlowDiagram?.steps?.length) {
      wrapUpItems.push({ id: 'publish-flow-diagram', label: 'Publish flow' })
    }
    if (hasContext) wrapUpItems.push({ id: 'context', label: 'Context' })
    if (hasTools && chapterSlug !== 'getting-started-with-vibecoding') {
      wrapUpItems.push({ id: 'tool-bridge', label: 'Tool bridge' })
    }
    wrapUpItems.push({ id: 'artifact', label: 'Artifact' })
    if (enrichment?.critiqueRubricCards?.cards?.length) {
      wrapUpItems.push({ id: 'critique-rubric-cards', label: 'Critique rubric' })
    }
    wrapUpItems.push({ id: 'resources', label: 'Resource index' })
    if (hasReflect) wrapUpItems.push({ id: 'reflect', label: 'Reflect' })

    const overlayRailGroups: ChapterRailNavGroup[] = [
      {
        id: 'reading-anchors',
        label: 'Reading & anchors',
        items: [
          ...(showReaderAtAGlance ? [{ id: 'reader-at-a-glance', label: 'At a glance' }] : []),
          ...(overlay.makingPreview?.length ? [{ id: 'what-you-are-making', label: "What you're making" }] : []),
          ...(overlay.anchorWorks.length > 0 ? [{ id: 'anchor-works', label: 'Anchor works' }] : []),
          ...(overlay.imageAssets.length > 0 ? [{ id: 'chapter-media', label: 'Chapter media' }] : []),
          { id: 'full-reading', label: 'Full chapter reading' },
        ],
      },
      ...(studioNavItems.length > 0
        ? [{ id: 'lesson-studio', label: 'Studio', items: studioNavItems }]
        : []),
      {
        id: 'lesson-cards',
        label: 'Lesson cards',
        items: overlay.sections.map((s) => ({ id: s.id, label: s.title })),
      },
      {
        id: 'wrap-up',
        label: 'Resources & project',
        items: wrapUpItems,
      },
    ]

    const isCapstone = chapterSlug === 'final-project-build-publish-and-frame-your-net-artwork'
    const nextSlug = overlay.nextChapterSlug
    const prevSlug = overlay.previousChapterSlug

    const pedagogicalNext = isCapstone
      ? null
      : nextSlug !== undefined
        ? nextSlug != null && nextSlug !== ''
          ? {
              href: chapterHref(chaptersHrefPrefix, nextSlug),
              title: sorted.find((c) => c.slug === nextSlug)?.title ?? nextSlug,
            }
          : null
        : next && nextHref
          ? { href: nextHref, title: next.title }
          : null

    const railPrevHref =
      prevSlug !== undefined
        ? prevSlug != null && prevSlug !== ''
          ? chapterHref(chaptersHrefPrefix, prevSlug)
          : null
        : prevHref
    const railPrevLabel =
      prevSlug !== undefined
        ? prevSlug != null && prevSlug !== ''
          ? sorted.find((c) => c.slug === prevSlug)?.title ?? prevSlug
          : null
        : (prev?.title ?? null)

    const railNextHref = isCapstone
      ? null
      : nextSlug !== undefined
        ? nextSlug != null && nextSlug !== ''
          ? chapterHref(chaptersHrefPrefix, nextSlug)
          : null
        : nextHref
    const railNextLabel = isCapstone
      ? null
      : nextSlug !== undefined
        ? nextSlug != null && nextSlug !== ''
          ? sorted.find((c) => c.slug === nextSlug)?.title ?? nextSlug
          : null
        : (next?.title ?? null)

    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {topLinks}
        <LessonChapterBanner banner={overlay.chapterBanner} title={overlay.title} subtitle={overlay.subtitle} className="mb-10" />
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,270px)_minmax(0,1fr)]">
          <StickyChapterRail
            chapterNumber={overlay.number}
            chapterSequenceLabel={overlay.chapterSequenceLabel}
            module={overlay.module}
            chapterTitle={overlay.title}
            sectionGroups={overlayRailGroups}
            glossaryTerms={overlay.glossaryTerms}
            glossaryHref={glossaryHref}
            estimatedTimeLabel={courseRow?.estimatedTimeLabel ?? overlay.estimatedTime}
            difficultyLabel={courseRow?.difficultyLabel ?? overlay.difficulty}
            prevHref={railPrevHref}
            prevLabel={railPrevLabel}
            nextHref={railNextHref}
            nextLabel={railNextLabel}
          />
          <div
            className={cn(
              'min-w-0',
              presentation === 'hypertext'
                ? 'space-y-12'
                : presentation === 'remix-collage'
                  ? 'space-y-8'
                  : presentation === 'publishing' || presentation === 'canon-entry'
                    ? 'space-y-9'
                    : presentation === 'interaction-motion' ||
                        presentation === 'identity-networked' ||
                        presentation === 'systems-circulation' ||
                        presentation === 'getting-started' ||
                        presentation === 'advanced-pathways' ||
                        presentation === 'final-capstone' ||
                        presentation === 'browser-as-medium' ||
                        presentation === 'interface-glitch'
                      ? 'space-y-7'
                      : 'space-y-10',
              enrichment?.themeWrapperClass,
            )}
          >
            <LessonAmbientBackdrop className="p-6 sm:p-8">
              <div className="space-y-6">
                <ChapterHeroShell chapter={overlay}>
                  <ChapterHeader chapter={overlay} />
                </ChapterHeroShell>
                <ChapterThesisCard thesis={overlay.thesis} />
                {overlay.makingPreview?.length ? (
                  <WhatYouAreMakingBar items={overlay.makingPreview} lessonSkin={presentation} />
                ) : null}
              </div>
            </LessonAmbientBackdrop>
            {showReaderAtAGlance ? (
              <section id="reader-at-a-glance" className="scroll-mt-28">
                <Card className="border-primary/25 bg-muted/40 dark:border-primary/20 dark:bg-muted/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-neutral-900 dark:text-neutral-50">At a glance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{descriptionLead}</p>
                  </CardContent>
                </Card>
              </section>
            ) : null}
            {enrichment && studioSpecsBeforeAnchors(enrichment).length > 0 ? (
              <ChapterSpecificComponentRenderer
                presentation={presentation}
                components={studioSpecsBeforeAnchors(enrichment)}
              />
            ) : null}
            {chapterSlug === 'getting-started-with-vibecoding' ? <GettingStartedOfficialHubs /> : null}
            <AnchorWorksPanel works={overlay.anchorWorks} leadCallout={overlay.primaryAnchorCallout} />
            {enrichment ? (
              <>
                <ChapterSpecificComponentRenderer
                  presentation={presentation}
                  components={studioSpecsAfterAnchors(enrichment)}
                />
                {hasContext ? (
                  <ContextCardsRow
                    artists={overlay.artists}
                    institutions={overlay.institutions}
                    curators={overlay.curatorLenses}
                  />
                ) : null}
                {enrichment.vibecoding ? (
                  <VibecodingInThisChapterCard vibecoding={toVibecodingChapterBridge(enrichment.vibecoding)} />
                ) : null}
                {enrichment.prompting ? <PromptingTipCard tip={enrichment.prompting} /> : null}
                {hasTools && chapterSlug !== 'getting-started-with-vibecoding' ? (
                  <ToolBridgeCard tools={overlay.tools} />
                ) : null}
                <VocabularyRow terms={overlay.glossaryTerms} glossaryHref={glossaryHref} />
                <div className="space-y-6">
                  {overlay.sections.map((s) => (
                    <ConceptBlock
                      key={s.id}
                      id={s.id}
                      label={s.label}
                      title={s.title}
                      body={s.body}
                      icon={s.icon}
                    />
                  ))}
                </div>
                <ChapterSpecificComponentRenderer
                  presentation={presentation}
                  components={studioSpecsAfterConceptsCore(enrichment)}
                />
                <LessonImageAssetStrip assets={overlay.imageAssets} />
                <ChapterSpecificComponentRenderer
                  presentation={presentation}
                  components={studioSpecsPageAsSpaceOnly(enrichment)}
                />
                <ArtifactPromptCard artifact={overlay.artifact} />
                <ChapterSpecificComponentRenderer
                  presentation={presentation}
                  components={studioSpecsAfterArtifact(enrichment)}
                />
                <ResourceStrip
                  resources={overlay.resources}
                  artists={overlay.artists}
                  institutions={overlay.institutions}
                  books={overlay.books}
                  tools={overlay.tools}
                  anchorWorks={overlay.anchorWorks}
                  curatorLenses={overlay.curatorLenses}
                  showQuickIndex={!overlay.resources?.length}
                  presentation={presentation}
                  dossierLayout={overlay.dossierLayout}
                />
                <ReflectionCard questions={overlay.reflection} />
                <LessonFullReadingCard html={diskChapter.html} variant="overlay" />
              </>
            ) : (
              <>
                <LessonImageAssetStrip assets={overlay.imageAssets} />
                <LessonFullReadingCard html={diskChapter.html} variant="overlay" />
                <div className="space-y-6">
                  {overlay.sections.map((s) => (
                    <ConceptBlock
                      key={s.id}
                      id={s.id}
                      label={s.label}
                      title={s.title}
                      body={s.body}
                      icon={s.icon}
                    />
                  ))}
                </div>
                <VocabularyRow terms={overlay.glossaryTerms} glossaryHref={glossaryHref} />
                <ContextCardsRow
                  artists={overlay.artists}
                  institutions={overlay.institutions}
                  curators={overlay.curatorLenses}
                />
                <ToolBridgeCard tools={overlay.tools} />
                <ArtifactPromptCard artifact={overlay.artifact} />
                <ReflectionCard questions={overlay.reflection} />
                <ResourceStrip
                  resources={overlay.resources}
                  artists={overlay.artists}
                  institutions={overlay.institutions}
                  books={overlay.books}
                  tools={overlay.tools}
                  anchorWorks={overlay.anchorWorks}
                  curatorLenses={overlay.curatorLenses}
                  showQuickIndex={!overlay.resources?.length}
                  dossierLayout={overlay.dossierLayout}
                />
              </>
            )}

            {pedagogicalNext ? (
              <NextChapterCard title={pedagogicalNext.title} href={pedagogicalNext.href} />
            ) : null}
          </div>
        </div>
      </div>
    )
  }

  const plainModule: ModuleKey = courseRow?.module ?? 'browser-language'
  const plainChapterNumber = courseRow?.number ?? 0
  const plainSequenceLabel = courseRow ? undefined : 'Supplement'
  const plainH2Items = extractH2NavFromHtml(diskChapter.html).map((h) => ({ id: h.id, label: h.label }))
  const plainRailGroups: ChapterRailNavGroup[] = [
    { id: 'start', label: 'Start here', items: [{ id: 'chapter-overview', label: 'Overview' }] },
    ...(plainH2Items.length > 0 ? [{ id: 'in-chapter', label: 'In this chapter', items: plainH2Items }] : []),
    { id: 'reading', label: 'Reading', items: [{ id: 'full-reading', label: 'Full chapter reading' }] },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {topLinks}
      <LessonChapterBanner
        banner={null}
        title={diskChapter.title}
        subtitle={diskChapter.description}
        className="mb-10"
      />
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,270px)_minmax(0,1fr)]">
        <StickyChapterRail
          chapterNumber={plainChapterNumber}
          chapterSequenceLabel={plainSequenceLabel}
          module={plainModule}
          chapterTitle={diskChapter.title}
          sectionGroups={plainRailGroups}
          glossaryTerms={[]}
          glossaryHref={glossaryHref}
          estimatedTimeLabel={courseRow?.estimatedTimeLabel ?? null}
          difficultyLabel={courseRow?.difficultyLabel ?? null}
          prevHref={prevHref}
          prevLabel={prev?.title ?? null}
          nextHref={nextHref}
          nextLabel={next?.title ?? null}
        />
        <div className="min-w-0 space-y-10">
          <LessonAmbientBackdrop className="p-6 sm:p-8">
            <section id="chapter-overview" className="scroll-mt-28 space-y-6">
              <div className="flex flex-wrap gap-2">
                {courseRow ? (
                  <Badge variant="secondary">Chapter {courseRow.number}</Badge>
                ) : (
                  <Badge variant="outline">Supplement</Badge>
                )}
                {courseRow ? (
                  <Badge variant="outline">{moduleLabel[courseRow.module] ?? courseRow.module}</Badge>
                ) : null}
                {courseRow?.estimatedTimeLabel ? (
                  <Badge variant="outline">{courseRow.estimatedTimeLabel}</Badge>
                ) : null}
                {courseRow?.difficultyLabel ? (
                  <Badge variant="outline">{courseRow.difficultyLabel}</Badge>
                ) : null}
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                {diskChapter.title}
              </h1>
              {diskChapter.description ? (
                <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">{diskChapter.description}</p>
              ) : null}
            </section>
          </LessonAmbientBackdrop>

          <LessonFullReadingCard html={diskChapter.html} variant="plain" />

          {next && nextHref ? <NextChapterCard title={next.title} href={nextHref} /> : null}
        </div>
      </div>
    </div>
  )
}
