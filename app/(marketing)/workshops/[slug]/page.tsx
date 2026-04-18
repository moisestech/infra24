import type { Metadata } from 'next'
import { DccWorkshopPublicDetail } from '@/components/marketing/DccWorkshopPublicDetail'
import { dccSiteMeta } from '@/lib/marketing/content'
import { DCC_WORKSHOPS_SEO_BANNER_IMAGE_URL } from '@/lib/marketing/dcc-workshops-landing-content'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug: raw } = await params
  const slug = decodeURIComponent(raw)
  const title = slug.replace(/-/g, ' ')
  const description = `Workshop overview — ${dccSiteMeta.organizationName} public catalog.`
  return {
    title,
    description,
    openGraph: {
      title: `${title} | Workshops`,
      description,
      url: `/workshops/${encodeURIComponent(slug)}`,
      images: [
        {
          url: DCC_WORKSHOPS_SEO_BANNER_IMAGE_URL,
          alt: `${dccSiteMeta.organizationName} — ${title}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Workshops`,
      description,
      images: [DCC_WORKSHOPS_SEO_BANNER_IMAGE_URL],
    },
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
