'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { UnifiedNavigation, ooliteConfig, bakehouseConfig } from '@/components/navigation'
import { TenantProvider } from '@/components/tenant/TenantProvider'
import { OrganizationLogo } from '@/components/ui/OrganizationLogo'
import { EmbedCarousel } from '@/components/360/EmbedCarousel'
import { getEmbedItems, EmbedItem } from '@/lib/360/embed-config'
import { motion } from 'framer-motion'
import { Globe, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Organization {
  id: string
  name: string
  slug: string
}

export default function ThreeSixtyPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [embeds, setEmbeds] = useState<EmbedItem[]>([])
  const [loading, setLoading] = useState(true)
  
  const getNavigationConfig = () => {
    switch (slug) {
      case 'oolite':
        return ooliteConfig
      case 'bakehouse':
        return bakehouseConfig
      default:
        return ooliteConfig
    }
  }
  
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        
        // Load organization data
        const orgResponse = await fetch(`/api/organizations/by-slug/${slug}`)
        if (orgResponse.ok) {
          const orgData = await orgResponse.json()
          setOrganization(orgData.organization)
        }
        
        // Load embed items (currently from config, future: from API)
        const embedItems = getEmbedItems(slug)
        setEmbeds(embedItems)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    if (slug) {
      loadData()
    }
  }, [slug])
  
  if (loading) {
    return (
      <TenantProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <UnifiedNavigation config={getNavigationConfig()} userRole="admin" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </TenantProvider>
    )
  }
  
  return (
    <TenantProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <UnifiedNavigation config={getNavigationConfig()} userRole="admin" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Link href={`/o/${slug}`}>
                  <Button variant="ghost" size="icon">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    360 Interactive Experiences
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Explore interactive web applications and tools
                  </p>
                </div>
              </div>
              <OrganizationLogo 
                organizationSlug={slug} 
                size="lg" 
                className="h-12 w-12"
              />
            </div>
          </motion.div>
          
          {/* Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            {embeds.length === 0 ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No interactive experiences available yet.
                  </p>
                </div>
              </div>
            ) : (
              <EmbedCarousel embeds={embeds} autoPlay={false} />
            )}
          </motion.div>
          
          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              About 360 Experiences
            </h2>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              This carousel showcases interactive web applications and tools. Use the arrow keys or 
              navigation buttons to explore different experiences. Press spacebar to pause/play 
              auto-navigation.
            </p>
          </motion.div>
        </div>
      </div>
    </TenantProvider>
  )
}


