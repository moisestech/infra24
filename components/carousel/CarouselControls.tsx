'use client';

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

interface CarouselControlsProps {
  onPrevious: () => void;
  onNext: () => void;
  onTogglePlayPause: () => void;
  isPaused: boolean;
  currentIndex: number;
  totalItems: number;
}

export function CarouselControls({ 
  onPrevious, 
  onNext, 
  onTogglePlayPause, 
  isPaused, 
  currentIndex, 
  totalItems 
}: CarouselControlsProps) {
  
  return (
    <>
      {/* Progress indicator */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-2">
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

      {/* Navigation buttons */}
      <button
        onClick={onPrevious}
        className="absolute left-8 top-1/2 -translate-y-1/2 p-6 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all"
      >
        <ChevronLeft className="w-8 h-8 text-white" />
      </button>

      <button
        onClick={onNext}
        className="absolute right-8 top-1/2 -translate-y-1/2 p-6 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all"
      >
        <ChevronRight className="w-8 h-8 text-white" />
      </button>

      {/* Play/Pause button */}
      <button
        onClick={onTogglePlayPause}
        className="absolute bottom-8 right-8 z-30 p-4 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all flex items-center gap-2"
      >
        {isPaused ? (
          <>
            <Play className="w-6 h-6 text-white" />
            <span className="text-white text-sm font-medium">Play</span>
          </>
        ) : (
          <>
            <Pause className="w-6 h-6 text-white" />
            <span className="text-white text-sm font-medium">Pause</span>
          </>
        )}
      </button>
    </>
  );
}
