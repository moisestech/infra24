'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { useState, useCallback, useEffect, useMemo } from 'react';
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
}

export function AnnouncementCarousel({ announcements, organizationSlug }: AnnouncementCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false); // Hide QR code by default
  const [showQRCodeButton, setShowQRCodeButton] = useState(true); // Show QR code toggle button by default
  const [showLearnMore, setShowLearnMore] = useState(false); // Hide Learn More button by default
  const initialMetrics = calculateScreenMetrics();
  const initialSizes = getResponsiveTextSizes(initialMetrics);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(initialMetrics.orientation);
  
  console.log('🎬 AnnouncementCarousel initial calculation:', {
    metrics: {
      width: initialMetrics.width,
      height: initialMetrics.height,
      orientation: initialMetrics.orientation,
      isLargeDisplay: initialMetrics.isLargeDisplay
    },
    iconMultiplier: initialSizes.iconMultiplier
  });
  
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
  
  // Log initial state
  useEffect(() => {
    console.log('🎨 AnnouncementCarousel initial state:', {
      initialIconMultiplier: initialSizes.iconMultiplier,
      currentIconSizeMultiplier: iconSizeMultiplier,
      hasManualIconSize,
      screenMetrics: initialMetrics
    });
  }, []);
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
  const futureAnnouncements = useMemo(() => {
    return announcements.filter(announcement => {
      // Show all published announcements
      return announcement.status === 'published';
    });
  }, [announcements]);

  // Get current announcement
  const currentAnnouncement = futureAnnouncements[currentIndex];
  const currentAnnouncementId = currentAnnouncement?.id;
  const currentDuration = currentAnnouncementId 
    ? (perAnnouncementDurations.get(currentAnnouncementId) || 10000)
    : 10000;

  // Auto-play functionality with per-announcement durations
  useEffect(() => {
    if (!emblaApi || isPaused || futureAnnouncements.length <= 1) {
      setTimeRemaining(null);
      return;
    }

    const duration = currentDuration;
    setTimeRemaining(duration);

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null) return null;
        const newTime = prev - 100;
        if (newTime <= 0) {
          emblaApi.scrollNext();
          return duration;
        }
        return newTime;
      });
    }, 100); // Update every 100ms for smooth countdown

    return () => clearInterval(interval);
  }, [emblaApi, isPaused, futureAnnouncements.length, currentIndex, currentDuration]);

  // Handle slide changes
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCurrentIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    onSelect(); // Set initial index

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  // Track if user has manually changed icon/avatar sizes
  const [hasManualIconSize, setHasManualIconSize] = useState(false);
  const [hasManualAvatarSize, setHasManualAvatarSize] = useState(false);
  
  // Reset manual override when screen size changes to 1080x1808
  useEffect(() => {
    if (screenMetrics && screenMetrics.width === 1080 && screenMetrics.height === 1808) {
      console.log('🔄 1080x1808 detected - resetting manual icon size override');
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
          console.log('🔄 1080x1808 detected - forcing icon size update to 2.0x (overriding manual setting)');
          setHasManualIconSize(false);
        }
        console.log('🔄 Updating iconSizeMultiplier from responsive sizing:', {
          oldValue: iconSizeMultiplier,
          newValue: newSizes.iconMultiplier,
          hasManualIconSize: hasManualIconSize && !is1080x1808,
          is1080x1808,
          metrics: { width: metrics.width, height: metrics.height }
        });
        setIconSizeMultiplier(newSizes.iconMultiplier);
      } else {
        console.log('⚠️ Icon size multiplier NOT updated (manual override):', {
          currentValue: iconSizeMultiplier,
          responsiveValue: newSizes.iconMultiplier,
          hasManualIconSize
        });
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
      />

      {/* Carousel content */}
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
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
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
