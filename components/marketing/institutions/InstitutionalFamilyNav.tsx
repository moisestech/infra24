import { INSTITUTIONAL_FAMILY_NAV, type InstitutionalFamilyMatch } from '@/lib/marketing/institutions/shared';
import { cn } from '@/lib/utils';
import { OfferLink } from './OfferLink';

type InstitutionalFamilyNavProps = {
  active: InstitutionalFamilyMatch;
  className?: string;
};

/** Shared strip across offering doors. Sticky below the DCC header (z-100). */
export function InstitutionalFamilyNav({ active, className }: InstitutionalFamilyNavProps) {
  return (
    <nav
      aria-label="Institutional offering doors"
      className={cn(
        // Header is menu button + py, not min-h — sit below it (z-100) so pills stay clickable.
        'sticky top-[4.8125rem] z-40 sm:top-[5.3125rem]',
        'border-b border-[var(--cdc-border)] bg-[#fafafa]/95 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/90',
        className
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-1.5 overflow-x-auto px-4 py-2 sm:gap-2 sm:px-6 lg:px-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <p className="cdc-font-mono-accent mr-1 hidden shrink-0 text-[10px] uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400 sm:block">
          Offerings
        </p>
        {INSTITUTIONAL_FAMILY_NAV.map((item) => {
          const isActive = active === item.match;
          return (
            <OfferLink
              key={item.href}
              href={item.href}
              aria-label={`${item.label} — ${item.short}`}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition sm:min-h-10 sm:px-3',
                isActive
                  ? 'border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900'
                  : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-500'
              )}
            >
              <span>{item.label}</span>
              <span
                className={cn(
                  'cdc-font-mono-accent hidden text-[9px] uppercase tracking-[0.12em] md:inline',
                  isActive ? 'opacity-80' : 'opacity-60'
                )}
              >
                {item.short}
              </span>
            </OfferLink>
          );
        })}
      </div>
    </nav>
  );
}
