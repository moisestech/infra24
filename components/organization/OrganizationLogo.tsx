'use client'

import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface OrganizationLogoProps {
  organization: {
    name: string
    logo_url?: string
    logo_url_light?: string
    logo_url_dark?: string
    settings?: {
      logos?: {
        light_mode?: string
        dark_mode?: string
      }
    }
  }
  className?: string
  width?: number
  height?: number
  priority?: boolean
}

export function OrganizationLogo({ 
  organization, 
  className = '', 
  width = 200, 
  height = 60,
  priority = false 
}: OrganizationLogoProps) {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return a placeholder while theme is loading
    return (
      <div 
        className={`bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${className}`}
        style={{ width, height }}
      />
    )
  }

  // Determine which logo to use based on theme
  const isDarkMode = resolvedTheme === 'dark'
  const logoUrl = isDarkMode 
    ? organization.logo_url_dark || organization.settings?.logos?.dark_mode || organization.logo_url
    : organization.logo_url_light || organization.settings?.logos?.light_mode || organization.logo_url

  if (!logoUrl) {
    // Fallback to organization name if no logo
    return (
      <div className={`flex items-center justify-center font-bold text-lg ${className}`}>
        {organization.name}
      </div>
    )
  }

  return (
    <Image
      src={logoUrl}
      alt={`${organization.name} Logo`}
      width={width}
      height={height}
      className={className}
      priority={priority}
      style={{
        objectFit: 'contain',
        width: 'auto',
        height: 'auto',
        maxWidth: width,
        maxHeight: height,
      }}
    />
  )
}
