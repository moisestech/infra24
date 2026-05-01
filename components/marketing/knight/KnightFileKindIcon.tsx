import type { IconType } from 'react-icons';
import {
  FaEnvelopeOpenText,
  FaFileExcel,
  FaFileLines,
  FaFilePdf,
  FaFilePowerpoint,
  FaFileZipper,
  FaPalette,
} from 'react-icons/fa6';
import type { FunderFileKind } from '@/lib/marketing/knight-packet';
import { cn } from '@/lib/utils';

const FILE_KIND_ICONS: Record<FunderFileKind, IconType> = {
  pdf: FaFilePdf,
  doc: FaFileLines,
  slides: FaFilePowerpoint,
  sheet: FaFileExcel,
  archive: FaFileZipper,
  brand: FaPalette,
  letter: FaEnvelopeOpenText,
};

const FILE_KIND_ICON_BG: Record<FunderFileKind, string> = {
  pdf: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-200',
  doc: 'bg-sky-100 text-sky-800 dark:bg-sky-950/55 dark:text-sky-200',
  slides: 'bg-amber-100 text-amber-800 dark:bg-amber-950/55 dark:text-amber-200',
  sheet: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/55 dark:text-emerald-200',
  archive: 'bg-violet-100 text-violet-800 dark:bg-violet-950/55 dark:text-violet-200',
  brand: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-950/55 dark:text-fuchsia-200',
  letter: 'bg-orange-100 text-orange-800 dark:bg-orange-950/55 dark:text-orange-200',
};

/** Packet terminal panel: pastel on light “screen”, glassy inset tiles in dark mode. */
const FILE_KIND_ICON_TERMINAL: Record<FunderFileKind, string> = {
  pdf: 'bg-rose-100 text-rose-700 ring-1 ring-[var(--cdc-border)] dark:bg-rose-950/55 dark:text-rose-100 dark:ring-inset dark:ring-rose-400/22',
  doc: 'bg-sky-100 text-sky-800 ring-1 ring-[var(--cdc-border)] dark:bg-sky-950/50 dark:text-sky-100 dark:ring-inset dark:ring-sky-400/22',
  slides:
    'bg-amber-100 text-amber-800 ring-1 ring-[var(--cdc-border)] dark:bg-amber-950/50 dark:text-amber-100 dark:ring-inset dark:ring-amber-400/22',
  sheet:
    'bg-emerald-100 text-emerald-800 ring-1 ring-[var(--cdc-border)] dark:bg-emerald-950/50 dark:text-emerald-100 dark:ring-inset dark:ring-emerald-400/22',
  archive:
    'bg-violet-100 text-violet-800 ring-1 ring-[var(--cdc-border)] dark:bg-violet-950/50 dark:text-violet-100 dark:ring-inset dark:ring-violet-400/22',
  brand:
    'bg-fuchsia-100 text-fuchsia-800 ring-1 ring-[var(--cdc-border)] dark:bg-fuchsia-950/50 dark:text-fuchsia-100 dark:ring-inset dark:ring-fuchsia-400/22',
  letter:
    'bg-orange-100 text-orange-800 ring-1 ring-[var(--cdc-border)] dark:bg-orange-950/50 dark:text-orange-100 dark:ring-inset dark:ring-orange-400/22',
};

const BOX_SIZE: Record<'default' | 'lg', string> = {
  default: 'h-10 w-10 rounded-xl',
  lg: 'h-14 w-14 rounded-2xl md:h-[4.25rem] md:w-[4.25rem] md:rounded-2xl',
};

const GLYPH_SIZE: Record<'default' | 'lg', string> = {
  default: 'h-5 w-5',
  lg: 'h-7 w-7 md:h-8 md:w-8',
};

type KnightFileKindIconProps = {
  kind: FunderFileKind;
  className?: string;
  boxed?: boolean;
  /** Larger tile + glyph for prominent packet cards (e.g. Core packet). */
  size?: 'default' | 'lg';
  /** Pastel + border vs terminal panel (pastel in light theme, glassy `dark:` tiles on dark theme). */
  variant?: 'default' | 'terminal';
};

export function KnightFileKindIcon({
  kind,
  className,
  boxed,
  size = 'default',
  variant = 'default',
}: KnightFileKindIconProps) {
  const Icon = FILE_KIND_ICONS[kind];
  if (boxed) {
    return (
      <span
        className={cn(
          'inline-flex shrink-0 items-center justify-center',
          BOX_SIZE[size],
          variant === 'terminal'
            ? FILE_KIND_ICON_TERMINAL[kind]
            : cn(FILE_KIND_ICON_BG[kind], 'ring-1 ring-[var(--cdc-border)]'),
          className
        )}
      >
        <Icon className={GLYPH_SIZE[size]} aria-hidden />
      </span>
    );
  }
  return <Icon className={className} aria-hidden />;
}
