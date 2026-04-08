'use client';

import { useState, useEffect } from 'react';
import { PatternTemplate } from '@/components/carousel/PatternTemplate';
import {
  getIconForAnnouncement,
  getStylesForAnnouncement,
} from '@/components/carousel/announcement-styles';
import { useOrganizationTheme } from '@/components/carousel/OrganizationThemeContext';
import {
  calculateScreenMetrics,
  getResponsiveTextSizes,
  type ResponsiveSizes,
} from '@/components/carousel/ResponsiveSizing';
import type { Announcement } from '@/types/announcement';

interface FullScreenAnnouncementProps {
  announcement: Announcement;
  organizationSlug: string;
  cleanViewMode?: boolean;
  hideDates?: boolean;
}

export function FullScreenAnnouncement({
  announcement,
  organizationSlug,
  cleanViewMode = false,
  hideDates = false,
}: FullScreenAnnouncementProps) {
  const { theme: organizationTheme } = useOrganizationTheme();
  const initialMetrics = calculateScreenMetrics();
  const initialSizes = getResponsiveTextSizes(initialMetrics);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(initialMetrics.orientation);
  const [screenMetrics, setScreenMetrics] = useState(initialMetrics);
  const [responsiveSizes, setResponsiveSizes] = useState<ResponsiveSizes>(initialSizes);
  const [showQRCode, setShowQRCode] = useState(false);

  const [textSizes, setTextSizes] = useState({
    title: 'text-6xl',
    description: initialSizes.description,
    location: initialSizes.location,
    date: initialSizes.date,
    type: 'text-4xl',
    metadata: initialSizes.metadata,
    startDate: 'text-3xl',
    endDate: 'text-3xl',
    duration: 'text-3xl',
  });
  const [iconSizeMultiplier] = useState(2.5);
  const [avatarSizeMultiplier] = useState(initialSizes.avatarMultiplier);

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

  return (
    <div className="relative w-full max-w-full h-screen overflow-hidden bg-white">
      <PatternTemplate
        announcement={announcement}
        styles={getStylesForAnnouncement(announcement, organizationSlug)}
        IconComponent={getIconForAnnouncement(announcement)}
        orientation={orientation}
        showQRCode={showQRCode}
        setShowQRCode={setShowQRCode}
        showQRCodeButton
        showLearnMore
        organizationSlug={organizationSlug}
        organizationTheme={organizationTheme}
        textSizes={textSizes}
        iconSizeMultiplier={iconSizeMultiplier}
        avatarSizeMultiplier={avatarSizeMultiplier}
        showTags={false}
        showPriorityBadge={false}
        showVisibilityBadge={false}
        screenMetrics={screenMetrics}
        responsiveSizes={responsiveSizes}
        isActive
        animationsPaused={cleanViewMode}
        slideIndex={0}
        hideAnnouncementDates={hideDates}
      />
    </div>
  );
}
