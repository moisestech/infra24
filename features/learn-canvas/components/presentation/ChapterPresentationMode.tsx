'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Card, CardContent } from '@/shared/components/ui/card'
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Maximize2, 
  Minimize2,
  Volume2,
  VolumeX,
  ArrowLeft,
  ArrowRight,
  Presentation,
  Eye,
  EyeOff
} from 'lucide-react'
import { useLanguage } from '@/shared/i18n/LanguageProvider'
import { cn } from '@/shared/lib/utils'
import { LanguageSelector } from '@/features/learn-canvas/components/LanguageSelector'
import { SlideImage } from './SlideImage'
import { SlideVideo } from './SlideVideo'
import { ResearchLinks } from './ResearchLinks'
import { KeyFigures } from './KeyFigures'
import { TechnicalDiagrams } from './TechnicalDiagrams'

export interface PresentationSlide {
  id: string
  title: string
  content: string
  type: 'title' | 'content' | 'interactive' | 'break'
  duration?: number // seconds for auto-advance
  image?: string
  video?: string
  assetKey?: string // Key for development placeholder system
  researchLinks?: Array<{
    title: string
    url: string
    type: 'paper' | 'article' | 'video' | 'demo' | 'github'
  }>
  keyFigures?: Array<{
    name: string
    role: string
    contribution: string
    avatar?: string
    organization?: string
    year?: string
  }>
  diagrams?: Array<{
    id: string
    title: string
    description: string
    image?: string
    type: 'architecture' | 'timeline' | 'comparison' | 'workflow'
    content?: string
  }>
  notes?: string
}

interface ChapterPresentationModeProps {
  chapter: any
  slides: PresentationSlide[]
  onExit: () => void
  className?: string
}

