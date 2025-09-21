'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { OrganizationLogo } from '@/components/ui/OrganizationLogo'

interface OrganizationBannerProps {
  organization: {
    id: string
    name: string
    slug: string
    banner_image?: string
  }
  className?: string
}

export function OrganizationBanner({ organization, className }: OrganizationBannerProps) {
  const getBannerImage = () => {
    // Return organization-specific banner images
    switch (organization.slug) {
      case 'oolite':
        return 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1758247127/smart-sign/orgs/oolite/oolite-digital-arts-program_ai-sketch_mqtbm9.png'
      case 'bakehouse':
        return 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
      case 'locust':
        return 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
      default:
        return organization.banner_image || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    }
  }

  const getGradientOverlay = () => {
    // Organization-specific gradient overlays
    switch (organization.slug) {
      case 'oolite':
        return 'bg-gradient-to-br from-purple-600/80 via-blue-600/80 to-indigo-700/80'
      case 'bakehouse':
        return 'bg-gradient-to-br from-orange-600/80 via-red-600/80 to-pink-700/80'
      case 'locust':
        return 'bg-gradient-to-br from-green-600/80 via-teal-600/80 to-cyan-700/80'
      default:
        return 'bg-gradient-to-br from-gray-600/80 via-slate-600/80 to-zinc-700/80'
    }
  }

  const getAccentColor = () => {
    // Organization-specific accent colors
    switch (organization.slug) {
      case 'oolite':
        return 'from-purple-500 to-blue-500'
      case 'bakehouse':
        return 'from-orange-500 to-red-500'
      case 'locust':
        return 'from-green-500 to-teal-500'
      default:
        return 'from-gray-500 to-slate-500'
    }
  }

  return (
    <motion.div 
      className={`relative h-48 md:h-64 overflow-hidden rounded-2xl ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${getBannerImage()})`
        }}
      />
      
      {/* Gradient Overlay */}
      <div className={`absolute inset-0 ${getGradientOverlay()}`} />
      
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-lg animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/20 rounded-full blur-md animate-pulse delay-500" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-between p-6 md:p-8">
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {organization.name}
            </h1>
            <p className="text-white/90 text-sm md:text-base">
              Digital Innovation & Creative Community
            </p>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="hidden md:block"
        >
          <div className="relative">
            <OrganizationLogo 
              organizationSlug={organization.slug}
              size="lg"
              className="h-16 w-16 4xl:h-20 4xl:w-20"
            />
            {/* Accent ring */}
            <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${getAccentColor()} opacity-20 blur-sm`} />
          </div>
        </motion.div>
      </div>
      
      {/* Bottom accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${getAccentColor()}`}
      />
    </motion.div>
  )
}
