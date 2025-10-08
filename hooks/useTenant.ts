/**
 * useTenant Hook
 * Provides tenant configuration and utilities for client-side components
 */

'use client'

import { useParams, usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { getTenantConfig, TenantConfig } from '@/lib/tenant'

export function useTenant() {
  const params = useParams()
  const pathname = usePathname()

  const tenantConfig = useMemo(() => {
    // Extract tenant slug from URL params or pathname
    let tenantSlug: string | null = null

    // Check if we're in a tenant route (/o/[slug])
    if (params?.slug && typeof params.slug === 'string') {
      tenantSlug = params.slug
    } else if (pathname.startsWith('/o/')) {
      // Fallback to pathname parsing
      const pathSegments = pathname.split('/').filter(Boolean)
      if (pathSegments[0] === 'o' && pathSegments[1]) {
        tenantSlug = pathSegments[1]
      }
    }

    if (!tenantSlug) {
      return null
    }

    return getTenantConfig(tenantSlug)
  }, [params?.slug, pathname])

  const isFeatureEnabled = useMemo(() => {
    return (feature: keyof TenantConfig['features']) => {
      if (!tenantConfig) return false
      return tenantConfig.features[feature]
    }
  }, [tenantConfig])

  const getCSSVariables = useMemo(() => {
    if (!tenantConfig) return {}
    
    return {
      '--tenant-primary': tenantConfig.theme.primaryColor,
      '--tenant-secondary': tenantConfig.theme.secondaryColor,
      '--tenant-accent': tenantConfig.theme.accentColor,
      '--tenant-logo': `url(${tenantConfig.theme.logo})`,
    }
  }, [tenantConfig])

  return {
    tenantConfig,
    isFeatureEnabled,
    getCSSVariables,
    tenantId: tenantConfig?.id || null,
    tenantSlug: params?.slug as string || null,
  }
}

