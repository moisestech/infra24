import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { MemoryAgentPublicAbout } from '@/components/memory-agent/MemoryAgentPublicAbout'
import { MemoryAgentRoadmap } from '@/components/memory-agent/MemoryAgentRoadmap'
import { SohoMemberSignalAboutPage } from '@/components/sohohouse/SohoMemberSignalAboutPage'
import { getMemoryAgentBranding } from '@/lib/memory-agent/org-branding'
import { getTenantConfig } from '@/lib/tenant'

type PageProps = { params: Promise<{ slug: string }> }

function normalizeSlug(slug: string): string {
  const s = slug.trim().toLowerCase()
  if (s === 'soho-house') return 'sohohouse'
  return s
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: raw } = await params
  const slug = normalizeSlug(raw)
  if (slug === 'sohohouse') {
    return {
      title: 'Soho House AI Assistant for Member Relations — About the Demo',
      description:
        'Concept demo for a governed Member Signal Agent. Sample House-style programming — not connected to Soho House internal systems.',
    }
  }
  const tenant = getTenantConfig(slug)
  const branding = getMemoryAgentBranding(slug)
  const name = tenant?.name ?? branding.orgName
  return {
    title: `${branding.productTitle} — About — ${name}`,
    description: `How ${branding.agentName} works at ${name}: voice and text questions grounded in institutional records.`,
  }
}

export default async function MemoryAgentAboutPage({ params }: PageProps) {
  const { slug: raw } = await params
  const slug = normalizeSlug(raw)
  if (raw.trim().toLowerCase() === 'soho-house') {
    redirect('/o/sohohouse/memory-agent/about')
  }

  if (slug === 'sohohouse') {
    return <SohoMemberSignalAboutPage />
  }

  const tenant = getTenantConfig(slug)
  const orgName = tenant?.name ?? getMemoryAgentBranding(slug).orgName

  return (
    <div className="memory-agent-theme min-h-screen bg-[var(--ma-page-bg,#fafaf9)] px-4 py-10 text-[var(--ma-text,#18181b)] dark:bg-[var(--ma-page-bg-dark,#09090b)] dark:text-[var(--ma-text,#fafafa)]">
      <div className="mx-auto max-w-2xl">
        <MemoryAgentPublicAbout orgSlug={slug} orgName={orgName} />

        <details className="mt-12 rounded-xl border border-[var(--ma-border)] bg-[var(--ma-surface)] p-4">
          <summary className="cursor-pointer text-sm font-medium text-[var(--ma-text)]">
            Roadmap &amp; technical notes (internal)
          </summary>
          <div className="mt-6">
            <MemoryAgentRoadmap />
          </div>
          <p className="mt-6 text-center text-xs text-[var(--ma-text-muted)]">
            Developer controls live on the main agent page (enable developer mode in settings).
          </p>
        </details>

        <p className="mt-8 text-center text-sm">
          <Link
            href={`/o/${slug}/memory-agent`}
            className="font-medium text-[color:var(--ma-primary,#0891b2)] hover:underline"
          >
            ← Back to agent
          </Link>
        </p>
      </div>
    </div>
  )
}
