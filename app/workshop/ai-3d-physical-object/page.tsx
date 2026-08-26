import type { Metadata } from 'next'
import { DccEditorialWorkshopPage } from '@/components/dcc/education/DccEditorialWorkshopPage'
import { AI_3D_PHYSICAL_OBJECT } from '@/lib/dcc/education/editorial-workshops'
import { dccSiteMeta } from '@/lib/marketing/content'

const page = AI_3D_PHYSICAL_OBJECT

export const metadata: Metadata = {
  title: page.title,
  description: page.lead,
  alternates: { canonical: `/workshop/${page.slug}` },
  openGraph: {
    title: `${page.title} | ${dccSiteMeta.organizationName}`,
    description: page.lead,
    url: `/workshop/${page.slug}`,
    images: [{ url: page.hero.src, alt: page.hero.alt }],
  },
}

export default function Ai3dPhysicalObjectPage() {
  return <DccEditorialWorkshopPage page={page} />
}
