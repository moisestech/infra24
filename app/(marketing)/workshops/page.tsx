import type { Metadata } from 'next'
import { DccWorkshopsCatalogClient } from '@/components/marketing/DccWorkshopsCatalogClient'
import { dccSiteMeta } from '@/lib/marketing/content'

export const metadata: Metadata = {
  title: 'Workshops',
  description:
    'Public Digital Lab workshop catalog — artist-centered sessions on websites, discoverability, documentation, AI literacy, and creative digital practice.',
  openGraph: {
    title: `Workshops | ${dccSiteMeta.organizationName}`,
    description:
      'Public workshop catalog for contemporary artistic digital practice. Sign in to Oolite for the full member catalog.',
  },
}

export default function DccWorkshopsPage() {
  return <DccWorkshopsCatalogClient />
}
