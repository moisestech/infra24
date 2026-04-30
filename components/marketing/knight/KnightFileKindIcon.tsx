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

type KnightFileKindIconProps = {
  kind: FunderFileKind;
  className?: string;
  boxed?: boolean;
};

export function KnightFileKindIcon({ kind, className, boxed }: KnightFileKindIconProps) {
  const Icon = FILE_KIND_ICONS[kind];
  if (boxed) {
    return (
      <span
        className={cn(
          'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-black/[0.04] dark:ring-white/[0.08]',
          FILE_KIND_ICON_BG[kind],
          className
        )}
      >
        <Icon className="h-5 w-5" aria-hidden />
      </span>
    );
  }
  return <Icon className={className} aria-hidden />;
}
