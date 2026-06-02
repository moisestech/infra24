'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronDown, Filter, ImageIcon, Layers, ArrowDownUp } from 'lucide-react';

import { cn } from '@/lib/utils';

const CloseFilterDropdownContext = createContext<(() => void) | undefined>(undefined);

export type AnnouncementStatusFilter =
  | 'all'
  | 'current'
  | 'expired'
  | 'active'
  | 'inactive'
  | 'public'
  | 'internal'
  | 'members_only';

export type AnnouncementCategoryPreset =
  | 'events_exhibitions'
  | 'workshops'
  | 'cinematic'
  | 'artists';

export type AnnouncementDateSort = 'latest_first' | 'earliest_first';

const SORT_OPTIONS: Array<{ key: AnnouncementDateSort; label: string }> = [
  { key: 'latest_first', label: 'Latest → earliest' },
  { key: 'earliest_first', label: 'Earliest → latest' },
];

type OrgChrome = {
  solid: string;
  onSolid: string;
  softSurface: string;
  text: string;
};

type FilterDropdownProps = {
  label: string;
  summary: string;
  icon: ReactNode;
  active?: boolean;
  activeRingColor?: string;
  children: ReactNode;
  align?: 'left' | 'right';
};

function FilterDropdown({
  label,
  summary,
  icon,
  active = false,
  activeRingColor,
  children,
  align = 'left',
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors',
          'bg-white dark:bg-gray-800',
          'text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700',
          active ? 'border-2' : 'border-gray-300 dark:border-gray-600'
        )}
        style={active && activeRingColor ? { borderColor: activeRingColor } : undefined}
      >
        <span className="text-gray-500 dark:text-gray-400">{icon}</span>
        <span className="flex flex-col items-start leading-tight">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {label}
          </span>
          <span className="font-medium">{summary}</span>
        </span>
        <ChevronDown
          className={cn('h-4 w-4 shrink-0 text-gray-400 transition-transform', open && 'rotate-180')}
          aria-hidden
        />
      </button>
      {open ? (
        <CloseFilterDropdownContext.Provider value={() => setOpen(false)}>
          <div
            role="dialog"
            className={cn(
              'absolute z-30 mt-2 min-w-[15rem] max-w-[min(20rem,calc(100vw-2rem))] rounded-lg border border-gray-200 dark:border-gray-700',
              'bg-white dark:bg-gray-900 shadow-lg py-2',
              align === 'right' ? 'right-0' : 'left-0'
            )}
          >
            {children}
          </div>
        </CloseFilterDropdownContext.Provider>
      ) : null}
    </div>
  );
}

function MenuOption({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  const closeDropdown = useContext(CloseFilterDropdownContext);
  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={selected}
      onClick={() => {
        onClick();
        closeDropdown?.();
      }}
      className={cn(
        'flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors',
        selected
          ? 'bg-gray-100 dark:bg-gray-800 font-medium text-gray-900 dark:text-white'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/80'
      )}
    >
      {children}
    </button>
  );
}

const STATUS_OPTIONS: Array<{ key: AnnouncementStatusFilter; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'current', label: 'Current' },
  { key: 'expired', label: 'Expired' },
  { key: 'active', label: 'Active' },
  { key: 'inactive', label: 'Inactive' },
  { key: 'public', label: 'Public' },
  { key: 'internal', label: 'Internal' },
  { key: 'members_only', label: 'Members only' },
];

const MEMBER_STATUS_OPTIONS: Array<{ key: AnnouncementStatusFilter; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'current', label: 'Current' },
  { key: 'expired', label: 'Past' },
];

const PRESET_OPTIONS: Array<{
  key: 'none' | 'april_2026' | AnnouncementCategoryPreset;
  label: string;
}> = [
  { key: 'none', label: 'No preset' },
  { key: 'april_2026', label: 'April 2026' },
  { key: 'events_exhibitions', label: 'Events & exhibitions' },
  { key: 'workshops', label: 'Workshops' },
  { key: 'cinematic', label: 'Cinematic' },
  { key: 'artists', label: 'Artists' },
];

export type AnnouncementListFilterBarProps = {
  /** Month picker, view toggle, etc. — rendered before filter dropdowns in the same row */
  leading?: ReactNode;
  filter: AnnouncementStatusFilter;
  onFilterChange: (value: AnnouncementStatusFilter) => void;
  statusCounts: Record<AnnouncementStatusFilter, number>;
  categoryPreset: AnnouncementCategoryPreset | null;
  monthFilter: string;
  onPresetChange: (preset: 'none' | 'april_2026' | AnnouncementCategoryPreset) => void;
  includePosterPromotions: boolean;
  onIncludePosterPromotionsChange: (value: boolean) => void;
  imagesOnly: boolean;
  onImagesOnlyChange: (value: boolean) => void;
  onClearAll: () => void;
  hasExtraFilters: boolean;
  chrome: OrgChrome;
  /** Public member preview — simpler status filter options */
  memberPreview?: boolean;
  dateSort: AnnouncementDateSort;
  onDateSortChange: (value: AnnouncementDateSort) => void;
};

