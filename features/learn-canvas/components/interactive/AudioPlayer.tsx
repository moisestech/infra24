'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Download,
  Share2
} from 'lucide-react'

interface AudioPlayerProps {
  src: string
  title?: string
  description?: string
  autoplay?: boolean
  showWaveform?: boolean
  showDownload?: boolean
  showShare?: boolean
  className?: string
}

export function AudioPlayer({
  src,
  title = 'Audio Content',
  description,
  autoplay = false,
  showWaveform = true,
  showDownload = true,
  showShare = true,
  className = ''
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Format time helper
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // Handle play/pause
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
    }
  }

  // Handle seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  // Handle mute toggle
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  // Handle skip
  const skip = (direction: 'forward' | 'backward') => {
    if (audioRef.current) {
      const skipTime = direction === 'forward' ? 10 : -10
      audioRef.current.currentTime += skipTime
    }
  }

  // Handle download
  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = src
    link.download = title || 'audio'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Handle share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description || 'Check out this audio content',
          url: window.location.href
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        // You could add a toast notification here
      } catch (err) {
        console.error('Failed to copy link')
      }
    }
  }

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      setIsLoading(false)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handlePlay = () => {
      setIsPlaying(true)
    }

    const handlePause = () => {
      setIsPlaying(false)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    const handleError = () => {
      setError('Failed to load audio')
      setIsLoading(false)
    }

    // Add event listeners
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)

    // Set initial volume
    audio.volume = volume

    // Autoplay if requested
    if (autoplay) {
      audio.play().catch(() => {
        // Autoplay blocked by browser
        setIsLoading(false)
      })
    }

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
    }
  }, [autoplay, volume])

  return (
    <div className={`bg-gray-900 rounded-xl border border-gray-700 p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {description && (
            <p className="text-sm text-gray-400 mt-1">{description}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {showDownload && (
            <button
              onClick={handleDownload}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
          {showShare && (
            <button
              onClick={handleShare}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Audio Element */}
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Error State */}
      {error && (
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-3 mb-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && !error && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-400"></div>
        </div>
      )}

      {/* Player Controls */}
      {!isLoading && !error && (
        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #84cc16 0%, #84cc16 ${(currentTime / (duration || 1)) * 100}%, #374151 ${(currentTime / (duration || 1)) * 100}%, #374151 100%)`
              }}
            />
          </div>

          {/* Main Controls */}
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => skip('backward')}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Skip backward 10s"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            
            <button
              onClick={togglePlay}
              className="p-3 bg-lime-500 hover:bg-lime-600 text-black rounded-full transition-colors"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-1" />
              )}
            </button>
            
            <button
              onClick={() => skip('forward')}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Skip forward 10s"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Volume Controls */}
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleMute}
              className="p-1 text-gray-400 hover:text-white transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #84cc16 0%, #84cc16 ${(isMuted ? 0 : volume) * 100}%, #374151 ${(isMuted ? 0 : volume) * 100}%, #374151 100%)`
              }}
            />
          </div>
        </div>
      )}

      {/* Custom Slider Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #84cc16;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #84cc16;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  )
} 