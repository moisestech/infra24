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
  Bell,
  Mail,
  Video,
  Camera,
  Palette
} from 'lucide-react'
import { NavigationConfig } from '../types'

export const madartsConfig: NavigationConfig = {
  organization: {
    id: '01e09cce-83da-4b0f-94ce-b227e949414a',
    name: 'MadArts',
    slug: 'madarts',
    logo_url: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1760055343/smart-sign/orgs/madarts/madarts-logo-pink_nb5pgx.png'
  },
  colors: {
    primary: '#E91E63',
    primaryLight: '#F48FB1',
    primaryDark: '#C2185B',
    primaryAlpha: 'rgba(233, 30, 99, 0.1)',
    primaryAlphaLight: 'rgba(233, 30, 99, 0.05)',
    primaryAlphaDark: 'rgba(233, 30, 99, 0.15)',
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
    roadmap: false,
    budget: false,
    impactRoi: false,
    aiTools: false,
    bookings: true,
  },
  quickActions: {
    highlightActions: true,
    customActions: [
      {
        name: 'Book Studio',
        href: '/o/madarts/bookings',
        icon: Calendar,
        description: 'Reserve studio space',
        highlighted: true
      },
      {
        name: 'Workshops',
        href: '/o/madarts/workshops',
        icon: GraduationCap,
        description: 'View available workshops'
      },
      {
        name: 'Community',
        href: '/o/madarts/members',
        icon: Users,
        description: 'Connect with members'
      }
    ]
  },
  navigation: {
    userItems: [
      {
        name: 'Home',
        href: '/o/madarts',
        icon: Home
      },
      {
        name: 'Workshops',
        href: '/o/madarts/workshops',
        icon: GraduationCap,
        badge: 'New'
      },
      {
        name: 'Bookings',
        href: '/o/madarts/bookings',
        icon: Calendar
      },
      {
        name: 'Community',
        href: '/o/madarts/members',
        icon: Users
      },
      {
        name: 'Announcements',
        href: '/o/madarts/announcements',
        icon: Bell
      },
      {
        name: 'Analytics',
        href: '/o/madarts/analytics',
        icon: BarChart3
      }
    ],
    adminItems: [
      {
        name: 'Admin Dashboard',
        href: '/o/madarts/admin',
        icon: BarChart3,
        category: 'admin'
      },
      {
        name: 'User Management',
        href: '/o/madarts/admin/users',
        icon: Users,
        category: 'admin'
      },
      {
        name: 'Workshop Management',
        href: '/o/madarts/admin/workshops',
        icon: GraduationCap,
        category: 'admin'
      },
      {
        name: 'Booking Management',
        href: '/o/madarts/admin/bookings',
        icon: Calendar,
        category: 'admin'
      }
    ]
  }
}
