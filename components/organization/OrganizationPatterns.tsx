'use client'

import { PatternType } from '@/components/patterns'
import { PatternColors } from '@/components/patterns/types'

export interface OrganizationPatternConfig {
  slug: string
  name: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  patterns: {
    [key: string]: {
      type: PatternType
      colors: PatternColors
    }
  }
}

// Oolite Arts - Cyan/Blue theme
export const oolitePatternConfig: OrganizationPatternConfig = {
  slug: 'oolite',
  name: 'Oolite Arts',
  primaryColor: '#47abc4',
  secondaryColor: '#6bb8d1',
  accentColor: '#3a8ba3',
  patterns: {
    urgent: {
      type: 'geometric',
      colors: {
        primary: 'rgba(71, 171, 196, 0.15)',
        secondary: 'rgba(107, 184, 209, 0.12)',
        accent: 'rgba(58, 139, 163, 0.10)',
        pattern: 'rgba(71, 171, 196, 0.8)'
      }
    },
    event: {
      type: 'waves',
      colors: {
        primary: 'rgba(71, 171, 196, 0.12)',
        secondary: 'rgba(107, 184, 209, 0.10)',
        accent: 'rgba(58, 139, 163, 0.08)',
        pattern: 'rgba(71, 171, 196, 0.7)'
      }
    },
    facility: {
      type: 'dots',
      colors: {
        primary: 'rgba(71, 171, 196, 0.10)',
        secondary: 'rgba(107, 184, 209, 0.08)',
        accent: 'rgba(58, 139, 163, 0.06)',
        pattern: 'rgba(71, 171, 196, 0.6)'
      }
    },
    opportunity: {
      type: 'grid',
      colors: {
        primary: 'rgba(71, 171, 196, 0.08)',
        secondary: 'rgba(107, 184, 209, 0.06)',
        accent: 'rgba(58, 139, 163, 0.04)',
        pattern: 'rgba(71, 171, 196, 0.5)'
      }
    },
    administrative: {
      type: 'lines',
      colors: {
        primary: 'rgba(71, 171, 196, 0.06)',
        secondary: 'rgba(107, 184, 209, 0.04)',
        accent: 'rgba(58, 139, 163, 0.02)',
        pattern: 'rgba(71, 171, 196, 0.4)'
      }
    }
  }
}

// Bakehouse Art Complex - Amber/Yellow theme
export const bakehousePatternConfig: OrganizationPatternConfig = {
  slug: 'bakehouse',
  name: 'Bakehouse Art Complex',
  primaryColor: '#f59e0b',
  secondaryColor: '#fbbf24',
  accentColor: '#d97706',
  patterns: {
    urgent: {
      type: 'geometric',
      colors: {
        primary: 'rgba(245, 158, 11, 0.15)',
        secondary: 'rgba(251, 191, 36, 0.12)',
        accent: 'rgba(217, 119, 6, 0.10)',
        pattern: 'rgba(245, 158, 11, 0.8)'
      }
    },
    event: {
      type: 'waves',
      colors: {
        primary: 'rgba(245, 158, 11, 0.12)',
        secondary: 'rgba(251, 191, 36, 0.10)',
        accent: 'rgba(217, 119, 6, 0.08)',
        pattern: 'rgba(245, 158, 11, 0.7)'
      }
    },
    facility: {
      type: 'dots',
      colors: {
        primary: 'rgba(245, 158, 11, 0.10)',
        secondary: 'rgba(251, 191, 36, 0.08)',
        accent: 'rgba(217, 119, 6, 0.06)',
        pattern: 'rgba(245, 158, 11, 0.6)'
      }
    },
    opportunity: {
      type: 'grid',
      colors: {
        primary: 'rgba(245, 158, 11, 0.08)',
        secondary: 'rgba(251, 191, 36, 0.06)',
        accent: 'rgba(217, 119, 6, 0.04)',
        pattern: 'rgba(245, 158, 11, 0.5)'
      }
    },
    administrative: {
      type: 'lines',
      colors: {
        primary: 'rgba(245, 158, 11, 0.06)',
        secondary: 'rgba(251, 191, 36, 0.04)',
        accent: 'rgba(217, 119, 6, 0.02)',
        pattern: 'rgba(245, 158, 11, 0.4)'
      }
    },
    // Bakehouse-specific announcement types
    attention_artists: {
      type: 'geometric',
      colors: {
        primary: 'rgba(245, 158, 11, 0.20)',
        secondary: 'rgba(251, 191, 36, 0.15)',
        accent: 'rgba(217, 119, 6, 0.10)',
        pattern: 'rgba(245, 158, 11, 0.9)'
      }
    },
    attention_public: {
      type: 'waves',
      colors: {
        primary: 'rgba(245, 158, 11, 0.18)',
        secondary: 'rgba(251, 191, 36, 0.12)',
        accent: 'rgba(217, 119, 6, 0.08)',
        pattern: 'rgba(245, 158, 11, 0.8)'
      }
    },
    fun_fact: {
      type: 'dots',
      colors: {
        primary: 'rgba(245, 158, 11, 0.16)',
        secondary: 'rgba(251, 191, 36, 0.10)',
        accent: 'rgba(217, 119, 6, 0.06)',
        pattern: 'rgba(245, 158, 11, 0.7)'
      }
    },
    promotion: {
      type: 'grid',
      colors: {
        primary: 'rgba(245, 158, 11, 0.14)',
        secondary: 'rgba(251, 191, 36, 0.08)',
        accent: 'rgba(217, 119, 6, 0.04)',
        pattern: 'rgba(245, 158, 11, 0.6)'
      }
    },
    gala_announcement: {
      type: 'geometric',
      colors: {
        primary: 'rgba(245, 158, 11, 0.22)',
        secondary: 'rgba(251, 191, 36, 0.18)',
        accent: 'rgba(217, 119, 6, 0.12)',
        pattern: 'rgba(245, 158, 11, 0.9)'
      }
    }
  }
}

