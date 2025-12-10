'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmbedItem } from '@/lib/360/embed-config'
import { EmbedCard } from './EmbedCard'
import { cn } from '@/lib/utils'

interface EmbedCarouselProps {
  embeds: EmbedItem[]
  autoPlay?: boolean
  autoPlayInterval?: number
}

export function EmbedCarousel({ 
  embeds, 
  autoPlay = false, 
  autoPlayInterval = 10000 
}: EmbedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(!autoPlay)
  
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % embeds.length)
  }, [embeds.length])
  
  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + embeds.length) % embeds.length)
  }, [embeds.length])
  
  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsPaused(true) // Pause when manually navigating
  }
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide()
        setIsPaused(true)
      } else if (e.key === 'ArrowRight') {
        nextSlide()
        setIsPaused(true)
      } else if (e.key === ' ') {
        e.preventDefault()
        setIsPaused((prev) => !prev)
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [nextSlide, prevSlide])
  
  // Auto-play
  useEffect(() => {
    if (!isPaused && autoPlay && embeds.length > 1) {
      const interval = setInterval(nextSlide, autoPlayInterval)
      return () => clearInterval(interval)
    }
  }, [isPaused, autoPlay, autoPlayInterval, nextSlide, embeds.length])
  
  if (embeds.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">
          No embeds available
        </p>
      </div>
    )
  }
  
  return (
    <div className="relative w-full h-full min-h-[600px]">
      {/* Main Carousel */}
      <div className="relative w-full h-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <EmbedCard 
              embed={embeds[currentIndex]} 
              isActive={true}
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation Arrows */}
        {embeds.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm z-20"
              aria-label="Previous embed"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm z-20"
              aria-label="Next embed"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}
      </div>
      
      {/* Dots Indicator */}
      {embeds.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {embeds.map((embed, index) => (
            <button
              key={embed.id}
              onClick={() => goToSlide(index)}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                index === currentIndex
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/50 hover:bg-white/75'
              )}
              aria-label={`Go to ${embed.title}`}
            />
          ))}
        </div>
      )}
      
      {/* Embed Info Overlay */}
      <div className="absolute top-4 left-4 right-4 z-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/60 backdrop-blur-sm rounded-lg p-4 text-white max-w-2xl"
        >
          <h3 className="text-xl font-bold mb-1">
            {embeds[currentIndex].title}
          </h3>
          {embeds[currentIndex].description && (
            <p className="text-sm text-white/80">
              {embeds[currentIndex].description}
            </p>
          )}
          <div className="mt-2 text-xs text-white/60">
            {currentIndex + 1} of {embeds.length}
          </div>
        </motion.div>
      </div>
      
      {/* Keyboard Hint */}
      <div className="absolute bottom-4 right-4 z-20 bg-black/60 backdrop-blur-sm rounded-lg p-2 text-white text-xs">
        <div>← → Navigate</div>
        <div>Space Pause/Play</div>
      </div>
    </div>
  )
}


