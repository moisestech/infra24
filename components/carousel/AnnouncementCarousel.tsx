'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { Announcement } from '@/types/announcement';
import { PatternTemplate } from './PatternTemplate';
import { CarouselControls } from './CarouselControls';
import { getIconForAnnouncement, getStylesForAnnouncement } from './announcement-styles';
import { useOrganizationTheme } from './OrganizationThemeContext';
import { TextSizeControls } from './DevTextSizeControls';

interface AnnouncementCarouselProps {
  announcements: Announcement[];
  organizationSlug?: string;
}

export function AnnouncementCarousel({ announcements, organizationSlug }: AnnouncementCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
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
  const [iconSizeMultiplier, setIconSizeMultiplier] = useState(1);
  const [avatarSizeMultiplier, setAvatarSizeMultiplier] = useState(5);
  const [showTags, setShowTags] = useState(false);
  const [showPriorityBadge, setShowPriorityBadge] = useState(false);
  const [showVisibilityBadge, setShowVisibilityBadge] = useState(false);
  const { theme: organizationTheme } = useOrganizationTheme();

  // Filter active announcements (show all active announcements, not just future ones)
  const futureAnnouncements = useMemo(() => {
    return announcements.filter(announcement => {
      // Show all active announcements
      return announcement.is_active === true;
    });
  }, [announcements]);

  // Auto-play functionality
  useEffect(() => {
    if (!emblaApi || isPaused || futureAnnouncements.length <= 1) return;

    const autoPlay = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000); // 5 seconds per slide

    return () => clearInterval(autoPlay);
  }, [emblaApi, isPaused, futureAnnouncements.length]);

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

  // Handle orientation changes - using 1.37 ratio (1280x934) for landscape
  useEffect(() => {
    const updateOrientation = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const ratio = width / height;
      
      // Use 1.37 ratio threshold for landscape (1280x934)
      setOrientation(ratio >= 1.37 ? 'landscape' : 'portrait');
    };

    updateOrientation();
    window.addEventListener('resize', updateOrientation);
    window.addEventListener('orientationchange', updateOrientation);

    return () => {
      window.removeEventListener('resize', updateOrientation);
      window.removeEventListener('orientationchange', updateOrientation);
    };
  }, []);

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
        onIconSizeChange={setIconSizeMultiplier}
        onAvatarSizeChange={setAvatarSizeMultiplier}
        onShowTagsChange={setShowTags}
        onShowPriorityBadgeChange={setShowPriorityBadge}
        onShowVisibilityBadgeChange={setShowVisibilityBadge}
      />

      {/* Carousel Controls */}
      <CarouselControls
        onPrevious={scrollPrev}
        onNext={scrollNext}
        onTogglePlayPause={togglePlayPause}
        isPaused={isPaused}
        currentIndex={currentIndex}
        totalItems={futureAnnouncements.length}
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
                announcement={announcement}
                styles={getStylesForAnnouncement(announcement)}
                IconComponent={getIconForAnnouncement(announcement)}
                orientation={orientation}
                showQRCode={showQRCode}
                setShowQRCode={setShowQRCode}
                organizationSlug={organizationSlug}
                organizationTheme={organizationTheme}
                textSizes={textSizes}
                iconSizeMultiplier={iconSizeMultiplier}
                avatarSizeMultiplier={avatarSizeMultiplier}
                showTags={showTags}
                showPriorityBadge={showPriorityBadge}
                showVisibilityBadge={showVisibilityBadge}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
