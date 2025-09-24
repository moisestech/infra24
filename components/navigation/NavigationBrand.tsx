'use client'

import Link from 'next/link'
import { OrganizationLogo } from '@/components/ui/OrganizationLogo'
import { Organization } from './types'

interface NavigationBrandProps {
  organization: Organization
  className?: string
}

export function NavigationBrand({ organization, className = '' }: NavigationBrandProps) {
  return (
    <div className={`flex items-center ${className}`}>
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
