'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useUser } from '@clerk/nextjs'
import { UnifiedNavigation, ooliteConfig, bakehouseConfig, madartsConfig } from '@/components/navigation'
import { Badge } from '@/components/ui/badge'
import { useTheme } from '@/contexts/ThemeContext'
import { useTenant } from '@/components/tenant/TenantProvider'
import DecorativeDivider from '@/components/common/DecorativeDivider'
import { PageFooter } from '@/components/common/PageFooter'
import {
  BookOpen,
  Filter,
  Search,
  Edit,
  Star,
  Sparkles,
  Heart,
} from 'lucide-react'
import WorkshopCategoryVotingUnified from '@/components/workshops/WorkshopCategoryVotingUnified'
import { getWorkshopsLandingContent } from '@/lib/orgs/oolite/workshops-landing-content'
import { WorkshopCard } from '@/components/workshops/marketing/WorkshopCard'
import { InstitutionalInquiryCta } from '@/components/workshops/marketing/InstitutionalInquiryCta'
import { mergeWorkshopMetadata } from '@/lib/workshops/marketing-metadata'
import {
  WORKSHOP_TRACK_LABELS,
  type WorkshopTrackId,
} from '@/lib/workshops/track-labels'
import type { WorkshopRow } from '@/components/workshops/marketing/types'

interface Organization {
  id: string
  name: string
  slug: string
  banner_image?: string
  created_at: string
}

interface Workshop {
  id: string
  title: string
  description: string
  content?: string
  category: string
  type: string
  level: 'beginner' | 'intermediate' | 'advanced'
  status: 'draft' | 'published' | 'archived'
  duration_minutes: number
  max_participants: number
  price: number
  instructor: string
  prerequisites: string[]
  materials: string[]
  outcomes: string[]
  is_active: boolean
  is_shared: boolean
  featured: boolean
  image_url?: string
  organization_id: string
  organization_name: string
  organization_slug: string
  created_by_email: string
  total_bookings: number
  confirmed_bookings: number
  average_rating: number
  total_feedback: number
  created_at: string
  updated_at: string
  metadata?: Record<string, unknown> | null
}

// Animation variants
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const hoverScale = {
  scale: 1.05,
  transition: {
    type: "spring" as const,
    stiffness: 400,
    damping: 10
  }
}

interface WorkshopsPageProps {
  slug?: string;
}