function presetSummary(
  categoryPreset: AnnouncementCategoryPreset | null,
  monthFilter: string
): string {
  if (monthFilter === '2026-04') return 'April 2026';
  if (!categoryPreset) return 'None';
  const match = PRESET_OPTIONS.find((p) => p.key === categoryPreset);
  return match?.label ?? 'None';
}

function presetKey(
  categoryPreset: AnnouncementCategoryPreset | null,
  monthFilter: string
): 'none' | 'april_2026' | AnnouncementCategoryPreset {
  if (monthFilter === '2026-04' && !categoryPreset) return 'april_2026';
  if (categoryPreset) return categoryPreset;
  return 'none';
}

export function AnnouncementListFilterBar({
  leading,
  filter,
  onFilterChange,
  statusCounts,
  categoryPreset,
  monthFilter,
  onPresetChange,
  includePosterPromotions,
  onIncludePosterPromotionsChange,
  imagesOnly,
  onImagesOnlyChange,
  onClearAll,
  hasExtraFilters,
  chrome,
  memberPreview = false,
  dateSort,
  onDateSortChange,
}: AnnouncementListFilterBarProps) {
  const statusLabel =
    (memberPreview ? MEMBER_STATUS_OPTIONS : STATUS_OPTIONS).find((o) => o.key === filter)
      ?.label ?? 'All';
  const activePreset = presetKey(categoryPreset, monthFilter);
  const statusOptions = memberPreview ? MEMBER_STATUS_OPTIONS : STATUS_OPTIONS;
  const sortLabel = SORT_OPTIONS.find((o) => o.key === dateSort)?.label ?? 'Latest → earliest';

  return (
    <div className="flex flex-wrap items-center gap-2">
      {leading}
      <FilterDropdown
        label="Filter"
        summary={statusLabel}
        icon={<Filter className="h-4 w-4" aria-hidden />}
        active={filter !== 'all'}
        activeRingColor={chrome.solid}
      >
        <div role="menu" aria-label="Status filter">
          {statusOptions.map(({ key, label }) => (
            <MenuOption
              key={key}
              selected={filter === key}
              onClick={() => onFilterChange(key)}
            >
              <span>{label}</span>
              <span className="tabular-nums text-xs text-gray-500 dark:text-gray-400">
                {statusCounts[key]}
              </span>
            </MenuOption>
          ))}
        </div>
      </FilterDropdown>

      <FilterDropdown
        label="Presets"
        summary={presetSummary(categoryPreset, monthFilter)}
        icon={<Layers className="h-4 w-4" aria-hidden />}
        active={activePreset !== 'none'}
        activeRingColor={chrome.solid}
      >
        <div role="menu" aria-label="Category presets">
          {PRESET_OPTIONS.map(({ key, label }) => (
            <MenuOption
              key={key}
              selected={activePreset === key}
              onClick={() => onPresetChange(key)}
            >
              <span>{label}</span>
            </MenuOption>
          ))}
          {categoryPreset === 'events_exhibitions' ? (
            <label className="mx-3 mt-2 flex cursor-pointer items-center gap-2 border-t border-gray-200 dark:border-gray-700 pt-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={includePosterPromotions}
                onChange={(e) => onIncludePosterPromotionsChange(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span>Include film posters</span>
            </label>
          ) : null}
        </div>
      </FilterDropdown>

      <FilterDropdown
        label="Sort"
        summary={sortLabel}
        icon={<ArrowDownUp className="h-4 w-4" aria-hidden />}
        active={dateSort !== 'latest_first'}
        activeRingColor={chrome.solid}
      >
        <div role="menu" aria-label="Date sort">
          {SORT_OPTIONS.map(({ key, label }) => (
            <MenuOption
              key={key}
              selected={dateSort === key}
              onClick={() => onDateSortChange(key)}
            >
              <span>{label}</span>
            </MenuOption>
          ))}
        </div>
      </FilterDropdown>

      <FilterDropdown
        label="Display"
        summary={imagesOnly ? 'With images' : 'All items'}
        icon={<ImageIcon className="h-4 w-4" aria-hidden />}
        active={imagesOnly}
        activeRingColor={chrome.solid}
        align="right"
      >
        <div className="px-3 py-2">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={imagesOnly}
              onChange={(e) => onImagesOnlyChange(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span>Image only</span>
          </label>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Hide announcements without a hero image.
          </p>
        </div>
      </FilterDropdown>

      {hasExtraFilters ? (
        <button
          type="button"
          onClick={onClearAll}
          className="text-sm font-medium hover:underline"
          style={{ color: chrome.solid }}
        >
          Clear filters
        </button>
      ) : null}
    </div>
  );
}
