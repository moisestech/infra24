import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  CalendarRange,
  Flag,
  Gauge,
  GitBranch,
  Landmark,
  LayoutDashboard,
  MapPinned,
  PlayCircle,
  RefreshCw,
  Rocket,
  ShieldCheck,
  Sprout,
  TableProperties,
  Users2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type BudgetSectionVisualKey =
  | 'overview'
  | 'funding'
  | 'allocation'
  | 'impactFlow'
  | 'network'
  | 'timeline'
  | 'measurement'
  | 'publicValue'
  | 'detail'
  | 'closing'
  | 'transparency';

export const budgetSectionIcons: Record<BudgetSectionVisualKey, LucideIcon> = {
  overview: LayoutDashboard,
  funding: Landmark,
  allocation: BarChart3,
  impactFlow: GitBranch,
  network: Users2,
  timeline: CalendarRange,
  measurement: Gauge,
  publicValue: MapPinned,
  detail: TableProperties,
  closing: Sprout,
  transparency: ShieldCheck,
};

/** Icons for the four pilot phases (setup → launch → refine → evaluate). */
export const budgetPhaseIcons = [Rocket, PlayCircle, RefreshCw, Flag] as const;

type BudgetSectionHeaderProps = {
  sectionKey: BudgetSectionVisualKey;
  title: string;
  /** Optional kicker above title */
  eyebrow?: string;
  className?: string;
};

/** Icon + title row for budget sections (Knight packet tone). */
export function BudgetSectionHeader({ sectionKey, title, eyebrow, className }: BudgetSectionHeaderProps) {
  const Icon = budgetSectionIcons[sectionKey];

  return (
    <header className={cn('flex gap-4 sm:items-start', className)}>
      <span
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-teal-200/80 bg-gradient-to-br from-teal-50 to-white shadow-sm dark:border-teal-800/60 dark:from-teal-950/60 dark:to-neutral-900 dark:shadow-none"
        aria-hidden
      >
        <Icon className="h-6 w-6 text-teal-700 dark:text-teal-300" />
      </span>
      <div className="min-w-0 pt-0.5">
        {eyebrow ? (
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-2xl">
          {title}
        </h2>
      </div>
    </header>
  );
}
