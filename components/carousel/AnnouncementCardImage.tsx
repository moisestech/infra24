'use client';

import type { CSSProperties } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { LANDSCAPE_CARD_IMAGE_CLASS, CARD_IMAGE_MAX_HEIGHT } from '@/lib/display/announcement-image-frame';

interface AnnouncementCardImageProps {
  imageUrl: string;
  alt: string;
  /** Intrinsic-ratio landscape frame (full width, no crop). */
  naturalLandscape?: boolean;
  fillFrameClass?: string;
  fillFrameStyle?: CSSProperties;
  objectPosition?: 'top' | 'center';
  minimal?: boolean;
  imageScale?: number;
  imageOpacity?: number;
  landscapeMaxHeight?: string;
  sizes?: string;
}

export function AnnouncementCardImage({
  imageUrl,
  alt,
  naturalLandscape = false,
  fillFrameClass,
  fillFrameStyle,
  objectPosition = 'center',
  minimal = false,
  imageScale = 1,
  imageOpacity = 1,
  landscapeMaxHeight = CARD_IMAGE_MAX_HEIGHT.landscapeNatural,
  sizes = '(max-width: 1280px) 1040px, 100vw',
}: AnnouncementCardImageProps) {
  const wrapperStyle = {
    transform: `scale(${imageScale})`,
    transformOrigin: 'center top',
    opacity: imageOpacity,
  } as const;

  if (naturalLandscape) {
    const img = (
      <Image
        src={imageUrl}
        alt={alt}
        width={1600}
        height={900}
        className={cn(LANDSCAPE_CARD_IMAGE_CLASS, 'rounded-2xl')}
        sizes="100vw"
        priority={false}
        style={{ width: '100%', height: 'auto', maxHeight: landscapeMaxHeight }}
      />
    );

    if (minimal) {
      return (
        <div className="relative w-full max-w-none" style={wrapperStyle}>
          {img}
        </div>
      );
    }

    return (
      <div className="relative w-full max-w-none" style={wrapperStyle}>
        <div className="rounded-2xl p-[1px] bg-gradient-to-br from-white/50 via-white/15 to-emerald-400/25 ring-1 ring-white/15">
          {img}
        </div>
      </div>
    );
  }

  if (!fillFrameClass) return null;

  const fillImage = (
    <div className={fillFrameClass} style={fillFrameStyle}>
      <Image
        src={imageUrl}
        alt={alt}
        fill
        className={cn('object-cover', objectPosition === 'top' ? 'object-top' : 'object-center')}
        sizes={sizes}
        priority={false}
      />
    </div>
  );

  if (minimal) {
    return (
      <div className="w-full" style={wrapperStyle}>
        {fillImage}
      </div>
    );
  }

  return (
    <div className="w-full" style={wrapperStyle}>
      <div className="rounded-2xl p-[1px] bg-gradient-to-br from-white/50 via-white/15 to-emerald-400/25 ring-1 ring-white/15">
        {fillImage}
      </div>
    </div>
  );
}
