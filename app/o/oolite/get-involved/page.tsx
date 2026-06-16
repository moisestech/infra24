'use client'

import { Suspense } from 'react'

import { UnifiedNavigation, ooliteConfig } from '@/components/navigation'
import { GetInvolvedHub } from '@/components/oolite/GetInvolvedHub'
import { TenantLayout } from '@/components/tenant/TenantLayout'
import { useTenant } from '@/components/tenant/TenantProvider'

function GetInvolvedPageContent() {
  const { tenantId, isLoading, error } = useTenant()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  if (tenantId !== 'oolite') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">This page is only available for Oolite Arts.</p>
      </div>
    )
  }

  return (
    <TenantLayout>
      <div className="min-h-screen bg-background">
        <UnifiedNavigation config={ooliteConfig} userRole="admin" />
        <GetInvolvedHub />
      </div>
    </TenantLayout>
  )
}

export default function OoliteGetInvolvedPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading…</div>}>
      <GetInvolvedPageContent />
    </Suspense>
  )
}
