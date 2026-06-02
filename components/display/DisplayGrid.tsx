'use client';

import { createContext, useContext } from 'react';
import { cn } from '@/lib/utils';
import { formatDisplayLabel } from '@/lib/display/format-display-label';
import { resolveConstituentLabel } from '@/lib/network-builder/constituent-types';
import type { Announcement } from '@/types/announcement';
import type { ColorPalette } from '@/lib/themes';
import { useOrganizationTheme } from '@/components/carousel/OrganizationThemeContext';
import { SMART_SIGN_COMPACT_TOP_INSET_CLASS, SMART_SIGN_COMPACT_SECTION_TITLE_CLASS } from '@/lib/display/announcement-image-frame';
import { artistGridPortraitUrl } from '@/lib/display/artist-spotlight';
import { StackedDateOverlay } from '@/components/display/StackedDateOverlay';
import { stackedDateFromWorkshopItem } from '@/lib/display/stacked-date-display';
import { parseWorkshopScheduleBlocks } from '@/lib/display/workshop-schedule-blocks';

export interface WorkshopGridItem {
  id: string;
  title: string;
  description?: string | null;
  image_url?: string | null;
  category?: string | null;
  /** When set (e.g. from announcement `additional_info`), shown as schedule / hours block */
  schedule_detail?: string | null;
  /** Primary date line — overlaid on image and included in schedule text */
  schedule_date_label?: string | null;
  /** Epoch ms of the workshop start (for upcoming sort); null when undated. */
  event_sort_ms?: number | null;
  /** Epoch ms of the workshop end (for still-relevant filtering); null when undated. */
  event_end_ms?: number | null;
  /** Undated digital-lab / online class — render a "Coming Soon" badge. */
  is_online_class?: boolean;
}

export interface ArtistGridItem {
  id: string;
  name: string;
  bio?: string | null;
  avatar_url?: string | null;
  profile_image?: string | null;
  studio_type?: string | null;
  /** Shown on smart-sign artist cards (e.g. metadata.studio or studio_location) */
  studio_number?: string | null;
  /** Public API may include this for studio-resident filtering */
  metadata?: Record<string, unknown> | null;
  /** Resolved member type label (e.g. Studio Resident) */
  constituent_label?: string | null;
  /** Stable slug (e.g. studio_resident) — mirrors org_member_types.type_key */
  constituent_type?: string | null;
}

const LIGHT_PRIMARY_FALLBACK = '#47abc4';

const GridChromeContext = createContext<{
  colors: ColorPalette | null;
  /** White shell + light cards for smart-sign grid segments (workshops / artists / cinematic). */
  surfaceMode: 'light' | 'theme';
}>({ colors: null, surfaceMode: 'theme' });

function useGridChrome() {
  return useContext(GridChromeContext);
}

