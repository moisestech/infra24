import type { Metadata } from 'next'
import Link from 'next/link'
import { vibeCodingNetArtOverview } from '@/content/workshop/vibe-coding-net-art-overview'
import { handbookHref } from '@/lib/workshop/handbook-href'
import { dccSiteMeta } from '@/lib/marketing/content'
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

const HANDBOOK_SLUG = 'vibe-coding-net-art'

export const metadata: Metadata = {
  title: `${vibeCodingNetArtOverview.title} — Course handbook`,
  description: `${dccSiteMeta.organizationName} — ${vibeCodingNetArtOverview.description.slice(0, 155)}…`,
  alternates: { canonical: `/workshop/${HANDBOOK_SLUG}` },
}

export default function VibeCodingNetArtWorkshopPage() {
  const basePath = `/workshop/${HANDBOOK_SLUG}/`
  const page = vibeCodingNetArtOverview
  const heroCtas = page.heroCtas.map((c) => ({
    label: c.label,
    href: handbookHref(basePath, c.href),
  }))

  return (
    <main className="mx-auto max-w-7xl space-y-10 px-4 py-8 md:px-8 md:py-12">
      <p className="text-sm text-neutral-600">
        <Link
          href={`/workshops/${encodeURIComponent('vibe-coding-and-net-art')}`}
          className="font-medium text-neutral-900 underline-offset-4 hover:underline"
        >
          ← Catalog workshop page
        </Link>
      </p>

      <WorkshopHero title={page.title} subtitle={page.subtitle} description={page.description} ctas={heroCtas} />
      <WhyThisWorkshop items={page.whyThisWorkshop} />
      <ModuleGroupingGrid modules={page.modules} />
      <CourseSequenceIndex chapters={page.courseSequence} basePath={basePath} />
      <CanonicalSpineStrip spine={page.canonicalSpine} />
      <ToolStackGrid tools={page.toolStack} />
      <LearningOutcomesGrid outcomes={page.learningOutcomes} />
      <WhatYouLeaveWith items={page.whatYouLeaveWith} />
      <GlossaryCTA glossary={page.glossary} basePath={basePath} />
      <FinalProjectPreview project={page.finalProjectPreview} basePath={basePath} />
    </main>
  )
}
