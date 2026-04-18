import type { Metadata } from 'next'
import { DccWorkshopsCatalogClient } from '@/components/marketing/DccWorkshopsCatalogClient'
import { dccSiteMeta } from '@/lib/marketing/content'
import { DCC_WORKSHOPS_SEO_BANNER_IMAGE_URL } from '@/lib/marketing/dcc-workshops-landing-content'

const workshopsOgDescription =
  'Browse published DCC.miami workshops for digital practice, public programs, and cultural organizations in Miami.'

export const metadata: Metadata = {
  title: 'Workshops',
  description:
    'Digital Culture Center Miami public workshop catalog — artist-centered sessions on websites, discoverability, documentation, AI literacy, and creative digital practice.',
  openGraph: {
    title: `Workshops | ${dccSiteMeta.organizationName}`,
    description: workshopsOgDescription,
    url: '/workshops',
    images: [
      {
        url: DCC_WORKSHOPS_SEO_BANNER_IMAGE_URL,
        alt: `${dccSiteMeta.organizationName} — public workshops`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Workshops | ${dccSiteMeta.organizationName}`,
    description: workshopsOgDescription,
    images: [DCC_WORKSHOPS_SEO_BANNER_IMAGE_URL],
  },
}

export default function DccWorkshopsPage() {
  return <DccWorkshopsCatalogClient />
}
