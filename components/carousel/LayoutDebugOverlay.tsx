'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutDebugOverlayProps {
  imageLayout?: string | null;
  hasImage: boolean;
  organizationSlug?: string;
  className?: string;
  disabled?: boolean;
}

export function LayoutDebugOverlay({ 
  imageLayout, 
  hasImage, 
  organizationSlug,
  className,
  disabled = false
}: LayoutDebugOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  // Check for debug mode via URL parameter or localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const debugMode = urlParams.get('debug') === 'true' || localStorage.getItem('layoutDebug') === 'true';
    setIsVisible(debugMode);
    setShowOverlay(debugMode);
  }, []);

  const toggleVisibility = () => {
    const newVisibility = !isVisible;
    setIsVisible(newVisibility);
    localStorage.setItem('layoutDebug', newVisibility.toString());
  };

  const toggleOverlay = () => {
    setShowOverlay(!showOverlay);
  };

  if (disabled) {
    return null;
  }

  if (!isVisible) {
    return (
      <motion.button
        onClick={toggleVisibility}
        className={cn(
          "fixed top-20 left-4 z-50 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full p-3 border border-white/20 transition-colors",
          className
        )}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        title="Enable Layout Debug Overlay"
      >
        <Eye className="w-5 h-5 text-white" />
      </motion.button>
    );
  }

  return (
    <>
      {/* Debug Controls */}
      <motion.div
        className="fixed top-20 left-4 z-50 bg-black/90 backdrop-blur-sm rounded-lg border border-white/20 shadow-lg p-3"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="text-white text-xs font-medium">Layout Debug</div>
          <motion.button
            onClick={toggleOverlay}
            className={cn(
              "p-1 rounded transition-colors",
              showOverlay 
                ? "bg-transparent border-transparent hover:bg-white/5" 
                : "bg-gray-500/80 hover:bg-gray-500"
            )}
            title={showOverlay ? "Hide overlay" : "Show overlay"}
          >
            {showOverlay ? (
              <Eye className="w-3 h-3 text-white" />
            ) : (
              <EyeOff className="w-3 h-3 text-white" />
            )}
          </motion.button>
          <motion.button
            onClick={toggleVisibility}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            title="Close"
          >
            <X className="w-3 h-3 text-white/70" />
          </motion.button>
        </div>
        <div className="text-white/70 text-xs space-y-1">
          <div>Image: {hasImage ? '✓' : '✗'}</div>
          <div>Layout: {imageLayout || 'none'}</div>
        </div>
      </motion.div>

      {/* Visual Overlay */}
      {showOverlay && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {hasImage && imageLayout && (
            <>
              {/* Split Left Layout Overlay */}
              {imageLayout === 'split-left' && (
                <>
                  <div className="absolute left-0 top-0 bottom-0 w-[40%] border-4 border-red-500/50 bg-red-500/10">
                    <div className="absolute top-2 left-2 bg-red-500/90 text-white px-2 py-1 text-xs font-bold rounded">
                      IMAGE AREA (40%)
                    </div>
                  </div>
                  <div className="absolute right-0 top-0 bottom-0 w-[60%] border-4 border-blue-500/50 bg-blue-500/10">
                    <div className="absolute top-2 right-2 bg-blue-500/90 text-white px-2 py-1 text-xs font-bold rounded">
                      CONTENT AREA (60%)
                    </div>
                  </div>
                </>
              )}

              {/* Split Right Layout Overlay */}
              {imageLayout === 'split-right' && (
                <>
                  <div className="absolute left-0 top-0 bottom-0 w-[60%] border-4 border-blue-500/50 bg-blue-500/10">
                    <div className="absolute top-2 left-2 bg-blue-500/90 text-white px-2 py-1 text-xs font-bold rounded">
                      CONTENT AREA (60%)
                    </div>
                  </div>
                  <div className="absolute right-0 top-0 bottom-0 w-[40%] border-4 border-red-500/50 bg-red-500/10">
                    <div className="absolute top-2 right-2 bg-red-500/90 text-white px-2 py-1 text-xs font-bold rounded">
                      IMAGE AREA (40%)
                    </div>
                  </div>
                </>
              )}

              {/* Card Layout Overlay */}
              {imageLayout === 'card' && (
                <>
                  <div className="absolute inset-0 border-4 border-green-500/50 bg-green-500/10">
                    <div className="absolute top-2 left-2 bg-green-500/90 text-white px-2 py-1 text-xs font-bold rounded">
                      CARD LAYOUT - Image card with content flowing around
                    </div>
                  </div>
                  {/* Show approximate image card area */}
                  <div className="absolute left-12 top-12 border-2 border-yellow-400/70 bg-yellow-400/20 rounded-lg"
                    style={{
                      width: '256px',
                      height: '320px'
                    }}>
                    <div className="absolute top-1 left-1 bg-yellow-400/90 text-black px-2 py-1 text-xs font-bold rounded">
                      IMAGE CARD AREA
                    </div>
                  </div>
                  {/* Show content area */}
                  <div className="absolute left-80 top-12 right-12 bottom-12 border-2 border-blue-400/70 bg-blue-400/20 rounded-lg">
                    <div className="absolute top-1 left-1 bg-blue-400/90 text-white px-2 py-1 text-xs font-bold rounded">
                      CONTENT AREA (text should appear here)
                    </div>
                  </div>
                </>
              )}

              {/* Hero Layout Overlay */}
              {imageLayout === 'hero' && (
                <div className="absolute inset-0 border-4 border-purple-500/50 bg-purple-500/10">
                  <div className="absolute top-2 left-2 bg-purple-500/90 text-white px-2 py-1 text-xs font-bold rounded">
                    HERO LAYOUT - Image background with content overlay
                  </div>
                </div>
              )}

              {/* Other layouts */}
              {!['split-left', 'split-right', 'card', 'hero'].includes(imageLayout) && (
                <div className="absolute inset-0 border-4 border-yellow-500/50 bg-yellow-500/10">
                  <div className="absolute top-2 left-2 bg-yellow-500/90 text-white px-2 py-1 text-xs font-bold rounded">
                    LAYOUT: {imageLayout}
                  </div>
                </div>
              )}
            </>
          )}

          {/* No image overlay */}
          {!hasImage && (
            <div className="absolute inset-0 border-4 border-gray-500/50 bg-gray-500/10">
              <div className="absolute top-2 left-2 bg-gray-500/90 text-white px-2 py-1 text-xs font-bold rounded">
                NO IMAGE - Full content area
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

