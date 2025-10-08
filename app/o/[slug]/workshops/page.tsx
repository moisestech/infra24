'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useUser } from '@clerk/nextjs'
import { UnifiedNavigation, ooliteConfig, bakehouseConfig } from '@/components/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/contexts/ThemeContext'
import { useTenant } from '@/components/tenant/TenantProvider'
import DecorativeDivider from '@/components/common/DecorativeDivider'
import { PageFooter } from '@/components/common/PageFooter'
import { 
  BookOpen, 
  Clock, 
  Users, 
  DollarSign, 
  User, 
  Calendar,
  Filter,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Star,
  MapPin,
  Sparkles,
  Heart,
  Target
} from 'lucide-react'
import WorkshopCategoryVotingUnified from '@/components/workshops/WorkshopCategoryVotingUnified'

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
  
  console.log('🔧 Oolite Workshops Page Debug:')
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
      default:
        console.log('🧭 Using default oolite config')
        return ooliteConfig // Default fallback
    }
  }
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
        const orgResponse = await fetch(`/api/organizations/by-slug/${slug}`)
        let orgData = null
        if (orgResponse.ok) {
          orgData = await orgResponse.json()
          setOrganization(orgData.organization)
        }

        // Get workshops for this organization
        console.log('🔍 Fetching workshops for organization:', orgData?.organization?.id)
        if (orgData?.organization?.id) {
          const workshopsResponse = await fetch(`/api/organizations/${orgData.organization.id}/workshops`)
          if (workshopsResponse.ok) {
            const workshopsData = await workshopsResponse.json()
            console.log('📚 Workshops data received:', workshopsData)
            console.log('📊 Total workshops fetched:', workshopsData.workshops?.length || 0)
            
            // Debug each workshop
            workshopsData.workshops?.forEach((workshop: any, index: number) => {
              console.log(`📝 Workshop ${index + 1}:`, {
                title: workshop.title,
                status: workshop.status,
                featured: workshop.featured,
                is_public: workshop.is_public,
                is_active: workshop.is_active
              })
            })
            
            setWorkshops(workshopsData.workshops || [])
          } else {
            console.error('❌ Failed to fetch workshops:', workshopsResponse.status, workshopsResponse.statusText)
          }
        } else {
          console.error('❌ No organization ID found for slug:', slug)
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
  
  const filteredWorkshops = workshops.filter(workshop => {
    const matchesSearch = workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workshop.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workshop.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || workshop.category === selectedCategory
    const matchesLevel = selectedLevel === 'all' || workshop.level === selectedLevel
    
    return matchesSearch && matchesCategory && matchesLevel
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

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
    }
    return `${mins}m`
  }

  const renderWorkshopCard = (workshop: Workshop, index: number) => (
    <motion.div
      key={workshop.id}
      variants={fadeIn}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={reducedMotion ? {} : hoverScale}
      className="cursor-pointer"
    >
      <Card className={`overflow-hidden transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:border-indigo-500/50 hover:shadow-2xl' 
          : 'bg-white/50 backdrop-blur-sm border-gray-200 hover:border-indigo-500/50 hover:shadow-2xl'
      }`}>
        {/* Workshop Image */}
        {workshop.image_url && (
          <div className="relative h-48 overflow-hidden">
            <img 
              src={workshop.image_url} 
              alt={workshop.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
            {workshop.featured && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-yellow-500 text-yellow-900 dark:bg-yellow-400 dark:text-yellow-900">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              </div>
            )}
          </div>
        )}
        
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <CardTitle className="text-lg line-clamp-2">{workshop.title}</CardTitle>
            <Badge className={getLevelColor(workshop.level)}>
              {workshop.level}
            </Badge>
          </div>
          <CardDescription className="line-clamp-3">
            {workshop.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Workshop Details */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>{formatDuration(workshop.duration_minutes)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-gray-500" />
              <span>{workshop.confirmed_bookings}/{workshop.max_participants} participants</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-gray-500" />
              <span>{workshop.instructor}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <span>${workshop.price}</span>
            </div>
          </div>

          {/* Category */}
          <div className="flex items-center gap-2">
            <Badge variant="default" className="text-xs">
              {workshop.category}
            </Badge>
            {workshop.is_shared && (
              <Badge variant="default" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Shared
              </Badge>
            )}
            {workshop.status === 'draft' && (
              <Badge variant="default" className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                Draft
              </Badge>
            )}
          </div>

          {/* Rating */}
          {workshop.average_rating > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(workshop.average_rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                ({workshop.total_feedback} reviews)
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Link href={`/o/${slug}/workshops/${workshop.id}`}>
              <Button 
                size="sm" 
                className="flex-1"
                style={{
                  backgroundColor: tenantConfig?.theme?.primaryColor || '#3b82f6',
                  borderColor: tenantConfig?.theme?.primaryColor || '#3b82f6',
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = tenantConfig?.theme?.secondaryColor || '#1d4ed8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = tenantConfig?.theme?.primaryColor || '#3b82f6';
                }}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </Link>
            <Link href={`/o/${slug}/bookings?workshopId=${workshop.id}&type=workshop`}>
              <Button size="sm" variant="outline">
                <Calendar className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-gradient-to-b from-gray-900 to-black text-white' 
          : 'bg-gradient-to-b from-gray-50 to-white text-gray-900'
      }`}>
        {/* Navigation */}
        <div className="relative z-50">
          <UnifiedNavigation config={getNavigationConfig()} userRole="admin" />
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
        <UnifiedNavigation config={getNavigationConfig()} userRole="admin" />
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
              <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                <span className="block">Workshops</span>
                <span 
                  className="block bg-clip-text text-transparent"
                  style={{
                     backgroundImage: `linear-gradient(to right, ${tenantConfig?.theme?.primaryColor || '#3b82f6'}, ${tenantConfig?.theme?.secondaryColor || '#1d4ed8'}, ${tenantConfig?.theme?.accentColor || '#60a5fa'})`
                  }}
                >
                  Learn & Create
                </span>
              </h1>
              
              <p className={`text-xl ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              } max-w-2xl mx-auto`}>
                Discover hands-on workshops designed to enhance your skills and creativity
              </p>
              
              {organization && (
                <p className={`text-lg ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {organization.name}
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </section>
      
      <DecorativeDivider 
        icon={Sparkles}
        gradientColors={{
          from: theme === 'dark' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)',
          via: theme === 'dark' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.05)',
          to: theme === 'dark' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)'
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
                {featuredWorkshops.map((workshop, index) => renderWorkshopCard(workshop, index))}
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
                {publishedWorkshops.map((workshop, index) => renderWorkshopCard(workshop, index))}
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
                {unpublishedWorkshops.map((workshop, index) => renderWorkshopCard(workshop, index))}
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

