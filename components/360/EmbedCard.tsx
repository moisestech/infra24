'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { EmbedItem, getAspectRatioClass } from '@/lib/360/embed-config'
import { Loader2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmbedCardProps {
  embed: EmbedItem
  isActive: boolean
  onLoad?: () => void
  onError?: () => void
}

export function EmbedCard({ embed, isActive, onLoad, onError }: EmbedCardProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  
  const handleLoad = () => {
    setLoading(false)
    onLoad?.()
  }
  
  const handleError = () => {
    setLoading(false)
    setError(true)
    onError?.()
  }
  
  return (
    <div className={cn(
      'relative w-full h-full flex items-center justify-center',
      getAspectRatioClass(embed.aspectRatio)
    )}>
      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 z-10">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Loading {embed.title}...
            </p>
          </div>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 z-10">
          <div className="text-center p-6">
            <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Failed to load {embed.title}
            </p>
            <a
              href={embed.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Open in new tab
            </a>
          </div>
        </div>
      )}
      
      {/* Iframe */}
      {!error && (
        <motion.iframe
          src={embed.url}
          title={embed.title}
          className={cn(
            'w-full h-full border-0 rounded-lg',
            loading && 'opacity-0',
            !loading && 'opacity-100'
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: loading ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          onLoad={handleLoad}
          onError={handleError}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      )}
    </div>
  )
}


