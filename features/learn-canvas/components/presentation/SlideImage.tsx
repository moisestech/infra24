'use client'

import { cn } from '@/lib/utils'
import { DevPlaceholder, getAssetRequirements } from './DevPlaceholder'

interface SlideImageProps {
  src?: string
  alt: string
  className?: string
  fallbackEmoji?: string
  fallbackTitle?: string
  assetKey?: keyof typeof import('./DevPlaceholder').AI_VIDEO_ASSETS
}

export function SlideImage({ 
  src, 
  alt, 
  className, 
  fallbackEmoji = '🎬',
  fallbackTitle = 'AI Video Workshop',
  assetKey
}: SlideImageProps) {
  // If we have an asset key, use DevPlaceholder in development mode
  if (assetKey && process.env.NODE_ENV === 'development') {
    const requirements = getAssetRequirements(assetKey)
    return (
      <DevPlaceholder
        placeholderPrompt={requirements.placeholderPrompt}
        realImageNeeded={requirements.realImageNeeded}
        keyFigures={requirements.keyFigures}
        priority={requirements.priority}
        currentImage={src}
        alt={alt}
        className={cn("w-full h-64 md:h-80", className)}
      />
    )
  }

  if (src && src.startsWith('/img/')) {
    // For now, show placeholder for all images
    return (
      <div className={cn(
        "w-full h-64 md:h-80 bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-lg flex flex-col items-center justify-center",
        className
      )}>
        <div className="text-6xl mb-4">{fallbackEmoji}</div>
        <h3 className="text-xl font-semibold text-[#00ff00] mb-2">{fallbackTitle}</h3>
        <p className="text-sm text-gray-400 text-center px-4">{alt}</p>
      </div>
    )
  }

  // If no src or external image, show placeholder
  return (
    <div className={cn(
      "w-full h-64 md:h-80 bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-lg flex flex-col items-center justify-center",
      className
    )}>
      <div className="text-6xl mb-4">{fallbackEmoji}</div>
      <h3 className="text-xl font-semibold text-[#00ff00] mb-2">{fallbackTitle}</h3>
      <p className="text-sm text-gray-400 text-center px-4">{alt}</p>
    </div>
  )
}
