'use client';

import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import type { ArtistGridItem } from '@/components/display/DisplayGrid';
import {
  SMART_SIGN_CARD_CONTENT_CLASS,
  SMART_SIGN_COMPACT_SECTION_TITLE_CLASS,
  SMART_SIGN_COMPACT_TOP_INSET_CLASS,
  SMART_SIGN_VIEWPORT_MAX_HEIGHT_PX,
} from '@/lib/display/announcement-image-frame';
import {
  artistPortraitRotationPool,
  portraitImageFrameClass,
} from '@/lib/display/artist-portraits';
import {
  artistHeadshotUrl,
  resolveArtistPortraits,
  selectArtistPortraitAt,
  sortStudioResidents,
  spotlightDisplayBio,
  spotlightLayoutForFrame,
} from '@/lib/display/artist-spotlight';

interface ArtistSpotlightCarouselProps {
  artists: ArtistGridItem[];
  showArtwork?: boolean;
  rotationMs?: number;
  title?: string;
  subtitle?: string;
}

function useViewportOrientation(): 'portrait' | 'landscape' {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setOrientation(w / h >= 1.37 ? 'landscape' : 'portrait');
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return orientation;
}

export function ArtistSpotlightCarousel({
  artists,
  showArtwork = true,
  rotationMs = 7000,
  title = 'Studio Residents',
  subtitle = '2026',
}: ArtistSpotlightCarouselProps) {
  const viewportOrientation = useViewportOrientation();
  const list = useMemo(
    () => sortStudioResidents(artists).filter((a) => artistHeadshotUrl(a)),
    [artists]
  );
  const [index, setIndex] = useState(0);
  const [portraitIndex, setPortraitIndex] = useState(0);
  const safeIndex = list.length ? index % list.length : 0;
  const current = list[safeIndex];
  const headshot = current ? artistHeadshotUrl(current) : null;
  const studio = (current?.studio_number || '').trim();
  const bio = current ? spotlightDisplayBio(current.bio) : null;

  const portraits = useMemo(
    () => (current ? resolveArtistPortraits(current.metadata) : null),
    [current]
  );
  const rotationPool = useMemo(() => {
    if (!portraits) return { urls: [] as string[], frames: [] as const };
    return artistPortraitRotationPool(portraits, viewportOrientation);
  }, [portraits, viewportOrientation]);

  const selectedPortrait =
    current && showArtwork
      ? selectArtistPortraitAt(current.metadata, portraitIndex, viewportOrientation)
      : null;
  const layout = selectedPortrait
    ? spotlightLayoutForFrame(selectedPortrait.frame)
    : 'dual';
  const showHeadshot = Boolean(headshot) && layout === 'dual';

  useEffect(() => {
    setIndex(0);
    setPortraitIndex(0);
  }, [list.length]);

  useEffect(() => {
    setPortraitIndex(0);
  }, [safeIndex, viewportOrientation]);

  useEffect(() => {
    if (list.length <= 1) return;
    const ms = Math.max(3000, rotationMs);
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % list.length);
    }, ms);
    return () => window.clearInterval(timer);
  }, [list.length, rotationMs]);

  useEffect(() => {
    if (!showArtwork || rotationPool.urls.length <= 1) return;
    const ms = Math.max(3000, Math.round(rotationMs / 2));
    const timer = window.setInterval(() => {
      setPortraitIndex((i) => (i + 1) % rotationPool.urls.length);
    }, ms);
    return () => window.clearInterval(timer);
  }, [showArtwork, rotationPool.urls.length, rotationMs, safeIndex]);

  if (!current || !headshot) {
    return (
      <div className="flex h-[min(100dvh,1920px)] max-h-[1920px] w-full items-center justify-center bg-white text-gray-700">
        No studio residents to show
      </div>
    );
  }

  return (
    <div
      className="relative mx-auto flex w-full max-h-[1920px] flex-col overflow-hidden bg-white text-gray-900"
      style={{ height: `min(100dvh, ${SMART_SIGN_VIEWPORT_MAX_HEIGHT_PX}px)` }}
    >
      <div
        className={cn(
          'mt-[100px] mb-4 shrink-0 px-6 text-center md:mb-5 md:px-10',
          SMART_SIGN_COMPACT_TOP_INSET_CLASS
        )}
      >
        <h2
          className={cn(
            'font-black tracking-tight',
            SMART_SIGN_COMPACT_SECTION_TITLE_CLASS
          )}
        >
          {title}
          {subtitle ? (
            <span className="font-semibold text-gray-500 md:font-bold"> · {subtitle}</span>
          ) : null}
        </h2>
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center overflow-hidden px-4 pb-8 md:px-6 md:pb-10">
        <div className={cn('w-full shrink-0 text-center', SMART_SIGN_CARD_CONTENT_CLASS)}>
          <h3 className="text-4xl font-black tracking-tight text-gray-900 md:text-6xl">
            {current.name}
            {studio ? (
              <span className="font-black text-[#47abc4]"> · Studio {studio}</span>
            ) : null}
          </h3>
        </div>

        <div
          className={cn(
            'mt-4 flex min-h-0 w-full flex-1 flex-col items-center justify-center gap-4 md:mt-5 md:gap-5',
            SMART_SIGN_CARD_CONTENT_CLASS
          )}
        >
          {showHeadshot ? (
            <div className="relative aspect-square w-full max-h-[min(36vh,560px)] overflow-hidden rounded-2xl bg-gray-100 shadow-sm ring-1 ring-gray-200">
              <img
                key={`${current.id}-headshot`}
                src={headshot}
                alt={current.name}
                className="h-full w-full object-cover object-center"
              />
            </div>
          ) : null}

          {selectedPortrait ? (
            <div className={portraitImageFrameClass(selectedPortrait.frame)}>
              <img
                key={`${current.id}-portrait-${portraitIndex}`}
                src={selectedPortrait.url}
                alt={`Portrait of ${current.name}`}
                className="h-full w-full object-contain object-center"
              />
            </div>
          ) : null}
        </div>

        {bio ? (
          <p
            className={cn(
              'mx-auto mt-4 shrink-0 text-center text-base leading-relaxed text-gray-600 md:mt-5 md:text-lg',
              SMART_SIGN_CARD_CONTENT_CLASS
            )}
          >
            {bio}
          </p>
        ) : null}
      </div>

      {list.length > 1 ? (
        <div className="absolute bottom-6 right-6 z-10 flex flex-col items-end gap-2 md:bottom-10 md:right-10">
          <p className="text-xs font-semibold tabular-nums text-gray-500 md:text-sm">
            {safeIndex + 1} / {list.length}
          </p>
          <div className="flex max-w-[min(40vw,12rem)] flex-wrap justify-end gap-2">
            {list.map((artist, i) => (
              <button
                key={artist.id}
                type="button"
                aria-label={`Show ${artist.name}`}
                aria-current={i === safeIndex ? 'true' : undefined}
                onClick={() => setIndex(i)}
                className={cn(
                  'rounded-full transition-colors',
                  i === safeIndex
                    ? 'h-3 w-3 bg-[#47abc4] ring-2 ring-[#47abc4]/30'
                    : 'h-2.5 w-2.5 bg-gray-300 hover:bg-gray-400'
                )}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
