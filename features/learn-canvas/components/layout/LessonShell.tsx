'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, BookOpen, Clock, CheckCircle, Presentation } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
// useLanguage not available

interface LessonShellProps {
  children: React.ReactNode
  title: string
  chapterNumber: number
  totalChapters: number
  estimatedDuration?: number
  onProgress?: (progress: number) => void
  onComplete?: () => void
  onPresentationMode?: () => void
  className?: string
}

export function LessonShell({
  children,
  title,
  chapterNumber,
  totalChapters,
  estimatedDuration,
  onProgress,
  onComplete,
  onPresentationMode,
  className
}: LessonShellProps) {
  // Simple fallback for language support
  const t = (key: string, options?: any) => key
  const [progress, setProgress] = useState(0)
  const [timeSpent, setTimeSpent] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = Math.min((scrollTop / docHeight) * 100, 100)
      
      setProgress(scrollPercent)
      onProgress?.(scrollPercent)
      
      // Mark as complete when scrolled to bottom
      if (scrollPercent >= 95 && !isCompleted) {
        setIsCompleted(true)
        onComplete?.()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [onProgress, onComplete, isCompleted])

  // Track time spent
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(prev => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className={cn("min-h-screen bg-black learn-page", className)}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-black/95 backdrop-blur-sm border-b border-white/10"
      >
        <div className="container mx-auto px-4 py-4">
          {/* First Row: Chapter Info and Title */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#00ff00]" />
                <span className="text-sm text-[#00ff00]">
                  {t('workshop.chapter')} {chapterNumber} {t('workshop.of')} {totalChapters}
                </span>
              </div>
            </div>
            
            {/* Presentation Mode Button */}
            {onPresentationMode && (
              <button
                onClick={onPresentationMode}
                title={t('workshop.presentation_mode')}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border hover:text-accent-foreground h-8 w-8 bg-[#00ff00]/20 border-[#00ff00]/30 text-[#00ff00] hover:bg-[#00ff00]/30"
              >
                <Presentation className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {/* Second Row: Title and Progress Info */}
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-white learn-heading">{title}</h1>
            
            {/* Progress & Time */}
            <div className="flex items-center gap-4">
              {estimatedDuration && (
                <div className="flex items-center gap-1 text-sm text-[#00ff00]">
                  <Clock className="w-4 h-4 text-[#00ff00]" />
                  <span>{formatTime(timeSpent)} / {estimatedDuration}m</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <div className="w-24 bg-white/10 rounded-full h-2">
                  <motion.div
                    className="bg-[#00ff00] h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className="text-sm text-[#00ff00] w-12">
                  {Math.round(progress)}%
                </span>
              </div>
              
              {isCompleted && (
                <div className="flex items-center gap-1 text-[#00ff00]">
                  <CheckCircle className="w-5 h-5 text-[#00ff00]" />
                  <span className="text-sm font-medium">{t('workshop.complete')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto prose prose-invert prose-lg"
        >
          {children}
        </motion.div>
      </div>
      
      {/* Navigation Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="border-t border-white/10 bg-black/95 backdrop-blur-sm"
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <button
              disabled={chapterNumber <= 1}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                chapterNumber > 1
                  ? "text-gray-400 hover:text-white hover:bg-white/10"
                  : "text-gray-600 cursor-not-allowed"
              )}
            >
              <ChevronLeft className="w-4 h-4" />
{t('workshop.previous_chapter')}
            </button>
            
            <div className="text-center">
              <div className="text-sm text-[#00ff00]">
                {t('workshop.chapter')} {chapterNumber} {t('workshop.of')} {totalChapters}
              </div>
              <div className="text-xs text-[#00ff00] mt-1">
                {t('workshop.complete_percentage', { percentage: Math.round(progress) })}
              </div>
            </div>
            
            <button
              disabled={chapterNumber >= totalChapters}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                chapterNumber < totalChapters
                  ? "text-gray-400 hover:text-white hover:bg-white/10"
                  : "text-gray-600 cursor-not-allowed"
              )}
            >
{t('workshop.next_chapter')}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 