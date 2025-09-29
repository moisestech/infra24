'use client'

import { useState } from 'react'
import MuxPlayer from '@mux/mux-player-react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface SlideVideoProps {
  src?: string
  poster?: string
  className?: string
  fallbackTitle?: string
  fallbackEmoji?: string
}

export function SlideVideo({ 
  src, 
  poster, 
  className, 
  fallbackTitle = 'AI Video Demo',
  fallbackEmoji = '🎬'
}: SlideVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)

  // If no video source, show placeholder
  if (!src || src.includes('your-') || src.includes('placeholder')) {
    return (
      <div className={cn(
        "w-full h-64 md:h-80 bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-lg flex flex-col items-center justify-center relative overflow-hidden",
        className
      )}>
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00ff00]/20 via-transparent to-[#00ff00]/20 animate-pulse"></div>
        </div>
        
        <div className="relative z-10 text-center">
          <div className="text-6xl mb-4 animate-bounce">{fallbackEmoji}</div>
          <h3 className="text-xl font-semibold text-[#00ff00] mb-2">{fallbackTitle}</h3>
          <p className="text-sm text-gray-400 mb-4">Video placeholder</p>
          
          {/* Play button overlay */}
          <div className="flex items-center justify-center gap-4">
            <button className="p-3 bg-[#00ff00]/20 border border-[#00ff00]/30 rounded-full hover:bg-[#00ff00]/30 transition-colors">
              <Play className="w-6 h-6 text-[#00ff00]" />
            </button>
            <span className="text-sm text-gray-400">Click to play demo</span>
          </div>
        </div>
      </div>
    )
  }

  // If we have a real video source, use MuxPlayer
  return (
    <div className={cn("w-full h-64 md:h-80 rounded-lg overflow-hidden", className)}>
      <MuxPlayer
        streamType="on-demand"
        playbackId={src.split('/').pop()?.split('.')[0]} // Extract playback ID from URL
        poster={poster}
        className="w-full h-full"
        muted={isMuted}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onVolumeChange={(e) => setIsMuted((e.target as HTMLVideoElement)?.muted ?? false)}
        style={{
          '--controls-backdrop-color': 'rgba(0, 0, 0, 0.7)',
          '--controls-color': '#00ff00',
        } as React.CSSProperties}
      />
    </div>
  )
}
