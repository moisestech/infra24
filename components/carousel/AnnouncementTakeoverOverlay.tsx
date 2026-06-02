'use client';

import { cn } from '@/lib/utils';
import type { Announcement } from '@/types/announcement';
import {
  buildTakeoverAnnouncementProxy,
  resolveTakeoverOverlayConfig,
  shouldShowTakeoverAppQr,
  takeoverScrimClassName,
  type ResolvedTakeoverOverlayConfig,
} from '@/lib/display/announcement-display-mode';
import { announcementHasScannableDestination } from '@/lib/announcements/scan-target';
import { takeoverOverlayLayout } from '@/lib/display/takeover-overlay-layout';
import { AnnouncementPeople } from './AnnouncementPeople';
import { TakeoverOverlayPanel } from './TakeoverOverlayPanel';
import { TypeStyle } from './announcement-styles';
import { LucideIcon } from 'lucide-react';
import type { ScreenMetrics, ResponsiveSizes } from './ResponsiveSizing';

interface AnnouncementTakeoverOverlayProps {
  announcement: Announcement;
  styles: TypeStyle;
  IconComponent: LucideIcon;
  orientation: 'portrait' | 'landscape';
  organizationSlug?: string;
  organizationTheme?: unknown;
  showQRCode: boolean;
  setShowQRCode: (show: boolean) => void;
  showQRCodeButton?: boolean;
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
  avatarSizeMultiplier?: number;
  screenMetrics?: ScreenMetrics;
  responsiveSizes?: ResponsiveSizes;
  animationsPaused?: boolean;
  hideAnnouncementDates?: boolean;
  overlayConfig?: ResolvedTakeoverOverlayConfig;
}

export function AnnouncementTakeoverOverlay({
  announcement,
  styles,
  IconComponent,
  orientation,
  organizationSlug,
  showQRCodeButton = true,
  textSizes,
  iconSizeMultiplier = 1,
  avatarSizeMultiplier = 5,
  screenMetrics,
  hideAnnouncementDates = false,
  overlayConfig,
}: AnnouncementTakeoverOverlayProps) {
  const config = overlayConfig ?? resolveTakeoverOverlayConfig(announcement.metadata);
  const displayAnnouncement = buildTakeoverAnnouncementProxy(announcement);
  const scrimClass = takeoverScrimClassName(config.scrim);
  const showAppQr = shouldShowTakeoverAppQr(announcement.metadata, {
    carouselQrEnabled: showQRCodeButton,
    hasScannableDestination: announcementHasScannableDestination(announcement),
  });

  const showDateBlock =
    config.show_date && !hideAnnouncementDates && (announcement.type as string) !== 'fun_fact';

  const panelConfig: ResolvedTakeoverOverlayConfig = {
    ...config,
    show_date: showDateBlock,
  };

  return (
    <div className={takeoverOverlayLayout.root}>
      {scrimClass ? <div className={scrimClass} aria-hidden /> : null}

      <div className={takeoverOverlayLayout.topSpacer} aria-hidden />

      <div className="relative z-20 flex shrink-0 flex-col">
        {config.show_people &&
          Array.isArray(announcement.people) &&
          announcement.people.length > 0 && (
            <AnnouncementPeople
              people={announcement.people}
              orientation={orientation}
              avatarSizeMultiplier={avatarSizeMultiplier}
              className={cn(
                takeoverOverlayLayout.peopleSlot,
                'px-6 sm:px-10 md:px-14 xl:px-20 2xl:px-24'
              )}
            />
          )}

        {textSizes && (
          <TakeoverOverlayPanel
            announcement={displayAnnouncement}
            styles={styles}
            IconComponent={IconComponent}
            orientation={orientation}
            organizationSlug={organizationSlug}
            config={panelConfig}
            showAppQr={showAppQr}
            textSizes={{
              title: textSizes.title,
              description: textSizes.description,
              location: textSizes.location,
              type: textSizes.type,
            }}
            iconSizeMultiplier={iconSizeMultiplier}
            screenMetrics={screenMetrics}
          />
        )}
      </div>
    </div>
  );
}
