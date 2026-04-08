'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Announcement } from '@/types/announcement';
import type { DisplayProgram, DisplaySegment, ArtistGridFilter } from '@/lib/display/display-program';
import {
  filterAnnouncementsByRecentWindow,
  filterCinematicAnnouncements,
} from '@/lib/display/display-program';
import { AnnouncementCarousel } from '@/components/carousel/AnnouncementCarousel';
import { FullScreenAnnouncement } from '@/components/display/FullScreenAnnouncement';
import {
  DisplayGrid,
  WorkshopGridCard,
  ArtistGridCard,
  CinematicGridCard,
  type WorkshopGridItem,
  type ArtistGridItem,
} from '@/components/display/DisplayGrid';

function isStudioResidentArtist(a: ArtistGridItem): boolean {
  const st = String(a.studio_type || '').toLowerCase();
  if (st === 'studio' || st.includes('studio')) return true;
  const meta = a.metadata;
  if (meta && typeof meta === 'object') {
    const r = meta.residency;
    if (r === 'studio_resident' || r === 'resident') return true;
    if (meta.studio_resident === true) return true;
  }
  return false;
}

function filterArtistsByProgram(artists: ArtistGridItem[], filter: ArtistGridFilter | undefined): ArtistGridItem[] {
  const f = filter ?? 'all';
  if (f === 'all') return artists;
  return artists.filter((a) => isStudioResidentArtist(a));
}

function resolveFullscreenAnnouncement(
  announcements: Announcement[],
  segment: DisplaySegment
): Announcement | null {
  const id = segment.params?.announcementId?.trim();
  if (id) {
    const found = announcements.find((a) => a.id === id);
    if (found) return found;
  }
  const titleNeedle = segment.params?.title?.trim().toLowerCase();
  if (titleNeedle) {
    const found = announcements.find((a) => a.title?.toLowerCase().includes(titleNeedle));
    if (found) return found;
  }
  return announcements[0] ?? null;
}

interface DisplayProgramOrchestratorProps {
  orgSlug: string;
  program: DisplayProgram;
  /** Full public announcement list (segment windows applied inside) */
  allAnnouncements: Announcement[];
  workshops: WorkshopGridItem[];
  artists: ArtistGridItem[];
  cleanViewMode?: boolean;
}

export function DisplayProgramOrchestrator({
  orgSlug,
  program,
  allAnnouncements,
  workshops,
  artists,
  cleanViewMode = false,
}: DisplayProgramOrchestratorProps) {
  const segments = program.segments;
  const [index, setIndex] = useState(0);
  const [docHidden, setDocHidden] = useState(false);

  useEffect(() => {
    const onVis = () => setDocHidden(document.hidden);
    onVis();
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  const safeIndex = segments.length ? index % segments.length : 0;
  const segment = segments[safeIndex];

  useEffect(() => {
    if (segments.length <= 1) return;
    if (docHidden) return;
    const ms = Math.max(3000, segment?.durationMs ?? 10_000);
    const t = window.setTimeout(() => {
      setIndex((i) => (i + 1) % segments.length);
    }, ms);
    return () => window.clearTimeout(t);
  }, [segments.length, safeIndex, segment?.durationMs, segment?.id, docHidden]);

  const carouselList = useCallback(
    (seg: DisplaySegment) => {
      const days = seg.params?.useRecentWindowDays ?? 30;
      return filterAnnouncementsByRecentWindow(allAnnouncements, days);
    },
    [allAnnouncements]
  );

  const cinematicList = useCallback(
    (seg: DisplaySegment) => {
      const list = filterCinematicAnnouncements(allAnnouncements);
      const max = seg.params?.maxItems ?? 12;
      return list.slice(0, max);
    },
    [allAnnouncements]
  );

  const workshopItems = useCallback(
    (seg: DisplaySegment) => {
      const max = seg.params?.maxItems ?? 12;
      return workshops.slice(0, max);
    },
    [workshops]
  );

  const artistItems = useCallback(
    (seg: DisplaySegment) => {
      const filtered = filterArtistsByProgram(artists, seg.params?.filter);
      const max = seg.params?.maxItems ?? 12;
      return filtered.slice(0, max);
    },
    [artists]
  );

  const body = useMemo(() => {
    if (!segment) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-black text-white">
          No display segments configured
        </div>
      );
    }

    switch (segment.kind) {
      case 'announcement_carousel': {
        const list = carouselList(segment);
        if (list.length === 0) {
          return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-950 text-white">
              No announcements in this time window
            </div>
          );
        }
        return (
          <AnnouncementCarousel
            announcements={list}
            organizationSlug={orgSlug}
            cleanViewMode={cleanViewMode}
            hideAnnouncementDates={segment.params?.hideDates === true}
          />
        );
      }
      case 'announcement_fullscreen': {
        const ann = resolveFullscreenAnnouncement(allAnnouncements, segment);
        if (!ann) {
          return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-950 text-white">
              No announcement for fullscreen segment
            </div>
          );
        }
        return (
          <FullScreenAnnouncement
            announcement={ann}
            organizationSlug={orgSlug}
            cleanViewMode={cleanViewMode}
            hideDates={segment.params?.hideDates === true}
          />
        );
      }
      case 'grid_workshops': {
        const items = workshopItems(segment);
        const cols = segment.params?.columns ?? 3;
        if (items.length === 0) {
          return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-950 text-white">
              No public workshops
            </div>
          );
        }
        return (
          <DisplayGrid title="Workshops" columns={cols}>
            {items.map((w) => (
              <WorkshopGridCard key={w.id} item={w} />
            ))}
          </DisplayGrid>
        );
      }
      case 'grid_artists': {
        const items = artistItems(segment);
        const cols = segment.params?.columns ?? 3;
        if (items.length === 0) {
          return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-950 text-white">
              No artists to show
            </div>
          );
        }
        return (
          <DisplayGrid title="Artists" columns={cols}>
            {items.map((a) => (
              <ArtistGridCard key={a.id} item={a} />
            ))}
          </DisplayGrid>
        );
      }
      case 'grid_cinematic': {
        const list = cinematicList(segment);
        const cols = segment.params?.columns ?? 3;
        if (list.length === 0) {
          return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-950 text-white">
              No cinematic announcements
            </div>
          );
        }
        return (
          <DisplayGrid title="Cinematic" columns={cols}>
            {list.map((a) => (
              <CinematicGridCard key={a.id} announcement={a} />
            ))}
          </DisplayGrid>
        );
      }
      default:
        return (
          <div className="flex h-screen w-full items-center justify-center bg-black text-white">
            Unknown segment kind
          </div>
        );
    }
  }, [
    segment,
    orgSlug,
    cleanViewMode,
    allAnnouncements,
    carouselList,
    cinematicList,
    workshopItems,
    artistItems,
  ]);

  return <div className="relative h-screen w-full max-w-full overflow-hidden">{body}</div>;
}
