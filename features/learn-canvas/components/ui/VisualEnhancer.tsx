'use client'

import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExternalLink as ExternalLinkIcon, Image, Video, FileText, Link as LinkIcon } from 'lucide-react'

// Custom ExternalLink component for research links
interface ExternalLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

export function ExternalLink({ href, children, className }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-1 text-[#00ff00] hover:text-[#00ff00]/80 transition-colors duration-200 underline decoration-[#00ff00]/50 hover:decoration-[#00ff00]",
        className
      )}
    >
      {children}
      <ExternalLinkIcon className="w-3 h-3 text-[#00ff00]" />
    </a>
  )
}

interface VisualEnhancerProps {
  type: 'image' | 'video' | 'link' | 'section' | 'highlight'
  title?: string
  description?: string
  src?: string
  url?: string
  className?: string
  children?: React.ReactNode
}

export function VisualEnhancer({ 
  type, 
  title, 
  description, 
  src, 
  url, 
  className,
  children 
}: VisualEnhancerProps) {
  const getIcon = () => {
    switch (type) {
      case 'image': return <Image className="w-5 h-5" />
      case 'video': return <Video className="w-5 h-5" />
      case 'link': return <LinkIcon className="w-5 h-5" />
      case 'section': return <FileText className="w-5 h-5" />
      case 'highlight': return <div className="w-5 h-5 bg-[#00ff00] rounded-full" />
      default: return null
    }
  }

  const getBadgeColor = () => {
    switch (type) {
      case 'image': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'video': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'link': return 'bg-[#00ff00]/20 text-[#00ff00] border border-[#00ff00]/30'
      case 'section': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      case 'highlight': return 'bg-[#00ff00]/20 text-[#00ff00] border border-[#00ff00]/30'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  if (type === 'image' && src) {
    return (
      <Card className={cn("bg-black/50 border-[#00ff00]/20 overflow-hidden", className)}>
        <CardContent className="p-0">
          <div className="relative">
            <img 
              src={src} 
              alt={title || 'Chapter image'} 
              className="w-full h-64 object-cover"
            />
            <div className="absolute top-4 left-4">
              <Badge className={getBadgeColor()}>
                {getIcon()}
                <span className="ml-1">Image</span>
              </Badge>
            </div>
            {(title || description) && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                {title && <h3 className="text-white font-semibold mb-1">{title}</h3>}
                {description && <p className="text-gray-300 text-sm">{description}</p>}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (type === 'video' && src) {
    return (
      <Card className={cn("bg-black/50 border-[#00ff00]/20 overflow-hidden", className)}>
        <CardContent className="p-0">
          <div className="relative">
            <video 
              src={src} 
              controls
              className="w-full h-64 object-cover"
            />
            <div className="absolute top-4 left-4">
              <Badge className={getBadgeColor()}>
                {getIcon()}
                <span className="ml-1">Video</span>
              </Badge>
            </div>
            {(title || description) && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                {title && <h3 className="text-white font-semibold mb-1">{title}</h3>}
                {description && <p className="text-gray-300 text-sm">{description}</p>}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (type === 'link' && url) {
    return (
      <Card className={cn("bg-black/50 border-[#00ff00]/20 hover:border-[#00ff00]/40 transition-colors", className)}>
        <CardContent className="p-4">
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-[#00ff00] hover:text-[#00ff00]/80 transition-colors"
          >
            <ExternalLinkIcon className="w-5 h-5" />
            <div className="flex-1">
              {title && <h3 className="font-semibold">{title}</h3>}
              {description && <p className="text-gray-400 text-sm">{description}</p>}
            </div>
            <Badge className={getBadgeColor()}>
              {getIcon()}
              <span className="ml-1">Link</span>
            </Badge>
          </a>
        </CardContent>
      </Card>
    )
  }

  if (type === 'section') {
    return (
      <Card className={cn("bg-black/50 border-[#00ff00]/20", className)}>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            {getIcon()}
            {title && <h3 className="text-[#00ff00] font-semibold">{title}</h3>}
          </div>
          {description && <p className="text-gray-300 mb-4">{description}</p>}
          {children}
        </CardContent>
      </Card>
    )
  }

  if (type === 'highlight') {
    return (
      <div className={cn("bg-[#00ff00]/5 border-l-4 border-[#00ff00] p-4 rounded-r-lg", className)}>
        <div className="flex items-start gap-3">
          {getIcon()}
          <div className="flex-1">
            {title && <h3 className="text-[#00ff00] font-semibold mb-2">{title}</h3>}
            {description && <p className="text-gray-300">{description}</p>}
            {children}
          </div>
        </div>
      </div>
    )
  }

  return null
}

// Placeholder component for development mode with production image specs
export function DevPlaceholder({ 
  type = 'hero-image',
  prompt,
  caption,
  aspectRatio = '16:9',
  className,
  imageNumber,
  fileName
}: { 
  type?: 'hero-image' | 'section-image' | 'technical-diagram' | 'video' | 'link'
  prompt: string
  caption: string
  aspectRatio?: string
  className?: string
  imageNumber?: number
  fileName?: string
}) {
  // Always show in development, or if NODE_ENV is not set (local development)
  if (process.env.NODE_ENV === 'production') return null

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case '16:9': return 'aspect-video'
      case '4:3': return 'aspect-[4/3]'
      case '1:1': return 'aspect-square'
      default: return 'aspect-video'
    }
  }

  const getTypeIcon = () => {
    switch (type) {
      case 'hero-image': return '🖼️'
      case 'section-image': return '📸'
      case 'technical-diagram': return '📊'
      case 'video': return '🎥'
      case 'link': return '🔗'
      default: return '🖼️'
    }
  }

  const getTypeLabel = () => {
    switch (type) {
      case 'hero-image': return 'Hero Image'
      case 'section-image': return 'Section Image'
      case 'technical-diagram': return 'Technical Diagram'
      case 'video': return 'Video'
      case 'link': return 'Link'
      default: return 'Image'
    }
  }

  const getStyleBible = () => {
    return "editorial documentary, soft film grain, subtle CRT scanlines, cyan/green HUD micro-graphics, shallow vignette, cohesive neutral palette with neon accents, 35mm equivalent, eye-level, balanced negative space for captions, landscape 16:9, high detail, crisp typography spaces, no text artifacts, no brand logos, no real celebrities, no watermark, no misspelled UI text, no extra fingers/faces"
  }

  return (
    <Card className={cn("bg-black/50 border-dashed border-2 border-[#00ff00]/30 overflow-hidden my-6", className)}>
      <CardContent className="p-0">
        <div className={cn("relative bg-gradient-to-br from-[#00ff00]/10 to-black/50 flex items-center justify-center", getAspectRatioClass())}>
          {/* Placeholder Content */}
          <div className="text-center p-6 max-w-4xl">
            <div className="text-6xl mb-4 opacity-60">{getTypeIcon()}</div>
            <div className="bg-[#00ff00]/20 text-[#00ff00] px-3 py-1 rounded-full text-sm font-mono mb-4 inline-block">
              🚧 DEV PLACEHOLDER
            </div>
            <h3 className="text-lg font-semibold text-[#00ff00] mb-3">
              {getTypeLabel()} - {aspectRatio}
              {imageNumber && <span className="text-sm text-gray-400 ml-2">#{imageNumber}</span>}
            </h3>
            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
              {caption}
            </p>
            
            {/* Production Specs */}
            <div className="bg-black/50 border border-[#00ff00]/20 rounded-lg p-4 text-left space-y-3">
              <div>
                <div className="text-xs text-[#00ff00] font-mono mb-1">FILE NAME:</div>
                <div className="text-xs text-gray-400 font-mono">{fileName || `image_${imageNumber || 'XX'}_${type.replace('-', '_')}_1920x1080.jpg`}</div>
              </div>
              
              <div>
                <div className="text-xs text-[#00ff00] font-mono mb-1">AI PROMPT:</div>
                <div className="text-xs text-gray-400 leading-relaxed mb-2">
                  {prompt}
                </div>
                <div className="text-xs text-gray-500 italic">
                  + {getStyleBible()}
                </div>
              </div>
              
              <div>
                <div className="text-xs text-[#00ff00] font-mono mb-1">ALT TEXT:</div>
                <div className="text-xs text-gray-400">{caption}</div>
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-4 right-4 w-2 h-2 bg-[#00ff00] rounded-full opacity-60"></div>
          <div className="absolute bottom-4 left-4 w-1 h-1 bg-[#00ff00] rounded-full opacity-40"></div>
          <div className="absolute top-1/2 left-4 w-1 h-1 bg-[#00ff00] rounded-full opacity-30"></div>
        </div>
      </CardContent>
    </Card>
  )
}
