import Link from 'next/link';
import type { KnightPacketContextLink } from '@/lib/marketing/knight-packet';
import { KnightContextIconBadge } from '@/components/marketing/knight/KnightContextIcon';
import { cn } from '@/lib/utils';

const ACCENT_BAR: Record<KnightPacketContextLink['accent'], string> = {
  teal: 'from-teal-500 to-cyan-400 dark:from-teal-400 dark:to-cyan-300',
  coral: 'from-orange-500 to-rose-400 dark:from-orange-400 dark:to-rose-300',
  magenta: 'from-fuchsia-600 to-pink-400 dark:from-fuchsia-400 dark:to-pink-300',
  indigo: 'from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-violet-300',
};

type KnightContextCardGridProps = {
  items: KnightPacketContextLink[];
};

export function KnightContextCardGrid({ items }: KnightContextCardGridProps) {
  return (
    <ul className="mt-8 grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <li
          key={item.id}
          className="group relative overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-sm ring-1 ring-black/[0.03] transition-shadow hover:shadow-md dark:border-neutral-700 dark:bg-neutral-900/80 dark:ring-white/[0.04] dark:hover:shadow-lg dark:hover:shadow-black/20"
        >
          <div
            className={cn(
              'h-1.5 w-full bg-gradient-to-r opacity-90 dark:opacity-100',
              ACCENT_BAR[item.accent]
            )}
          />
          <div className="flex gap-4 p-5">
            <KnightContextIconBadge icon={item.icon} accent={item.accent} />
            <div className="min-w-0 flex-1">
              <Link
                href={item.href}
                className="text-[15px] font-semibold text-neutral-900 underline-offset-4 group-hover:underline dark:text-neutral-100"
                {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {item.title}
              </Link>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {item.description}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
