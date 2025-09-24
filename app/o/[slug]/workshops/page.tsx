'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { UnifiedNavigation, ooliteConfig, bakehouseConfig } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useTheme } from '@/contexts/ThemeContext'
import DecorativeDivider from '@/components/common/DecorativeDivider'
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
  duration_minutes: number
  max_participants: number
  price: number
  instructor: string
  prerequisites: string[]
  materials: string[]
  outcomes: string[]
  is_active: boolean
  is_shared: boolean
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
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
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

export default function WorkshopsPage() {
  const params = useParams()
  const slug = params.slug as string
  // Get navigation config based on organization slug
  const getNavigationConfig = () => {
    switch (slug) {
      case 'oolite':
        return ooliteConfig
      case 'bakehouse':
        return bakehouseConfig
      default:
        return ooliteConfig // Default fallback
    }
  }
  const { theme } = useTheme()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [reducedMotion, setReducedMotion] = useState(false)

  // Intersection observer for sections
  const [heroRef, heroInView] = useInView({ threshold: 0.5 })
  const [workshopsRef, workshopsInView] = useInView({ threshold: 0.5 })

  useEffect(() => {
    async function loadData() {
      if (!params.slug) return
      
      try {
        const slug = params.slug as string

        // Get organization details
        const orgResponse = await fetch(`/api/organizations/by-slug/${slug}`)
        if (orgResponse.ok) {
          const orgData = await orgResponse.json()
          setOrganization(orgData.organization)
        }

        // Get workshops
        const workshopsResponse = await fetch('/api/workshops')
        if (workshopsResponse.ok) {
          const workshopsData = await workshopsResponse.json()
          setWorkshops(workshopsData.workshops || [])
        }

      } catch (error) {
        console.error('Error loading workshops data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params.slug])

  // Reduced motion detection
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  // Filter workshops
  const filteredWorkshops = workshops.filter(workshop => {
    const matchesSearch = workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workshop.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workshop.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || workshop.category === selectedCategory
    const matchesLevel = selectedLevel === 'all' || workshop.level === selectedLevel
    
    return matchesSearch && matchesCategory && matchesLevel
  })

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

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-gradient-to-b from-gray-900 to-black text-white' 
          : 'bg-gradient-to-b from-gray-50 to-white text-gray-900'
      }`}>
        <UnifiedNavigation config={getNavigationConfig()} userRole="admin" />
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
      <div className={`fixed top-0 left-0 right-0 z-50 ${
        theme === 'dark' 
          ? 'bg-gray-900/80 backdrop-blur-md border-b border-gray-800' 
          : 'bg-white/80 backdrop-blur-md border-b border-gray-200'
      }`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <UnifiedNavigation config={getNavigationConfig()} userRole="admin" />
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
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
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500">
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

          {/* Workshops Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkshops.map((workshop, index) => (
              <motion.div
                key={workshop.id}
                variants={fadeIn}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                whileHover={reducedMotion ? {} : hoverScale}
                className="cursor-pointer"
              >
                <Card className={`overflow-hidden transition-all duration-300 ${
                  theme === 'dark' 
                    ? 'bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:border-indigo-500/50 hover:shadow-2xl' 
                    : 'bg-white/50 backdrop-blur-sm border-gray-200 hover:border-indigo-500/50 hover:shadow-2xl'
                }`}>
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
                      <Button size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredWorkshops.length === 0 && (
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
    </div>
  )
}

