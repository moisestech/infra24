'use client'

import Link from 'next/link'
import { SohoHouseLogo } from '@/components/sohohouse/SohoHouseLogo'
import { OrganizationLogo } from '@/components/ui/OrganizationLogo'
import { cn } from '@/lib/utils'
import { NavigationChromeVariant, Organization } from './types'

interface NavigationBrandProps {
  organization: Organization
  className?: string
  chromeVariant?: NavigationChromeVariant
}

export function NavigationBrand({
  organization,
  className = '',
  chromeVariant = 'default',
}: NavigationBrandProps) {
  const isSohoChrome = chromeVariant === 'soho-dark'
  const isSoho = organization.slug === 'sohohouse'

  if (isSoho) {
    return (
      <div className={cn('flex items-center', className)}>
        <SohoHouseLogo
          variant="horizontal"
          size="md"
          href={`/o/${organization.slug}`}
          color={isSohoChrome ? '#f5efe6' : undefined}
          className="py-1"
        />
      </div>
    )
  }

  if (organization.brandDisplay) {
    return (
      <div className={cn('flex items-center', className)}>
        <Link
          href={`/o/${organization.slug}`}
          className="flex flex-col justify-center py-2 hover:opacity-90 transition-opacity"
        >
          <span
            className={cn(
              'text-sm font-medium tracking-wide',
              isSohoChrome ? 'text-[#f5efe6]' : 'text-gray-900 dark:text-gray-100'
            )}
          >
            {organization.brandDisplay.title}
          </span>
          {organization.brandDisplay.subtitle ? (
            <span
              className={cn(
                'text-[10px] font-medium uppercase tracking-[0.22em]',
                isSohoChrome ? 'text-[rgba(245,239,230,0.55)]' : 'text-gray-500 dark:text-gray-400'
              )}
            >
              {organization.brandDisplay.subtitle}
            </span>
          ) : null}
        </Link>
      </div>
    )
  }

  return (
    <div className={cn('flex items-center', className)}>
      <Link 
        href={`/o/${organization.slug}`} 
        className="flex items-center py-3 hover:opacity-80 transition-opacity"
      >
        <OrganizationLogo 
          organizationSlug={organization.slug} 
          variant="horizontal" 
          size="md" 
          className="h-12"
        />
      </Link>
    </div>
  )
}
