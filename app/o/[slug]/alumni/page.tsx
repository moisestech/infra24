import type { Metadata } from 'next'
import { Suspense } from 'react'

import { AlumniDirectoryPage } from '@/components/organization/AlumniDirectoryPage'
import {
  fetchAlumniFromAirtable,
  isAlumniAirtableConfigured,
} from '@/lib/airtable/alumni-service'
import { enrichAlumniWithDirectoryArtists } from '@/lib/organization/artist-alumni-bridge'
import { fetchDirectoryArtistsForOrgSlug } from '@/lib/organization/fetch-directory-artists'
import { getTenantConfig } from '@/lib/tenant'

export const dynamic = 'force-dynamic'

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const tenant = getTenantConfig(slug)
  const name = tenant?.name ?? slug
  return {
    title: 'Alumni',
    description: `Alumni directory for ${name}.`,
  }
}

export default async function OrgAlumniPage({ params }: PageProps) {
  const { slug } = await params
  const tenant = getTenantConfig(slug)
  const orgName = tenant?.name ?? slug

  const configured = isAlumniAirtableConfigured(slug)

  let alumni: Awaited<ReturnType<typeof fetchAlumniFromAirtable>> = null
  let fetchError = false

  let directoryArtists: Awaited<ReturnType<typeof fetchDirectoryArtistsForOrgSlug>> = []

  if (configured) {
    const [data, artists] = await Promise.all([
      fetchAlumniFromAirtable(slug),
      fetchDirectoryArtistsForOrgSlug(slug),
    ])
    directoryArtists = artists
    if (data === null) {
      fetchError = true
      alumni = []
    } else {
      alumni = enrichAlumniWithDirectoryArtists(data, artists, slug)
    }
  }

  return (
    <Suspense
      fallback={
        <div className="container mx-auto max-w-6xl px-4 py-16 text-center text-muted-foreground">
          Loading alumni…
        </div>
      }
    >
      <AlumniDirectoryPage
        slug={slug}
        orgName={orgName}
        configured={configured}
        fetchError={fetchError}
        alumni={alumni ?? []}
        directoryArtistCount={directoryArtists.length}
      />
    </Suspense>
  )
}
