'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeftRight, Image } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface BeforeAfterSliderProps {
  beforeImg: string
  afterImg: string
  beforeLabel?: string
  afterLabel?: string
  className?: string
}

export function BeforeAfterSlider({
  beforeImg,
  afterImg,
  beforeLabel = "Original",
  afterLabel = "AI Enhanced",
  className
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = (x / rect.width) * 100
    setSliderPosition(Math.max(0, Math.min(100, percentage)))
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const touch = e.touches[0]
    const x = touch.clientX - rect.left
    const percentage = (x / rect.width) * 100
    setSliderPosition(Math.max(0, Math.min(100, percentage)))
  }

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener('mouseup', handleGlobalMouseUp)
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn("space-y-4", className)}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-lime-500/20 rounded-lg flex items-center justify-center">
          <Image className="w-4 h-4 text-lime-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">Before & After Comparison</h3>
      </div>
      
      {/* Slider Container */}
      <div
        ref={containerRef}
        className="relative w-full aspect-video rounded-lg overflow-hidden bg-black border border-white/10 cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        {/* Before Image (Background) */}
        <div className="absolute inset-0">
          <img
            src={beforeImg}
            alt="Before"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* After Image (Clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img
            src={afterImg}
            alt="After"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Slider Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
              <ArrowLeftRight className="w-4 h-4 text-gray-800" />
            </div>
          </div>
        </div>
        
        {/* Labels */}
        <div className="absolute top-4 left-4">
          <div className="px-3 py-1 bg-black/50 rounded text-sm text-white font-medium">
            {beforeLabel}
          </div>
        </div>
        
        <div className="absolute top-4 right-4">
          <div className="px-3 py-1 bg-black/50 rounded text-sm text-white font-medium">
            {afterLabel}
          </div>
        </div>
        
        {/* Instructions */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="px-4 py-2 bg-black/50 rounded text-sm text-white text-center">
            Drag to compare • {Math.round(sliderPosition)}% enhanced
          </div>
        </div>
      </div>
      
      {/* Comparison Info */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="text-center">
          <div className="font-medium text-gray-300">{beforeLabel}</div>
          <div className="text-gray-500">Original image</div>
        </div>
        <div className="text-center">
          <div className="font-medium text-lime-400">{afterLabel}</div>
          <div className="text-gray-500">AI enhanced version</div>
        </div>
      </div>
    </motion.div>
  )
} 