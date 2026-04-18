'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
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

function isAdultStudioWorkshop(w: Workshop): boolean {
  if (w.category === 'adult_studio_classes') return true
  const meta = w.metadata as Record<string, unknown> | null | undefined
  return meta?.program === 'adult_art_classes'
}

function sortWorkshopsFeaturedFirst(a: Workshop, b: Workshop) {
  if (Boolean(a.featured) !== Boolean(b.featured)) return a.featured ? -1 : 1
  return a.title.localeCompare(b.title)
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
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
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
    const title = (workshop.title ?? '').toString().toLowerCase()
    const description = (workshop.description ?? '').toString().toLowerCase()
    const instructor = (workshop.instructor ?? '').toString().toLowerCase()
    const q = searchTerm.toLowerCase()
    const matchesSearch =
      title.includes(q) || description.includes(q) || instructor.includes(q)

    const matchesCategory =
      selectedCategory === 'all' ||
      (workshop.category ?? '') === selectedCategory
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

  const isOoliteLab = slug === 'oolite'
  const digitalLabList = useMemo(
    () =>
      filteredWorkshops
        .filter((w) => !isAdultStudioWorkshop(w) && w.status === 'published')
        .sort(sortWorkshopsFeaturedFirst),
    [filteredWorkshops]
  )
  const adultStudioList = useMemo(
    () =>
      filteredWorkshops
        .filter((w) => isAdultStudioWorkshop(w) && w.status === 'published')
        .sort(sortWorkshopsFeaturedFirst),
    [filteredWorkshops]
  )
  const draftFiltered = useMemo(
    () => filteredWorkshops.filter((w) => w.status === 'draft'),
    [filteredWorkshops]
  )

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        isDark 
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
              isDark ? 'bg-gray-700' : 'bg-gray-200'
            }`}></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className={`${
                  isDark ? 'bg-gray-800' : 'bg-white'
                } rounded-lg shadow p-6`}>
                  <div className={`h-48 rounded mb-4 ${
                    isDark ? 'bg-gray-700' : 'bg-gray-200'
                  }`}></div>
                  <div className={`h-4 rounded w-3/4 mb-2 ${
                    isDark ? 'bg-gray-700' : 'bg-gray-200'
                  }`}></div>
                  <div className={`h-3 rounded w-1/2 ${
                    isDark ? 'bg-gray-700' : 'bg-gray-200'
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
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isOoliteLab
          ? isDark
            ? 'bg-neutral-950 text-neutral-100'
            : 'bg-stone-50 text-neutral-900'
          : isDark
            ? 'bg-gradient-to-b from-gray-900 to-black text-white'
            : 'bg-gradient-to-b from-gray-50 to-white text-gray-900'
      }`}
    >
      {/* Navigation */}
      <div className="relative z-50">
        <UnifiedNavigation config={navigationConfig} userRole="admin" />
      </div>

      {/* Hero */}
      {isOoliteLab ? (
        <section
          ref={heroRef}
          className={`border-b pt-24 pb-16 md:pt-28 md:pb-20 ${
            isDark ? 'border-neutral-800 bg-neutral-950' : 'border-stone-200/80 bg-stone-50'
          }`}
        >
          <div className="container mx-auto max-w-3xl px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <p
                className={`text-xs font-semibold uppercase tracking-[0.2em] md:text-sm ${
                  isDark ? 'text-neutral-400' : 'text-neutral-500'
                }`}
              >
                {landingCopy.heroEyebrow}
              </p>
              <h1
                className={`text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl lg:text-[3.25rem] ${
                  isDark ? 'text-white' : 'text-neutral-900'
                }`}
              >
                <span className="block">{landingCopy.heroTitle}</span>
                <span
                  className="mt-1 block"
                  style={{ color: tenantConfig?.theme?.primaryColor || ooliteColors.primary }}
                >
                  {landingCopy.heroTitleAccent}
                </span>
              </h1>
              <p
                className={`mx-auto max-w-2xl text-base leading-relaxed md:text-lg ${
                  isDark ? 'text-neutral-300' : 'text-neutral-600'
                }`}
              >
                {landingCopy.heroLead}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a
                  href={landingCopy.heroPrimaryCta.href}
                  className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
                  style={{ backgroundColor: tenantConfig?.theme?.primaryColor || ooliteColors.primary }}
                >
                  {landingCopy.heroPrimaryCta.label}
                </a>
                <a
                  href={landingCopy.heroSecondaryCta.href}
                  className={`inline-flex items-center justify-center rounded-full border px-6 py-2.5 text-sm font-medium transition hover:bg-black/5 dark:hover:bg-white/5 ${
                    isDark
                      ? 'border-neutral-600 text-neutral-100'
                      : 'border-neutral-300 text-neutral-900'
                  }`}
                >
                  {landingCopy.heroSecondaryCta.label}
                </a>
              </div>
              {organization && (
                <p
                  className={`pt-2 text-sm ${
                    isDark ? 'text-neutral-500' : 'text-neutral-500'
                  }`}
                >
                  {organization.name}
                </p>
              )}
            </motion.div>
          </div>
        </section>
      ) : (
        <section ref={heroRef} className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20">
          <div className="absolute inset-0">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#6366f133_1px,transparent_1px),linear-gradient(to_bottom,#6366f133_1px,transparent_1px)] bg-[size:14px_24px]" />
            </div>
            {!reducedMotion && (
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute h-1 w-1 rounded-full bg-indigo-500/30"
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
                      ease: 'linear',
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="container relative z-10 mx-auto px-4">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <p
                  className={`mb-3 text-sm font-medium uppercase tracking-widest ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {landingCopy.heroEyebrow}
                </p>
                <h1
                  className={`text-4xl font-bold leading-tight md:text-5xl lg:text-6xl ${
                    isDark ? 'text-white' : 'text-gray-900'
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
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  {landingCopy.heroLead}
                </p>
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <a
                    href={landingCopy.heroPrimaryCta.href}
                    className="inline-flex rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground"
                  >
                    {landingCopy.heroPrimaryCta.label}
                  </a>
                  <a
                    href={landingCopy.heroSecondaryCta.href}
                    className={`inline-flex rounded-full border px-6 py-2.5 text-sm font-medium ${
                      isDark ? 'border-gray-600 text-white' : 'border-gray-300 text-gray-900'
                    }`}
                  >
                    {landingCopy.heroSecondaryCta.label}
                  </a>
                </div>
                {organization && (
                  <p
                    className={`mt-4 text-base ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    {organization.name}
                  </p>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      )}

      <section
        className={`mx-auto max-w-3xl px-4 pb-12 pt-12 md:pb-16 md:pt-16 ${
          isDark ? 'text-neutral-300' : 'text-neutral-700'
        }`}
      >
        <h2
          className={`text-center text-2xl font-semibold tracking-tight md:text-3xl ${
            isDark ? 'text-white' : 'text-neutral-900'
          }`}
        >
          {landingCopy.framingSection.title}
        </h2>
        <p
          className={`mx-auto mt-5 whitespace-pre-line text-center text-base leading-relaxed md:text-lg ${
            isDark ? 'text-neutral-400' : 'text-neutral-600'
          }`}
        >
          {landingCopy.framingSection.body}
        </p>

        <p className="mt-12 text-center text-sm font-medium text-muted-foreground">
          {landingCopy.trustLine}
        </p>
        <ul className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
          {landingCopy.trustItems.map((t) => (
            <li
              key={t}
              className={`rounded-full border px-4 py-2 ${
                isDark
                  ? 'border-neutral-700 bg-neutral-900/50'
                  : 'border-stone-200 bg-white shadow-sm'
              }`}
            >
              {t}
            </li>
          ))}
        </ul>
      </section>

      {isOoliteLab ? (
        <div className="mx-auto max-w-4xl px-4 pb-6 sm:px-6 lg:px-8">
          <div
            className={`rounded-xl border px-4 py-4 text-center text-sm sm:text-base ${
              isDark
                ? 'border-neutral-700 bg-neutral-900/40 text-neutral-200'
                : 'border-stone-200 bg-stone-50 text-stone-800'
            }`}
          >
            <span className="font-medium">Digital Lab workshop catalog</span>
            {' — '}
            <Link
              href="/o/oolite/workshops/digital-lab"
              className="font-semibold text-primary underline underline-offset-2"
            >
              Open the Digital Lab workshop catalog
            </Link>
            {' '}
            (filters, sort, and readiness badges).
          </div>
        </div>
      ) : null}

      {/* Workshops Section */}
      <section ref={workshopsRef} id="workshops-catalog" className="scroll-mt-24 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2
              className={`mb-3 text-3xl font-semibold tracking-tight md:text-4xl ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              {isOoliteLab ? landingCopy.featuredSection.title : 'Available workshops'}
            </h2>
            <p
              className={`mx-auto max-w-2xl text-base leading-relaxed md:text-lg ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              {isOoliteLab
                ? landingCopy.featuredSection.subcopy
                : 'Choose from our curated selection of workshops designed for all skill levels.'}
            </p>
          </motion.div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search workshops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2">
                <Filter className={`h-4 w-4 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`px-3 py-1 rounded-md border ${
                    isDark 
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
                    isDark 
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
                    isDark
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
                    isDark
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
                      isDark
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

          {isOoliteLab && filteredWorkshops.length > 0 ? (
            <p className="mb-10 text-center text-sm text-muted-foreground">
              Filters apply to all workshops below.
            </p>
          ) : null}

          {isOoliteLab ? (
            <>
              {digitalLabList.length > 0 ? (
                <div className="mb-16">
                  <h3
                    className={`mb-2 text-center text-xl font-semibold tracking-tight md:text-2xl ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    Digital Lab
                  </h3>
                  <p
                    className={`mx-auto mb-8 max-w-xl text-center text-sm leading-relaxed ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    Websites, discoverability, documentation, AI literacy, creative coding, and sustainable
                    digital workflows.
                  </p>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {digitalLabList.map((workshop) => (
                      <motion.div
                        key={workshop.id}
                        variants={fadeIn}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        whileHover={reducedMotion ? {} : hoverScale}
                      >
                        <WorkshopCard workshop={workshop as WorkshopRow} orgSlug={slug} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : null}

              {adultStudioList.length > 0 ? (
                <div className="mb-16">
                  <h3
                    className={`mb-2 text-center text-xl font-semibold tracking-tight md:text-2xl ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    Adult studio classes
                  </h3>
                  <p
                    className={`mx-auto mb-8 max-w-xl text-center text-sm leading-relaxed ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    In-person painting, drawing, printmaking, and mixed-media sessions at Oolite Arts.
                  </p>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {adultStudioList.map((workshop) => (
                      <motion.div
                        key={workshop.id}
                        variants={fadeIn}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        whileHover={reducedMotion ? {} : hoverScale}
                      >
                        <WorkshopCard workshop={workshop as WorkshopRow} orgSlug={slug} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : null}

              {organization ? (
                <div className="mb-16">
                  <WorkshopCategoryVotingUnified organizationId={organization.id} userId={user?.id} />
                </div>
              ) : null}

              {draftFiltered.length > 0 ? (
                <div className="mb-16">
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="mb-8 text-center"
                  >
                    <h3
                      className={`mb-4 text-2xl font-semibold md:text-3xl ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      <Edit className="mr-2 inline-block h-8 w-8 text-orange-500" />
                      Draft workshops
                    </h3>
                    <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Workshops currently in development.
                    </p>
                  </motion.div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {draftFiltered.map((workshop) => (
                      <motion.div
                        key={workshop.id}
                        variants={fadeIn}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        whileHover={reducedMotion ? {} : hoverScale}
                      >
                        <WorkshopCard workshop={workshop as WorkshopRow} orgSlug={slug} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <>
              {featuredWorkshops.length > 0 ? (
                <div className="mb-16">
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="mb-8 text-center"
                  >
                    <h3
                      className={`mb-4 text-2xl font-bold md:text-3xl ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      <Star className="mr-2 inline-block h-8 w-8 text-yellow-500" />
                      Featured workshops
                    </h3>
                    <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Our most popular and highly recommended workshops
                    </p>
                  </motion.div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                        <WorkshopCard workshop={workshop as WorkshopRow} orgSlug={slug} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : null}

              {organization ? (
                <div className="mb-16">
                  <WorkshopCategoryVotingUnified organizationId={organization.id} userId={user?.id} />
                </div>
              ) : null}

              {publishedWorkshops.length > 0 ? (
                <div className="mb-16">
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="mb-8 text-center"
                  >
                    <h3
                      className={`mb-4 text-2xl font-bold md:text-3xl ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      Available workshops
                    </h3>
                    <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Choose from our curated selection of workshops designed for all skill levels
                    </p>
                  </motion.div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                        <WorkshopCard workshop={workshop as WorkshopRow} orgSlug={slug} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : null}

              {unpublishedWorkshops.length > 0 ? (
                <div className="mb-16">
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="mb-8 text-center"
                  >
                    <h3
                      className={`mb-4 text-2xl font-bold md:text-3xl ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      <Edit className="mr-2 inline-block h-8 w-8 text-orange-500" />
                      Draft workshops
                    </h3>
                    <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Workshops currently in development — coming soon!
                    </p>
                  </motion.div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                        <WorkshopCard workshop={workshop as WorkshopRow} orgSlug={slug} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          )}

          {/* Empty State */}
          {(workshops.length === 0 ||
            (workshops.length > 0 && filteredWorkshops.length === 0)) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <BookOpen className={`mx-auto h-12 w-12 mb-4 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <h3 className={`text-lg font-medium mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {workshops.length === 0
                  ? 'No workshops in the catalog'
                  : 'No workshops match your filters'}
              </h3>
              <p className={`max-w-lg mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {workshops.length === 0 ? (
                  <>
                    There are no rows in the{' '}
                    <code className="text-xs bg-black/10 dark:bg-white/10 px-1 rounded">workshops</code>{' '}
                    table for this organization yet. Seed or import workshops in Supabase for this org’s ID, or check
                    that you are viewing the correct tenant slug.
                  </>
                ) : (
                  <>
                    Clear search and set category, level, format, audience, and track filters to &quot;All&quot; to see
                    everything again.
                  </>
                )}
              </p>
            </motion.div>
          )}
        </div>
      </section>

      <section
        className={`mx-auto max-w-5xl px-4 py-16 md:py-20 ${
          isDark ? 'text-neutral-300' : 'text-neutral-700'
        }`}
      >
        <h2 className="text-center text-2xl font-semibold tracking-tight md:text-3xl">
          {landingCopy.howItWorks.title}
        </h2>
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {landingCopy.howItWorks.steps.map((step, i) => (
            <div key={`${step.title}-${i}`} className="text-center md:text-left">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 border-t border-border/60 pt-16">
          <h2
            className={`text-center text-2xl font-semibold tracking-tight md:text-3xl ${
              isDark ? 'text-white' : 'text-neutral-900'
            }`}
          >
            {landingCopy.whySeriesSection.title}
          </h2>
          <p
            className={`mx-auto mt-5 max-w-3xl text-center text-base leading-relaxed md:text-lg ${
              isDark ? 'text-neutral-400' : 'text-neutral-600'
            }`}
          >
            {landingCopy.whySeriesSection.body}
          </p>
        </div>

        <div
          className={`mt-16 rounded-2xl border p-8 md:p-10 ${
            isDark ? 'border-neutral-800 bg-neutral-900/40' : 'border-stone-200 bg-white/90 shadow-sm'
          }`}
        >
          <h2 className="text-2xl font-semibold">{landingCopy.forInstitutions.title}</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">{landingCopy.forInstitutions.body}</p>
          <ul className="mt-6 list-disc space-y-2 pl-5 text-sm">
            {landingCopy.forInstitutions.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          {landingCopy.institutionCtas.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-3">
              {landingCopy.institutionCtas.map((cta) => (
                <a
                  key={cta.label}
                  href={cta.href}
                  className={`inline-flex rounded-full border px-4 py-2 text-sm font-medium transition hover:bg-black/5 dark:hover:bg-white/5 ${
                    isDark ? 'border-neutral-600 text-neutral-100' : 'border-neutral-300 text-neutral-900'
                  }`}
                >
                  {cta.label}
                </a>
              ))}
            </div>
          ) : null}
          <div className="mt-8">
            <InstitutionalInquiryCta landing={landingCopy.institutionalInquiry} orgSlug={slug} />
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

        <div className="mt-20 border-t border-border/60 pt-16">
          <h2 className="text-center text-2xl font-semibold">{landingCopy.comingSoonSection.title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground md:text-base">
            {landingCopy.comingSoonSection.subcopy}
          </p>
        </div>

        <div
          className={`mt-16 rounded-2xl border p-8 text-center md:p-12 ${
            isDark ? 'border-neutral-800 bg-neutral-900/30' : 'border-stone-200 bg-stone-100/80'
          }`}
        >
          <h2 className="text-xl font-semibold md:text-2xl">{landingCopy.footerCtaSection.title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {landingCopy.footerCtaSection.body}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {landingCopy.footerCtaSection.ctas.map((cta) => (
              <a
                key={cta.label}
                href={cta.href}
                className="inline-flex rounded-full px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
                style={{ backgroundColor: tenantConfig?.theme?.primaryColor || ooliteColors.primary }}
              >
                {cta.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <DecorativeDivider
        icon={Heart}
        gradientColors={{
          from: isDark ? 'rgba(99, 102, 241, 0.08)' : 'rgba(99, 102, 241, 0.04)',
          via: isDark ? 'rgba(168, 85, 247, 0.08)' : 'rgba(168, 85, 247, 0.04)',
          to: isDark ? 'rgba(99, 102, 241, 0.08)' : 'rgba(99, 102, 241, 0.04)',
        }}
        iconColor={isDark ? 'text-indigo-400/40' : 'text-indigo-500/40'}
        className="my-12"
      />

      <PageFooter
        organizationSlug={slug}
        showGetStarted={true}
        showGuidelines={true}
        showTerms={true}
      />
    </div>
  )
}

