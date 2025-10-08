'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { UnifiedNavigation, ooliteConfig, bakehouseConfig } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useTheme } from '@/contexts/ThemeContext'
import DecorativeDivider from '@/components/common/DecorativeDivider'
import { 
  Settings, 
  Share2, 
  Building2, 
  BookOpen, 
  Users, 
  Calendar,
  Plus,
  Edit,
  Trash2,
  Eye,
  Check,
  X,
  Clock,
  AlertCircle,
  Sparkles,
  Target,
  Heart
} from 'lucide-react'

interface Workshop {
  id: string
  title: string
  description: string
  category: string
  level: string
  duration_minutes: number
  max_participants: number
  price: number
  instructor: string
  organization_name: string
  organization_slug: string
  is_shared: boolean
  created_at: string
}

interface Organization {
  id: string
  name: string
  slug: string
}

interface SharingRelation {
  id: string
  workshop_id: string
  source_organization_name: string
  source_organization_slug: string
  target_organization_name: string
  target_organization_slug: string
  shared_at: string
  expires_at?: string
  sharing_notes?: string
  shared_by_email: string
  is_active: boolean
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

function WorkshopSharingAdminPageContent() {
  const { theme } = useTheme()
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [sharingRelations, setSharingRelations] = useState<SharingRelation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null)
  const [selectedOrganization, setSelectedOrganization] = useState<string>('')
  const [sharingNotes, setSharingNotes] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [showShareModal, setShowShareModal] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  // Intersection observer for sections
  const [heroRef, heroInView] = useInView({ threshold: 0.5 })
  const [workshopsRef, workshopsInView] = useInView({ threshold: 0.5 })

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/api/admin/workshop-sharing')
        if (response.ok) {
          const data = await response.json()
          setWorkshops(data.shareableWorkshops || [])
          setOrganizations(data.organizations || [])
          setSharingRelations(data.sharingRelations || [])
        }
      } catch (error) {
        console.error('Error loading workshop sharing data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Reduced motion detection
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  const handleShareWorkshop = async () => {
    if (!selectedWorkshop || !selectedOrganization) return

    try {
      const response = await fetch('/api/admin/workshop-sharing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workshop_id: selectedWorkshop.id,
          target_organization_id: selectedOrganization,
          expires_at: expiresAt || null,
          notes: sharingNotes || null,
        }),
      })

      if (response.ok) {
        // Refresh data
        const data = await response.json()
        setSharingRelations(prev => [...prev, data.sharing])
        setShowShareModal(false)
        setSelectedWorkshop(null)
        setSelectedOrganization('')
        setSharingNotes('')
        setExpiresAt('')
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error sharing workshop:', error)
      alert('Failed to share workshop')
    }
  }

  const handleToggleSharing = async (sharingId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/workshop-sharing/${sharingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_active: isActive,
        }),
      })

      if (response.ok) {
        setSharingRelations(prev =>
          prev.map(relation =>
            relation.id === sharingId ? { ...relation, is_active: isActive } : relation
          )
        )
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error updating sharing:', error)
      alert('Failed to update sharing')
    }
  }

  const handleDeleteSharing = async (sharingId: string) => {
    if (!confirm('Are you sure you want to remove this workshop sharing?')) return

    try {
      const response = await fetch(`/api/admin/workshop-sharing/${sharingId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setSharingRelations(prev => prev.filter(relation => relation.id !== sharingId))
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error deleting sharing:', error)
      alert('Failed to delete sharing')
    }
  }

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
        <UnifiedNavigation config={ooliteConfig} userRole="admin" />
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
          <UnifiedNavigation config={ooliteConfig} userRole="admin" />
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
                <span className="block">Workshop Sharing</span>
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500">
                  Admin Panel
                </span>
              </h1>
              
              <p className={`text-xl ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              } max-w-2xl mx-auto`}>
                Manage workshop sharing between organizations and control access to educational content
              </p>
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
              Shareable Workshops
            </h2>
            <p className={`text-xl ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            } max-w-3xl mx-auto`}>
              Select workshops to share with other organizations
            </p>
          </motion.div>

          {/* Workshops Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {workshops.map((workshop, index) => (
              <motion.div
                key={workshop.id}
                variants={fadeIn}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={reducedMotion ? {} : hoverScale}
                className="cursor-pointer"
                onClick={() => {
                  setSelectedWorkshop(workshop)
                  setShowShareModal(true)
                }}
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
                        <Building2 className="h-4 w-4 text-gray-500" />
                        <span>{workshop.organization_name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{formatDuration(workshop.duration_minutes)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>{workshop.max_participants} max participants</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <BookOpen className="h-4 w-4 text-gray-500" />
                        <span>{workshop.instructor}</span>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="text-xs">
                        {workshop.category}
                      </Badge>
                    </div>

                    {/* Action Button */}
                    <Button size="sm" className="w-full">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Workshop
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Current Sharing Relations */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h3 className={`text-2xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Current Sharing Relations
            </h3>
          </motion.div>

          <div className="space-y-4">
            {sharingRelations.map((relation) => (
              <motion.div
                key={relation.id}
                variants={fadeIn}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <Card className={`${
                  theme === 'dark' 
                    ? 'bg-gray-800/50 backdrop-blur-sm border-gray-700' 
                    : 'bg-white/50 backdrop-blur-sm border-gray-200'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h4 className="font-semibold">{relation.source_organization_name}</h4>
                          <span className="text-gray-500">→</span>
                          <h4 className="font-semibold">{relation.target_organization_name}</h4>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Shared: {new Date(relation.shared_at).toLocaleDateString()}</span>
                          {relation.expires_at && (
                            <span>Expires: {new Date(relation.expires_at).toLocaleDateString()}</span>
                          )}
                          <span>By: {relation.shared_by_email}</span>
                        </div>
                        {relation.sharing_notes && (
                          <p className="text-sm text-gray-600 mt-2">{relation.sharing_notes}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={relation.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'}>
                          {relation.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleSharing(relation.id, !relation.is_active)}
                        >
                          {relation.is_active ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteSharing(relation.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && selectedWorkshop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } rounded-lg max-w-md w-full p-6`}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className={`text-xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Share Workshop
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Workshop
                  </label>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {selectedWorkshop.title}
                  </p>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Share with Organization
                  </label>
                  <select
                    value={selectedOrganization}
                    onChange={(e) => setSelectedOrganization(e.target.value)}
                    className={`w-full px-3 py-2 rounded-md border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="">Select organization...</option>
                    {organizations
                      .filter(org => org.id !== selectedWorkshop.organization_name)
                      .map(org => (
                        <option key={org.id} value={org.id}>{org.name}</option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Expiration Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className={`w-full px-3 py-2 rounded-md border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Notes (Optional)
                  </label>
                  <textarea
                    value={sharingNotes}
                    onChange={(e) => setSharingNotes(e.target.value)}
                    rows={3}
                    className={`w-full px-3 py-2 rounded-md border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="Add any notes about this sharing..."
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button
                  onClick={handleShareWorkshop}
                  disabled={!selectedOrganization}
                  className="flex-1"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Workshop
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowShareModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
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

export default function WorkshopSharingAdminPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WorkshopSharingAdminPageContent />
    </Suspense>
  );
}

