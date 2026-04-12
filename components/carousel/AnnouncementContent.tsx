'use client';

import { useEffect, useState } from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { TypeStyle } from './announcement-styles';
import { AnnouncementMetadata } from './AnnouncementMetadata';
import QRCode from '@/components/ui/QRCode';
import {
  announcementHasScannableDestination,
  buildAnnouncementScanPath,
} from '@/lib/announcements/scan-target';

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
  animationsPaused?: boolean;
  hideAnnouncementDates?: boolean;
  /** Fullscreen smart-sign card: solid light surface (readable dark text) */
  minimalImageFrame?: boolean;
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
  isActive = false,
  animationsPaused = false,
  hideAnnouncementDates = false,
  minimalImageFrame = false,
}: AnnouncementContentProps) {
  const isImageOnly = announcement?.metadata?.image_only === true;
  const lightCardSurface = Boolean(minimalImageFrame && layoutType === 'card');
  const fg = lightCardSurface ? 'text-gray-900' : styles.text || 'text-white';
  const fgSoft = lightCardSurface ? 'text-gray-600' : styles.text || 'text-white';
  if (isImageOnly) {
    return null;
  }
  
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
    return finalSize;
  };

  // Log screen size, icon size, and location icon size for debugging
  useEffect(() => {
    if (screenMetrics && screenMetrics.width && screenMetrics.height) {
      const badgeIconSize = layoutType === 'card' ? getIconSize('small') : getIconSize('medium');
      const locationIconSize = layoutType === 'card' ? getIconSize('small') : getIconSize('medium');
      console.log('[AnnouncementContent]', {
        screenSize: `${screenMetrics.width}×${screenMetrics.height}`,
        iconSizeMultiplier,
        badgeIconSize: `${badgeIconSize}px`,
        locationIconSize: `${locationIconSize}px`,
      });
    }
  }, [screenMetrics?.width, screenMetrics?.height, iconSizeMultiplier, layoutType]);

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

  // Rendering log removed to reduce console noise

  // DEBUG: colored backgrounds to see layout bounds (set true for debugging)
  const DEBUG_LAYOUT = false;

  const [scanOrigin, setScanOrigin] = useState('');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setScanOrigin(window.location.origin);
    }
  }, []);

  const stableScanUrl =
    scanOrigin && organizationSlug && announcement.id
      ? `${scanOrigin}${buildAnnouncementScanPath(organizationSlug, announcement.id)}`
      : '';

  return (
    <div 
      className={cn(
        "relative z-30 h-full flex flex-col w-full min-w-0",
        layoutType === 'card' ? "justify-between p-0 space-y-4 md:space-y-6 xl:space-y-8" : "justify-center",
        layoutType === 'card' ? "flex-1" : getPaddingClass(),
        layoutType !== 'card' && "space-y-16 xl:space-y-20 2xl:space-y-24 3xl:space-y-28 max-w-4xl xl:max-w-6xl 2xl:max-w-7xl 3xl:max-w-8xl",
        DEBUG_LAYOUT && "bg-blue-500/40"
      )}
      style={{ maxWidth: '100%', width: '100%', boxSizing: 'border-box' }}
    >
        {/* Type Badge - icon and category side by side */}
        <div 
          className={cn(
            'inline-flex items-center gap-2 flex-nowrap rounded-full',
            lightCardSurface
              ? 'border border-gray-200 bg-gray-100'
              : 'bg-white/10 backdrop-blur-sm',
            layoutType === 'card' 
              ? "gap-2 px-4 py-2 md:px-5 md:py-2.5 xl:px-6 xl:py-3" 
              : "gap-4 xl:gap-6 px-8 xl:px-12 py-4 xl:py-6",
            DEBUG_LAYOUT && "border-2 border-red-500"
          )}
        >
          <span className={cn("flex-shrink-0 flex items-center justify-center", DEBUG_LAYOUT && "bg-green-500/60 p-1 rounded")}>
            <IconComponent 
              className={cn(fg)} 
              size={layoutType === 'card' ? getIconSize('small') : getIconSize('medium')} 
            />
          </span>
          <div className={cn("flex items-center gap-2 flex-nowrap min-w-0", DEBUG_LAYOUT && "bg-purple-500/60 px-2 py-1 rounded")}>
            <span className={cn(
              "font-bold break-words whitespace-normal",
              fg,
              textSizes.type
            )}>
              {announcement.type?.replace('_', ' ').toUpperCase() || 'EVENT'}
            </span>
            {announcement.sub_type && (
              <span className={cn(
                "font-medium opacity-70 break-words whitespace-normal",
                fgSoft,
                textSizes.type
              )}>
                • {announcement.sub_type.replace('_', ' ').toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* Date - in-flow for card layout (no overlay). Only show event time from starts_at, not posted time from created_at */}
        {!hideAnnouncementDates && layoutType === 'card' && (announcement.type as string) !== 'fun_fact' && (() => {
          const eventDate = announcement.starts_at || announcement.created_at;
          if (!eventDate) return null;
          const d = new Date(eventDate);
          const dayOfWeek = d.toLocaleString('en-US', { weekday: 'long' });
          const dateStr = `${d.toLocaleString('en-US', { month: 'short' })} ${d.getDate()}`;
          // Only show time when it's from starts_at (event time), not created_at (posted time)
          const hasEventTime = !!announcement.starts_at;
          const timeStr = hasEventTime ? d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : null;
          const showTime = hasEventTime && timeStr && timeStr !== '12:00 AM';
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          d.setHours(0, 0, 0, 0);
          const isToday = d.getTime() === today.getTime();
          return (
            <div className="flex flex-col gap-1">
              <div className={cn('font-semibold', lightCardSurface ? 'text-gray-800' : 'text-white/90', textSizes.date)}>
                {dayOfWeek} · {dateStr}
                {showTime && ` · ${timeStr}`}
              </div>
              {isToday && (
                <span className="inline-flex w-fit rounded-full bg-green-500/90 px-3 py-1 text-sm font-medium text-white">
                  Today
                </span>
              )}
            </div>
          );
        })()}

        {/* Title */}
        <h1 
          className={cn(
            "font-black leading-tight break-words whitespace-normal",
            fg,
            textSizes.title
          )}
          style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
        >
          {announcement.title}
        </h1>

        {/* Description - First sentence only */}
        {announcement.body && (
          <p 
            className={cn(
              "font-medium leading-relaxed opacity-90 break-words whitespace-normal text-black",
              textSizes.description
            )}
            style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
          >
            {(() => {
              // Extract first sentence (ending with . ! or ?)
              const firstSentenceMatch = announcement.body.match(/^[^.!?]+[.!?]/);
              return firstSentenceMatch ? firstSentenceMatch[0].trim() : announcement.body.split('.')[0] + '.';
            })()}
          </p>
        )}

        {/* Location */}
        {announcement.location && (
          <div 
            className={cn(
              "flex items-center gap-2 md:gap-4 flex-wrap",
              textSizes.location
            )}
          >
            <MapPin 
              className="opacity-80 flex-shrink-0 text-black"
              size={layoutType === 'card' ? getIconSize('small') : getIconSize('medium')} 
            />
            <span className="opacity-80 font-medium break-words whitespace-normal text-black" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
              {announcement.location}
            </span>
          </div>
        )}

        {/* QR encodes stable /scan URL → redirects to qr_destination_url or primary_link */}
        {showQRCodeButton &&
          stableScanUrl &&
          announcementHasScannableDestination(announcement) && (
          <div
            className={cn(
              "flex flex-col items-start gap-4 xl:gap-6",
              layoutType === 'card' ? "mt-auto" : ""
            )}
          >
            <div className={cn(
              "bg-white shadow-2xl flex items-center justify-center p-2",
              orientation === 'portrait'
                ? "w-32 xl:w-40 2xl:w-48 3xl:w-56 4xl:w-64 h-32 xl:h-40 2xl:h-48 3xl:h-56 4xl:h-64"
                : "w-40 xl:w-48 2xl:w-56 3xl:w-64 4xl:w-72 h-40 xl:h-48 2xl:h-56 3xl:h-64 4xl:h-72"
            )}>
              {(() => {
                let qrSize: number;
                if (screenMetrics?.width) {
                  if (orientation === 'portrait') {
                    qrSize = Math.min(Math.floor(screenMetrics.width * 0.13), 256);
                  } else {
                    qrSize = Math.min(Math.floor(screenMetrics.width * 0.11), 288);
                  }
                  qrSize = Math.max(qrSize - 16, 100);
                } else {
                  qrSize = orientation === 'portrait' ? 120 : 150;
                }
                return (
                  <QRCode
                    value={stableScanUrl}
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
              Scan for more
            </p>
          </div>
        )}

        {/* Metadata Display */}
        <div>
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
        </div>

        {/* Learn More Button */}
        {showLearnMore && (
          <div>
            <a
              href={organizationSlug ? `/o/${organizationSlug}/announcements/${announcement.id}` : `/announcements/${announcement.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'inline-flex items-center gap-4 xl:gap-6 px-12 xl:px-16 2xl:px-20 3xl:px-24 py-6 xl:py-8 2xl:py-10 3xl:py-12 rounded-full font-bold transition-all',
                lightCardSurface
                  ? 'bg-gray-900 text-white hover:bg-gray-800'
                  : 'bg-white/20 text-white backdrop-blur-sm hover:bg-white/30',
                orientation === 'portrait'
                  ? "text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl 4xl:text-8xl"
                  : "text-4xl xl:text-5xl 2xl:text-6xl 3xl:text-7xl 4xl:text-9xl"
              )}
            >
              <span>Learn More</span>
              <ExternalLink 
                className={cn(lightCardSurface ? 'text-white' : fg)}
                size={getIconSize('small')} 
              />
            </a>
          </div>
        )}
    </div>
  );
}
