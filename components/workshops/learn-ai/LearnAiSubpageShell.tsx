'use client'

import Link from 'next/link'
import { useTenant } from '@/components/tenant/TenantProvider'
import { TenantLayout } from '@/components/tenant/TenantLayout'
import {
  UnifiedNavigation,
  ooliteConfig,
  bakehouseConfig,
  madartsConfig,
} from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { LearnAiWorkshopNav } from './LearnAiWorkshopNav'
import { LEARN_AI_WORKSHOP_SLUG } from '@/lib/workshops/learn-ai-without-losing-yourself/constants'

export function LearnAiSubpageShell({
  orgSlug,
  title,
  lead,
  children,
}: {
  orgSlug: string
  title: string
  lead?: string
  children: React.ReactNode
}) {
  const { tenantId, isLoading: tenantLoading, error: tenantError } = useTenant()

  const getNavigationConfig = () => {
    if (tenantId === 'oolite') return ooliteConfig
    if (tenantId === 'bakehouse') return bakehouseConfig
    if (tenantId === 'madarts') return madartsConfig
    return ooliteConfig
  }

  if (tenantLoading) {
    return (
      <TenantLayout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary" />
        </div>
      </TenantLayout>
    )
  }

  if (tenantError) {
    return (
      <TenantLayout>
        <div className="flex min-h-screen items-center justify-center text-destructive">
          {tenantError}
        </div>
      </TenantLayout>
    )
  }

  return (
    <TenantLayout>
      <div className="min-h-screen bg-background">
        <UnifiedNavigation config={getNavigationConfig()} userRole="admin" />
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`/o/${orgSlug}/workshops/${encodeURIComponent(LEARN_AI_WORKSHOP_SLUG)}`}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Workshop overview
              </Link>
            </Button>
          </div>
          <LearnAiWorkshopNav orgSlug={orgSlug} className="mb-10" />
          <header className="mb-10 space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            {lead ? <p className="max-w-3xl text-muted-foreground leading-relaxed">{lead}</p> : null}
          </header>
          {children}
        </div>
      </div>
    </TenantLayout>
  )
}
