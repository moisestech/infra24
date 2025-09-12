'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { Announcement } from '@/types/announcement';
import { PatternTemplate } from './PatternTemplate';
import { CarouselControls } from './CarouselControls';
import { getIconForAnnouncement, getStylesForAnnouncement } from './announcement-styles';
import { useOrganizationTheme } from './OrganizationThemeContext';
import { DevTextSizeControls } from './DevTextSizeControls';

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
  const [textSizeMultiplier, setTextSizeMultiplier] = useState(1);
  const { theme: organizationTheme } = useOrganizationTheme();

  // Filter future announcements
  const futureAnnouncements = useMemo(() => {
    const now = new Date();
    return announcements.filter(announcement => {
      const eventDate = announcement.starts_at || announcement.created_at;
      return new Date(eventDate) >= now;
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

  // Handle orientation changes
  useEffect(() => {
    const updateOrientation = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const ratio = width / height;
      
      setOrientation(ratio > 1.2 ? 'landscape' : 'portrait');
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
    <div className="relative h-screen bg-white">
      {/* Dev Controls - Only show in development */}
      {process.env.NODE_ENV === 'development' && (
        <DevTextSizeControls onTextSizeChange={setTextSizeMultiplier} />
      )}

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
                textSizeMultiplier={textSizeMultiplier}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
