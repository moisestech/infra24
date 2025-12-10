'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Announcement, ImageLayoutType } from '@/types/announcement';
import { PatternTemplate } from './PatternTemplate';
import { CarouselControls } from './CarouselControls';
import { getIconForAnnouncement, getStylesForAnnouncement } from './announcement-styles';
import { useOrganizationTheme } from './OrganizationThemeContext';
import { TextSizeControls } from './DevTextSizeControls';
import { calculateScreenMetrics, getResponsiveTextSizes, type ResponsiveSizes } from './ResponsiveSizing';

interface ImageSettings {
  layout?: ImageLayoutType;
  scale?: number;
  splitPercentage?: number;
  opacity?: number;
}

interface AnnouncementCarouselProps {
  announcements: Announcement[];
  organizationSlug?: string;
  cleanViewMode?: boolean;
}

export function AnnouncementCarousel({ announcements, organizationSlug, cleanViewMode = false }: AnnouncementCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'start',
    duration: 25,
    startIndex: 0,
    skipSnaps: false,
    dragFree: false
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false); // Hide QR code by default
  const [showQRCodeButton, setShowQRCodeButton] = useState(false); // Disabled until QR code is fully tested
  const [showLearnMore, setShowLearnMore] = useState(false); // Hide Learn More button by default
  const initialMetrics = calculateScreenMetrics();
  const initialSizes = getResponsiveTextSizes(initialMetrics);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(initialMetrics.orientation);
  
  // Initial calculation log removed to reduce console noise
  
  const [screenMetrics, setScreenMetrics] = useState(initialMetrics);
  const [responsiveSizes, setResponsiveSizes] = useState<ResponsiveSizes>(initialSizes);
  const [textSizes, setTextSizes] = useState({
    title: initialSizes.title,
    description: initialSizes.description,
    location: initialSizes.location,
    date: initialSizes.date,
    type: initialSizes.type,
    metadata: initialSizes.metadata,
    startDate: 'text-3xl',
    endDate: 'text-3xl',
    duration: 'text-3xl'
  });
  const [iconSizeMultiplier, setIconSizeMultiplier] = useState(initialSizes.iconMultiplier);
  const [avatarSizeMultiplier, setAvatarSizeMultiplier] = useState(initialSizes.avatarMultiplier);
  
  // Initial state log removed to reduce console noise
  const [showTags, setShowTags] = useState(false);
  const [showPriorityBadge, setShowPriorityBadge] = useState(false);
  const [showVisibilityBadge, setShowVisibilityBadge] = useState(false);
  const { theme: organizationTheme } = useOrganizationTheme();
  
  // Per-announcement image settings
  const [perAnnouncementImageSettings, setPerAnnouncementImageSettings] = useState<Map<string, ImageSettings>>(new Map());
  
  // Per-announcement display durations (in milliseconds)
  const [perAnnouncementDurations, setPerAnnouncementDurations] = useState<Map<string, number>>(new Map());
  
  // Countdown timer state
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  // Load persisted settings from localStorage on mount
  useEffect(() => {
    try {
      const savedImageSettings = localStorage.getItem('announcementImageSettings');
      const savedDurations = localStorage.getItem('announcementDurations');
      
      if (savedImageSettings) {
        const parsed = JSON.parse(savedImageSettings);
        const settingsMap = new Map<string, ImageSettings>();
        Object.entries(parsed).forEach(([id, settings]) => {
          settingsMap.set(id, settings as ImageSettings);
        });
        setPerAnnouncementImageSettings(settingsMap);
      }
      
      if (savedDurations) {
        const parsed = JSON.parse(savedDurations);
        const durationsMap = new Map<string, number>();
        Object.entries(parsed).forEach(([id, duration]) => {
          durationsMap.set(id, duration as number);
        });
        setPerAnnouncementDurations(durationsMap);
      }
    } catch (error) {
      console.error('Failed to load persisted settings:', error);
    }
  }, []);

  // Persist image settings to localStorage
  useEffect(() => {
    try {
      const settingsObj = Object.fromEntries(perAnnouncementImageSettings);
      localStorage.setItem('announcementImageSettings', JSON.stringify(settingsObj));
    } catch (error) {
      console.error('Failed to save image settings:', error);
    }
  }, [perAnnouncementImageSettings]);

  // Persist durations to localStorage
  useEffect(() => {
    try {
      const durationsObj = Object.fromEntries(perAnnouncementDurations);
      localStorage.setItem('announcementDurations', JSON.stringify(durationsObj));
    } catch (error) {
      console.error('Failed to save durations:', error);
    }
  }, [perAnnouncementDurations]);

  // Filter active announcements (show all active announcements, not just future ones)
  // Also deduplicate by ID to prevent duplicates from showing
  // IMPORTANT: Preserves the exact order from the API - no sorting or randomization
  const futureAnnouncements = useMemo(() => {
    const published = announcements.filter(announcement => {
      // Show all published announcements
      return announcement.status === 'published';
    });
    
    // Deduplicate by ID (keep first occurrence) - preserves order
    const seen = new Set<string>();
    const filtered = published.filter(announcement => {
      if (seen.has(announcement.id)) {
        console.warn('⚠️ Duplicate announcement detected:', announcement.title, announcement.id);
        return false;
      }
      seen.add(announcement.id);
      return true;
    });
    
    // Log the filtered announcements list in order (concise)
    if (filtered.length > 0) {
      console.log('🎠 CAROUSEL ORDER:', filtered.length, 'announcements - autoplay follows this sequence');
    }
    
    return filtered;
  }, [announcements]);
  
  // Log carousel initialization with all announcements (only once)
  useEffect(() => {
    if (futureAnnouncements.length > 0) {
      console.log('🎠 CAROUSEL INITIALIZED:', {
        total: futureAnnouncements.length,
        autoplay: !isPaused && futureAnnouncements.length > 1 ? 'ON' : 'OFF',
        order: futureAnnouncements.map((ann, idx) => `${idx + 1}. ${ann.title?.substring(0, 40)}...`).join('\n')
      });
    }
  }, [futureAnnouncements.length]); // Only log when count changes, not on every render

  // Get current announcement
  const currentAnnouncement = futureAnnouncements[currentIndex];
  const currentAnnouncementId = currentAnnouncement?.id;
  const currentDuration = currentAnnouncementId 
    ? (perAnnouncementDurations.get(currentAnnouncementId) || 10000)
    : 10000;
  
  // Log current announcement details when it changes (only on index change, not on every render)
  useEffect(() => {
    if (currentAnnouncement) {
      console.log('📌 CAROUSEL: Slide changed', {
        position: `${currentIndex + 1}/${futureAnnouncements.length}`,
        title: currentAnnouncement.title,
        duration: `${currentDuration / 1000}s`,
        autoplay: !isPaused ? 'ON' : 'OFF'
      });
    }
  }, [currentIndex, currentAnnouncement?.id]); // Removed other deps to reduce logging

  // Refs to manage autoplay interval and timer state
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeRemainingRef = useRef<number | null>(null);
  const emblaApiRef = useRef(emblaApi);
  const isPausedRef = useRef(isPaused);
  const futureAnnouncementsRef = useRef(futureAnnouncements);
  const perAnnouncementDurationsRef = useRef(perAnnouncementDurations);

  // Keep refs in sync
  useEffect(() => {
    emblaApiRef.current = emblaApi;
    isPausedRef.current = isPaused;
    futureAnnouncementsRef.current = futureAnnouncements;
    perAnnouncementDurationsRef.current = perAnnouncementDurations;
  }, [emblaApi, isPaused, futureAnnouncements, perAnnouncementDurations]);

  // Auto-play functionality with per-announcement durations
  // Ensures announcements play in the exact same order as arrow navigation (0, 1, 2, 3...)
  useEffect(() => {
    // Clear existing interval if autoplay should be disabled
    if (!emblaApi || isPaused || futureAnnouncements.length <= 1) {
      setTimeRemaining(null);
      timeRemainingRef.current = null;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Create interval only once (timer will be initialized/reset in onSelect callback)
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        // Use refs to get current values (avoid stale closures)
        if (!emblaApiRef.current || isPausedRef.current) {
          return;
        }

        const currentTime = timeRemainingRef.current;
        if (currentTime === null || currentTime <= 0) {
          return;
        }

        const newTime = currentTime - 100;
        timeRemainingRef.current = newTime;
        setTimeRemaining(newTime);

        if (newTime <= 0) {
          // Get the actual current index from emblaApi
          const currentIdx = emblaApiRef.current.selectedScrollSnap();
          const expectedNextIdx = (currentIdx + 1) % futureAnnouncementsRef.current.length;
          
          // Only log when actually advancing
          console.log('⏭️ AUTOPLAY: Next →', {
            from: `${currentIdx + 1}/${futureAnnouncementsRef.current.length}`,
            to: `${expectedNextIdx + 1}/${futureAnnouncementsRef.current.length}`,
            title: futureAnnouncementsRef.current[expectedNextIdx]?.title?.substring(0, 50) || 'N/A'
          });
          
          // scrollNext() maintains the exact same order as clicking the next arrow button
          emblaApiRef.current.scrollNext();
          
          // Timer will be reset in onSelect callback when slide changes
        }
      }, 100); // Update every 100ms for smooth countdown
    }

    return () => {
      // Don't clear interval here - let it persist across renders
      // Only clear when autoplay is disabled or component unmounts
    };
  }, [emblaApi, isPaused, futureAnnouncements.length]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // Handle slide changes and ensure smooth transitions
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      const newIndex = emblaApi.selectedScrollSnap();
      const previousIndex = currentIndex;
      setCurrentIndex(newIndex);
      
      // Only log if index actually changed
      if (newIndex !== previousIndex) {
        const currentAnn = futureAnnouncements[newIndex];
        const loopedBack = previousIndex === futureAnnouncements.length - 1 && newIndex === 0;
        
        if (loopedBack) {
          console.log('🔁 CAROUSEL: Looped back to beginning');
        }
        
        // Reset autoplay timer when slide changes
        const currentAnnId = currentAnn?.id;
        const duration = currentAnnId 
          ? (perAnnouncementDurations.get(currentAnnId) || 10000)
          : 10000;
        timeRemainingRef.current = duration;
        setTimeRemaining(duration);
        
        // Detailed logging removed - handled by the current announcement effect above
      }
    };

    emblaApi.on('select', onSelect);
    onSelect(); // Set initial index

    // Add smooth transition to the carousel container (the flex div)
    const container = (emblaRef as any)?.current?.querySelector?.('.flex') as HTMLElement | undefined;
    if (container) {
      container.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, emblaRef, currentIndex, futureAnnouncements, isPaused]);

  // Track if user has manually changed icon/avatar sizes
  const [hasManualIconSize, setHasManualIconSize] = useState(false);
  const [hasManualAvatarSize, setHasManualAvatarSize] = useState(false);
  
      // Reset manual override when screen size changes to 1080x1808
  useEffect(() => {
    if (screenMetrics && screenMetrics.width === 1080 && screenMetrics.height === 1808) {
      setHasManualIconSize(false);
    }
  }, [screenMetrics?.width, screenMetrics?.height]);

  // Handle orientation and screen metrics changes
  useEffect(() => {
    const updateMetrics = () => {
      const metrics = calculateScreenMetrics();
      setScreenMetrics(metrics);
      setOrientation(metrics.orientation);
      
      // Update responsive sizes
      const newSizes = getResponsiveTextSizes(metrics);
      setResponsiveSizes(newSizes);
      
      // Update text sizes from responsive system
      setTextSizes({
        title: newSizes.title,
        description: newSizes.description,
        location: newSizes.location,
        date: newSizes.date,
        type: newSizes.type,
        metadata: newSizes.metadata,
        startDate: 'text-3xl',
        endDate: 'text-3xl',
        duration: 'text-3xl'
      });
      
      // Only update icon and avatar multipliers if user hasn't manually changed them
      // Special case: Always update for 1080x1808 screens (reset manual override)
      const is1080x1808 = metrics.width === 1080 && metrics.height === 1808;
      const shouldUpdate = !hasManualIconSize || is1080x1808;
      
      if (shouldUpdate) {
        if (is1080x1808 && hasManualIconSize) {
          setHasManualIconSize(false);
        }
        setIconSizeMultiplier(newSizes.iconMultiplier);
      }
      if (!hasManualAvatarSize) {
        setAvatarSizeMultiplier(newSizes.avatarMultiplier);
      }
    };

    updateMetrics();
    window.addEventListener('resize', updateMetrics);
    window.addEventListener('orientationchange', updateMetrics);

    return () => {
      window.removeEventListener('resize', updateMetrics);
      window.removeEventListener('orientationchange', updateMetrics);
    };
  }, [hasManualIconSize, hasManualAvatarSize]);

  // Navigation functions
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const togglePlayPause = useCallback(() => {
    setIsPaused(!isPaused);
  }, [isPaused]);

  // Handle image layout change
  const handleImageLayoutChange = useCallback((announcementId: string, layout: ImageLayoutType) => {
    setPerAnnouncementImageSettings(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(announcementId) || {};
      newMap.set(announcementId, { ...existing, layout });
      return newMap;
    });
  }, []);

  // Handle image settings change
  const handleImageSettingsChange = useCallback((announcementId: string, settings: Partial<ImageSettings>) => {
    setPerAnnouncementImageSettings(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(announcementId) || {};
      newMap.set(announcementId, { ...existing, ...settings });
      return newMap;
    });
  }, []);

  // Handle duration change
  const handleDurationChange = useCallback((announcementId: string, duration: number) => {
    setPerAnnouncementDurations(prev => {
      const newMap = new Map(prev);
      newMap.set(announcementId, duration);
      return newMap;
    });
  }, []);

  // Don't render if no announcements
  if (futureAnnouncements.length === 0) {
    return (
      <div className="relative h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">No Upcoming Events</h2>
          <p className="text-xl text-gray-600">Check back later for new announcements!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-white" style={{ aspectRatio: '1.37' }}>
      {/* Text Size Debug Controls - Available in production with ?debug=true */}
      {!cleanViewMode && (
        <TextSizeControls 
        onTextSizeChange={(element, size) => setTextSizes(prev => ({ ...prev, [element]: size }))} 
              onIconSizeChange={(size) => {
                console.log('🎛️ Manual icon size change from debug controls:', {
                  oldValue: iconSizeMultiplier,
                  newValue: size,
                  settingHasManualIconSize: true
                });
                setIconSizeMultiplier(size);
                setHasManualIconSize(true);
              }}
        onAvatarSizeChange={(size) => {
          setAvatarSizeMultiplier(size);
          setHasManualAvatarSize(true);
        }}
        onShowTagsChange={setShowTags}
        onShowPriorityBadgeChange={setShowPriorityBadge}
        onShowVisibilityBadgeChange={setShowVisibilityBadge}
        onShowQRCodeButtonChange={setShowQRCodeButton}
        onShowLearnMoreChange={setShowLearnMore}
        currentAnnouncementId={currentAnnouncementId}
        currentAnnouncementTitle={currentAnnouncement?.title}
        onImageLayoutChange={handleImageLayoutChange}
        onImageSettingsChange={handleImageSettingsChange}
        onDurationChange={handleDurationChange}
        currentDuration={currentDuration}
      />
      )}

      {/* Carousel Controls */}
      <CarouselControls
        onPrevious={scrollPrev}
        onNext={scrollNext}
        onTogglePlayPause={togglePlayPause}
        isPaused={isPaused}
        currentIndex={currentIndex}
        totalItems={futureAnnouncements.length}
        currentAnnouncementDuration={currentDuration}
        onDurationChange={(duration) => currentAnnouncementId && handleDurationChange(currentAnnouncementId, duration)}
        timeRemaining={timeRemaining}
        cleanViewMode={cleanViewMode}
      />

      {/* Carousel content */}
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full" style={{ transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
          {futureAnnouncements.map((announcement, index) => (
            <div 
              key={`${announcement.id}-${index}`}
              className="flex-[0_0_100%] min-w-0 relative h-full"
            >
              <PatternTemplate 
                key={`${announcement.id}-${currentIndex}-${index}`}
                announcement={announcement}
                styles={getStylesForAnnouncement(announcement, organizationSlug)}
                IconComponent={getIconForAnnouncement(announcement)}
                orientation={orientation}
                showQRCode={showQRCode}
                setShowQRCode={setShowQRCode}
                showQRCodeButton={showQRCodeButton}
                showLearnMore={showLearnMore}
                organizationSlug={organizationSlug}
                organizationTheme={organizationTheme}
                textSizes={textSizes}
                iconSizeMultiplier={iconSizeMultiplier}
                avatarSizeMultiplier={avatarSizeMultiplier}
                showTags={showTags}
                showPriorityBadge={showPriorityBadge}
                showVisibilityBadge={showVisibilityBadge}
                imageSettings={perAnnouncementImageSettings.get(announcement.id)}
                screenMetrics={screenMetrics}
                responsiveSizes={responsiveSizes}
                isActive={index === currentIndex}
                animationsPaused={cleanViewMode}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
