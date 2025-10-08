'use client'

import { useState } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface VideoEmbedProps {
  src: string
  caption?: string
  start?: number
  end?: number
  className?: string
  autoPlay?: boolean
  muted?: boolean
}

export function VideoEmbed({ 
  src, 
  caption, 
  start, 
  end, 
  className,
  autoPlay = false,
  muted = true
}: VideoEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(muted)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Handle different video sources
  const getVideoUrl = () => {
    if (src.includes('youtube.com') || src.includes('youtu.be')) {
      const videoId = src.includes('youtu.be') 
        ? src.split('youtu.be/')[1] 
        : src.split('v=')[1]?.split('&')[0]
      
      let url = `https://www.youtube.com/embed/${videoId}?`
      if (start) url += `start=${start}&`
      if (end) url += `end=${end}&`
      if (autoPlay) url += 'autoplay=1&'
      if (isMuted) url += 'mute=1&'
      url += 'rel=0&modestbranding=1'
      
      return url
    }
    
    return src
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleMuteToggle = () => {
    setIsMuted(!isMuted)
  }

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const openExternal = () => {
    window.open(src, '_blank')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn("space-y-4", className)}
    >
      {/* Video Container */}
      <div className="relative group rounded-lg overflow-hidden bg-black border border-white/10">
        {/* Video Player */}
        <div className="relative aspect-video">
          {src.includes('youtube.com') || src.includes('youtu.be') ? (
            <iframe
              src={getVideoUrl()}
              title={caption || "Video content"}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              src={src}
              className="w-full h-full object-cover"
              controls
              autoPlay={autoPlay}
              muted={isMuted}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          )}
          
          {/* Custom Controls Overlay (for non-YouTube videos) */}
          {!src.includes('youtube.com') && !src.includes('youtu.be') && (
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePlayPause}
                    className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  
                  <button
                    onClick={handleMuteToggle}
                    className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleFullscreen}
                    className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                  >
                    <Maximize className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={openExternal}
                    className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Video Info */}
        <div className="absolute top-4 left-4">
          <div className="px-2 py-1 bg-black/50 rounded text-xs text-white">
            {start && end ? `${start}s - ${end}s` : 'Video'}
          </div>
        </div>
      </div>
      
      {/* Caption */}
      {caption && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-gray-400 text-center italic"
        >
          {caption}
        </motion.p>
      )}
    </motion.div>
  )
} 