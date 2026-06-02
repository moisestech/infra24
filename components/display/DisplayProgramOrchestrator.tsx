'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Announcement } from '@/types/announcement';
import type { DisplayProgram, DisplaySegment, ArtistGridFilter } from '@/lib/display/display-program';
import {
  filterAnnouncementsByRecentWindow,
  filterCinematicAnnouncements,
  SMART_SIGN_ANNOUNCEMENTS_ON_OR_AFTER,
} from '@/lib/display/display-program';
import {
  filterAnnouncementsByDisplayCalendarMonth,
  filterAnnouncementsOnOrAfterDate,
  filterAnnouncementsRelevantForDisplay,
  getTodayDisplayDateKey,
  isValidDisplayCalendarMonthKey,
} from '@/lib/display/announcement-month';
import { AnnouncementCarousel } from '@/components/carousel/AnnouncementCarousel';
import { FullScreenAnnouncement } from '@/components/display/FullScreenAnnouncement';
import {
  DisplayGrid,
  ArtistGridCard,
  CinematicGridCard,
  type WorkshopGridItem,
  type ArtistGridItem,
} from '@/components/display/DisplayGrid';
import { mergeWorkshopGridItems } from '@/lib/display/workshop-announcements-merge';
import { computeWorkshopSegmentDurationMs } from '@/lib/display/workshop-grid-segment';
import { WorkshopSegmentPlayer } from '@/components/display/WorkshopSegmentPlayer';
import { sortStudioResidents } from '@/lib/display/artist-spotlight';
import { artistMatchesConstituentFilter } from '@/lib/network-builder/constituent-types';
import {
  excludeFromSmartSignCarousel,
  resolveCinematicSegmentTakeover,
} from '@/lib/display/announcement-display-mode';
import { CinematicSegmentTakeover } from '@/components/display/CinematicSegmentTakeover';
import { ArtistSpotlightCarousel } from '@/components/display/ArtistSpotlightCarousel';

