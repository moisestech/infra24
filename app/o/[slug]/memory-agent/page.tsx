import type { Metadata } from 'next'
import { MemoryAgentShell } from '@/components/memory-agent/MemoryAgentShellClient'
import { redirect } from 'next/navigation'

import { getMemoryAgentBranding } from '@/lib/memory-agent/org-branding'
import { getTenantConfig } from '@/lib/tenant'

export const dynamic = 'force-dynamic'

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const branding = getMemoryAgentBranding(slug)
  return {
    title: `${branding.productTitle} — ${branding.agentName}`,
    description: `${branding.agentName} guides ${branding.orgName}'s institutional memory.`,
  }
}

export default async function OrgMemoryAgentPage({ params }: PageProps) {
  const { slug: raw } = await params
  if (raw.trim().toLowerCase() === 'soho-house') {
    redirect('/o/sohohouse/memory-agent')
  }
  const slug = raw
  const tenant = getTenantConfig(slug)
  const orgName = tenant?.name ?? slug

  return <MemoryAgentShell slug={slug} orgName={orgName} />
}
