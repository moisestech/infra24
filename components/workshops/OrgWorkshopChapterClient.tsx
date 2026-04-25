'use client'

import type { ReactNode } from 'react'
import { TenantLayout } from '@/components/tenant/TenantLayout'
import {
  UnifiedNavigation,
  ooliteConfig,
  bakehouseConfig,
  madartsConfig,
} from '@/components/navigation'
import { WorkshopChapterReader } from '@/components/workshops/marketing/WorkshopChapterReader'
import { useTenant } from '@/components/tenant/TenantProvider'

function navigationForTenant(tenantId: string | null) {
  if (tenantId === 'oolite') return ooliteConfig
  if (tenantId === 'bakehouse') return bakehouseConfig
  if (tenantId === 'madarts') return madartsConfig
  return ooliteConfig
}

export function OrgWorkshopChapterClient({
  orgSlug,
  workshopKey,
  workshopId,
  chapterSlug,
  children,
}: {
  orgSlug: string
  workshopKey: string
  workshopId: string
  chapterSlug: string
  /** When set (server-rendered), replaces the default learn API markdown reader — e.g. Vibe Coding rich lesson. */
  children?: ReactNode
}) {
  const { tenantId } = useTenant()
  const nav = navigationForTenant(tenantId)
  const encKey = encodeURIComponent(workshopKey)
  const base = `/o/${encodeURIComponent(orgSlug)}/workshop/${encKey}/chapters`

  return (
    <TenantLayout>
      <div className="min-h-screen bg-background">
        <UnifiedNavigation config={nav} userRole="admin" />
        {children ?? (
          <WorkshopChapterReader
            workshopId={workshopId}
            chapterSlug={chapterSlug}
            shell="org"
            backHref={`/o/${encodeURIComponent(orgSlug)}/workshop/${encKey}`}
            chapterHref={(slug) => `${base}/${encodeURIComponent(slug)}`}
          />
        )}
      </div>
    </TenantLayout>
  )
}
