import { Home, Shield, Sparkles } from 'lucide-react'

import { NavigationConfig } from '../types'

export const sohohouseConfig: NavigationConfig = {
  organization: {
    id: 'sohohouse',
    name: 'Soho House',
    slug: 'sohohouse',
  },
  colors: {
    primary: '#C4A574',
    primaryLight: '#E8DCC8',
    primaryDark: '#A89070',
    primaryAlpha: 'rgba(196, 165, 116, 0.14)',
    primaryAlphaLight: 'rgba(196, 165, 116, 0.08)',
    primaryAlphaDark: 'rgba(196, 165, 116, 0.22)',
  },
  chrome: {
    variant: 'soho-dark',
  },
  features: {
    adminTools: false,
    surveys: false,
    analytics: false,
    digitalLab: false,
    workshops: false,
    announcements: false,
    members: false,
    submissions: false,
    roadmap: false,
    budget: false,
    impactRoi: false,
    aiTools: false,
    bookings: false,
  },
  navigation: {
    userItems: [
      {
        name: 'Overview',
        href: '/o/sohohouse',
        icon: Home,
        description: 'House demo overview',
        category: 'user',
      },
      {
        name: 'Member Signal Agent',
        href: '/o/sohohouse/memory-agent',
        icon: Sparkles,
        description: 'Ask about routes, programming, and smart signs',
        category: 'user',
      },
      {
        name: 'Governance',
        href: '/o/sohohouse/memory-agent/about',
        icon: Shield,
        description: 'How drafts become approved handoffs',
        category: 'user',
      },
    ],
    adminItems: [],
  },
}
