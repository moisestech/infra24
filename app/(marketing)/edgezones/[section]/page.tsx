import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { EdgeZonesHashRedirect } from '@/components/marketing/edgezones/EdgeZonesHashRedirect'
import {
  EDGE_ZONES_SECTION_PATHS,
  type EdgeZonesSectionPath,
  isEdgeZonesSectionPath,
} from '@/lib/marketing/edgezones-sections'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

type Props = {
  params: Promise<{ section: string }>
}

export function generateStaticParams(): { section: EdgeZonesSectionPath }[] {
  return EDGE_ZONES_SECTION_PATHS.map((section) => ({ section }))
}

export default async function EdgeZonesSectionPage({ params: pendingParams }: Props) {
  const params = await pendingParams
  if (!isEdgeZonesSectionPath(params.section)) {
    notFound()
  }

  return <EdgeZonesHashRedirect section={params.section} />
}