export function ChapterPresentationMode({ 
  chapter, 
  slides, 
  onExit, 
  className 
}: ChapterPresentationModeProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const { t, language, setLanguage } = useLanguage()

  const currentSlideData = slides[currentSlide]

  // Get appropriate emoji for each slide
  const getEmojiForSlide = (slideId: string): string => {
    const emojiMap: Record<string, string> = {
      'title': '🎬',
      'learning-objectives': '🎯',
      'journey-begins': '🚀',
      'early-technical-approach': '🧠',
      'expanding-beyond-faces': '🎨',
      'temporal-coherence-challenge': '⏰',
      'text-to-video-breakthrough': '📝',
      'ai-video-mainstream': '🌟',
      'runway-gen2': '🎭',
      'creative-adoption': '🎪',
      'quality-control-revolution': '🎬',
      'technical-evolution': '⚙️',
      'ethical-journey': '⚖️',
      'history-lessons': '📚',
      'key-takeaways': '💡',
      'reflection-questions': '🤔',
      'next-steps': '➡️',
      'platform-comparison': '🛠️',
      'runway-ml': '🎬',
      'prompt-engineering': '✍️',
      'ethical-framework': '🛡️',
      'multi-tool-approach': '🔧',
      'industry-transformation': '🏭',
      'emerging-trends': '🚀',
      'cutscenes-trailers': '🎮',
      'character-animation': '🎭',
      'real-time-generation': '⚡',
      'indie-developer-success': '💡',
      'aaa-studio-integration': '🏢',
      'tools-platforms': '🛠️',
      'future-opportunities': '🔮',
      'practical-exercises': '🎯',
      'action-plan': '📋'
    }
    return emojiMap[slideId] || '🎬'
  }

  // Auto-advance slides
  useEffect(() => {
    if (isPlaying && currentSlideData.duration) {
      intervalRef.current = setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
      }, currentSlideData.duration * 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current)
      }
    }
  }, [isPlaying, currentSlide, currentSlideData.duration, slides.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        setCurrentSlide((prev) => (prev + 1) % slides.length)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onExit()
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault()
        setIsFullscreen(!isFullscreen)
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault()
        setIsPlaying(!isPlaying)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isFullscreen, isPlaying, onExit, slides.length])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div className={cn(
      "fixed inset-0 bg-black text-white z-50 flex flex-col",
      isFullscreen && "bg-black",
      className
    )}>
      {/* Header Controls */}
      <div className="flex items-center justify-between p-4 bg-black/80 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-[#00ff00]/20 text-[#00ff00] border-[#00ff00]/30">
            <Presentation className="w-3 h-3 mr-1" />
            {t('workshop.presentation_mode')}
          </Badge>
          <span className="text-sm text-gray-400">
            {currentSlide + 1} / {slides.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <LanguageSelector 
            buttonSize="px-3 py-2"
            className="bg-black/50 border-gray-600 text-white hover:bg-gray-800"
          />
          <Button
            onClick={() => setShowNotes(!showNotes)}
            variant="outline"
            size="sm"
            className="bg-black/50 border-gray-600 text-white hover:bg-gray-800"
          >
            {showNotes ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
          <Button
            onClick={toggleFullscreen}
            variant="outline"
            size="sm"
            className="bg-black/50 border-gray-600 text-white hover:bg-gray-800"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          <Button
            onClick={onExit}
            variant="outline"
            size="sm"
            className="bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30"
          >
            {t('common.close')}
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Slide Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-6xl"
            >
              {/* Slide Video */}
              {currentSlideData.video && (
                <div className="mb-8 flex justify-center">
                  <SlideVideo
                    src={currentSlideData.video}
                    poster={currentSlideData.image}
                    fallbackEmoji={getEmojiForSlide(currentSlideData.id)}
                    fallbackTitle={currentSlideData.title}
                    className="max-h-96"
                  />
                </div>
              )}

              {/* Slide Image (fallback if no video) */}
              {!currentSlideData.video && currentSlideData.image && (
                <div className="mb-8 flex justify-center">
                  <SlideImage
                    src={currentSlideData.image}
                    alt={currentSlideData.title}
                    fallbackEmoji={getEmojiForSlide(currentSlideData.id)}
                    fallbackTitle={currentSlideData.title}
                    assetKey={currentSlideData.assetKey as any}
                    className="max-h-96"
                  />
                </div>
              )}

              {/* Fallback for slides without images or videos */}
              {!currentSlideData.video && !currentSlideData.image && (
                <div className="mb-8 flex justify-center">
                  <div className="w-32 h-32 bg-[#00ff00]/10 border-2 border-[#00ff00]/30 rounded-lg flex items-center justify-center">
                    <span className="text-6xl">{getEmojiForSlide(currentSlideData.id)}</span>
                  </div>
                </div>
              )}

              {/* Slide Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-6xl font-bold text-center mb-8 text-[#00ff00]"
              >
                {currentSlideData.title}
              </motion.h1>

              {/* Slide Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg md:text-xl text-center text-gray-300 leading-relaxed whitespace-pre-line"
              >
                {currentSlideData.content}
              </motion.div>

              {/* Key Figures */}
              {currentSlideData.keyFigures && currentSlideData.keyFigures.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="mt-8"
                >
                  <KeyFigures figures={currentSlideData.keyFigures} />
                </motion.div>
              )}

              {/* Technical Diagrams */}
              {currentSlideData.diagrams && currentSlideData.diagrams.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="mt-8"
                >
                  <TechnicalDiagrams diagrams={currentSlideData.diagrams} />
                </motion.div>
              )}

              {/* Research Links */}
              {currentSlideData.researchLinks && currentSlideData.researchLinks.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="mt-8"
                >
                  <ResearchLinks links={currentSlideData.researchLinks} />
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Speaker Notes Sidebar */}
        {showNotes && currentSlideData.notes && (
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            className="w-80 bg-gray-900/50 border-l border-gray-800 p-6"
          >
            <h3 className="text-lg font-semibold text-[#00ff00] mb-4">
              {t('workshop.presentation_mode')} Notes
            </h3>
            <div className="text-sm text-gray-300 leading-relaxed">
              {currentSlideData.notes}
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="flex items-center justify-between p-4 bg-black/80 border-t border-gray-800">
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <Button
            onClick={prevSlide}
            variant="outline"
            size="sm"
            className="bg-black/50 border-gray-600 text-white hover:bg-gray-800"
            disabled={currentSlide === 0}
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          <Button
            onClick={togglePlay}
            variant="outline"
            size="sm"
            className="bg-black/50 border-gray-600 text-white hover:bg-gray-800"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button
            onClick={nextSlide}
            variant="outline"
            size="sm"
            className="bg-black/50 border-gray-600 text-white hover:bg-gray-800"
            disabled={currentSlide === slides.length - 1}
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        {/* Slide Navigation Dots */}
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                index === currentSlide 
                  ? "bg-[#00ff00] scale-125" 
                  : "bg-gray-600 hover:bg-gray-500"
              )}
            />
          ))}
        </div>

        {/* Progress Info */}
        <div className="text-sm text-gray-400">
          {Math.round(((currentSlide + 1) / slides.length) * 100)}% {t('common.complete')}
        </div>
      </div>
    </div>
  )
}
