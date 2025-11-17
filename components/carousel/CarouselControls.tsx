'use client';

import { motion } from "framer-motion";
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CarouselControlsProps {
  onPrevious: () => void;
  onNext: () => void;
  onTogglePlayPause: () => void;
  isPaused: boolean;
  currentIndex: number;
  totalItems: number;
  currentAnnouncementDuration?: number;
  onDurationChange?: (duration: number) => void;
  timeRemaining?: number | null;
}

export function CarouselControls({ 
  onPrevious, 
  onNext, 
  onTogglePlayPause, 
  isPaused, 
  currentIndex, 
  totalItems,
  currentAnnouncementDuration = 5000,
  onDurationChange,
  timeRemaining
}: CarouselControlsProps) {
  const [showDurationControls, setShowDurationControls] = useState(false);
  const [tempDuration, setTempDuration] = useState(currentAnnouncementDuration);

  const formatTime = (ms: number) => {
    const seconds = Math.ceil(ms / 1000);
    return `${seconds}s`;
  };

  const handleDurationChange = (newDuration: number) => {
    setTempDuration(newDuration);
    if (onDurationChange) {
      onDurationChange(newDuration);
    }
  };

  return (
    <>
      {/* Progress indicator */}
      <div className="fixed top-4 left-4 z-40 flex items-center gap-2">
        {Array.from({ length: totalItems }).map((_, idx) => (
          <motion.div
            key={idx}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentIndex === idx ? "w-8 bg-white" : "w-2 bg-white/50"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        ))}
      </div>

      {/* Countdown Timer */}
      {timeRemaining !== null && timeRemaining !== undefined && !isPaused && (
        <div className="fixed top-4 right-4 z-40 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg" style={{ zIndex: 40 }}>
          <Clock className="w-4 h-4 text-white" />
          <span className="text-white text-sm font-mono">
            {formatTime(timeRemaining)}
          </span>
        </div>
      )}

      {/* Carousel Controls - Bottom right: Navigation arrows, Duration, and Play/Pause */}
      <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3">
        {/* Navigation buttons - Side by side */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevious}
            className="p-4 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all shadow-lg"
            style={{ zIndex: 50 }}
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={onNext}
            className="p-4 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all shadow-lg"
            style={{ zIndex: 50 }}
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Duration Control Button - Same size as other buttons */}
        {onDurationChange && (
          <div className="relative">
            <button
              onClick={() => setShowDurationControls(!showDurationControls)}
              className="p-4 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all shadow-lg flex items-center gap-2"
              title="Adjust duration"
              style={{ zIndex: 50 }}
            >
              <Clock className="w-6 h-6 text-white" />
              <span className="text-white text-sm font-medium">
                {formatTime(currentAnnouncementDuration)}
              </span>
            </button>

            {/* Duration Control Panel */}
            {showDurationControls && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-full right-0 mb-2 bg-black/95 backdrop-blur-sm rounded-lg p-4 min-w-[200px] border border-white/30 shadow-2xl"
                style={{ zIndex: 50 }}
              >
                <div className="text-white text-xs font-medium mb-3">Display Duration</div>
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="range"
                    min="2000"
                    max="30000"
                    step="1000"
                    value={tempDuration}
                    onChange={(e) => handleDurationChange(Number(e.target.value))}
                    className="flex-1"
                  />
                  <input
                    type="number"
                    min="2000"
                    max="30000"
                    step="1000"
                    value={tempDuration}
                    onChange={(e) => handleDurationChange(Number(e.target.value))}
                    className="w-20 px-2 py-1 bg-white/10 rounded text-white text-sm font-mono text-right"
                  />
                  <span className="text-white text-xs">ms</span>
                </div>
                <div className="text-white/70 text-xs text-center">
                  {formatTime(tempDuration)} per slide
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleDurationChange(3000)}
                    className="flex-1 px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-white text-xs transition-colors"
                  >
                    3s
                  </button>
                  <button
                    onClick={() => handleDurationChange(5000)}
                    className="flex-1 px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-white text-xs transition-colors"
                  >
                    5s
                  </button>
                  <button
                    onClick={() => handleDurationChange(10000)}
                    className="flex-1 px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-white text-xs transition-colors"
                  >
                    10s
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Play/Pause button */}
        <button
          onClick={onTogglePlayPause}
          className={cn(
            "p-4 rounded-full backdrop-blur-sm transition-all flex items-center justify-center border-2 shadow-2xl",
            isPaused 
              ? "bg-green-500/90 hover:bg-green-500 border-green-400 text-white" 
              : "bg-orange-500/90 hover:bg-orange-500 border-orange-400 text-white"
          )}
          title={isPaused ? "Resume carousel" : "Pause carousel"}
          style={{ 
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            zIndex: 50
          }}
        >
          {isPaused ? (
            <Play className="w-6 h-6 text-white" />
          ) : (
            <Pause className="w-6 h-6 text-white" />
          )}
        </button>
      </div>
    </>
  );
}