function isStudioResidentArtist(a: ArtistGridItem): boolean {
  const memberTypeKey =
    typeof a.metadata?.member_type_key === 'string' ? a.metadata.member_type_key : null;
  return artistMatchesConstituentFilter(a.metadata, memberTypeKey, 'studio_residents');
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

  const displayAnnouncements = useMemo(() => {
    const mode = program.displayFilterMode ?? 'on_view_or_upcoming';
    if (mode === 'on_or_after') {
      const floor = program.displayOnOrAfter?.trim() || SMART_SIGN_ANNOUNCEMENTS_ON_OR_AFTER;
      return filterAnnouncementsOnOrAfterDate(allAnnouncements, floor);
    }
    return filterAnnouncementsRelevantForDisplay(allAnnouncements, getTodayDisplayDateKey());
  }, [allAnnouncements, program.displayFilterMode, program.displayOnOrAfter]);

  useEffect(() => {
    const onVis = () => setDocHidden(document.hidden);
    onVis();
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  const safeIndex = segments.length ? index % segments.length : 0;
  const segment = segments[safeIndex];

  const carouselList = useCallback(
    (seg: DisplaySegment) => {
      let list = displayAnnouncements.filter((a) => !excludeFromSmartSignCarousel(a));
      const month = seg.params?.displayCalendarMonth?.trim() ?? '';
      if (month && isValidDisplayCalendarMonthKey(month)) {
        return filterAnnouncementsByDisplayCalendarMonth(list, month);
      }
      const days = seg.params?.useRecentWindowDays;
      if (days != null && days > 0) {
        return filterAnnouncementsByRecentWindow(list, days);
      }
      return list;
    },
    [displayAnnouncements]
  );

  const cinematicList = useCallback(
    (seg: DisplaySegment) => {
      let list = filterCinematicAnnouncements(displayAnnouncements);
      const month = seg.params?.displayCalendarMonth?.trim() ?? '';
      if (month && isValidDisplayCalendarMonthKey(month)) {
        list = filterAnnouncementsByDisplayCalendarMonth(list, month);
      }
      const max = seg.params?.maxItems ?? 12;
      return list.slice(0, max);
    },
    [displayAnnouncements]
  );

  const mergedWorkshops = useMemo(
    () => mergeWorkshopGridItems(displayAnnouncements, workshops),
    [displayAnnouncements, workshops]
  );

  const workshopItems = useCallback(
    (seg: DisplaySegment) => {
      const max = seg.params?.maxItems ?? 200;
      return mergedWorkshops.slice(0, max);
    },
    [mergedWorkshops]
  );

  // The workshops segment paginates internally (featured + grid slides), so its
  // on-screen time must equal the sum of all its slide durations, not the static
  // program durationMs. Other segments keep their configured durationMs.
  const effectiveDurationMs = useMemo(() => {
    if (!segment) return 10_000;
    if (segment.kind === 'grid_workshops') {
      return computeWorkshopSegmentDurationMs(workshopItems(segment), segment.params);
    }
    return segment.durationMs;
  }, [segment, workshopItems]);

  useEffect(() => {
    if (segments.length <= 1) return;
    if (docHidden) return;
    const ms = Math.max(3000, effectiveDurationMs ?? 10_000);
    const t = window.setTimeout(() => {
      setIndex((i) => (i + 1) % segments.length);
    }, ms);
    return () => window.clearTimeout(t);
  }, [segments.length, safeIndex, effectiveDurationMs, segment?.id, docHidden]);

  const artistItems = useCallback(
    (seg: DisplaySegment) => {
      const filtered = filterArtistsByProgram(artists, seg.params?.filter);
      const sorted =
        seg.params?.filter === 'studio_residents'
          ? sortStudioResidents(filtered)
          : filtered;
      const defaultMax = seg.params?.filter === 'studio_residents' ? 13 : 12;
      const max = seg.params?.maxItems ?? defaultMax;
      return sorted.slice(0, max);
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
        const month = segment.params?.displayCalendarMonth?.trim() ?? '';
        const pool =
          month && isValidDisplayCalendarMonthKey(month)
            ? filterAnnouncementsByDisplayCalendarMonth(displayAnnouncements, month)
            : displayAnnouncements;
        const ann = resolveFullscreenAnnouncement(pool, segment);
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
          <WorkshopSegmentPlayer
            items={items}
            params={segment.params}
            columns={cols}
            cleanViewMode={cleanViewMode}
            orgSlug={orgSlug}
          />
        );
      }
      case 'grid_artists': {
        const items = artistItems(segment);
        const mode = segment.params?.artistDisplayMode ?? 'grid';
        const showArtwork = segment.params?.showArtwork !== false;
        const rotationMs = segment.params?.artistRotationMs ?? 7000;

        if (items.length === 0) {
          return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-950 text-white">
              No artists to show
            </div>
          );
        }

        if (mode === 'spotlight') {
          return (
            <ArtistSpotlightCarousel
              artists={items}
              showArtwork={showArtwork}
              rotationMs={rotationMs}
              title="Studio Residents"
              subtitle="2026"
            />
          );
        }

        const cols = segment.params?.columns ?? 3;
        return (
          <DisplayGrid title="Artists" subtitle="Studio residents" surfaceMode="light" columns={cols}>
            {items.map((a) => (
              <ArtistGridCard key={a.id} item={a} />
            ))}
          </DisplayGrid>
        );
      }
      case 'grid_cinematic': {
        const list = cinematicList(segment);
        const featured = resolveCinematicSegmentTakeover(displayAnnouncements);
        if (featured) {
          return (
            <CinematicSegmentTakeover
              announcement={featured}
              organizationSlug={orgSlug}
              cleanViewMode={cleanViewMode}
            />
          );
        }
        const cols = segment.params?.columns ?? 3;
        if (list.length === 0) {
          return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-950 text-white">
              No cinematic announcements
            </div>
          );
        }
        return (
          <DisplayGrid title="Cinematic" hideHeading surfaceMode="light" columns={cols}>
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
    displayAnnouncements,
    carouselList,
    cinematicList,
    workshopItems,
    artistItems,
  ]);

  return (
    <div className="relative min-h-screen min-h-[100dvh] w-full max-w-full overflow-x-hidden overflow-y-auto">
      {body}
    </div>
  );
}
