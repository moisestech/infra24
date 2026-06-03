import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ExternalLink } from 'lucide-react'

import { AlumniProfileView } from '@/components/organization/AlumniProfileView'
import { OrgDirectoryProfileBackHeader } from '@/components/organization/OrgDirectoryProfileBackHeader'
import {
  UnifiedNavigation,
  ooliteConfig,
  bakehouseConfig,
  madartsConfig,
  sohohouseConfig,
} from '@/components/navigation'
import {
  fetchAlumniFromAirtable,
  isAlumniAirtableConfigured,
} from '@/lib/airtable/alumni-service'
import { enrichAlumniWithDirectoryArtists } from '@/lib/organization/artist-alumni-bridge'
import { fetchDirectoryArtistsForOrgSlug } from '@/lib/organization/fetch-directory-artists'
import { getTenantConfig } from '@/lib/tenant'

export const dynamic = 'force-dynamic'

type PageProps = { params: Promise<{ slug: string; id: string }> }

function getNavigationConfig(slug: string) {
  switch (slug) {
    case 'oolite':
      return ooliteConfig
    case 'bakehouse':
      return bakehouseConfig
    case 'madarts':
      return madartsConfig
    case 'sohohouse':
      return sohohouseConfig
    default:
      return ooliteConfig
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, id } = await params
  if (!isAlumniAirtableConfigured(slug)) {
    return { title: 'Alumni' }
  }
  const rows = (await fetchAlumniFromAirtable(slug)) ?? []
  const row = rows.find((r) => r.id === id)
  const name = row?.artistName?.trim() || row?.name?.trim() || 'Alumni'
  return { title: name }
}

export default async function OrgAlumniProfilePage({ params }: PageProps) {
  const { slug, id } = await params
  const tenant = getTenantConfig(slug)
  const orgName = tenant?.name ?? slug

  if (!isAlumniAirtableConfigured(slug)) {
    notFound()
  }

  const [alumni, directoryArtists] = await Promise.all([
    fetchAlumniFromAirtable(slug),
    fetchDirectoryArtistsForOrgSlug(slug),
  ])

  const rows = alumni ?? []
  const raw = rows.find((r) => r.id === id)
  if (!raw) notFound()

  const row = enrichAlumniWithDirectoryArtists(rows, directoryArtists, slug).find(
    (r) => r.id === id
  )
  if (!row) notFound()

  const navConfig = getNavigationConfig(slug)

  const displayName = row.artistName?.trim() || row.name?.trim() || 'Alumni profile'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedNavigation config={navConfig} userRole="user" />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <OrgDirectoryProfileBackHeader
          orgSlug={slug}
          title={displayName}
          description={`${orgName} alumni — full profile`}
          backHref={`/o/${slug}/alumni`}
        />
        <AlumniProfileView row={row} orgName={orgName} orgSlug={slug} variant="page" />
        {row.linkedArtist ? (
          <p className="mt-8 text-sm text-muted-foreground">
            Also in the member directory:{' '}
            <Link
              href={row.linkedArtist.artistProfileUrl}
              className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
            >
              View artist profile
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </p>
        ) : null}
      </main>
    </div>
  )
}
