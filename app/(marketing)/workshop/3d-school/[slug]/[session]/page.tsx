import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ThreeDSchoolChrome } from '@/components/dcc/education/3d-curriculum/ThreeDSchoolChrome'
import { CurriculumSessionDetail } from '@/components/dcc/education/3d-curriculum/CurriculumSessionDetail'
import {
  getCurriculumSession,
  listCurriculumSessionParams,
} from '@/lib/dcc/education/3d-curriculum'
import { dccSiteMeta } from '@/lib/marketing/content'

type Props = {
  params: { slug: string; session: string }
}

export function generateStaticParams() {
  return listCurriculumSessionParams()
}

export function generateMetadata({ params }: Props): Metadata {
  const match = getCurriculumSession(params.slug, params.session)
  if (!match) return { title: 'Session' }
  const session = match.workshop.curriculumSessions?.[match.sessionIndex]
  if (!session) return { title: 'Session' }
  const path = `/workshop/3d-school/${match.workshop.slug}/${session.slug}`
  return {
    title: `${session.title} · ${match.workshop.title}`,
    description: session.body,
    alternates: { canonical: path },
    openGraph: {
      title: `${session.title} | ${dccSiteMeta.organizationName}`,
      description: session.body,
      url: path,
    },
  }
}

export default function ThreeDSchoolSessionPage({ params }: Props) {
  const match = getCurriculumSession(params.slug, params.session)
  if (!match) notFound()

  return (
    <ThreeDSchoolChrome organizedOpen={false}>
      <CurriculumSessionDetail workshop={match.workshop} sessionIndex={match.sessionIndex} />
    </ThreeDSchoolChrome>
  )
}
