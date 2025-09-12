'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, RotateCcw, Settings, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TextSizeControlsProps {
  onTextSizeChange: (multiplier: number) => void;
  onIconSizeChange?: (multiplier: number) => void;
  className?: string;
}

export function TextSizeControls({ onTextSizeChange, onIconSizeChange, className }: TextSizeControlsProps) {
  const [textSizeMultiplier, setTextSizeMultiplier] = useState(1);
  const [iconSizeMultiplier, setIconSizeMultiplier] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Check for debug mode via URL parameter or localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const debugMode = urlParams.get('debug') === 'true' || localStorage.getItem('textSizeDebug') === 'true';
    setIsVisible(debugMode);
  }, []);

  const handleSizeChange = (newMultiplier: number) => {
    setTextSizeMultiplier(newMultiplier);
    onTextSizeChange(newMultiplier);
  };

  const increaseSize = () => {
    const newSize = Math.min(textSizeMultiplier + 0.1, 2.0);
    handleSizeChange(newSize);
  };

  const decreaseSize = () => {
    const newSize = Math.max(textSizeMultiplier - 0.1, 0.5);
    handleSizeChange(newSize);
  };

  const resetSize = () => {
    handleSizeChange(1.0);
    handleIconSizeChange(1.0);
  };

  const handleIconSizeChange = (newMultiplier: number) => {
    setIconSizeMultiplier(newMultiplier);
    if (onIconSizeChange) {
      onIconSizeChange(newMultiplier);
    }
  };

  const increaseIconSize = () => {
    const newSize = Math.min(iconSizeMultiplier + 0.1, 2.0);
    handleIconSizeChange(newSize);
  };

  const decreaseIconSize = () => {
    const newSize = Math.max(iconSizeMultiplier - 0.1, 0.5);
    handleIconSizeChange(newSize);
  };

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
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="text-white text-sm font-medium">
              Text Size Debug
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
          
          <div className="space-y-3">
            {/* Text Size Controls */}
            <div>
              <div className="text-white text-xs font-medium mb-2">Text Size</div>
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={decreaseSize}
                  className="p-2 bg-red-500/80 hover:bg-red-500 rounded-md transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Decrease text size"
                >
                  <Minus className="w-4 h-4 text-white" />
                </motion.button>
                
                <div className="text-white text-sm font-mono min-w-[60px] text-center bg-white/10 rounded px-2 py-1">
                  {(textSizeMultiplier * 100).toFixed(0)}%
                </div>
                
                <motion.button
                  onClick={increaseSize}
                  className="p-2 bg-green-500/80 hover:bg-green-500 rounded-md transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Increase text size"
                >
                  <Plus className="w-4 h-4 text-white" />
                </motion.button>
              </div>
            </div>

            {/* Icon Size Controls */}
            {onIconSizeChange && (
              <div>
                <div className="text-white text-xs font-medium mb-2">Icon Size</div>
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={decreaseIconSize}
                    className="p-2 bg-orange-500/80 hover:bg-orange-500 rounded-md transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Decrease icon size"
                  >
                    <Minus className="w-4 h-4 text-white" />
                  </motion.button>
                  
                  <div className="text-white text-sm font-mono min-w-[60px] text-center bg-white/10 rounded px-2 py-1">
                    {(iconSizeMultiplier * 100).toFixed(0)}%
                  </div>
                  
                  <motion.button
                    onClick={increaseIconSize}
                    className="p-2 bg-cyan-500/80 hover:bg-cyan-500 rounded-md transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Increase icon size"
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </motion.button>
                </div>
              </div>
            )}
          </div>
          
          <motion.button
            onClick={resetSize}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/80 hover:bg-blue-500 rounded-md transition-colors text-white text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Reset to default size"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </motion.button>

          <div className="text-xs text-white/60 text-center">
            Add ?debug=true to URL to enable
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="text-white text-xs font-mono">
            T:{(textSizeMultiplier * 100).toFixed(0)}%
            {onIconSizeChange && ` I:${(iconSizeMultiplier * 100).toFixed(0)}%`}
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
