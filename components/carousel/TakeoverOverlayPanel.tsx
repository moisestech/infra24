'use client';

import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Announcement } from '@/types/announcement';
import {
  formatTakeoverOverlaySchedule,
  takeoverOverlayLayout,
} from '@/lib/display/takeover-overlay-layout';
import type { ResolvedTakeoverOverlayConfig } from '@/lib/display/announcement-display-mode';
import {
  announcementHasScannableDestination,
  buildAnnouncementScanPath,
} from '@/lib/announcements/scan-target';
import QRCode from '@/components/ui/QRCode';
import { TypeStyle } from './announcement-styles';
import { LucideIcon } from 'lucide-react';
import type { ScreenMetrics } from './ResponsiveSizing';

interface TakeoverOverlayPanelProps {
  announcement: Announcement;
  styles: TypeStyle;
  IconComponent: LucideIcon;
  orientation: 'portrait' | 'landscape';
  organizationSlug?: string;
  config: ResolvedTakeoverOverlayConfig;
  showAppQr: boolean;
  textSizes?: {
    title: string;
    description: string;
    location: string;
    type: string;
  };
  iconSizeMultiplier?: number;
  screenMetrics?: ScreenMetrics;
}

export function TakeoverOverlayPanel({
  announcement,
  styles,
  IconComponent,
  orientation,
  organizationSlug,
  config,
  showAppQr,
  textSizes = {
    title: 'text-5xl',
    description: 'text-2xl',
    location: 'text-xl',
    type: 'text-lg',
  },
  iconSizeMultiplier = 1,
  screenMetrics,
}: TakeoverOverlayPanelProps) {
  const fg = styles.text || 'text-white';
  const fgSoft = styles.text || 'text-white';
  const schedule = formatTakeoverOverlaySchedule(announcement);

  const [scanOrigin, setScanOrigin] = useState('');
  useEffect(() => {
    if (typeof window !== 'undefined') setScanOrigin(window.location.origin);
  }, []);

  const stableScanUrl =
    scanOrigin && organizationSlug && announcement.id
      ? `${scanOrigin}${buildAnnouncementScanPath(organizationSlug, announcement.id)}`
      : '';

  const getIconSize = () => {
    const base = screenMetrics?.isLargeDisplay ? 40 : screenMetrics?.isConstrained ? 24 : 32;
    return Math.round(base * iconSizeMultiplier);
  };

  const getQrSize = () => {
    if (screenMetrics?.width) {
      const ratio = orientation === 'portrait' ? 0.14 : 0.12;
      return Math.max(Math.min(Math.floor(screenMetrics.width * ratio), 280), 112);
    }
    return orientation === 'portrait' ? 128 : 144;
  };

  return (
    <div className={takeoverOverlayLayout.panel}>
      <div className={takeoverOverlayLayout.textStack}>
        {config.show_date && (schedule.dateLine || schedule.timeLine) && (
          <div className={takeoverOverlayLayout.dateStack}>
            {schedule.dateLine && (
              <p className={takeoverOverlayLayout.dateLine}>{schedule.dateLine}</p>
            )}
            {schedule.timeLine && (
              <p className={takeoverOverlayLayout.timeLine}>{schedule.timeLine}</p>
            )}
          </div>
        )}

        {config.show_type_badge && (
          <div className={takeoverOverlayLayout.typeBadge}>
            <IconComponent className={cn(fg, 'shrink-0')} size={getIconSize()} />
            <span className={cn('font-bold uppercase tracking-wide', fg, textSizes.type)}>
              {announcement.type?.replace('_', ' ') || 'event'}
              {announcement.sub_type
                ? ` · ${announcement.sub_type.replace('_', ' ')}`
                : ''}
            </span>
          </div>
        )}

        {config.show_title && announcement.title && (
          <h1
            className={cn(
              'font-black break-words',
              takeoverOverlayLayout.title,
              fg,
              textSizes.title
            )}
            style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
          >
            {announcement.title}
          </h1>
        )}

        {config.show_body && announcement.body && (
          <p
            className={cn(
              'break-words font-medium whitespace-pre-line',
              takeoverOverlayLayout.body,
              fgSoft,
              textSizes.description
            )}
            style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
          >
            {announcement.body.trim()}
          </p>
        )}

        {config.show_location && announcement.location && (
          <div className={cn(takeoverOverlayLayout.locationRow, textSizes.location)}>
            <MapPin className="mt-1 shrink-0 text-white/75" size={getIconSize()} />
            <span className="font-medium text-white/80">{announcement.location}</span>
          </div>
        )}
      </div>

      {showAppQr &&
        stableScanUrl &&
        announcementHasScannableDestination(announcement) && (
          <div className={takeoverOverlayLayout.qrZone}>
            <div className={takeoverOverlayLayout.qrRow}>
              <div className="rounded-lg bg-white p-2 shadow-2xl">
                <QRCode value={stableScanUrl} size={getQrSize()} className="block" />
              </div>
              <p className={takeoverOverlayLayout.qrLabel}>Scan for more</p>
            </div>
          </div>
        )}
    </div>
  );
}
