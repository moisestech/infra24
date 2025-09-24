import { 
  Home, 
  GraduationCap, 
  Calendar,
  BarChart3,
  FileText,
  Map, 
  DollarSign, 
  TrendingUp,
  Users,
  Bell
} from 'lucide-react'
import { NavigationConfig } from '../types'

export const bakehouseConfig: NavigationConfig = {
  organization: {
    id: 'bakehouse-org-id',
    name: 'Bakehouse Art Complex',
    slug: 'bakehouse',
    logo_url: '/bakehouse-logo.png'
  },
  colors: {
    primary: '#f59e0b',
    primaryLight: '#fbbf24',
    primaryDark: '#d97706',
    primaryAlpha: 'rgba(245, 158, 11, 0.1)',
    primaryAlphaLight: 'rgba(245, 158, 11, 0.05)',
    primaryAlphaDark: 'rgba(245, 158, 11, 0.15)',
  },
  features: {
    adminTools: true,
    surveys: false, // Disabled for Bakehouse
    analytics: true,
    digitalLab: false, // No digital lab
    workshops: true,
    announcements: true,
    members: true,
    submissions: true,
    roadmap: false, // No roadmap feature
    budget: true,
    impactRoi: false, // No impact ROI tracking
    aiTools: false, // No AI tools
    bookings: true,
  },
  navigation: {
    userItems: [
      {
        name: 'Overview',
        href: '/o/bakehouse',
        icon: Home,
        description: 'Bakehouse overview',
        category: 'user'
      },
      {
        name: 'Workshops',
        href: '/o/bakehouse/workshops',
        icon: GraduationCap,
        description: 'Educational programs and training',
        category: 'user'
      },
      {
        name: 'Announcements',
        href: '/o/bakehouse/announcements',
        icon: Bell,
        description: 'Latest updates and news',
        category: 'user'
      },
      {
        name: 'Members',
        href: '/o/bakehouse/users',
        icon: Users,
        description: 'Community members and artists',
        category: 'user'
      }
    ],
    adminItems: [
      {
        name: 'Analytics',
        href: '/o/bakehouse/analytics',
        icon: BarChart3,
        description: 'Performance metrics and insights',
        category: 'admin'
      },
      {
        name: 'Members',
        href: '/o/bakehouse/users',
        icon: Users,
        description: 'Manage organization members',
        category: 'admin'
      },
      {
        name: 'Submissions',
        href: '/o/bakehouse/submissions',
        icon: FileText,
        description: 'Manage forms and review submissions',
        category: 'admin'
      },
      {
        name: 'Budget',
        href: '/o/bakehouse/budget',
        icon: DollarSign,
        description: 'Financial planning and costs',
        category: 'admin'
      },
      {
        name: 'Bookings',
        href: '/o/bakehouse/bookings',
        icon: Calendar,
        description: 'Manage workshops and resources',
        category: 'admin'
      }
    ]
  }
}
