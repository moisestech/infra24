'use client';

import { cn } from '@/lib/utils';
import QRCode from '@/components/ui/QRCode';
import { takeoverOverlayLayout } from '@/lib/display/takeover-overlay-layout';
import type { ScreenMetrics } from './ResponsiveSizing';

interface TakeoverAssetQrProps {
  scanUrl: string;
  orientation: 'portrait' | 'landscape';
  screenMetrics?: ScreenMetrics;
}

/** Bottom-anchored QR for pre-designed takeover assets (image or video). */
export function TakeoverAssetQr({ scanUrl, orientation, screenMetrics }: TakeoverAssetQrProps) {
  const getQrSize = () => {
    if (screenMetrics?.width) {
      const ratio = orientation === 'portrait' ? 0.14 : 0.12;
      return Math.max(Math.min(Math.floor(screenMetrics.width * ratio), 280), 112);
    }
    return orientation === 'portrait' ? 128 : 144;
  };

  return (
    <div
      className={cn(
        'absolute inset-x-0 bottom-0 z-30',
        takeoverOverlayLayout.panel,
        'pb-7 sm:pb-10 md:pb-12 xl:pb-16 2xl:pb-20'
      )}
    >
      <div className={takeoverOverlayLayout.qrRow}>
        <div className="rounded-lg bg-white p-2 shadow-2xl">
          <QRCode value={scanUrl} size={getQrSize()} className="block" />
        </div>
        <p className={takeoverOverlayLayout.qrLabel}>Scan for more</p>
      </div>
    </div>
  );
}
