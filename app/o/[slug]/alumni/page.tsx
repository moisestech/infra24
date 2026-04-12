import type { Metadata } from 'next'

import { AlumniDirectoryPage } from '@/components/organization/AlumniDirectoryPage'
import {
  fetchAlumniFromAirtable,
  isAlumniAirtableConfigured,
} from '@/lib/airtable/alumni-service'
import { getTenantConfig } from '@/lib/tenant'

export const dynamic = 'force-dynamic'

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const tenant = getTenantConfig(slug)
  const name = tenant?.name ?? slug
  return {
    title: `Alumni — ${name}`,
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

  if (configured) {
    const data = await fetchAlumniFromAirtable(slug)
    if (data === null) {
      fetchError = true
      alumni = []
    } else {
      alumni = data
    }
  }

  return (
    <AlumniDirectoryPage
      slug={slug}
      orgName={orgName}
      configured={configured}
      fetchError={fetchError}
      alumni={alumni ?? []}
    />
  )
}
