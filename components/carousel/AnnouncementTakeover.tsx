'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  announcementHasScannableDestination,
  buildAnnouncementScanPath,
} from '@/lib/announcements/scan-target';
import type { Announcement } from '@/types/announcement';
import {
  getTakeoverMode,
  resolveTakeoverOverlayConfig,
  shouldShowTakeoverAppQr,
  shouldShowTakeoverViewDetails,
  type ResolvedTakeoverMedia,
} from '@/lib/display/announcement-display-mode';
import { AnnouncementTakeoverOverlay } from './AnnouncementTakeoverOverlay';
import { TakeoverAssetQr } from './TakeoverAssetQr';
import { TakeoverVideoBackground } from './TakeoverVideoBackground';
import { TypeStyle } from './announcement-styles';
import { LucideIcon } from 'lucide-react';
import type { ScreenMetrics, ResponsiveSizes } from './ResponsiveSizing';

interface AnnouncementTakeoverProps {
  announcement: Announcement;
  media: ResolvedTakeoverMedia;
  organizationSlug?: string;
  organizationTheme?: unknown;
  showQRCode?: boolean;
  setShowQRCode?: (show: boolean) => void;
  showQRCodeButton?: boolean;
  styles: TypeStyle;
  IconComponent: LucideIcon;
  orientation: 'portrait' | 'landscape';
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
  isActive?: boolean;
}

function takeoverVideoPosterUrl(announcement: Announcement, mediaUrl: string): string | undefined {
  const imageUrl = announcement.image_url?.trim();
  if (imageUrl && !/\.(mp4|webm|ogg|mov)(\?|$)/i.test(imageUrl)) {
    return imageUrl;
  }
  if (mediaUrl.includes('res.cloudinary.com') && mediaUrl.includes('/video/upload/')) {
    return mediaUrl
      .replace('/video/upload/', '/video/upload/so_0/')
      .replace(/\.(mp4|webm|mov|ogg)(\?.*)?$/i, '.jpg');
  }
  return undefined;
}

export function AnnouncementTakeover({
  announcement,
  media,
  organizationSlug,
  organizationTheme,
  showQRCode = false,
  setShowQRCode = () => {},
  showQRCodeButton = true,
  styles,
  IconComponent,
  orientation,
  textSizes,
  iconSizeMultiplier = 1,
  avatarSizeMultiplier = 5,
  screenMetrics,
  responsiveSizes,
  animationsPaused = false,
  hideAnnouncementDates = false,
  isActive = true,
}: AnnouncementTakeoverProps) {
  const [scanOrigin, setScanOrigin] = useState('');
  const mode = getTakeoverMode(announcement.metadata);
  const overlayConfig = resolveTakeoverOverlayConfig(announcement.metadata);
  const hasScannable = announcementHasScannableDestination(announcement);
  const showAppQr =
    mode === 'asset' &&
    shouldShowTakeoverAppQr(announcement.metadata, {
      carouselQrEnabled: showQRCodeButton,
      hasScannableDestination: hasScannable,
    }) &&
    Boolean(organizationSlug) &&
    Boolean(scanOrigin);
  const showViewDetails =
    mode === 'asset' && shouldShowTakeoverViewDetails(announcement.metadata);
  const stableScanUrl =
    scanOrigin && organizationSlug && announcement.id
      ? `${scanOrigin}${buildAnnouncementScanPath(organizationSlug, announcement.id)}`
      : '';

  useEffect(() => {
    if (typeof window !== 'undefined') setScanOrigin(window.location.origin);
  }, []);

  return (
    <div className="relative h-full w-full min-h-0 overflow-hidden bg-black">
      {media.kind === 'video' ? (
        <TakeoverVideoBackground
          src={media.url}
          label={announcement.title || 'Announcement video'}
          poster={takeoverVideoPosterUrl(announcement, media.url)}
          isActive={isActive}
          paused={animationsPaused}
        />
      ) : (
        <Image
          src={media.url}
          alt={announcement.title || 'Announcement'}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      )}

      {mode === 'asset' && showAppQr && stableScanUrl && (
        <TakeoverAssetQr
          scanUrl={stableScanUrl}
          orientation={orientation}
          screenMetrics={screenMetrics}
        />
      )}

      {showViewDetails && (
        <div className="absolute bottom-6 right-6 z-30">
          <a
            href={
              organizationSlug
                ? `/o/${organizationSlug}/announcements/${announcement.id}`
                : `/announcements/${announcement.id}`
            }
            className="inline-flex items-center gap-2 rounded-full bg-black/45 px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-white backdrop-blur-sm transition-colors hover:bg-black/60"
          >
            View details
          </a>
        </div>
      )}

      {mode === 'overlay' && (
        <AnnouncementTakeoverOverlay
          announcement={announcement}
          styles={styles}
          IconComponent={IconComponent}
          orientation={orientation}
          organizationSlug={organizationSlug}
          organizationTheme={organizationTheme}
          showQRCode={showQRCode}
          setShowQRCode={setShowQRCode}
          showQRCodeButton={showQRCodeButton}
          textSizes={textSizes}
          iconSizeMultiplier={iconSizeMultiplier}
          avatarSizeMultiplier={avatarSizeMultiplier}
          screenMetrics={screenMetrics}
          responsiveSizes={responsiveSizes}
          animationsPaused={animationsPaused}
          hideAnnouncementDates={hideAnnouncementDates}
          overlayConfig={overlayConfig}
        />
      )}
    </div>
  );
}
