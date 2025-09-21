'use client'

import { OrganizationLogo } from '@/components/ui/OrganizationLogo'
import { OrganizationBanner } from './OrganizationBanner'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

interface SurveyNavigationProps {
  organization: {
    id: string
    name: string
    slug: string
  }
  survey: {
    id: string
    title: string
    description: string
  }
  className?: string
}

export function SurveyNavigation({ organization, survey, className }: SurveyNavigationProps) {
  const router = useRouter()

  const handleBackClick = () => {
    router.push(`/o/${organization.slug}`)
  }

  return (
    <motion.nav 
      className={`bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 ${className}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackClick}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <OrganizationLogo 
              organizationSlug={organization.slug} 
              variant="horizontal" 
              size="md" 
            />
            
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                {survey.title}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="hidden md:block text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Digital Lab Survey
              </p>
            </div>
            
            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

interface SurveyHeaderProps {
  organization: {
    id: string
    name: string
    slug: string
  }
  survey: {
    id: string
    title: string
    description: string
    category: string
  }
  className?: string
}

export function SurveyHeader({ organization, survey, className }: SurveyHeaderProps) {
  return (
    <motion.div 
      className={`space-y-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {/* Organization Banner */}
      <OrganizationBanner organization={organization} />
      
      {/* Digital Lab Section with Gradient */}
      <motion.div 
        className="relative overflow-hidden rounded-2xl p-8 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {/* Gradient Background - Light Mode */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 dark:hidden opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent dark:hidden"></div>
        
        {/* Gradient Background - Dark Mode */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800 hidden dark:block opacity-90"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent hidden dark:block"></div>
        
        {/* Animated Background Pattern - Light Mode */}
        <div className="absolute inset-0 opacity-20 dark:hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-lg animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/20 rounded-full blur-md animate-pulse delay-500"></div>
        </div>
        
        {/* Animated Background Pattern - Dark Mode */}
        <div className="absolute inset-0 opacity-15 hidden dark:block">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-lg animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/10 rounded-full blur-md animate-pulse delay-500"></div>
        </div>
        
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center justify-center mb-4"
          >
            <div className="p-3 bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </motion.div>
          
          <motion.h2 
            className="text-2xl font-bold text-white mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Digital Lab Initiative
          </motion.h2>
          
          <motion.p 
            className="text-white/90 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            Help us shape the future of digital innovation at {organization.name}. 
            Your feedback will directly influence our new Digital Lab program.
          </motion.p>
        </div>
      </motion.div>
      
      <div className="space-y-4 text-center">
        <motion.h1 
          className="text-3xl font-bold text-gray-900 dark:text-white"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {survey.title}
        </motion.h1>
        
        <motion.p 
          className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          {survey.description}
        </motion.p>
      </div>
      
      <motion.div 
        className="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
      >
        <span className="flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          ~5 minutes
        </span>
        <span className="flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Anonymous
        </span>
        <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-xs font-medium">
          {survey.category.replace('_', ' ')}
        </span>
      </motion.div>
    </motion.div>
  )
}
