'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, RotateCcw, Settings, X, Tag, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ImageLayoutType } from '@/types/announcement';

interface ImageSettings {
  layout?: ImageLayoutType;
  scale?: number;
  splitPercentage?: number;
  opacity?: number;
}

interface TextSizeControlsProps {
  onTextSizeChange: (element: string, size: string) => void;
  onIconSizeChange?: (multiplier: number) => void;
  onAvatarSizeChange?: (multiplier: number) => void;
  onShowTagsChange?: (show: boolean) => void;
  onShowPriorityBadgeChange?: (show: boolean) => void;
  onShowVisibilityBadgeChange?: (show: boolean) => void;
  onShowQRCodeButtonChange?: (show: boolean) => void;
  onShowLearnMoreChange?: (show: boolean) => void;
  currentAnnouncementId?: string;
  currentAnnouncementTitle?: string;
  onImageLayoutChange?: (announcementId: string, layout: ImageLayoutType) => void;
  onImageSettingsChange?: (announcementId: string, settings: Partial<ImageSettings>) => void;
  onDurationChange?: (announcementId: string, duration: number) => void;
  currentDuration?: number;
  className?: string;
}

export function TextSizeControls({ 
  onTextSizeChange, 
  onIconSizeChange, 
  onAvatarSizeChange, 
  onShowTagsChange, 
  onShowPriorityBadgeChange, 
  onShowVisibilityBadgeChange,
  onShowQRCodeButtonChange,
  onShowLearnMoreChange,
  currentAnnouncementId,
  currentAnnouncementTitle,
  onImageLayoutChange,
  onImageSettingsChange,
  onDurationChange,
  currentDuration = 5000,
  className 
}: TextSizeControlsProps) {
  const [screenDimensions, setScreenDimensions] = useState({ width: 0, height: 0, ratio: 0 });
  const [iconSizeMultiplier, setIconSizeMultiplier] = useState(1);
  const [avatarSizeMultiplier, setAvatarSizeMultiplier] = useState(5);
  const [showTags, setShowTags] = useState(false);
  const [showPriorityBadge, setShowPriorityBadge] = useState(false);
  const [showVisibilityBadge, setShowVisibilityBadge] = useState(false);
  const [showQRCodeButton, setShowQRCodeButton] = useState(true);
  const [showLearnMore, setShowLearnMore] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  // Image settings state
  const [imageLayout, setImageLayout] = useState<ImageLayoutType>('card');
  const [imageScale, setImageScale] = useState(1);
  const [splitPercentage, setSplitPercentage] = useState(40);
  const [imageOpacity, setImageOpacity] = useState(100);

  // Reset image settings when announcement changes
  useEffect(() => {
    if (currentAnnouncementId) {
      // Reset to defaults when switching announcements
      setImageLayout('card');
      setImageScale(1);
      setSplitPercentage(40);
      setImageOpacity(100);
    }
  }, [currentAnnouncementId]);
  
  // Individual text size controls for each element
  const [textSizes, setTextSizes] = useState({
    title: 'text-6xl',
    description: 'text-3xl',
    location: 'text-3xl',
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

  // Image layout options
  const imageLayoutOptions: ImageLayoutType[] = [
    'hero', 'split-left', 'split-right', 'card', 'masonry', 'overlay', 'side-panel', 'background'
  ];

  // Handle image layout change
  const handleImageLayoutChange = (layout: ImageLayoutType) => {
    setImageLayout(layout);
    if (currentAnnouncementId && onImageLayoutChange) {
      onImageLayoutChange(currentAnnouncementId, layout);
    }
  };

  // Update settings when values change
  useEffect(() => {
    if (currentAnnouncementId && onImageSettingsChange) {
      onImageSettingsChange(currentAnnouncementId, {
        scale: imageScale,
        splitPercentage: splitPercentage,
        opacity: imageOpacity
      });
    }
  }, [imageScale, splitPercentage, imageOpacity, currentAnnouncementId, onImageSettingsChange]);

  // Handle duration change
  const handleDurationChange = (duration: number) => {
    if (currentAnnouncementId && onDurationChange) {
      onDurationChange(currentAnnouncementId, duration);
    }
  };

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

  const toggleQRCodeButton = () => {
    const newValue = !showQRCodeButton;
    setShowQRCodeButton(newValue);
    if (onShowQRCodeButtonChange) {
      onShowQRCodeButtonChange(newValue);
    }
  };

  const toggleLearnMore = () => {
    const newValue = !showLearnMore;
    setShowLearnMore(newValue);
    if (onShowLearnMoreChange) {
      onShowLearnMoreChange(newValue);
    }
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

          {/* Section: Visibility Controls */}
          <div className="space-y-2 border-t border-white/20 pt-2">
            <div className="text-white text-xs font-semibold uppercase tracking-wide">Visibility</div>
            
            {/* QR Code Button Toggle */}
            {onShowQRCodeButtonChange && (
              <div className="flex items-center justify-between">
                <div className="text-white text-xs">QR Code Button</div>
                <motion.button
                  onClick={toggleQRCodeButton}
                  className={cn(
                    "px-3 py-1 rounded text-xs font-medium transition-colors",
                    showQRCodeButton 
                      ? "bg-green-500/80 hover:bg-green-500 text-white" 
                      : "bg-white/10 hover:bg-white/20 text-white/70"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showQRCodeButton ? 'ON' : 'OFF'}
                </motion.button>
              </div>
            )}

            {/* Learn More Button Toggle */}
            {onShowLearnMoreChange && (
              <div className="flex items-center justify-between">
                <div className="text-white text-xs">Learn More Button</div>
                <motion.button
                  onClick={toggleLearnMore}
                  className={cn(
                    "px-3 py-1 rounded text-xs font-medium transition-colors",
                    showLearnMore 
                      ? "bg-green-500/80 hover:bg-green-500 text-white" 
                      : "bg-white/10 hover:bg-white/20 text-white/70"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showLearnMore ? 'ON' : 'OFF'}
                </motion.button>
              </div>
            )}

            {/* Priority Badge Toggle */}
            {onShowPriorityBadgeChange && (
              <div className="flex items-center justify-between">
                <div className="text-white text-xs">Priority Badge</div>
                <motion.button
                  onClick={togglePriorityBadge}
                  className={cn(
                    "px-3 py-1 rounded text-xs font-medium transition-colors",
                    showPriorityBadge 
                      ? "bg-green-500/80 hover:bg-green-500 text-white" 
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
              <div className="flex items-center justify-between">
                <div className="text-white text-xs">Visibility Badge</div>
                <motion.button
                  onClick={toggleVisibilityBadge}
                  className={cn(
                    "px-3 py-1 rounded text-xs font-medium transition-colors",
                    showVisibilityBadge 
                      ? "bg-green-500/80 hover:bg-green-500 text-white" 
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
              <div className="flex items-center justify-between">
                <div className="text-white text-xs">Tags</div>
                <motion.button
                  onClick={toggleTags}
                  className={cn(
                    "px-3 py-1 rounded text-xs font-medium transition-colors",
                    showTags 
                      ? "bg-green-500/80 hover:bg-green-500 text-white" 
                      : "bg-white/10 hover:bg-white/20 text-white/70"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showTags ? 'ON' : 'OFF'}
                </motion.button>
              </div>
            )}
          </div>
          
          {/* Section: Text Size Controls */}
          <div className="space-y-2 border-t border-white/20 pt-2">
            <div className="text-white text-xs font-semibold uppercase tracking-wide">Text Elements</div>
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
              <div className="text-white text-xs">Avatar Size</div>
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


          {/* Section: Image Settings */}
          {currentAnnouncementId && (onImageLayoutChange || onImageSettingsChange) && (
            <div className="space-y-3 border-t border-white/20 pt-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-white" />
                <div className="text-white text-xs font-semibold uppercase tracking-wide">Image Settings</div>
              </div>
              
              {currentAnnouncementTitle && (
                <div className="text-white/70 text-xs truncate" title={currentAnnouncementTitle}>
                  {currentAnnouncementTitle}
                </div>
              )}

              {/* Image Layout Selector */}
              {onImageLayoutChange && (
                <div className="space-y-2">
                  <div className="text-white text-xs font-medium">Layout</div>
                  <select
                    value={imageLayout}
                    onChange={(e) => handleImageLayoutChange(e.target.value as ImageLayoutType)}
                    className="w-full px-2 py-1 bg-white/10 rounded text-white text-xs border border-white/20 focus:outline-none focus:border-white/40"
                  >
                    {imageLayoutOptions.map((layout) => (
                      <option key={layout} value={layout} className="bg-black">
                        {layout.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Image Scale */}
              {onImageSettingsChange && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-white text-xs font-medium">Scale</div>
                    <div className="text-white text-xs font-mono bg-white/10 rounded px-2 py-1">
                      {imageScale.toFixed(1)}x
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      onClick={() => setImageScale(Math.max(0.5, imageScale - 0.1))}
                      className="p-1 bg-orange-500/80 hover:bg-orange-500 rounded transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Minus className="w-3 h-3 text-white" />
                    </motion.button>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={imageScale}
                      onChange={(e) => setImageScale(Number(e.target.value))}
                      className="flex-1"
                    />
                    <motion.button
                      onClick={() => setImageScale(Math.min(2, imageScale + 0.1))}
                      className="p-1 bg-cyan-500/80 hover:bg-cyan-500 rounded transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plus className="w-3 h-3 text-white" />
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Split Percentage (for split layouts) */}
              {onImageSettingsChange && (imageLayout === 'split-left' || imageLayout === 'split-right') && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-white text-xs font-medium">Split %</div>
                    <div className="text-white text-xs font-mono bg-white/10 rounded px-2 py-1">
                      {splitPercentage}%
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      onClick={() => setSplitPercentage(Math.max(20, splitPercentage - 5))}
                      className="p-1 bg-purple-500/80 hover:bg-purple-500 rounded transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Minus className="w-3 h-3 text-white" />
                    </motion.button>
                    <input
                      type="range"
                      min="20"
                      max="60"
                      step="5"
                      value={splitPercentage}
                      onChange={(e) => setSplitPercentage(Number(e.target.value))}
                      className="flex-1"
                    />
                    <motion.button
                      onClick={() => setSplitPercentage(Math.min(60, splitPercentage + 5))}
                      className="p-1 bg-pink-500/80 hover:bg-pink-500 rounded transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plus className="w-3 h-3 text-white" />
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Image Opacity */}
              {onImageSettingsChange && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-white text-xs font-medium">Opacity</div>
                    <div className="text-white text-xs font-mono bg-white/10 rounded px-2 py-1">
                      {imageOpacity}%
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={imageOpacity}
                    onChange={(e) => setImageOpacity(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}

              {/* Duration Control */}
              {onDurationChange && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-white text-xs font-medium">Duration</div>
                    <div className="text-white text-xs font-mono bg-white/10 rounded px-2 py-1">
                      {Math.round(currentDuration / 1000)}s
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      onClick={() => handleDurationChange(Math.max(2000, currentDuration - 1000))}
                      className="p-1 bg-yellow-500/80 hover:bg-yellow-500 rounded transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Minus className="w-3 h-3 text-white" />
                    </motion.button>
                    <input
                      type="range"
                      min="2000"
                      max="30000"
                      step="1000"
                      value={currentDuration}
                      onChange={(e) => handleDurationChange(Number(e.target.value))}
                      className="flex-1"
                    />
                    <motion.button
                      onClick={() => handleDurationChange(Math.min(30000, currentDuration + 1000))}
                      className="p-1 bg-green-500/80 hover:bg-green-500 rounded transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Plus className="w-3 h-3 text-white" />
                    </motion.button>
                  </div>
                  <div className="flex gap-1">
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
                </div>
              )}
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
