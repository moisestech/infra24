import type { Metadata } from 'next'
import { DccWorkshopPublicDetail } from '@/components/marketing/DccWorkshopPublicDetail'
import { dccSiteMeta } from '@/lib/marketing/content'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug: raw } = await params
  const slug = decodeURIComponent(raw)
  return {
    title: slug.replace(/-/g, ' '),
    description: `Workshop overview — ${dccSiteMeta.organizationName} public catalog.`,
  }
}

export default async function DccWorkshopDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug: raw } = await params
  const workshopKey = decodeURIComponent(raw)
  return <DccWorkshopPublicDetail workshopKey={workshopKey} />
}
