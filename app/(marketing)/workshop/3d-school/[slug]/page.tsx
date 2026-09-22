import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ThreeDSchoolChrome } from '@/components/dcc/education/3d-curriculum/ThreeDSchoolChrome'
import { CurriculumWorkshopDetail } from '@/components/dcc/education/3d-curriculum/CurriculumWorkshopDetail'
import {
  getCurriculumWorkshopBySlug,
  listCurriculumWorkshopSlugs,
} from '@/lib/dcc/education/3d-curriculum'
import { dccSiteMeta } from '@/lib/marketing/content'

type Props = {
  params: { slug: string }
}

export function generateStaticParams() {
  return listCurriculumWorkshopSlugs().map((slug) => ({ slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const workshop = getCurriculumWorkshopBySlug(params.slug)
  if (!workshop) {
    return { title: 'Workshop' }
  }
  return {
    title: workshop.title,
    description: workshop.subtitle ?? workshop.whatYouMake,
    alternates: { canonical: `/workshop/3d-school/${workshop.slug}` },
    openGraph: {
      title: `${workshop.title} | ${dccSiteMeta.organizationName}`,
      description: workshop.subtitle ?? workshop.whatYouMake,
      url: `/workshop/3d-school/${workshop.slug}`,
    },
  }
}

export default function ThreeDSchoolWorkshopPage({ params }: Props) {
  const workshop = getCurriculumWorkshopBySlug(params.slug)
  if (!workshop) notFound()

  return (
    <ThreeDSchoolChrome>
      <CurriculumWorkshopDetail workshop={workshop} />
    </ThreeDSchoolChrome>
  )
}
