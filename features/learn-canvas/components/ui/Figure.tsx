'use client'

import { cn } from '@/shared/lib/utils'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { ExternalLink, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface FigureProps {
  imgSrc: string
  caption: string
  credit?: string
  alt?: string
  aspectRatio?: '16:9' | '4:3' | '1:1' | 'auto' | 'vertical'
  className?: string
  priority?: boolean
  showCredit?: boolean
  layout?: 'default' | 'side-by-side'
}

export function Figure({ 
  imgSrc, 
  caption, 
  credit, 
  alt,
  aspectRatio = '16:9',
  className,
  priority = false,
  showCredit = true,
  layout = 'default'
}: FigureProps) {
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case '16:9': return 'aspect-video'
      case '4:3': return 'aspect-[4/3]'
      case '1:1': return 'aspect-square'
      case 'auto': return 'aspect-auto'
      case 'vertical': return 'aspect-[3/4]'
      default: return 'aspect-video'
    }
  }

  const isSvg = imgSrc.endsWith('.svg')

  if (layout === 'side-by-side') {
    return (
      <Card className={cn("bg-black/50 border-[#00ff00]/20 overflow-hidden my-6", className)}>
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            {/* Image Container - Side */}
            <div className="md:w-1/2">
              <div className={cn("relative overflow-hidden", getAspectRatioClass())}>
                {isSvg ? (
                  <img 
                    src={imgSrc} 
                    alt={alt || caption}
                    className="w-full h-full object-cover"
                    loading={priority ? 'eager' : 'lazy'}
                  />
                ) : (
                  <Image
                    src={imgSrc}
                    alt={alt || caption}
                    fill
                    className="object-cover"
                    priority={priority}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                )}
                
                {/* Image Type Badge */}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-[#00ff00]/20 text-[#00ff00] border border-[#00ff00]/30">
                    <ImageIcon className="w-3 h-3 mr-1" />
                    {isSvg ? 'Diagram' : 'Image'}
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Caption and Credit - Side */}
            <div className="md:w-1/2 p-4 flex flex-col justify-center">
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                {caption}
              </p>
              {showCredit && credit && (
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>Credit:</span>
                  {credit.includes('http') ? (
                    <a 
                      href={credit} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#00ff00] hover:text-[#00ff00]/80 transition-colors flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View Source
                    </a>
                  ) : (
                    <span className="text-[#00ff00]">{credit}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("bg-black/50 border-[#00ff00]/20 overflow-hidden my-6", className)}>
      <CardContent className="p-0">
        <div className="relative">
          {/* Image Container */}
          <div className={cn("relative overflow-hidden", getAspectRatioClass())}>
            {isSvg ? (
              <img 
                src={imgSrc} 
                alt={alt || caption}
                className="w-full h-full object-cover"
                loading={priority ? 'eager' : 'lazy'}
              />
            ) : (
              <Image
                src={imgSrc}
                alt={alt || caption}
                fill
                className="object-cover"
                priority={priority}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              />
            )}
            
            {/* Image Type Badge */}
            <div className="absolute top-4 left-4">
              <Badge className="bg-[#00ff00]/20 text-[#00ff00] border border-[#00ff00]/30">
                <ImageIcon className="w-3 h-3 mr-1" />
                {isSvg ? 'Diagram' : 'Image'}
              </Badge>
            </div>
          </div>
          
          {/* Caption and Credit */}
          <div className="p-4 bg-gradient-to-t from-black/90 to-transparent">
            <p className="text-gray-300 text-sm leading-relaxed mb-2">
              {caption}
            </p>
            {showCredit && credit && (
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>Credit:</span>
                {credit.includes('http') ? (
                  <a 
                    href={credit} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#00ff00] hover:text-[#00ff00]/80 transition-colors flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View Source
                  </a>
                ) : (
                  <span className="text-[#00ff00]">{credit}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Development placeholder that shows the planned image specs
export function DevFigure({ 
  imgSrc, 
  caption, 
  credit, 
  alt,
  aspectRatio = '16:9',
  className,
  priority = false,
  showCredit = true,
  layout = 'default'
}: FigureProps) {
  // In development, show the placeholder with specs
  if (process.env.NODE_ENV === 'development') {
    return (
      <Card className={cn("bg-black/50 border-dashed border-2 border-[#00ff00]/30 overflow-hidden my-6", className)}>
        <CardContent className="p-0">
          <div className={cn("relative bg-gradient-to-br from-[#00ff00]/10 to-black/50 flex items-center justify-center", getAspectRatioClass())}>
            <div className="text-center p-8 max-w-2xl">
              <div className="text-6xl mb-4 opacity-60">🖼️</div>
              <div className="bg-[#00ff00]/20 text-[#00ff00] px-3 py-1 rounded-full text-sm font-mono mb-4 inline-block">
                🚧 DEV FIGURE
              </div>
              <h3 className="text-lg font-semibold text-[#00ff00] mb-3">
                Production Image - {aspectRatio}
              </h3>
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                {caption}
              </p>
              <div className="bg-black/50 border border-[#00ff00]/20 rounded-lg p-4 text-left space-y-2">
                <div className="text-xs text-[#00ff00] font-mono">FILE PATH:</div>
                <div className="text-xs text-gray-400 font-mono">{imgSrc}</div>
                {credit && (
                  <>
                    <div className="text-xs text-[#00ff00] font-mono">CREDIT:</div>
                    <div className="text-xs text-gray-400">{credit}</div>
                  </>
                )}
                {alt && (
                  <>
                    <div className="text-xs text-[#00ff00] font-mono">ALT TEXT:</div>
                    <div className="text-xs text-gray-400">{alt}</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // In production, render the actual Figure component
  return (
    <Figure 
      imgSrc={imgSrc}
      caption={caption}
      credit={credit}
      alt={alt}
      aspectRatio={aspectRatio}
      className={className}
      priority={priority}
      showCredit={showCredit}
      layout={layout}
    />
  )
}

function getAspectRatioClass() {
  return 'aspect-video' // Default to 16:9
}
