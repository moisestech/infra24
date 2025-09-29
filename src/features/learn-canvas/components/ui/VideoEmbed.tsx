'use client'

import { useState } from 'react'
import { Play, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface VideoEmbedProps {
  src: string
  title?: string
  poster?: string
  className?: string
  autoplay?: boolean
  controls?: boolean
  loop?: boolean
  muted?: boolean
}

export function VideoEmbed({
  src,
  title,
  poster,
  className = '',
  autoplay = false,
  controls = true,
  loop = false,
  muted = false
}: VideoEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = () => {
    setIsPlaying(true)
  }

  if (isPlaying) {
    return (
      <div className={`relative w-full ${className}`}>
        <video
          className="w-full rounded-lg"
          controls={controls}
          autoPlay={autoplay}
          loop={loop}
          muted={muted}
          poster={poster}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    )
  }

  return (
    <div className={`relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden ${className}`}>
      {poster && (
        <img
          src={poster}
          alt={title || 'Video thumbnail'}
          className="w-full h-full object-cover"
        />
      )}
      
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <Button
          onClick={handlePlay}
          size="lg"
          className="bg-white/20 hover:bg-white/30 text-white border-white/30"
        >
          <Play className="w-6 h-6 mr-2" />
          {title || 'Play Video'}
        </Button>
      </div>
      
      {title && (
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white font-semibold text-lg">{title}</h3>
        </div>
      )}
    </div>
  )
}
