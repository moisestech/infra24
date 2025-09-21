'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/Badge'
import { 
  FileText, 
  Users, 
  Calendar, 
  Target,
  CheckCircle,
  ArrowRight,
  Building2,
  Smartphone,
  Globe,
  Zap,
  Shield,
  Clock
} from 'lucide-react'
import Link from 'next/link'

interface Organization {
  id: string
  name: string
  slug: string
  banner_image?: string
  created_at: string
}

export default function SubmitProposalPage() {
  const params = useParams()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)

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
      } catch (error) {
        console.error('Error loading organization data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params.slug])

  const features = [
    {
      icon: Shield,
      title: 'Secure Submissions',
      description: 'Enterprise-grade security with encrypted data transmission'
    },
    {
      icon: Clock,
      title: 'Save & Resume',
      description: 'Start your submission and return later with auto-save functionality'
    },
    {
      icon: Users,
      title: 'Collaborative Review',
      description: 'Multiple reviewers can provide feedback and track progress'
    },
    {
      icon: Smartphone,
      title: 'Mobile Optimized',
      description: 'Responsive design that works perfectly on all devices'
    }
  ]

  const benefits = [
    'Streamlined application process for artists and participants',
    'Real-time status tracking and communication',
    'Automated notifications and reminders',
    'Integration with existing organization workflows',
    'Comprehensive analytics and reporting'
  ]

  const timeline = [
    {
      phase: 'Phase 1',
      title: 'Setup & Configuration',
      duration: '1 week',
      description: 'Customize forms, set up review workflows, and configure notifications'
    },
    {
      phase: 'Phase 2',
      title: 'Testing & Training',
      duration: '1 week',
      description: 'User acceptance testing and staff training on the platform'
    },
    {
      phase: 'Phase 3',
      title: 'Launch & Support',
      duration: 'Ongoing',
      description: 'Go-live support and ongoing maintenance and updates'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded-2xl">
              <FileText className="w-12 h-12 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Professional Submission Platform
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            {organization ? `Transform how ${organization.name} manages applications, surveys, and submissions with our enterprise-grade platform.` : 'Transform how your organization manages applications, surveys, and submissions with our enterprise-grade platform.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/submit">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                <FileText className="w-5 h-5 mr-2" />
                View Platform
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-gray-300 dark:border-gray-600">
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Demo
            </Button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {features.map((feature, index) => (
            <Card key={index} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Benefits Section */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Key Benefits
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Why choose our submission platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-6 h-6 mr-2 text-green-600" />
                  Strategic Advantages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-6 h-6 mr-2 text-blue-600" />
                  Technical Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Building2 className="w-5 h-5 text-blue-600 mr-3" />
                    <span className="text-gray-600 dark:text-gray-400">Multi-organization support</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 text-blue-600 mr-3" />
                    <span className="text-gray-600 dark:text-gray-400">Cloud-based platform</span>
                  </div>
                  <div className="flex items-center">
                    <Smartphone className="w-5 h-5 text-blue-600 mr-3" />
                    <span className="text-gray-600 dark:text-gray-400">Mobile responsive</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-blue-600 mr-3" />
                    <span className="text-gray-600 dark:text-gray-400">Role-based access</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Implementation Timeline
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Quick setup and deployment process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {timeline.map((phase, index) => (
              <div key={index} className="relative">
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        {index + 1}
                      </div>
                      <div>
                        <Badge variant="info" className="mb-1">{phase.phase}</Badge>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {phase.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      Duration: {phase.duration}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {phase.description}
                    </p>
                  </CardContent>
                </Card>
                
                {index < timeline.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Streamline Your Submissions?
              </h2>
              <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                {organization ? `Let's discuss how our platform can enhance ${organization.name}'s application and survey processes.` : 'Let\'s discuss how our platform can enhance your organization\'s application and survey processes.'}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Demo
                </Button>
                <Link href="/submit">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                    <FileText className="w-5 h-5 mr-2" />
                    View Platform
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
