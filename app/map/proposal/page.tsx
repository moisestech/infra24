'use client'

import { motion } from 'framer-motion'
import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/Badge'
import { 
  MapPin, 
  Eye, 
  Users, 
  Calendar, 
  Target,
  CheckCircle,
  ArrowRight,
  Building2,
  Smartphone,
  Globe,
  Zap
} from 'lucide-react'
import Link from 'next/link'

function MapProposalPageContent() {
  const features = [
    {
      icon: MapPin,
      title: 'Interactive Studio Map',
      description: 'Real-time location tracking of artists and their workspaces'
    },
    {
      icon: Users,
      title: 'Artist Profiles',
      description: 'Detailed profiles with portfolios, contact info, and availability'
    },
    {
      icon: Eye,
      title: 'Visual Navigation',
      description: 'Intuitive map interface with search and filtering capabilities'
    },
    {
      icon: Smartphone,
      title: 'Mobile Optimized',
      description: 'Responsive design that works perfectly on all devices'
    }
  ]

  const benefits = [
    'Enhanced visitor experience with easy navigation',
    'Real-time artist availability and location updates',
    'Integration with existing studio management systems',
    'Analytics and insights on space utilization',
    'Cost-effective solution with minimal hardware requirements'
  ]

  const timeline = [
    {
      phase: 'Phase 1',
      title: 'Design & Planning',
      duration: '2 weeks',
      description: 'Map design, user interface planning, and technical architecture'
    },
    {
      phase: 'Phase 2',
      title: 'Development',
      duration: '3 weeks',
      description: 'Core functionality, artist profiles, and interactive features'
    },
    {
      phase: 'Phase 3',
      title: 'Testing & Launch',
      duration: '1 week',
      description: 'Quality assurance, user testing, and deployment'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-2xl">
              <MapPin className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Smart Map Proposal
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            Transform your studio space with an interactive digital map that enhances visitor experience 
            and streamlines artist management.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/o/bakehouse/map">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Eye className="w-5 h-5 mr-2" />
                View Demo
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-gray-300 dark:border-gray-600">
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Meeting
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
                <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
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
              Why choose our Smart Map solution
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
                    <span className="text-gray-600 dark:text-gray-400">Real-time updates</span>
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
                    <span className="text-gray-600 dark:text-gray-400">Multi-user support</span>
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
              6-week development cycle for full deployment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {timeline.map((phase, index) => (
              <div key={index} className="relative">
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        {index + 1}
                      </div>
                      <div>
                        <Badge variant="default" className="mb-1">{phase.phase}</Badge>
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
          <Card className="bg-gradient-to-r from-blue-600 to-green-600 text-white border-0">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Transform Your Studio?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join us in creating a more connected and efficient studio environment. 
                Let's discuss how the Smart Map can enhance your space.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Demo
                </Button>
                <Link href="/o/bakehouse/map">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                    <Eye className="w-5 h-5 mr-2" />
                    View Live Demo
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

export default function MapProposalPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MapProposalPageContent />
    </Suspense>
  );
}
