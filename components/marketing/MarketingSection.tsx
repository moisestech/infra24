import { cn } from '@/lib/utils';

type MarketingSectionProps = {
  id?: string;
  className?: string;
  children: React.ReactNode;
};

export function MarketingSection({ id, className, children }: MarketingSectionProps) {
  return (
    <section id={id} className={cn('py-16 sm:py-20 lg:py-24', className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}
