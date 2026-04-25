import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { dccSiteMeta } from '@/lib/marketing/content'
import { VIBE_NET_ART_WORKSHOP_SLUG } from '@/lib/course/vibe-net-art/constants'
import { getChapterBySlug } from '@/lib/course/chapters'
import {
  studioSpecsAfterAnchors,
  studioSpecsAfterArtifact,
  studioSpecsAfterConcepts,
  studioSpecsBeforeAnchors,
} from '@/lib/course/chapter-studio-specs'
import { toVibecodingChapterBridge } from '@/lib/course/vibecoding-bridge'
import { listDiskChapters } from '@/lib/workshops/workshop-disk-chapters'
import { loadPublicWorkshopChapter } from '@/lib/workshops/public-markdown-chapters'
import { ChapterHeroShell } from '@/components/course/ChapterHeroShell'
import { ChapterHeader } from '@/components/course/ChapterHeader'
import { ChapterThesisCard } from '@/components/course/ChapterThesisCard'
import { WhatYouAreMakingBar } from '@/components/course/WhatYouAreMakingBar'
import { AnchorWorksPanel } from '@/components/course/AnchorWorksPanel'
import { ContextCardsRow } from '@/components/course/ContextCardsRow'
import { VocabularyRow } from '@/components/course/VocabularyRow'
import { ArtifactPromptCard } from '@/components/course/ArtifactPromptCard'
import { ReflectionCard } from '@/components/course/ReflectionCard'
import { ResourceStrip } from '@/components/course/ResourceStrip'
import { NextChapterCard } from '@/components/course/NextChapterCard'
import { VibecodingInThisChapterCard } from '@/components/course/VibecodingInThisChapterCard'
import { PromptingTipCard } from '@/components/course/PromptingTipCard'
import { ToolBridgeCard } from '@/components/course/ToolBridgeCard'
import { ChapterSpecificComponentRenderer } from '@/components/course/ChapterSpecificComponentRenderer'
import { ConceptBlock } from '@/components/course/ConceptBlock'
import { cn } from '@/lib/utils'

const HANDBOOK_BASE = '/workshop/vibe-coding-net-art/'

type PageProps = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const rows = await listDiskChapters(VIBE_NET_ART_WORKSHOP_SLUG)
  return rows.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: raw } = await params
  const slug = decodeURIComponent(raw)
  const chapter = getChapterBySlug(slug)
  const disk = await loadPublicWorkshopChapter(VIBE_NET_ART_WORKSHOP_SLUG, slug)
  if (!chapter || !disk) return { title: 'Chapter' }
  return {
    title: `${chapter.title} — Curated lesson`,
    description: `${disk.description || chapter.summary} — ${dccSiteMeta.organizationName}`,
    alternates: { canonical: `${HANDBOOK_BASE.replace(/\/$/, '')}/chapters/${encodeURIComponent(slug)}` },
  }
}