interface DisplayGridProps {
  title: string;
  subtitle?: string;
  /** When true, no page heading — for image-only grids (e.g. cinematic). */
  hideHeading?: boolean;
  /** Smart-sign grids: fixed white page background (carousel can stay on org / dark). */
  surfaceMode?: 'light' | 'theme';
  columns?: 1 | 2 | 3;
  /** Halve top inset below smart-sign chrome (workshops segment). */
  compactTopInset?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function DisplayGrid({
  title,
  subtitle,
  hideHeading = false,
  surfaceMode = 'theme',
  columns = 3,
  compactTopInset = false,
  className,
  children,
}: DisplayGridProps) {
  const { theme } = useOrganizationTheme();
  const colors = theme?.colors ?? null;
  const lightShell = surfaceMode === 'light';

  const shellStyle =
    lightShell
      ? { background: '#ffffff', color: '#111827' }
      : colors
        ? {
            background: `linear-gradient(to bottom, ${colors.surface}, ${colors.background})`,
            color: colors.text,
          }
        : undefined;

  return (
    <GridChromeContext.Provider value={{ colors, surfaceMode }}>
      <div
        className={cn(
          'min-h-screen w-full p-6 md:p-10',
          compactTopInset
            ? SMART_SIGN_COMPACT_TOP_INSET_CLASS
            : 'pt-[calc(1.5rem+150px)] md:pt-[calc(2.5rem+150px)]',
          lightShell &&
            'bg-white text-gray-900 dark:bg-white dark:text-gray-900',
          !lightShell && !colors && 'bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white',
          className
        )}
        style={shellStyle}
      >
        {!hideHeading ? (
          <>
            <h2
              className={cn(
                'font-black tracking-tight text-center',
                compactTopInset ? SMART_SIGN_COMPACT_SECTION_TITLE_CLASS : 'text-3xl md:text-5xl',
                subtitle ? 'mb-2 md:mb-3' : compactTopInset ? 'mb-4 md:mb-5' : 'mb-8 md:mb-10',
                lightShell && 'text-gray-900 dark:text-gray-900',
                !lightShell && !colors && 'text-white drop-shadow-lg'
              )}
              style={!lightShell && colors ? { color: colors.text } : undefined}
            >
              {title}
            </h2>
            {subtitle ? (
              <p
                className={cn(
                  'text-center text-base md:text-lg font-medium mb-8 md:mb-10',
                  lightShell && 'text-gray-600 dark:text-gray-600',
                  !lightShell && !colors && 'text-white/75'
                )}
                style={!lightShell && colors ? { color: colors.textSecondary } : undefined}
              >
                {subtitle}
              </p>
            ) : null}
          </>
        ) : null}
        <div
          className={cn(
            'grid gap-4 md:gap-6 max-w-[1800px] mx-auto',
            columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
            columns === 2 && 'grid-cols-1 md:grid-cols-2',
            columns === 1 && 'grid-cols-1 max-w-3xl mx-auto'
          )}
        >
          {children}
        </div>
      </div>
    </GridChromeContext.Provider>
  );
}

function imageSrc(url: string | null | undefined): string | null {
  if (!url?.trim()) return null;
  return url;
}

export function WorkshopGridCard({ item }: { item: WorkshopGridItem }) {
  const img = imageSrc(item.image_url);
  const schedule = (item.schedule_detail || '').trim();
  const stackedDate = stackedDateFromWorkshopItem(item);
  const scheduleBlocks = schedule ? parseWorkshopScheduleBlocks(schedule) : [];
  const { colors, surfaceMode } = useGridChrome();
  const light = surfaceMode === 'light';
  const themed = Boolean(colors) && !light;
  const accent = colors?.primary || LIGHT_PRIMARY_FALLBACK;

  return (
    <article
      className={cn(
        'group flex flex-col overflow-hidden rounded-2xl border transition-colors',
        light && 'border-gray-200 bg-white shadow-sm hover:shadow-md',
        !light && !themed && 'border-white/10 bg-white/5 shadow-md backdrop-blur-sm hover:bg-white/10',
        themed && 'shadow-sm hover:opacity-[0.98]'
      )}
      style={
        themed && colors
          ? {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.text,
            }
          : undefined
      }
    >
      <div
        className={cn(
          'relative w-full shrink-0 aspect-video',
          light && 'bg-gray-100',
          themed && 'bg-gray-200',
          !light && !themed && 'bg-gray-800'
        )}
      >
        {img ? (
          <img
            src={img}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
            loading="lazy"
          />
        ) : (
          <div
            className={cn(
              'absolute inset-0 flex items-center justify-center text-sm',
              light && 'text-gray-400',
              themed && 'text-gray-400',
              !light && !themed && 'text-white/30'
            )}
          >
            Workshop
          </div>
        )}
        {stackedDate ? (
          <StackedDateOverlay parts={stackedDate} size="md" />
        ) : item.is_online_class ? (
          <StackedDateOverlay comingSoon size="md" />
        ) : null}
      </div>
      <div
        className={cn(
          'flex min-h-[12rem] flex-1 flex-col gap-2.5 p-5 md:min-h-[13rem] md:gap-3 md:p-5',
          light && 'bg-white'
        )}
      >
        {item.category && (
          <span
            className={cn(
              'inline-flex w-fit rounded-lg px-3 py-1 text-sm font-semibold tracking-normal md:text-base',
              !light && !themed && 'bg-cyan-500/15 text-cyan-200/95'
            )}
            style={
              light
                ? { color: accent, backgroundColor: `${accent}1a` }
                : themed && colors
                  ? { backgroundColor: `${colors.primary}18`, color: colors.primary }
                  : undefined
            }
          >
            {formatDisplayLabel(item.category)}
          </span>
        )}
        <h3
          className={cn(
            'text-2xl font-bold leading-snug line-clamp-3 md:text-3xl xl:text-4xl md:leading-snug',
            light && 'text-gray-900 dark:text-gray-900'
          )}
        >
          {item.title}
        </h3>
        {scheduleBlocks.length > 0 ? (
          <div
            className={cn(
              'flex flex-col gap-1.5 md:gap-2',
              light && 'text-gray-800 dark:text-gray-800',
              themed && 'opacity-90',
              !light && !themed && 'text-white/90'
            )}
            style={themed && colors ? { color: colors.text } : undefined}
          >
            {scheduleBlocks.map((block, idx) => (
              <p
                key={`${block.type}-${idx}`}
                className={cn(
                  'leading-snug',
                  block.type === 'date' && 'text-lg font-bold md:text-xl',
                  block.type === 'weekday' && 'text-base font-semibold uppercase tracking-wide md:text-lg',
                  block.type === 'time' && 'text-base font-semibold md:text-lg',
                  block.type === 'course_type' && 'text-sm font-semibold uppercase tracking-wide opacity-80 md:text-base',
                  block.type === 'note' && 'text-sm font-medium italic opacity-75 md:text-base',
                  block.type === 'other' && 'text-base font-medium md:text-lg'
                )}
              >
                {block.text}
              </p>
            ))}
          </div>
        ) : null}
        {!schedule && item.description ? (
          <p
            className={cn(
              'line-clamp-6 flex-1 text-base leading-relaxed md:line-clamp-8 md:text-lg',
              light && 'text-gray-600 dark:text-gray-600',
              themed && 'opacity-80',
              !light && !themed && 'text-white/70'
            )}
            style={themed && colors ? { color: colors.textSecondary } : undefined}
          >
            {item.description}
          </p>
        ) : null}
      </div>
    </article>
  );
}

export function ArtistGridCard({ item }: { item: ArtistGridItem }) {
  const img = imageSrc(artistGridPortraitUrl(item) || item.avatar_url || item.profile_image);
  const { colors, surfaceMode } = useGridChrome();
  const light = surfaceMode === 'light';
  const themed = Boolean(colors) && !light;
  const accent = colors?.primary || LIGHT_PRIMARY_FALLBACK;
  const studio = (item.studio_number || '').trim();

  return (
    <article
      className={cn(
        'flex flex-col overflow-hidden rounded-2xl border transition-colors',
        light && 'border-gray-200 bg-white shadow-sm',
        !light && !themed && 'border-white/10 bg-white/5 shadow-md backdrop-blur-sm',
        themed && 'shadow-sm'
      )}
      style={
        themed && colors
          ? {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.text,
            }
          : undefined
      }
    >
      <div
        className={cn(
          'relative w-full aspect-[3/4]',
          light && 'bg-gray-100',
          themed && 'bg-gray-200',
          !light && !themed && 'bg-gray-800'
        )}
      >
        {img ? (
          <img
            src={img}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-top"
            loading="lazy"
          />
        ) : (
          <div
            className={cn(
              'absolute inset-0 flex items-center justify-center text-4xl font-bold',
              light && 'text-gray-300',
              themed && 'text-gray-300',
              !light && !themed && 'text-white/20'
            )}
          >
            {item.name.slice(0, 1)}
          </div>
        )}
      </div>
      <div className="p-4 text-center">
        <h3 className={cn('text-lg md:text-xl font-bold', light && 'text-gray-900')}>{item.name}</h3>
        {(() => {
          const label = resolveConstituentLabel(item.metadata, item.constituent_label ?? null);
          return label ? (
            <p className={cn('mt-1 text-xs font-semibold uppercase tracking-wide text-gray-500 md:text-sm')}>
              {label}
            </p>
          ) : null;
        })()}
        {studio && (
          <p
            className={cn('text-sm mt-1 font-medium', !light && !themed && 'text-cyan-200/85')}
            style={
              light
                ? { color: accent }
                : themed && colors
                  ? { color: colors.primary }
                  : undefined
            }
          >
            Studio {studio}
          </p>
        )}
      </div>
    </article>
  );
}

export function CinematicGridCard({ announcement }: { announcement: Announcement }) {
  const img = imageSrc(announcement.image_url);
  const { colors, surfaceMode } = useGridChrome();
  const light = surfaceMode === 'light';
  const themed = Boolean(colors) && !light;
  const imageOnly = announcement.metadata?.image_only === true;
  const bodyText = (announcement.body || '').trim();

  return (
    <article
      className={cn(
        'flex flex-col overflow-hidden rounded-2xl border transition-colors',
        light &&
          'border-gray-200 bg-white text-gray-900 shadow-sm dark:text-gray-900',
        !light && !themed && 'border-white/15 bg-black/60 shadow-md',
        themed && 'shadow-sm'
      )}
      style={
        themed && colors
          ? {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.text,
            }
          : undefined
      }
    >
      <div
        className={cn(
          'relative aspect-[9/16]',
          light && 'bg-gray-100',
          themed && 'bg-gray-200',
          !light && !themed && 'bg-gray-900'
        )}
      >
        {img ? (
          <img
            src={img}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-top"
            loading="lazy"
          />
        ) : (
          <div
            className={cn(
              'absolute inset-0 flex items-center justify-center text-sm',
              light && 'bg-gray-100 text-gray-400 dark:text-gray-500',
              themed && 'bg-gray-200 text-gray-400',
              !light && !themed && 'bg-gray-900 text-white/30'
            )}
          >
            {announcement.title ? (
              <span className="line-clamp-3 px-3 text-center font-medium">{announcement.title}</span>
            ) : null}
          </div>
        )}
      </div>
      {!imageOnly && (announcement.title || bodyText) ? (
        <div className="flex flex-1 flex-col gap-2 border-t border-gray-100 p-4">
          {announcement.title ? (
            <h3
              className={cn(
                'line-clamp-2 text-lg font-bold leading-snug md:text-xl',
                light && 'text-gray-900 dark:text-gray-900'
              )}
            >
              {announcement.title}
            </h3>
          ) : null}
          {bodyText ? (
            <p
              className={cn(
                'line-clamp-3 flex-1 text-sm',
                light && 'text-gray-600 dark:text-gray-600'
              )}
            >
              {bodyText}
            </p>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