export default function WorkshopsPage({ slug: propSlug }: WorkshopsPageProps = {}) {
  const params = useParams()
  const slug = (params.slug as string) || propSlug || 'oolite'
  const { user } = useUser()
  const { tenantConfig } = useTenant()

  // Oolite theme colors
  const ooliteColors = {
    primary: '#47abc4',
    primaryLight: '#6bb8d1',
    primaryDark: '#3a8ba3',
    primaryAlpha: 'rgba(71, 171, 196, 0.1)',
    primaryAlphaLight: 'rgba(71, 171, 196, 0.05)',
    primaryAlphaDark: 'rgba(71, 171, 196, 0.15)',
  };
  
  console.log('🔧 Workshops Page Debug:')
  console.log('params:', params)
  console.log('propSlug:', propSlug)
  console.log('final slug:', slug)
  console.log('user:', user)
  
  // Get navigation config based on organization slug
  const getNavigationConfig = () => {
    console.log('🧭 Getting navigation config for slug:', slug)
    switch (slug) {
      case 'oolite':
        console.log('🧭 Using oolite config')
        return ooliteConfig
      case 'bakehouse':
        console.log('🧭 Using bakehouse config')
        return bakehouseConfig
      case 'madarts':
        console.log('🧭 Using madarts config')
        return madartsConfig
      default:
        console.log('🧭 Using default oolite config')
        return ooliteConfig // Default fallback
    }
  }
  
  // Debug navigation config selection
  const navigationConfig = getNavigationConfig()
  console.log('🧭 Selected Navigation Config:', {
    organizationName: navigationConfig.organization.name,
    slug: navigationConfig.organization.slug,
    logoUrl: navigationConfig.organization.logo_url
  })
  const { theme } = useTheme()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)
  
  // Debug workshops state changes
  useEffect(() => {
    console.log('📚 Workshops state changed:', workshops.length, 'workshops')
    if (workshops.length > 0) {
      console.log('📚 First workshop:', workshops[0])
    }
  }, [workshops])

  // Debug organization state changes
  useEffect(() => {
    console.log('🏢 Organization state changed:', organization)
  }, [organization])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [selectedFormat, setSelectedFormat] = useState('all')
  const [selectedAudience, setSelectedAudience] = useState('all')
  const [selectedTrack, setSelectedTrack] = useState('all')

  const landingCopy = getWorkshopsLandingContent(slug)
  const [reducedMotion, setReducedMotion] = useState(false)

  // Intersection observer for sections
  const [heroRef, heroInView] = useInView({ threshold: 0.5 })
  const [workshopsRef, workshopsInView] = useInView({ threshold: 0.5 })

  useEffect(() => {
    console.log('🔍 useEffect triggered, slug:', slug)
    
    async function loadData() {
      console.log('🔍 loadData function called')
      if (!slug) {
        console.log('❌ No slug provided, returning early')
        return
      }
      
      try {
        console.log('🔍 Starting data load for slug:', slug)

        // Get organization details
        console.log('🔍 Fetching organization data from:', `/api/organizations/by-slug/${slug}`)
        const orgResponse = await fetch(`/api/organizations/by-slug/${slug}`)
        console.log('🔍 Organization API response status:', orgResponse.status)
        
        let orgData = null
        if (orgResponse.ok) {
          orgData = await orgResponse.json()
          console.log('🔍 Organization data received:', orgData)
          console.log('🔍 Organization data structure:', {
            hasOrganization: !!orgData.organization,
            organizationId: orgData.organization?.id,
            organizationName: orgData.organization?.name,
            organizationSlug: orgData.organization?.slug
          })
          setOrganization(orgData.organization)
        } else {
          console.error('❌ Failed to fetch organization:', orgResponse.status, orgResponse.statusText)
          const errorText = await orgResponse.text()
          console.error('❌ Organization API error response:', errorText)
        }

        // Get workshops for this organization
        console.log('🔍 Fetching workshops for organization:', orgData?.organization?.id)
        if (orgData?.organization?.id) {
          const workshopsUrl = `/api/organizations/${orgData.organization.id}/workshops`
          console.log('🔍 Fetching workshops from:', workshopsUrl)
          const workshopsResponse = await fetch(workshopsUrl)
          console.log('🔍 Workshops API response status:', workshopsResponse.status)
          
          if (workshopsResponse.ok) {
            const workshopsData = await workshopsResponse.json()
            console.log('📚 Workshops data received:', workshopsData)
            console.log('📊 Total workshops fetched:', workshopsData.workshops?.length || 0)
            
            // Debug each workshop
            workshopsData.workshops?.forEach((workshop: any, index: number) => {
              console.log(`📝 Workshop ${index + 1}:`, {
                id: workshop.id,
                title: workshop.title,
                instructor: workshop.instructor,
                status: workshop.status,
                featured: workshop.featured,
                is_public: workshop.is_public,
                is_active: workshop.is_active,
                level: workshop.level,
                duration_minutes: workshop.duration_minutes,
                category: workshop.category
              })
            })
            
            // Check specifically for Video Performance workshop by Tere Garcia
            const videoPerformanceWorkshop = workshopsData.workshops?.find((w: any) => 
              w.title.toLowerCase().includes('video') || 
              w.title.toLowerCase().includes('performance') ||
              w.instructor?.toLowerCase().includes('tere') ||
              w.instructor?.toLowerCase().includes('garcia')
            )
            
            if (videoPerformanceWorkshop) {
              console.log('🎬 ✅ Video Performance Workshop by Tere Garcia Found!')
              console.log('🎬 Workshop Details:', {
                id: videoPerformanceWorkshop.id,
                title: videoPerformanceWorkshop.title,
                instructor: videoPerformanceWorkshop.instructor,
                status: videoPerformanceWorkshop.status,
                featured: videoPerformanceWorkshop.featured,
                level: videoPerformanceWorkshop.level,
                duration: videoPerformanceWorkshop.duration_minutes,
                category: videoPerformanceWorkshop.category,
                organization_id: videoPerformanceWorkshop.organization_id
              })
            } else {
              console.log('❌ Video Performance Workshop by Tere Garcia NOT found')
              console.log('🔍 Available workshops:')
              workshopsData.workshops?.forEach((w: any, i: number) => {
                console.log(`   ${i + 1}. "${w.title}" by ${w.instructor}`)
              })
            }
            
            setWorkshops(workshopsData.workshops || [])
          } else {
            console.error('❌ Failed to fetch workshops:', workshopsResponse.status, workshopsResponse.statusText)
            const errorText = await workshopsResponse.text()
            console.error('❌ Workshops API error response:', errorText)
          }
        } else {
          console.error('❌ No organization ID found for slug:', slug)
          console.error('❌ Organization data:', orgData)
        }

      } catch (error) {
        console.error('Error loading workshops data:', error)
      } finally {
        setLoading(false)
      }
    }

    console.log('🔍 About to call loadData()')
    loadData()
  }, [slug])

  // Reduced motion detection
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  // Filter workshops
  console.log('🔍 Filtering workshops. Total workshops:', workshops.length)
  console.log('🔍 Search term:', searchTerm, 'Category:', selectedCategory, 'Level:', selectedLevel)
  
  const trackFilterOptions = useMemo(() => {
    const set = new Set<string>()
    for (const w of workshops) {
      const m = mergeWorkshopMetadata(w.metadata ?? undefined, {
        id: w.id,
        title: w.title,
      })
      if (m.track) set.add(m.track)
    }
    return Array.from(set).sort()
  }, [workshops])

  const filteredWorkshops = workshops.filter((workshop) => {
    const matchesSearch =
      workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workshop.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workshop.instructor.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory =
      selectedCategory === 'all' || workshop.category === selectedCategory
    const matchesLevel = selectedLevel === 'all' || workshop.level === selectedLevel

    const m = mergeWorkshopMetadata(workshop.metadata ?? undefined, {
      id: workshop.id,
      title: workshop.title,
    })
    const matchesFormat =
      selectedFormat === 'all' || m.format === selectedFormat
    const matchesAudience =
      selectedAudience === 'all' ||
      (m.audienceTags ?? []).includes(selectedAudience)
    const matchesTrack =
      selectedTrack === 'all' || m.track === selectedTrack

    return (
      matchesSearch &&
      matchesCategory &&
      matchesLevel &&
      matchesFormat &&
      matchesAudience &&
      matchesTrack
    )
  })
  
  console.log('🔍 Filtered workshops count:', filteredWorkshops.length)

  // Separate workshops by status and featured
  console.log('🔍 Separating workshops by status and featured...')
  console.log('📊 Total workshops before filtering:', workshops.length)
  console.log('📊 Filtered workshops:', filteredWorkshops.length)
  
  const featuredWorkshops = filteredWorkshops.filter(w => w.featured && w.status === 'published')
  const publishedWorkshops = filteredWorkshops.filter(w => w.status === 'published' && !w.featured)
  const unpublishedWorkshops = filteredWorkshops.filter(w => w.status === 'draft')
  
  console.log('🌟 Featured workshops (featured=true, status=published):', featuredWorkshops.length)
  featuredWorkshops.forEach((w, i) => console.log(`  ${i+1}. ${w.title} (featured: ${w.featured}, status: ${w.status})`))
  
  console.log('📚 Published workshops (status=published, featured=false):', publishedWorkshops.length)
  publishedWorkshops.forEach((w, i) => console.log(`  ${i+1}. ${w.title} (featured: ${w.featured}, status: ${w.status})`))
  
  console.log('📝 Unpublished workshops (status=draft):', unpublishedWorkshops.length)
  unpublishedWorkshops.forEach((w, i) => console.log(`  ${i+1}. ${w.title} (featured: ${w.featured}, status: ${w.status})`))

  // Get unique categories
  const categories = Array.from(new Set(workshops.map(w => w.category))).sort()

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-gradient-to-b from-gray-900 to-black text-white' 
          : 'bg-gradient-to-b from-gray-50 to-white text-gray-900'
      }`}>
        {/* Navigation */}
        <div className="relative z-50">
          <UnifiedNavigation config={navigationConfig} userRole="admin" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className={`h-8 rounded w-1/3 mb-6 ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            }`}></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className={`${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                } rounded-lg shadow p-6`}>
                  <div className={`h-48 rounded mb-4 ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  }`}></div>
                  <div className={`h-4 rounded w-3/4 mb-2 ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  }`}></div>
                  <div className={`h-3 rounded w-1/2 ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  }`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-b from-gray-900 to-black text-white' 
        : 'bg-gradient-to-b from-gray-50 to-white text-gray-900'
    }`}>
      
      {/* Navigation */}
      <div className="relative z-50">
        <UnifiedNavigation config={navigationConfig} userRole="admin" />
      </div>
      
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          {/* Animated grid background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#6366f133_1px,transparent_1px),linear-gradient(to_bottom,#6366f133_1px,transparent_1px)] bg-[size:14px_24px]" />
          </div>
          {/* Floating particles effect */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-indigo-500/30 rounded-full"
                animate={{
                  x: [
                    Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                    Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                  ],
                  y: [
                    Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                    Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                  ],
                }}
                transition={{
                  duration: Math.random() * 10 + 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <p
                className={`mb-3 text-sm font-medium uppercase tracking-widest ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                {landingCopy.heroEyebrow}
              </p>
              <h1
                className={`text-4xl font-bold leading-tight md:text-5xl lg:text-6xl ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
              >
                <span className="block">{landingCopy.heroTitle}</span>
                <span
                  className="block bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${tenantConfig?.theme?.primaryColor || '#3b82f6'}, ${tenantConfig?.theme?.secondaryColor || '#1d4ed8'}, ${tenantConfig?.theme?.accentColor || '#60a5fa'})`,
                  }}
                >
                  {landingCopy.heroTitleAccent}
                </span>
              </h1>

              <p
                className={`mx-auto mt-6 max-w-2xl text-lg leading-relaxed md:text-xl ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                {landingCopy.heroLead}
              </p>

              {organization && (
                <p
                  className={`mt-4 text-base ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {organization.name}
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <section
        className={`mx-auto max-w-5xl px-4 pb-16 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}
      >
        <p className="text-center text-sm font-medium text-muted-foreground">
          {landingCopy.trustLine}
        </p>
        <ul className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
          {landingCopy.trustItems.map((t) => (
            <li
              key={t}
              className={`rounded-full border px-4 py-2 ${
                theme === 'dark'
                  ? 'border-gray-700 bg-gray-900/40'
                  : 'border-gray-200 bg-white/80'
              }`}
            >
              {t}
            </li>
          ))}
        </ul>

        <h2 className="mt-16 text-center text-2xl font-semibold">
          {landingCopy.howItWorks.title}
        </h2>
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {landingCopy.howItWorks.steps.map((step, i) => (
            <div key={`${step.title}-${i}`} className="text-center md:text-left">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </div>
          ))}
        </div>

        <div
          className={`mt-16 rounded-2xl border p-8 md:p-10 ${
            theme === 'dark' ? 'border-gray-700 bg-gray-900/30' : 'border-gray-200 bg-white/60'
          }`}
        >
          <h2 className="text-2xl font-semibold">{landingCopy.forInstitutions.title}</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">{landingCopy.forInstitutions.body}</p>
          <ul className="mt-6 list-disc space-y-2 pl-5 text-sm">
            {landingCopy.forInstitutions.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <div className="mt-8">
            <InstitutionalInquiryCta
              landing={landingCopy.institutionalInquiry}
              orgSlug={slug}
            />
          </div>
        </div>

        <p className="mt-12 text-center text-sm text-muted-foreground">{landingCopy.proofLine}</p>

        <div className="mt-12 space-y-6">
          <h2 className="text-center text-2xl font-semibold">FAQ</h2>
          <div className="mx-auto max-w-3xl space-y-6">
            {landingCopy.faq.map((item) => (
              <div key={item.q} className="border-b border-border pb-6 last:border-0">
                <h3 className="font-medium">{item.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DecorativeDivider
        icon={Sparkles}
        gradientColors={{
          from: theme === 'dark' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)',
          via: theme === 'dark' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.05)',
          to: theme === 'dark' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)',
        }}
        iconColor={theme === 'dark' ? 'text-indigo-400/50' : 'text-indigo-500/50'}
        className="my-16"
      />
      
      {/* Workshops Section */}
      <section ref={workshopsRef} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Available Workshops
            </h2>
            <p className={`text-xl ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            } max-w-3xl mx-auto`}>
              Choose from our curated selection of workshops designed for all skill levels
            </p>
          </motion.div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search workshops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2">
                <Filter className={`h-4 w-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`px-3 py-1 rounded-md border ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className={`px-3 py-1 rounded-md border ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className={`rounded-md border px-3 py-1 ${
                    theme === 'dark'
                      ? 'border-gray-700 bg-gray-800 text-white'
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                >
                  <option value="all">All formats</option>
                  <option value="in_person">In person</option>
                  <option value="online">Online</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="async_resources">Async / resources</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedAudience}
                  onChange={(e) => setSelectedAudience(e.target.value)}
                  className={`rounded-md border px-3 py-1 ${
                    theme === 'dark'
                      ? 'border-gray-700 bg-gray-800 text-white'
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                >
                  <option value="all">All audiences</option>
                  <option value="individual_artists">Individual artists</option>
                  <option value="emerging_artists">Emerging artists</option>
                  <option value="staff_teams">Staff / teams</option>
                  <option value="educators">Educators</option>
                  <option value="residency_cohorts">Residency cohorts</option>
                  <option value="public_programs">Public programs</option>
                </select>
              </div>

              {trackFilterOptions.length > 0 && (
                <div className="flex items-center gap-2">
                  <select
                    value={selectedTrack}
                    onChange={(e) => setSelectedTrack(e.target.value)}
                    className={`rounded-md border px-3 py-1 ${
                      theme === 'dark'
                        ? 'border-gray-700 bg-gray-800 text-white'
                        : 'border-gray-300 bg-white text-gray-900'
                    }`}
                  >
                    <option value="all">All tracks</option>
                    {trackFilterOptions.map((t) => (
                      <option key={t} value={t}>
                        {WORKSHOP_TRACK_LABELS[t as WorkshopTrackId] ?? t}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Featured Workshops */}
          {featuredWorkshops.length > 0 && (
            <div className="mb-16">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center mb-8"
              >
                <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  <Star className="inline-block h-8 w-8 text-yellow-500 mr-2" />
                  Featured Workshops
                </h3>
                <p className={`text-lg ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Our most popular and highly recommended workshops
                </p>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredWorkshops.map((workshop) => (
                  <motion.div
                    key={workshop.id}
                    variants={fadeIn}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    whileHover={reducedMotion ? {} : hoverScale}
                  >
                    <WorkshopCard
                      workshop={workshop as WorkshopRow}
                      orgSlug={slug}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Workshop Category Voting */}
          {organization && (
            <div className="mb-16">
              <WorkshopCategoryVotingUnified 
                organizationId={organization.id} 
                userId={user?.id}
              />
            </div>
          )}

          {/* Published Workshops */}
          {publishedWorkshops.length > 0 && (
            <div className="mb-16">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center mb-8"
              >
                <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Available Workshops
                </h3>
                <p className={`text-lg ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Choose from our curated selection of workshops designed for all skill levels
                </p>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {publishedWorkshops.map((workshop) => (
                  <motion.div
                    key={workshop.id}
                    variants={fadeIn}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    whileHover={reducedMotion ? {} : hoverScale}
                  >
                    <WorkshopCard
                      workshop={workshop as WorkshopRow}
                      orgSlug={slug}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Unpublished Workshops (Draft) - Only show to admins */}
          {unpublishedWorkshops.length > 0 && (
            <div className="mb-16">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center mb-8"
              >
                <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  <Edit className="inline-block h-8 w-8 text-orange-500 mr-2" />
                  Draft Workshops
                </h3>
                <p className={`text-lg ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Workshops currently in development - coming soon!
                </p>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {unpublishedWorkshops.map((workshop) => (
                  <motion.div
                    key={workshop.id}
                    variants={fadeIn}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    whileHover={reducedMotion ? {} : hoverScale}
                  >
                    <WorkshopCard
                      workshop={workshop as WorkshopRow}
                      orgSlug={slug}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {workshops.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <BookOpen className={`mx-auto h-12 w-12 mb-4 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <h3 className={`text-lg font-medium mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                No workshops found
              </h3>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Try adjusting your search criteria or check back later for new workshops.
              </p>
            </motion.div>
          )}
        </div>
      </section>
      
      <DecorativeDivider 
        icon={Heart}
        gradientColors={{
          from: theme === 'dark' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)',
          via: theme === 'dark' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.05)',
          to: theme === 'dark' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)'
        }}
        iconColor={theme === 'dark' ? 'text-indigo-400/50' : 'text-indigo-500/50'}
        className="my-16"
      />

      {/* Page Footer */}
      <PageFooter 
        organizationSlug={slug}
        showGetStarted={true}
        showGuidelines={true}
        showTerms={true}
      />
    </div>
  )
}

