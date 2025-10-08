'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { UnifiedNavigation, ooliteConfig, bakehouseConfig } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useTheme } from '@/contexts/ThemeContext'
import DecorativeDivider from '@/components/common/DecorativeDivider'
import LargeIconCarousel from '@/components/common/LargeIconCarousel'
import { 
  Eye, 
  Play, 
  Download, 
  Share2, 
  Box as VrBox,
  Image as ImageIcon,
  FileText,
  Globe,
  Sparkles,
  Target,
  Heart,
  Building2,
  Rocket,
  Users,
  Zap
} from 'lucide-react'

interface Organization {
  id: string
  name: string
  slug: string
  banner_image?: string
  created_at: string
}

interface XRProject {
  id: string
  title: string
  description: string
  type: 'vr' | 'ar' | 'mixed' | 'maquette' | 'diagram'
  thumbnail: string
  fullImage?: string
  videoUrl?: string
  downloadUrl?: string
  tags: string[]
  created_at: string
  status: 'completed' | 'in_progress' | 'concept'
}

// Icons for the carousel
const carouselIcons = [
  { icon: VrBox, label: "Virtual Reality" },
  { icon: Building2, label: "3D Maquettes" },
  { icon: FileText, label: "Interactive Diagrams" },
  { icon: Globe, label: "Immersive Experiences" },
  { icon: Users, label: "Community Engagement" },
  { icon: Rocket, label: "Innovation" }
]

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

export default function XRPage() {
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
  const [projects, setProjects] = useState<XRProject[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<XRProject | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [reducedMotion, setReducedMotion] = useState(false)

  // Intersection observer for sections
  const [heroRef, heroInView] = useInView({ threshold: 0.5 })
  const [projectsRef, projectsInView] = useInView({ threshold: 0.5 })

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

        // TODO: Load XR projects from API
        // For now, using placeholder data
        setProjects([
          {
            id: '1',
            title: 'Virtual Studio Tour',
            description: 'Immersive 360° experience of our creative spaces',
            type: 'vr',
            thumbnail: '/placeholder-vr-thumb.jpg',
            videoUrl: '/placeholder-vr-video.mp4',
            tags: ['VR', 'Studio Tour', 'Immersive'],
            created_at: new Date().toISOString(),
            status: 'completed'
          },
          {
            id: '2',
            title: 'Exhibition Maquette',
            description: '3D model and architectural visualization of upcoming exhibition',
            type: 'maquette',
            thumbnail: '/placeholder-maquette-thumb.jpg',
            fullImage: '/placeholder-maquette-full.jpg',
            tags: ['Maquette', 'Exhibition', '3D Model'],
            created_at: new Date().toISOString(),
            status: 'in_progress'
          },
          {
            id: '3',
            title: 'Artwork Flow Diagram',
            description: 'Interactive diagram showing the journey of artworks through our space',
            type: 'diagram',
            thumbnail: '/placeholder-diagram-thumb.jpg',
            fullImage: '/placeholder-diagram-full.jpg',
            tags: ['Diagram', 'Process', 'Interactive'],
            created_at: new Date().toISOString(),
            status: 'completed'
          }
        ])

      } catch (error) {
        console.error('Error loading XR data:', error)
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

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.type === filter)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'vr': return <VrBox className="h-5 w-5" />
      case 'ar': return <Eye className="h-5 w-5" />
      case 'maquette': return <ImageIcon className="h-5 w-5" />
      case 'diagram': return <FileText className="h-5 w-5" />
      default: return <Globe className="h-5 w-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vr': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'ar': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'maquette': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'diagram': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'concept': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                <span className="block">XR Experiences</span>
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500">
                  Immersive Innovation
                </span>
              </h1>
              
              <p className={`text-xl ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              } max-w-2xl`}>
                Explore our immersive virtual reality experiences, 3D maquettes, and interactive diagrams
              </p>
              
              {organization && (
                <p className={`text-lg ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {organization.name}
                </p>
              )}
            </motion.div>

            <div className="h-[400px] md:h-[500px] flex items-center justify-center">
              <LargeIconCarousel icons={carouselIcons} reducedMotion={reducedMotion} />
            </div>
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
      
      {/* Projects Section */}
      <section ref={projectsRef} className="py-20">
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
              Explore Our XR Projects
            </h2>
            <p className={`text-xl ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            } max-w-3xl mx-auto`}>
              Discover immersive experiences, 3D visualizations, and interactive content
            </p>
          </motion.div>

          {/* Filter Tabs */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                className="mb-2"
              >
                All Projects
              </Button>
              <Button
                variant={filter === 'vr' ? 'default' : 'outline'}
                onClick={() => setFilter('vr')}
                className="mb-2"
              >
                <VrBox className="h-4 w-4 mr-2" />
                VR Experiences
              </Button>
              <Button
                variant={filter === 'maquette' ? 'default' : 'outline'}
                onClick={() => setFilter('maquette')}
                className="mb-2"
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Maquettes
              </Button>
              <Button
                variant={filter === 'diagram' ? 'default' : 'outline'}
                onClick={() => setFilter('diagram')}
                className="mb-2"
              >
                <FileText className="h-4 w-4 mr-2" />
                Diagrams
              </Button>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                variants={fadeIn}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={reducedMotion ? {} : hoverScale}
                className="cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <Card className={`overflow-hidden transition-all duration-300 ${
                  theme === 'dark' 
                    ? 'bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:border-indigo-500/50 hover:shadow-2xl' 
                    : 'bg-white/50 backdrop-blur-sm border-gray-200 hover:border-indigo-500/50 hover:shadow-2xl'
                }`}>
                  <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 flex items-center justify-center">
                    {getTypeIcon(project.type)}
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <Badge className={getTypeColor(project.type)}>
                        {project.type.toUpperCase()}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <Badge className={getStatusColor(project.status)}>
                        {project.status.replace('_', ' ')}
                      </Badge>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {project.videoUrl && (
                          <Button size="sm" variant="outline">
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        {project.downloadUrl && (
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="default" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <VrBox className={`mx-auto h-12 w-12 mb-4 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <h3 className={`text-lg font-medium mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                No {filter === 'all' ? '' : filter} projects found
              </h3>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Check back later for new XR experiences and visualizations.
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

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className={`text-2xl font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {selectedProject.title}
                    </h2>
                    <p className={`mt-2 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {selectedProject.description}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedProject(null)}
                    className="ml-4"
                  >
                    ×
                  </Button>
                </div>
              
                <div className={`aspect-video rounded-lg mb-6 flex items-center justify-center ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-br from-purple-900 to-blue-900' 
                    : 'bg-gradient-to-br from-purple-100 to-blue-100'
                }`}>
                  <div className="text-center">
                    {getTypeIcon(selectedProject.type)}
                    <p className={`mt-2 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {selectedProject.type.toUpperCase()} Experience
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Badge className={getTypeColor(selectedProject.type)}>
                      {selectedProject.type.toUpperCase()}
                    </Badge>
                    <Badge className={getStatusColor(selectedProject.status)}>
                      {selectedProject.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button>
                      <Eye className="h-4 w-4 mr-2" />
                      View Experience
                    </Button>
                    {selectedProject.downloadUrl && (
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    )}
                    <Button variant="outline">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}