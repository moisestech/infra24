'use client';

import { useEffect, useMemo, useState } from 'react';
import { DisplayGrid, WorkshopGridCard, type WorkshopGridItem } from '@/components/display/DisplayGrid';
import { FullScreenAnnouncement } from '@/components/display/FullScreenAnnouncement';
import type { DisplaySegmentParams } from '@/lib/display/display-program';
import {
  buildWorkshopSegmentSlides,
  workshopSlideDurationMs,
} from '@/lib/display/workshop-grid-segment';
import { workshopGridItemToAnnouncement } from '@/lib/display/workshop-grid-item-to-announcement';

interface WorkshopSegmentPlayerProps {
  items: WorkshopGridItem[];
  params?: DisplaySegmentParams;
  columns?: 1 | 2 | 3;
  cleanViewMode?: boolean;
  orgSlug: string;
}

/**
 * Drives the workshops segment: 5 featured upcoming workshops as card-frame
 * spotlights, then paginated grid pages (9-up). Auto-advances on a per-slide
 * timer (pausing while the tab is hidden) and loops within the segment.
 */
export function WorkshopSegmentPlayer({
  items,
  params,
  columns = 3,
  cleanViewMode = false,
  orgSlug,
}: WorkshopSegmentPlayerProps) {
  const slides = useMemo(() => buildWorkshopSegmentSlides(items, params), [items, params]);
  const [index, setIndex] = useState(0);
  const [docHidden, setDocHidden] = useState(false);

  useEffect(() => {
    setIndex(0);
  }, [slides.length]);

  useEffect(() => {
    const onVis = () => setDocHidden(document.hidden);
    onVis();
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  const safeIndex = slides.length ? index % slides.length : 0;
  const slide = slides[safeIndex];

  useEffect(() => {
    if (slides.length <= 1) return;
    if (docHidden) return;
    if (!slide) return;
    const ms = workshopSlideDurationMs(slide, params);
    const timer = window.setTimeout(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, ms);
    return () => window.clearTimeout(timer);
  }, [slides.length, safeIndex, slide, params, docHidden]);

  if (!slide) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-950 text-white">
        No public workshops
      </div>
    );
  }

  if (slide.kind === 'featured') {
    return (
      <FullScreenAnnouncement
        announcement={workshopGridItemToAnnouncement(slide.item)}
        organizationSlug={orgSlug}
        cleanViewMode={cleanViewMode}
      />
    );
  }

  return (
    <DisplayGrid title="Workshops" surfaceMode="light" columns={columns} compactTopInset>
      {slide.items.map((w) => (
        <WorkshopGridCard key={w.id} item={w} />
      ))}
    </DisplayGrid>
  );
}
