import { cn } from '@/lib/utils';

type SectionProps = {
  id?: string;
  className?: string;
  /** Full-bleed decorative layer behind content (e.g. soft gradients). */
  backdropClassName?: string;
  children: React.ReactNode;
};

/** DCC marketing section shell (matches MarketingSection rhythm). */
export function Section({ id, className, backdropClassName, children }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'py-14 sm:py-20 lg:py-24',
        backdropClassName && 'relative overflow-hidden',
        className
      )}
    >
      {backdropClassName ? (
        <div
          className={cn('pointer-events-none absolute inset-0 -z-10', backdropClassName)}
          aria-hidden
        />
      ) : null}
      <div className={cn('relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8')}>{children}</div>
    </section>
  );
}
