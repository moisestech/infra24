'use client';

import { createContext, useContext } from 'react';
import { cn } from '@/lib/utils';
import { formatDisplayLabel } from '@/lib/display/format-display-label';
import type { Announcement } from '@/types/announcement';
import type { ColorPalette } from '@/lib/themes';
import { useOrganizationTheme } from '@/components/carousel/OrganizationThemeContext';

export interface WorkshopGridItem {
  id: string;
  title: string;
  description?: string | null;
  image_url?: string | null;
  category?: string | null;
  /** When set (e.g. from announcement `additional_info`), shown as schedule / hours block */
  schedule_detail?: string | null;
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
  className?: string;
  children: React.ReactNode;
}

export function DisplayGrid({
  title,
  subtitle,
  hideHeading = false,
  surfaceMode = 'theme',
  columns = 3,
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
          'min-h-screen w-full p-6 pt-[calc(1.5rem+150px)] md:p-10 md:pt-[calc(2.5rem+150px)]',
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
                'text-3xl md:text-5xl font-black tracking-tight text-center',
                subtitle ? 'mb-2 md:mb-3' : 'mb-8 md:mb-10',
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
      </div>
      <div
        className={cn(
          'flex min-h-[14rem] flex-1 flex-col gap-3 p-5 md:min-h-[16rem] md:gap-3.5 md:p-6',
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
            'text-xl font-bold leading-snug line-clamp-3 md:text-2xl md:leading-snug',
            light && 'text-gray-900 dark:text-gray-900'
          )}
        >
          {item.title}
        </h3>
        {schedule ? (
          <p
            className={cn(
              'whitespace-pre-line text-base font-semibold leading-relaxed md:text-lg',
              light && 'text-gray-800 dark:text-gray-800',
              themed && 'opacity-90',
              !light && !themed && 'text-white/90'
            )}
            style={themed && colors ? { color: colors.text } : undefined}
          >
            {schedule}
          </p>
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
  const img = imageSrc(item.avatar_url || item.profile_image);
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