// Default pattern config for unknown organizations
export const defaultPatternConfig: OrganizationPatternConfig = {
  slug: 'default',
  name: 'Default Organization',
  primaryColor: '#6b7280',
  secondaryColor: '#9ca3af',
  accentColor: '#4b5563',
  patterns: {
    urgent: {
      type: 'geometric',
      colors: {
        primary: 'rgba(107, 114, 128, 0.15)',
        secondary: 'rgba(156, 163, 175, 0.12)',
        accent: 'rgba(75, 85, 99, 0.10)',
        pattern: 'rgba(107, 114, 128, 0.8)'
      }
    },
    event: {
      type: 'waves',
      colors: {
        primary: 'rgba(107, 114, 128, 0.12)',
        secondary: 'rgba(156, 163, 175, 0.10)',
        accent: 'rgba(75, 85, 99, 0.08)',
        pattern: 'rgba(107, 114, 128, 0.7)'
      }
    },
    facility: {
      type: 'dots',
      colors: {
        primary: 'rgba(107, 114, 128, 0.10)',
        secondary: 'rgba(156, 163, 175, 0.08)',
        accent: 'rgba(75, 85, 99, 0.06)',
        pattern: 'rgba(107, 114, 128, 0.6)'
      }
    },
    opportunity: {
      type: 'grid',
      colors: {
        primary: 'rgba(107, 114, 128, 0.08)',
        secondary: 'rgba(156, 163, 175, 0.06)',
        accent: 'rgba(75, 85, 99, 0.04)',
        pattern: 'rgba(107, 114, 128, 0.5)'
      }
    },
    administrative: {
      type: 'lines',
      colors: {
        primary: 'rgba(107, 114, 128, 0.06)',
        secondary: 'rgba(156, 163, 175, 0.04)',
        accent: 'rgba(75, 85, 99, 0.02)',
        pattern: 'rgba(107, 114, 128, 0.4)'
      }
    }
  }
}

// Function to get organization pattern config
export function getOrganizationPatternConfig(organizationSlug: string): OrganizationPatternConfig {
  switch (organizationSlug) {
    case 'oolite':
      return oolitePatternConfig
    case 'bakehouse':
      return bakehousePatternConfig
    default:
      return defaultPatternConfig
  }
}

// Function to get pattern config for a specific announcement type
export function getPatternConfigForAnnouncement(
  organizationSlug: string, 
  announcementType: string
): { type: PatternType; colors: PatternColors } {
  const orgConfig = getOrganizationPatternConfig(organizationSlug)
  return orgConfig.patterns[announcementType] || orgConfig.patterns.opportunity
}