export default async function VibeCodingNetArtChapterDossierPage({ params }: PageProps) {
  const { slug: raw } = await params
  const slug = decodeURIComponent(raw)

  const chapter = getChapterBySlug(slug)
  if (!chapter) notFound()

  if (!(await loadPublicWorkshopChapter(VIBE_NET_ART_WORKSHOP_SLUG, slug))) notFound()

  const glossaryHref = `${HANDBOOK_BASE}glossary`
  const enrichment = chapter.lessonEnrichment
  const presentation = chapter.design?.lessonSkin
  const readerHref = `/workshop/${encodeURIComponent(VIBE_NET_ART_WORKSHOP_SLUG)}/chapters/${encodeURIComponent(slug)}`

  const nextSlug = chapter.nextChapterSlug
  const nextChapter =
    nextSlug != null && nextSlug !== '' ? getChapterBySlug(nextSlug) : null
  const nextHref = nextChapter
    ? `${HANDBOOK_BASE}chapters/${encodeURIComponent(nextChapter.slug)}`
    : null

  return (
    <main
      className={cn(
        'mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10',
        presentation === 'hypertext'
          ? 'space-y-10'
          : presentation === 'remix-collage'
            ? 'space-y-7'
            : presentation === 'publishing' || presentation === 'canon-entry'
              ? 'space-y-9'
              : presentation === 'interaction-motion' ||
                presentation === 'identity-networked' ||
                presentation === 'advanced-pathways' ||
                presentation === 'final-capstone' ||
                presentation === 'browser-as-medium' ||
                presentation === 'interface-glitch' ||
                presentation === 'systems-circulation' ||
                presentation === 'getting-started'
                ? 'space-y-7'
                : 'space-y-8',
      )}
      data-chapter-dossier={slug}
    >
      <div className="flex flex-wrap gap-3 text-sm text-neutral-600 dark:text-neutral-400">
        <Link href={HANDBOOK_BASE} className="font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100">
          ← Course handbook
        </Link>
        <span aria-hidden>·</span>
        <Link href={glossaryHref} className="font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100">
          Glossary
        </Link>
        <span aria-hidden>·</span>
        <Link href={readerHref} className="font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100">
          Full lesson reader (markdown + rail)
        </Link>
      </div>

      <ChapterHeroShell chapter={chapter}>
        <ChapterHeader chapter={chapter} />
      </ChapterHeroShell>

      <ChapterThesisCard thesis={chapter.thesis} />

      {chapter.makingPreview?.length ? (
        <WhatYouAreMakingBar items={chapter.makingPreview} lessonSkin={presentation} />
      ) : null}

      {enrichment && studioSpecsBeforeAnchors(enrichment).length > 0 ? (
        <ChapterSpecificComponentRenderer
          presentation={presentation}
          components={studioSpecsBeforeAnchors(enrichment)}
        />
      ) : null}

      <AnchorWorksPanel works={chapter.anchorWorks} leadCallout={chapter.primaryAnchorCallout} />

      {enrichment ? (
        <ChapterSpecificComponentRenderer
          presentation={presentation}
          components={studioSpecsAfterAnchors(enrichment)}
        />
      ) : null}

      <ContextCardsRow artists={chapter.artists} institutions={chapter.institutions} curators={chapter.curatorLenses} />

      {enrichment?.vibecoding ? (
        <VibecodingInThisChapterCard vibecoding={toVibecodingChapterBridge(enrichment.vibecoding)} />
      ) : null}

      {enrichment?.prompting ? <PromptingTipCard tip={enrichment.prompting} /> : null}

      {chapter.tools.length && slug !== 'getting-started-with-vibecoding' ? (
        <ToolBridgeCard tools={chapter.tools} />
      ) : null}

      <VocabularyRow terms={chapter.glossaryTerms} glossaryHref={glossaryHref} />

      <section
        id="concepts"
        className={cn(
          'space-y-6',
          presentation === 'hypertext' &&
            'rounded-[2rem] border border-neutral-200/90 bg-neutral-50/40 p-6 dark:border-neutral-800 dark:bg-neutral-950/40 md:p-8',
          (presentation === 'publishing' ||
            presentation === 'advanced-pathways' ||
            presentation === 'final-capstone') &&
            'rounded-[2rem] border border-[#1F8A70]/15 bg-[#F7FFFC]/50 p-6 dark:border-[#7CE3C6]/15 dark:bg-[#071A16]/30 md:p-8',
          presentation === 'canon-entry' &&
            'rounded-[2rem] border border-slate-200/90 bg-slate-50/50 p-6 dark:border-slate-700 dark:bg-slate-950/30 md:p-8',
          (presentation === 'interaction-motion' ||
            presentation === 'browser-as-medium' ||
            presentation === 'interface-glitch') &&
            'rounded-[2rem] border border-violet-200/80 bg-gradient-to-br from-violet-50/40 via-white to-fuchsia-50/30 p-6 dark:border-violet-800/50 dark:from-violet-950/25 dark:via-neutral-950 dark:to-fuchsia-950/15 md:p-8',
          (presentation === 'identity-networked' || presentation === 'systems-circulation') &&
            'rounded-[2rem] border border-rose-200/70 bg-gradient-to-br from-rose-50/50 via-white to-violet-50/25 p-6 dark:border-rose-900/40 dark:from-rose-950/20 dark:via-neutral-950 dark:to-violet-950/15 md:p-8',
          presentation === 'getting-started' &&
            'rounded-[2rem] border border-blue-200/80 bg-gradient-to-br from-blue-50/50 via-white to-slate-50/35 p-6 dark:border-blue-900/40 dark:from-blue-950/20 dark:via-neutral-950 dark:to-slate-950/15 md:p-8',
        )}
      >
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
            Concepts
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50 md:text-4xl">
            Key ideas in this chapter
          </h2>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {chapter.sections.map((section) => (
            <ConceptBlock
              key={section.id}
              id={section.id}
              label={section.label}
              title={section.title}
              body={section.body}
              icon={section.icon}
            />
          ))}
        </div>
      </section>

      {enrichment ? (
        <ChapterSpecificComponentRenderer
          presentation={presentation}
          components={studioSpecsAfterConcepts(enrichment)}
        />
      ) : null}

      <ArtifactPromptCard artifact={chapter.artifact} />

      {enrichment ? (
        <ChapterSpecificComponentRenderer
          presentation={presentation}
          components={studioSpecsAfterArtifact(enrichment)}
        />
      ) : null}

      <ResourceStrip
        resources={chapter.resources}
        artists={chapter.artists}
        institutions={chapter.institutions}
        books={chapter.books}
        tools={chapter.tools}
        anchorWorks={chapter.anchorWorks}
        curatorLenses={chapter.curatorLenses}
        showQuickIndex={!chapter.resources?.length}
        presentation={presentation}
        dossierLayout={chapter.dossierLayout}
      />

      <ReflectionCard questions={chapter.reflection} />

      {nextChapter && nextHref ? (
        <NextChapterCard title={nextChapter.title} href={nextHref} />
      ) : null}
    </main>
  )
}
