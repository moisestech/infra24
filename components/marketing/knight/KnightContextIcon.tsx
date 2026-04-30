import type { IconType } from 'react-icons';
import {
  FaBuildingColumns,
  FaHandHoldingDollar,
  FaHouse,
  FaLayerGroup,
  FaListCheck,
  FaSitemap,
  FaUsers,
} from 'react-icons/fa6';
import type { KnightContextIconKey } from '@/lib/marketing/knight-packet';

const CONTEXT_ICONS: Record<KnightContextIconKey, IconType> = {
  home: FaHouse,
  about: FaUsers,
  mission: FaBuildingColumns,
  infra24: FaLayerGroup,
  projects: FaSitemap,
  funders: FaHandHoldingDollar,
  priorities: FaListCheck,
};

const ACCENT_RING: Record<'teal' | 'coral' | 'magenta' | 'indigo', string> = {
  teal:
    'bg-teal-50 text-teal-800 ring-teal-200/80 dark:bg-teal-950/70 dark:text-teal-200 dark:ring-teal-500/30',
  coral:
    'bg-orange-50 text-orange-900 ring-orange-200/80 dark:bg-orange-950/60 dark:text-orange-200 dark:ring-orange-500/25',
  magenta:
    'bg-fuchsia-50 text-fuchsia-900 ring-fuchsia-200/70 dark:bg-fuchsia-950/55 dark:text-fuchsia-200 dark:ring-fuchsia-500/25',
  indigo:
    'bg-indigo-50 text-indigo-900 ring-indigo-200/80 dark:bg-indigo-950/60 dark:text-indigo-200 dark:ring-indigo-400/25',
};

type KnightContextIconProps = {
  icon: KnightContextIconKey;
  accent: keyof typeof ACCENT_RING;
  size?: 'default' | 'compact';
};

export function KnightContextIconBadge({ icon, accent, size = 'default' }: KnightContextIconProps) {
  const Icon = CONTEXT_ICONS[icon];
  const box = size === 'compact' ? 'h-8 w-8 rounded-xl' : 'h-11 w-11 rounded-2xl';
  const glyph = size === 'compact' ? 'h-4 w-4' : 'h-5 w-5';
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center ring-1 ring-inset ${box} ${ACCENT_RING[accent]}`}
    >
      <Icon className={glyph} aria-hidden />
    </span>
  );
}
