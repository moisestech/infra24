'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, RotateCcw, Settings, X, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TextSizeControlsProps {
  onTextSizeChange: (element: string, size: string) => void;
  onIconSizeChange?: (multiplier: number) => void;
  onAvatarSizeChange?: (multiplier: number) => void;
  onShowTagsChange?: (show: boolean) => void;
  onShowPriorityBadgeChange?: (show: boolean) => void;
  onShowVisibilityBadgeChange?: (show: boolean) => void;
  className?: string;
}

export function TextSizeControls({ onTextSizeChange, onIconSizeChange, onAvatarSizeChange, onShowTagsChange, onShowPriorityBadgeChange, onShowVisibilityBadgeChange, className }: TextSizeControlsProps) {
  const [screenDimensions, setScreenDimensions] = useState({ width: 0, height: 0, ratio: 0 });
  const [iconSizeMultiplier, setIconSizeMultiplier] = useState(1);
  const [avatarSizeMultiplier, setAvatarSizeMultiplier] = useState(8);
  const [showTags, setShowTags] = useState(false);
  const [showPriorityBadge, setShowPriorityBadge] = useState(false);
  const [showVisibilityBadge, setShowVisibilityBadge] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Individual text size controls for each element
  const [textSizes, setTextSizes] = useState({
    title: 'text-9xl',
    description: 'text-7xl',
    location: 'text-7xl',
    date: 'text-7xl',
    type: 'text-8xl',
    metadata: 'text-sm',
    startDate: 'text-3xl',
    endDate: 'text-3xl',
    duration: 'text-3xl'
  });

  // Check for debug mode via URL parameter or localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const debugMode = urlParams.get('debug') === 'true' || localStorage.getItem('textSizeDebug') === 'true';
    setIsVisible(debugMode);
  }, []);

  // Track screen dimensions
  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const ratio = width / height;
      setScreenDimensions({ width, height, ratio });
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Tailwind text size options
  const textSizeOptions = [
    'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 
    'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl', 'text-7xl', 'text-8xl', 
    'text-9xl', 'text-10xl', 'text-11xl', 'text-12xl', 'text-13xl', 'text-14xl', 
    'text-15xl', 'text-16xl', 'text-17xl', 'text-18xl'
  ];

  const handleTextSizeChange = (element: string, newSize: string) => {
    setTextSizes(prev => ({ ...prev, [element]: newSize }));
    onTextSizeChange(element, newSize);
  };

  const getNextSize = (currentSize: string, direction: 'up' | 'down') => {
    const currentIndex = textSizeOptions.indexOf(currentSize);
    if (direction === 'up' && currentIndex < textSizeOptions.length - 1) {
      return textSizeOptions[currentIndex + 1];
    } else if (direction === 'down' && currentIndex > 0) {
      return textSizeOptions[currentIndex - 1];
    }
    return currentSize;
  };

  const resetAllSizes = () => {
    const defaultSizes = {
      title: 'text-9xl',
      description: 'text-7xl',
      location: 'text-7xl',
      date: 'text-7xl',
      type: 'text-8xl',
      metadata: 'text-sm',
      startDate: 'text-3xl',
      endDate: 'text-3xl',
      duration: 'text-3xl'
    };
    setTextSizes(defaultSizes);
    Object.entries(defaultSizes).forEach(([element, size]) => {
      onTextSizeChange(element, size);
    });
    handleIconSizeChange(5.0);
    handleAvatarSizeChange(8.0);
  };

  const handleIconSizeChange = (newMultiplier: number) => {
    setIconSizeMultiplier(newMultiplier);
    if (onIconSizeChange) {
      onIconSizeChange(newMultiplier);
    }
  };

  const handleAvatarSizeChange = (newMultiplier: number) => {
    setAvatarSizeMultiplier(newMultiplier);
    if (onAvatarSizeChange) {
      onAvatarSizeChange(newMultiplier);
    }
  };

  const increaseIconSize = () => {
    const newSize = Math.min(iconSizeMultiplier + 0.5, 5.0);
    handleIconSizeChange(newSize);
  };

  const decreaseIconSize = () => {
    const newSize = Math.max(iconSizeMultiplier - 0.5, 0.5);
    handleIconSizeChange(newSize);
  };

  const increaseAvatarSize = () => {
    const newSize = Math.min(avatarSizeMultiplier + 1, 10);
    handleAvatarSizeChange(newSize);
  };

  const decreaseAvatarSize = () => {
    const newSize = Math.max(avatarSizeMultiplier - 1, 1);
    handleAvatarSizeChange(newSize);
  };

  const toggleTags = () => {
    const newShowTags = !showTags;
    setShowTags(newShowTags);
    if (onShowTagsChange) {
      onShowTagsChange(newShowTags);
    }
  };

  const togglePriorityBadge = () => {
    const newShowPriorityBadge = !showPriorityBadge;
    setShowPriorityBadge(newShowPriorityBadge);
    if (onShowPriorityBadgeChange) {
      onShowPriorityBadgeChange(newShowPriorityBadge);
    }
  };

  const toggleVisibilityBadge = () => {
    const newShowVisibilityBadge = !showVisibilityBadge;
    setShowVisibilityBadge(newShowVisibilityBadge);
    if (onShowVisibilityBadgeChange) {
      onShowVisibilityBadgeChange(newShowVisibilityBadge);
    }
  };

  // Set default icon size to 5x for vertical orientation
  useEffect(() => {
    if (screenDimensions.ratio < 1) { // Portrait/vertical
      handleIconSizeChange(5.0);
    } else {
      handleIconSizeChange(1.0);
    }
  }, [screenDimensions.ratio]);

  const toggleVisibility = () => {
    const newVisibility = !isVisible;
    setIsVisible(newVisibility);
    localStorage.setItem('textSizeDebug', newVisibility.toString());
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Don't render if not visible
  if (!isVisible) {
    return (
      <motion.button
        onClick={toggleVisibility}
        className={cn(
          "fixed top-4 left-4 z-50 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full p-3 border border-white/20 transition-colors",
          className
        )}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        title="Enable Text Size Debug Controls"
      >
        <Settings className="w-5 h-5 text-white" />
      </motion.button>
    );
  }

  return (
    <motion.div 
      className={cn(
        "fixed top-4 left-4 z-50 bg-black/90 backdrop-blur-sm rounded-lg border border-white/20 shadow-lg",
        isMinimized ? "p-2" : "p-4",
        className
      )}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {!isMinimized ? (
        <div className="flex flex-col gap-3 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between">
            <div className="text-white text-sm font-medium">
              Design Debug Controls
            </div>
            <div className="flex items-center gap-1">
              <motion.button
                onClick={toggleMinimize}
                className="p-1 hover:bg-white/10 rounded transition-colors"
                title="Minimize"
              >
                <Minus className="w-3 h-3 text-white/70" />
              </motion.button>
              <motion.button
                onClick={toggleVisibility}
                className="p-1 hover:bg-white/10 rounded transition-colors"
                title="Close"
              >
                <X className="w-3 h-3 text-white/70" />
              </motion.button>
            </div>
          </div>

          {/* Screen Dimensions */}
          <div className="bg-white/10 rounded p-2">
            <div className="text-white text-xs font-medium mb-1">Screen Info</div>
            <div className="text-white text-xs font-mono">
              {screenDimensions.width} × {screenDimensions.height}
            </div>
            <div className="text-white text-xs font-mono">
              Ratio: {screenDimensions.ratio.toFixed(2)} ({screenDimensions.ratio < 1 ? 'Portrait' : 'Landscape'})
            </div>
          </div>
          
          {/* Individual Text Size Controls */}
          <div className="space-y-2">
            <div className="text-white text-xs font-medium">Text Elements</div>
            {Object.entries(textSizes).map(([element, currentSize]) => (
              <div key={element} className="flex items-center gap-2">
                <div className="text-white text-xs w-20 capitalize">{element}:</div>
                <motion.button
                  onClick={() => handleTextSizeChange(element, getNextSize(currentSize, 'down'))}
                  className="p-1 bg-red-500/80 hover:bg-red-500 rounded transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title={`Decrease ${element} size`}
                >
                  <Minus className="w-3 h-3 text-white" />
                </motion.button>
                
                <div className="text-white text-xs font-mono min-w-[80px] text-center bg-white/10 rounded px-2 py-1">
                  {currentSize}
                </div>
                
                <motion.button
                  onClick={() => handleTextSizeChange(element, getNextSize(currentSize, 'up'))}
                  className="p-1 bg-green-500/80 hover:bg-green-500 rounded transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title={`Increase ${element} size`}
                >
                  <Plus className="w-3 h-3 text-white" />
                </motion.button>
              </div>
            ))}
          </div>

          {/* Icon Size Controls */}
          {onIconSizeChange && (
            <div className="space-y-2">
              <div className="text-white text-xs font-medium">Icon Size</div>
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={decreaseIconSize}
                  className="p-1 bg-orange-500/80 hover:bg-orange-500 rounded transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Decrease icon size"
                >
                  <Minus className="w-3 h-3 text-white" />
                </motion.button>
                
                <div className="text-white text-xs font-mono min-w-[60px] text-center bg-white/10 rounded px-2 py-1">
                  {iconSizeMultiplier.toFixed(1)}x
                </div>
                
                <motion.button
                  onClick={increaseIconSize}
                  className="p-1 bg-cyan-500/80 hover:bg-cyan-500 rounded transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Increase icon size"
                >
                  <Plus className="w-3 h-3 text-white" />
                </motion.button>
              </div>
            </div>
          )}

          {/* Avatar Size Controls */}
          {onAvatarSizeChange && (
            <div className="space-y-2">
              <div className="text-white text-xs font-medium">Avatar Size</div>
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={decreaseAvatarSize}
                  className="p-1 bg-purple-500/80 hover:bg-purple-500 rounded transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Decrease avatar size"
                >
                  <Minus className="w-3 h-3 text-white" />
                </motion.button>
                
                <div className="text-white text-xs font-mono min-w-[60px] text-center bg-white/10 rounded px-2 py-1">
                  {avatarSizeMultiplier}x
                </div>
                
                <motion.button
                  onClick={increaseAvatarSize}
                  className="p-1 bg-pink-500/80 hover:bg-pink-500 rounded transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Increase avatar size"
                >
                  <Plus className="w-3 h-3 text-white" />
                </motion.button>
              </div>
            </div>
          )}

          {/* Priority Badge Toggle */}
          {onShowPriorityBadgeChange && (
            <div className="space-y-2">
              <div className="text-white text-xs font-medium">Priority Badge</div>
              <motion.button
                onClick={togglePriorityBadge}
                className={cn(
                  "px-3 py-1 rounded text-xs font-medium transition-colors",
                  showPriorityBadge 
                    ? "bg-red-500/80 hover:bg-red-500 text-white" 
                    : "bg-white/10 hover:bg-white/20 text-white/70"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {showPriorityBadge ? 'ON' : 'OFF'}
              </motion.button>
            </div>
          )}

          {/* Visibility Badge Toggle */}
          {onShowVisibilityBadgeChange && (
            <div className="space-y-2">
              <div className="text-white text-xs font-medium">Visibility Badge</div>
              <motion.button
                onClick={toggleVisibilityBadge}
                className={cn(
                  "px-3 py-1 rounded text-xs font-medium transition-colors",
                  showVisibilityBadge 
                    ? "bg-blue-500/80 hover:bg-blue-500 text-white" 
                    : "bg-white/10 hover:bg-white/20 text-white/70"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {showVisibilityBadge ? 'ON' : 'OFF'}
              </motion.button>
            </div>
          )}

          {/* Tags Toggle */}
          {onShowTagsChange && (
            <div className="space-y-2">
              <div className="text-white text-xs font-medium">Show Tags</div>
              <motion.button
                onClick={toggleTags}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded transition-colors text-white text-xs font-medium",
                  showTags 
                    ? "bg-green-500/80 hover:bg-green-500" 
                    : "bg-gray-500/80 hover:bg-gray-500"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={showTags ? "Hide tags" : "Show tags"}
              >
                <Tag className="w-3 h-3" />
                {showTags ? "ON" : "OFF"}
              </motion.button>
            </div>
          )}
          
          <motion.button
            onClick={resetAllSizes}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/80 hover:bg-blue-500 rounded-md transition-colors text-white text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Reset all sizes to default"
          >
            <RotateCcw className="w-4 h-4" />
            Reset All
          </motion.button>

          <div className="text-xs text-white/60 text-center">
            Add ?debug=true to URL to enable
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="text-white text-xs font-mono">
            {screenDimensions.width}×{screenDimensions.height} | {screenDimensions.ratio.toFixed(1)}
            {onIconSizeChange && ` | I:${iconSizeMultiplier.toFixed(1)}x`}
            {onAvatarSizeChange && ` | A:${avatarSizeMultiplier}x`}
            {onShowTagsChange && ` | T:${showTags ? 'ON' : 'OFF'}`}
          </div>
          <motion.button
            onClick={toggleMinimize}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            title="Expand controls"
          >
            <Plus className="w-3 h-3 text-white/70" />
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}

// Export both names for backward compatibility
export { TextSizeControls as DevTextSizeControls };
