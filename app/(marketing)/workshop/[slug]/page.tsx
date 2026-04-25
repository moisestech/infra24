import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { dccSiteMeta } from '@/lib/marketing/content'
import { canonicalWorkshopMarketingSlug } from '@/lib/workshops/workshop-metadata-slug-aliases'
import { VIBE_NET_ART_WORKSHOP_SLUG } from '@/lib/course/vibe-net-art/constants'
import { vibeCodingNetArtOverview } from '@/content/workshop/vibe-coding-net-art-overview'
import { handbookHref } from '@/lib/workshop/handbook-href'
import { WorkshopHero } from '@/components/workshop/WorkshopHero'
import { WhyThisWorkshop } from '@/components/workshop/WhyThisWorkshop'
import { ModuleGroupingGrid } from '@/components/workshop/ModuleGroupingGrid'
import { CourseSequenceIndex } from '@/components/workshop/CourseSequenceIndex'
import { CanonicalSpineStrip } from '@/components/workshop/CanonicalSpineStrip'
import { ToolStackGrid } from '@/components/workshop/ToolStackGrid'
import { LearningOutcomesGrid } from '@/components/workshop/LearningOutcomesGrid'
import { WhatYouLeaveWith } from '@/components/workshop/WhatYouLeaveWith'
import { GlossaryCTA } from '@/components/workshop/GlossaryCTA'
import { FinalProjectPreview } from '@/components/workshop/FinalProjectPreview'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return [{ slug: VIBE_NET_ART_WORKSHOP_SLUG }]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: raw } = await params
  const slug = canonicalWorkshopMarketingSlug(decodeURIComponent(raw))
  if (slug !== VIBE_NET_ART_WORKSHOP_SLUG) {
    return { title: 'Workshop' }
  }
  const title = `${vibeCodingNetArtOverview.title} — Course handbook`
  return {
    title,
    description: `${dccSiteMeta.organizationName} — ${vibeCodingNetArtOverview.description.slice(0, 155)}…`,
    alternates: { canonical: `/workshop/${slug}` },
  }
}

export default async function WorkshopHandbookPage({ params }: Props) {
  const { slug: raw } = await params
  const slug = canonicalWorkshopMarketingSlug(decodeURIComponent(raw))
  if (slug !== VIBE_NET_ART_WORKSHOP_SLUG) {
    notFound()
  }

  const basePath = `/workshop/${encodeURIComponent(slug)}/`
  const page = vibeCodingNetArtOverview
  const heroCtas = page.heroCtas.map((c) => ({
    label: c.label,
    href: handbookHref(basePath, c.href),
  }))

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
      <div className="mb-2 text-sm text-neutral-600 dark:text-neutral-400">
        <Link
          href={`/workshops/${encodeURIComponent(slug)}`}
          className="font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
        >
          ← Catalog workshop page
        </Link>
      </div>

      <main className="space-y-10">
        <WorkshopHero
          title={page.title}
          subtitle={page.subtitle}
          description={page.description}
          ctas={heroCtas}
        />
        <WhyThisWorkshop items={[...page.whyThisWorkshop]} />
        <ModuleGroupingGrid modules={[...page.modules]} />
        <CourseSequenceIndex chapters={[...page.courseSequence]} basePath={basePath} />
        <CanonicalSpineStrip spine={page.canonicalSpine} />
        <ToolStackGrid tools={[...page.toolStack]} />
        <LearningOutcomesGrid outcomes={[...page.learningOutcomes]} />
        <WhatYouLeaveWith items={[...page.whatYouLeaveWith]} />
        <GlossaryCTA glossary={page.glossary} basePath={basePath} />
        <FinalProjectPreview project={page.finalProjectPreview} basePath={basePath} />
      </main>
    </div>
  )
}
