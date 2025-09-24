import { LucideIcon } from 'lucide-react'

export interface ThemeColors {
  primary: string
  primaryLight: string
  primaryDark: string
  primaryAlpha: string
  primaryAlphaLight: string
  primaryAlphaDark: string
}

export interface NavigationItem {
  name: string
  href: string
  icon: LucideIcon
  description?: string
  category?: 'user' | 'admin'
  badge?: string | number
  disabled?: boolean
}

export interface Organization {
  id: string
  name: string
  slug: string
  logo_url?: string
  artist_icon?: string
  banner_image?: string
}

export interface NavigationConfig {
  organization: Organization
  colors: ThemeColors
  features: {
    adminTools: boolean
    surveys: boolean
    analytics: boolean
    digitalLab: boolean
    workshops: boolean
    announcements: boolean
    members: boolean
    submissions: boolean
    roadmap: boolean
    budget: boolean
    impactRoi: boolean
    aiTools: boolean
    bookings: boolean
  }
  navigation: {
    userItems: NavigationItem[]
    adminItems: NavigationItem[]
    customItems?: NavigationItem[]
  }
}

export interface NavigationProps {
  config: NavigationConfig
  userRole?: 'user' | 'admin' | 'super_admin'
  className?: string
}
