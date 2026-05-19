import type { Metadata } from 'next'

import { MemoryAgentHandoffPage } from '@/components/memory-agent/MemoryAgentHandoffPage'
import { getTenantConfig } from '@/lib/tenant'

export const dynamic = 'force-dynamic'

type PageProps = { params: Promise<{ slug: string; assetId: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const tenant = getTenantConfig(slug)
  const name = tenant?.name ?? slug
  return {
    title: `Guide — ${name}`,
    description: `Mobile handoff from ${name} Memory Agent.`,
  }
}

export default async function MemoryAgentHandoffRoute({ params }: PageProps) {
  const { slug, assetId } = await params
  const tenant = getTenantConfig(slug)
  const orgName = tenant?.name ?? slug
  const primary = tenant?.theme.primaryColor ?? '#0891b2'

  return (
    <MemoryAgentHandoffPage
      slug={slug}
      assetId={assetId}
      orgName={orgName}
      primaryColor={primary}
    />
  )
}
