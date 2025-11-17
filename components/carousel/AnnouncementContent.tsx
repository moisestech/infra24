'use client';

import { motion } from "framer-motion";
import { MapPin, ExternalLink } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { TypeStyle } from './announcement-styles';
import { AnnouncementMetadata } from './AnnouncementMetadata';
import QRCode from '@/components/ui/QRCode';

interface AnnouncementContentProps {
  announcement: any;
  styles: TypeStyle;
  IconComponent: LucideIcon;
  orientation: 'portrait' | 'landscape';
  showQRCode: boolean;
  setShowQRCode: (show: boolean) => void;
  organizationSlug?: string;
  textSizes?: {
    title: string;
    description: string;
    location: string;
    date: string;
    type: string;
    metadata: string;
    startDate: string;
    endDate: string;
    duration: string;
  };
  iconSizeMultiplier?: number;
  showPriorityBadge?: boolean;
  showVisibilityBadge?: boolean;
  showQRCodeButton?: boolean;
  showLearnMore?: boolean;
  layoutType?: 'card' | 'split-left' | 'split-right' | 'hero' | 'overlay' | 'background' | 'masonry' | 'side-panel' | null;
  screenMetrics?: any;
  responsiveSizes?: any;
  isActive?: boolean;
}

export function AnnouncementContent({ 
  announcement, 
  styles, 
  IconComponent, 
  orientation, 
  showQRCode, 
  setShowQRCode, 
  organizationSlug,
  textSizes = {
    title: 'text-9xl',
    description: 'text-7xl',
    location: 'text-7xl',
    date: 'text-7xl',
    type: 'text-8xl',
    metadata: 'text-sm',
    startDate: 'text-3xl',
    endDate: 'text-3xl',
    duration: 'text-3xl'
  },
  iconSizeMultiplier = 1,
  showPriorityBadge = false,
  showVisibilityBadge = false,
  showQRCodeButton = true,
  showLearnMore = true,
  layoutType = null,
  screenMetrics,
  responsiveSizes,
  isActive = false
}: AnnouncementContentProps) {
  
  // Helper function to get responsive base icon size
  const getResponsiveBaseIconSize = (sizeType: 'small' | 'medium' | 'large') => {
    if (!screenMetrics) {
      // Fallback to orientation-based sizes
      if (sizeType === 'small') {
        return orientation === 'portrait' ? 32 : 40;
      } else if (sizeType === 'medium') {
        return orientation === 'portrait' ? 48 : 64;
      } else {
        return orientation === 'portrait' ? 64 : 80;
      }
    }

    const { isLargeDisplay, isConstrained, orientation: screenOrientation, pixelRatio } = screenMetrics;
    
    // Base sizes adjusted for screen characteristics
    let baseSize: number;
    
    if (sizeType === 'small') {
      // Small icons (e.g., ExternalLink in buttons)
      baseSize = isLargeDisplay 
        ? (screenOrientation === 'portrait' ? 40 : 48)
        : isConstrained
        ? (screenOrientation === 'portrait' ? 24 : 28)
        : (screenOrientation === 'portrait' ? 32 : 40);
    } else if (sizeType === 'medium') {
      // Medium icons (e.g., MapPin, main badge icon)
      baseSize = isLargeDisplay
        ? (screenOrientation === 'portrait' ? 56 : 72)
        : isConstrained
        ? (screenOrientation === 'portrait' ? 36 : 44)
        : (screenOrientation === 'portrait' ? 48 : 64);
    } else {
      // Large icons (for emphasis)
      baseSize = isLargeDisplay
        ? (screenOrientation === 'portrait' ? 80 : 96)
        : isConstrained
        ? (screenOrientation === 'portrait' ? 48 : 56)
        : (screenOrientation === 'portrait' ? 64 : 80);
    }
    
    // Adjust for pixel ratio (higher pixel ratio = slightly smaller base)
    const pixelRatioAdjustment = pixelRatio > 2 ? 0.95 : pixelRatio > 1.5 ? 0.98 : 1;
    return Math.round(baseSize * pixelRatioAdjustment);
  };

  // Helper function to apply icon size multiplier to responsive base size
  const getIconSize = (sizeType: 'small' | 'medium' | 'large' = 'medium') => {
    const baseSize = getResponsiveBaseIconSize(sizeType);
    // Always use the iconSizeMultiplier prop - it's explicitly passed and should take precedence
    const multiplier = iconSizeMultiplier;
    const finalSize = Math.round(baseSize * multiplier);
    
    console.log('🎯 getIconSize:', {
      sizeType,
      baseSize,
      multiplier,
      finalSize,
      screenMetrics: screenMetrics ? {
        width: screenMetrics.width,
        height: screenMetrics.height,
        orientation: screenMetrics.orientation
      } : 'none',
      responsiveSizes: responsiveSizes ? {
        iconMultiplier: responsiveSizes.iconMultiplier
      } : 'none'
    });
    
    return finalSize;
  };

  // Adjust padding based on layout type and responsive sizing
  // Card and split layouts need less padding since they're constrained
  const getPaddingClass = () => {
    // Use responsive sizing if available
    if (responsiveSizes?.padding) {
      if (layoutType === 'card') {
        // Card layouts use minimal padding
        return screenMetrics?.isConstrained 
          ? 'p-3 md:p-4' 
          : 'p-4 md:p-6 xl:p-8';
      } else if (layoutType === 'split-left' || layoutType === 'split-right') {
        // Split layouts use moderate padding
        return screenMetrics?.isConstrained
          ? 'p-4 md:p-8'
          : 'p-6 md:p-10 xl:p-14';
      } else {
        // Full screen layouts use responsive padding
        return responsiveSizes.padding;
      }
    }
    
    // Fallback to original logic
    if (layoutType === 'card') {
      return 'p-4 md:p-6 xl:p-8 2xl:p-10';
    } else if (layoutType === 'split-left' || layoutType === 'split-right') {
      return 'p-8 md:p-12 xl:p-16 2xl:p-20';
    } else {
      // Full screen layouts (hero, overlay, background, etc.)
      return 'p-20 md:p-32 xl:p-40 2xl:p-48 3xl:p-56';
    }
  };

  console.log('📝 AnnouncementContent rendering:', {
    title: announcement.title,
    layoutType: layoutType || 'default',
    paddingClass: getPaddingClass(),
    hasTitle: !!announcement.title,
    hasBody: !!announcement.body,
    isActive,
    showQRCodeButton,
    primaryLink: announcement.primary_link,
    iconSizeMultiplier,
    screenMetrics: screenMetrics ? {
      width: screenMetrics.width,
      height: screenMetrics.height,
      pixelRatio: screenMetrics.pixelRatio,
      orientation: screenMetrics.orientation,
      isLargeDisplay: screenMetrics.isLargeDisplay,
      isConstrained: screenMetrics.isConstrained
    } : 'none',
    responsiveSizes: responsiveSizes ? {
      iconMultiplier: responsiveSizes.iconMultiplier
    } : 'none'
  });

  // Use animation key to force re-animation on slide change
  // When slide becomes active, generate a new unique key to force animations to restart
  const [animationKey, setAnimationKey] = useState(`inactive-${announcement.id}`);
  const prevIsActiveRef = useRef(false);
  
  useEffect(() => {
    if (isActive && !prevIsActiveRef.current) {
      // Slide just became active - generate new key to trigger animations
      const newKey = `active-${announcement.id}-${performance.now()}`;
      setAnimationKey(newKey);
      prevIsActiveRef.current = true;
      console.log('🎬 Animation triggered for active slide:', {
        announcementId: announcement.id,
        title: announcement.title,
        animationKey: newKey,
        isActive
      });
    } else if (!isActive) {
      // Slide is inactive
      setAnimationKey(`inactive-${announcement.id}`);
      prevIsActiveRef.current = false;
    }
  }, [isActive, announcement.id, announcement.title]);

  // Calculate max width for card layouts to ensure text wraps
  const getContentMaxWidth = () => {
    if (layoutType === 'card' && screenMetrics) {
      // For card layouts, use available width minus padding and image card
      const availableWidth = screenMetrics.width;
      const height = screenMetrics.height;
      
      // Check if it's 1080x1808 ratio - add 200px to max-width
      const aspectRatio = availableWidth / height;
      const is1080x1808 = Math.abs(aspectRatio - (1080/1808)) < 0.05 && 
                          availableWidth >= 1050 && availableWidth <= 1110 && 
                          height >= 1750 && height <= 1850;
      
      // For 1080x1808, use fixed 900px max-width
      let maxWidth: number;
      if (is1080x1808) {
        maxWidth = 900;
        console.log('📏 1080x1808 detected - using fixed 900px max-width');
      } else {
        // Estimate: image card takes ~30-35% of width, padding takes ~10-15%
        // So content gets ~50-60% of total width
        maxWidth = Math.floor(availableWidth * 0.6);
      }
      
      console.log('📏 getContentMaxWidth:', {
        layoutType,
        availableWidth,
        height,
        aspectRatio,
        is1080x1808,
        calculatedMaxWidth: maxWidth
      });
      
      return `${maxWidth}px`;
    }
    return undefined;
  };

  return (
    <motion.div 
      key={animationKey}
      className={cn(
        "relative z-30 h-full flex flex-col w-full min-w-0",
        layoutType === 'card' ? "justify-between" : "justify-center",
        getPaddingClass()
      )}
      style={{ maxWidth: '100%', width: '100%', boxSizing: 'border-box' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className={cn(
        "w-full min-w-0 flex flex-col",
        layoutType === 'card' 
          ? "space-y-4 md:space-y-6 xl:space-y-8 flex-1" 
          : "space-y-16 xl:space-y-20 2xl:space-y-24 3xl:space-y-28 max-w-4xl xl:max-w-6xl 2xl:max-w-7xl 3xl:max-w-8xl"
      )}
      style={{ 
        maxWidth: layoutType === 'card' ? getContentMaxWidth() || '100%' : undefined, 
        width: '100%',
        boxSizing: 'border-box'
      }}
      >
        {/* Type Badge */}
        <motion.div 
          key={`badge-${animationKey}`}
          className="inline-flex items-center gap-4 xl:gap-6 px-8 xl:px-12 py-4 xl:py-6 rounded-full bg-white/10 backdrop-blur-sm flex-wrap"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
        >
          <IconComponent 
            className={cn(styles.text || "text-white", "flex-shrink-0")} 
            size={getIconSize('medium')} 
          />
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn("font-bold break-words whitespace-normal", styles.text || "text-white", textSizes.type)}>
              {announcement.type?.replace('_', ' ').toUpperCase() || 'EVENT'}
            </span>
            {announcement.sub_type && (
              <span className={cn("font-medium opacity-70 break-words whitespace-normal", styles.text || "text-white", textSizes.type)}>
                • {announcement.sub_type.replace('_', ' ').toUpperCase()}
              </span>
            )}
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1 
          key={`title-${animationKey}`}
          className={cn("font-black leading-tight break-words whitespace-normal", styles.text || "text-white", textSizes.title)}
          style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
        >
          {announcement.title}
        </motion.h1>

        {/* Description - First sentence only */}
        {announcement.body && (
          <motion.p 
            key={`description-${animationKey}`}
            className={cn("font-medium leading-relaxed opacity-90 break-words whitespace-normal text-black", textSizes.description)}
            style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
          >
            {(() => {
              // Extract first sentence (ending with . ! or ?)
              const firstSentenceMatch = announcement.body.match(/^[^.!?]+[.!?]/);
              return firstSentenceMatch ? firstSentenceMatch[0].trim() : announcement.body.split('.')[0] + '.';
            })()}
          </motion.p>
        )}

        {/* Location */}
        {announcement.location && (
          <motion.div 
            key={`location-${animationKey}`}
            className={cn(
              "flex items-center gap-4 xl:gap-6 2xl:gap-8 3xl:gap-10 flex-wrap",
              orientation === 'portrait'
                ? "text-8xl xl:text-10xl 2xl:text-12xl 3xl:text-14xl 4xl:text-16xl"
                : "text-10xl xl:text-12xl 2xl:text-14xl 3xl:text-16xl 4xl:text-18xl"
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
          >
            <MapPin 
              className="opacity-80 flex-shrink-0 text-black"
              size={getIconSize('medium')} 
            />
            <span className={cn("opacity-80 font-medium break-words whitespace-normal text-black", textSizes.location)} style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
              {announcement.location}
            </span>
          </motion.div>
        )}

        {/* QR Code Display - Always Visible at Bottom for Card Layout */}
        {(() => {
          const shouldShowQR = showQRCodeButton && announcement.primary_link && announcement.primary_link !== '#';
          console.log('📱 QR Code visibility check:', {
            showQRCodeButton,
            hasPrimaryLink: !!announcement.primary_link,
            primaryLink: announcement.primary_link,
            primaryLinkIsHash: announcement.primary_link === '#',
            shouldShowQR,
            announcementTitle: announcement.title
          });
          return shouldShowQR;
        })() && (
          <motion.div
            className={cn(
              "flex flex-col items-start gap-4 xl:gap-6",
              layoutType === 'card' ? "mt-auto" : ""
            )}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className={cn(
              "bg-white shadow-2xl flex items-center justify-center p-2",
              orientation === 'portrait'
                ? "w-32 xl:w-40 2xl:w-48 3xl:w-56 4xl:w-64 h-32 xl:h-40 2xl:h-48 3xl:h-56 4xl:h-64"
                : "w-40 xl:w-48 2xl:w-56 3xl:w-64 4xl:w-72 h-40 xl:h-48 2xl:h-56 3xl:h-64 4xl:h-72"
            )}>
              {(() => {
                // Calculate QR code size based on container dimensions
                // Container sizes from className:
                // Portrait: w-32(128px) xl:w-40(160px) 2xl:w-48(192px) 3xl:w-56(224px) 4xl:w-64(256px)
                // Landscape: w-40(160px) xl:w-48(192px) 2xl:w-56(224px) 3xl:w-64(256px) 4xl:w-72(288px)
                
                let qrSize: number;
                
                if (screenMetrics?.width) {
                  // Calculate based on screen width and orientation
                  if (orientation === 'portrait') {
                    // Portrait: use 12-15% of screen width, max 256px
                    qrSize = Math.min(Math.floor(screenMetrics.width * 0.13), 256);
                  } else {
                    // Landscape: use 10-12% of screen width, max 288px
                    qrSize = Math.min(Math.floor(screenMetrics.width * 0.11), 288);
                  }
                  // Account for padding (p-2 = 8px on each side = 16px total)
                  qrSize = Math.max(qrSize - 16, 100); // Minimum 100px
                } else {
                  // Fallback sizes
                  qrSize = orientation === 'portrait' ? 120 : 150;
                }
                
                return (
                  <QRCode 
                    value={announcement.primary_link} 
                    size={qrSize}
                    className="w-full h-full"
                  />
                );
              })()}
            </div>
            <p className={cn(
              "opacity-80 text-left font-medium text-black",
              orientation === 'portrait'
                ? "text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl 4xl:text-5xl"
                : "text-2xl xl:text-3xl 2xl:text-4xl 3xl:text-5xl 4xl:text-6xl"
            )}>
              Scan to view event
            </p>
          </motion.div>
        )}

        {/* Metadata Display */}
        <motion.div
          key={`metadata-${animationKey}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
        >
          <AnnouncementMetadata 
            announcement={announcement}
            orientation={orientation}
            showPriorityBadge={showPriorityBadge}
            showVisibilityBadge={showVisibilityBadge}
            textSizes={textSizes}
            className="mt-8"
            iconSizeMultiplier={iconSizeMultiplier}
            screenMetrics={screenMetrics}
            responsiveSizes={responsiveSizes}
          />
        </motion.div>

        {/* Learn More Button */}
        {showLearnMore && (
          <motion.div
            key={`learn-more-${animationKey}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
          >
            <motion.a
              href={organizationSlug ? `/o/${organizationSlug}/announcements/${announcement.id}` : `/announcements/${announcement.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-4 xl:gap-6 px-12 xl:px-16 2xl:px-20 3xl:px-24 py-6 xl:py-8 2xl:py-10 3xl:py-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all font-bold",
                styles.text || "text-white",
                orientation === 'portrait'
                  ? "text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl 4xl:text-8xl"
                  : "text-4xl xl:text-5xl 2xl:text-6xl 3xl:text-7xl 4xl:text-9xl"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Learn More</span>
              <ExternalLink 
                className={cn(styles.text || "text-white")}
                size={getIconSize('small')} 
              />
            </motion.a>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
