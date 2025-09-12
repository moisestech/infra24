'use client'

import { useState } from 'react'
import { Building2 } from 'lucide-react'

interface OrganizationLogoProps {
  organization: {
    name: string
    slug: string
    logo_url?: string
    horizontal_logo_url?: string
  }
  size?: 'sm' | 'md' | 'lg'
  shape?: 'circle' | 'square'
  orientation?: 'square' | 'horizontal'
  className?: string
  showText?: boolean
  autoHideOnMobile?: boolean
}

export default function OrganizationLogo({ 
  organization, 
  size = 'md', 
  shape = 'square',
  orientation = 'square',
  className = '',
  showText = false,
  autoHideOnMobile = false
}: OrganizationLogoProps) {
  const [imageError, setImageError] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Get initials from organization name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Size classes
  const sizeClasses = {
    sm: orientation === 'horizontal' ? 'h-6 w-auto text-sm' : 'h-8 w-8 text-sm',
    md: orientation === 'horizontal' ? 'h-8 w-auto text-base' : 'h-10 w-10 text-base',
    lg: orientation === 'horizontal' ? 'h-10 w-auto text-lg' : 'h-12 w-12 text-lg'
  }

  // Shape classes
  const shapeClasses = {
    circle: 'rounded-full',
    square: 'rounded-lg'
  }

  const shouldShowText = autoHideOnMobile ? (showText && !isMobile) : showText

  // Get the appropriate logo URL based on orientation
  const getLogoUrl = () => {
    if (organization.slug === 'bakehouse') {
      if (orientation === 'horizontal') {
        return "https://res.cloudinary.com/du1ysiumj/image/upload/v1757702629/bakehouse-logo-horizontal-transparent_g6l6gh.png"
      } else {
        return "https://res.cloudinary.com/dck5rzi4h/image/upload/v1755993342/smart-sign/bakehouse-logo-low-rez_yyiht6.png"
      }
    }
    
    if (orientation === 'horizontal' && organization.horizontal_logo_url) {
      return organization.horizontal_logo_url
    }
    
    return organization.logo_url
  }

  const logoUrl = getLogoUrl()

  return (
    <div className="flex items-center space-x-2">
      <div className={`relative ${sizeClasses[size]} ${className}`}>
        {logoUrl && !imageError ? (
          <img
            src={logoUrl}
            alt={`${organization.name} logo`}
            className={`h-full w-full ${orientation === 'horizontal' ? 'object-contain' : shapeClasses[shape] + ' object-cover'}`}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={`h-full w-full ${orientation === 'horizontal' ? 'rounded-lg' : shapeClasses[shape]} bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold`}>
            {getInitials(organization.name)}
          </div>
        )}
      </div>
      {shouldShowText && (
        <span className="font-semibold text-gray-900 dark:text-white">
          {organization.name}
        </span>
      )}
    </div>
  )
}
