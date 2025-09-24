import { 
  Home, 
  Microscope, 
  GraduationCap, 
  Calendar,
  BarChart3,
  FileText,
  Bot, 
  Map, 
  DollarSign, 
  TrendingUp,
  LineChart,
  Users,
  Bell
} from 'lucide-react'
import { NavigationConfig } from '../types'

export const ooliteConfig: NavigationConfig = {
  organization: {
    id: '73339522-c672-40ac-a464-e027e9c99d13',
    name: 'Oolite Arts',
    slug: 'oolite',
    logo_url: '/oolite-logo.png'
  },
  colors: {
    primary: '#47abc4',
    primaryLight: '#6bb8d1',
    primaryDark: '#3a8ba3',
    primaryAlpha: 'rgba(71, 171, 196, 0.1)',
    primaryAlphaLight: 'rgba(71, 171, 196, 0.05)',
    primaryAlphaDark: 'rgba(71, 171, 196, 0.15)',
  },
  features: {
    adminTools: true,
    surveys: true,
    analytics: true,
    digitalLab: true,
    workshops: true,
    announcements: true,
    members: true,
    submissions: true,
    roadmap: true,
    budget: true,
    impactRoi: true,
    aiTools: true,
    bookings: true,
  },
  navigation: {
    userItems: [
      {
        name: 'Overview',
        href: '/o/oolite',
        icon: Home,
        description: 'Digital transformation overview',
        category: 'user'
      },
      {
        name: 'Digital Lab',
        href: '/o/oolite/digital-lab',
        icon: Microscope,
        description: 'Lab resources and equipment',
        category: 'user'
      },
      {
        name: 'Workshops',
        href: '/o/oolite/workshops',
        icon: GraduationCap,
        description: 'Educational programs and training',
        category: 'user'
      },
      {
        name: 'Announcements',
        href: '/o/oolite/announcements',
        icon: Bell,
        description: 'Latest updates and news',
        category: 'user'
      },
      {
        name: 'Members',
        href: '/o/oolite/users',
        icon: Users,
        description: 'Community members and artists',
        category: 'user'
      },
      {
        name: 'Surveys',
        href: '/o/oolite/surveys',
        icon: FileText,
        description: 'Participate in surveys',
        category: 'user'
      }
    ],
    adminItems: [
      {
        name: 'Analytics',
        href: '/o/oolite/analytics',
        icon: BarChart3,
        description: 'Performance metrics and insights',
        category: 'admin'
      },
      {
        name: 'Members',
        href: '/o/oolite/users',
        icon: Users,
        description: 'Manage organization members',
        category: 'admin'
      },
      {
        name: 'Submissions',
        href: '/o/oolite/submissions',
        icon: FileText,
        description: 'Manage forms and review submissions',
        category: 'admin'
      },
      {
        name: 'Surveys',
        href: '/o/oolite/surveys',
        icon: FileText,
        description: 'Survey management and analytics',
        category: 'admin'
      },
      {
        name: 'Roadmap',
        href: '/o/oolite/roadmap',
        icon: Map,
        description: 'Strategic development plan',
        category: 'admin'
      },
      {
        name: 'Budget',
        href: '/o/oolite/budget',
        icon: DollarSign,
        description: 'Financial planning and costs',
        category: 'admin'
      },
      {
        name: 'Budget Prognosis',
        href: '/o/oolite/budget/prognosis',
        icon: LineChart,
        description: '2025 budget projections and planning',
        category: 'admin'
      },
      {
        name: 'Impact & ROI',
        href: '/o/oolite/impact-roi',
        icon: TrendingUp,
        description: 'Success metrics and outcomes',
        category: 'admin'
      },
      {
        name: 'AI Tools',
        href: '/o/oolite/ai-tools',
        icon: Bot,
        description: 'AI-powered creative tools',
        category: 'admin'
      },
      {
        name: 'Bookings',
        href: '/o/oolite/bookings',
        icon: Calendar,
        description: 'Manage workshops and resources',
        category: 'admin'
      }
    ]
  }
}
