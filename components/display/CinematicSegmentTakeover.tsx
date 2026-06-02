'use client';

import { useState, useEffect } from 'react';
import { AnnouncementTakeover } from '@/components/carousel/AnnouncementTakeover';
import {
  getIconForAnnouncement,
  getStylesForAnnouncement,
} from '@/components/carousel/announcement-styles';
import {
  calculateScreenMetrics,
  getResponsiveTextSizes,
  type ResponsiveSizes,
} from '@/components/carousel/ResponsiveSizing';
import { resolveTakeoverMedia } from '@/lib/display/announcement-display-mode';
import type { Announcement } from '@/types/announcement';

interface CinematicSegmentTakeoverProps {
  announcement: Announcement;
  organizationSlug: string;
  cleanViewMode?: boolean;
}

/** Full-screen video/image takeover for the display program cinematic segment. */
export function CinematicSegmentTakeover({
  announcement,
  organizationSlug,
  cleanViewMode = false,
}: CinematicSegmentTakeoverProps) {
  const media = resolveTakeoverMedia(announcement);
  const initialMetrics = calculateScreenMetrics();
  const initialSizes = getResponsiveTextSizes(initialMetrics);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(initialMetrics.orientation);
  const [screenMetrics, setScreenMetrics] = useState(initialMetrics);
  const [responsiveSizes, setResponsiveSizes] = useState<ResponsiveSizes>(initialSizes);

  const textSizes = {
    title: 'text-6xl',
    description: initialSizes.description,
    location: initialSizes.location,
    date: initialSizes.date,
    type: 'text-4xl',
    metadata: initialSizes.metadata,
    startDate: 'text-3xl',
    endDate: 'text-3xl',
    duration: 'text-3xl',
  };

  useEffect(() => {
    const update = () => {
      const m = calculateScreenMetrics();
      setScreenMetrics(m);
      setOrientation(m.orientation);
      setResponsiveSizes(getResponsiveTextSizes(m));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  if (!media) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black text-white">
        No cinematic media
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <AnnouncementTakeover
        announcement={announcement}
        media={media}
        organizationSlug={organizationSlug}
        showQRCodeButton
        styles={getStylesForAnnouncement(announcement, organizationSlug)}
        IconComponent={getIconForAnnouncement(announcement)}
        orientation={orientation}
        textSizes={textSizes}
        iconSizeMultiplier={2.5}
        avatarSizeMultiplier={initialSizes.avatarMultiplier}
        screenMetrics={screenMetrics}
        responsiveSizes={responsiveSizes}
        animationsPaused={cleanViewMode}
        isActive
      />
    </div>
  );
}
