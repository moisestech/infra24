import { OfferLink } from './OfferLink';
import { cn } from '@/lib/utils';

type OfferingDoorsBandProps = {
  variant: 'workshops' | 'infra24' | 'partners' | 'contact';
  className?: string;
};

const COPY = {
  workshops: {
    eyebrow: 'Institutions and incubators',
    title: 'Hosting a cohort, or building digital systems?',
    body: 'Public catalog stays here. Guided production lives on Fabricate. Guest teaching and curriculum live on artist infrastructure. Museum and org digital systems live on institutions.',
    primary: { href: '/artist-infrastructure', label: 'Artist infrastructure' },
    secondary: { href: '/institutions', label: 'Institutions' },
    tertiary: { href: '/fabricate', label: 'Fabricate' },
  },
  infra24: {
    eyebrow: 'Related DCC doors',
    title: 'Need web, CRM, labs, or teaching?',
    body: 'Those live on /institutions and /artist-infrastructure. Infra24 is the public-interface product: signs, kiosks, portals, and update workflows.',
    primary: { href: '/institutions', label: 'Institutions' },
    secondary: { href: '/artist-infrastructure', label: 'Artist infrastructure' },
  },
  partners: {
    eyebrow: 'Related offering doors',
    title: 'Partners hosts workshops. These pages sell the work.',
    body: 'Digital systems for museums and orgs, and teaching for incubators, are separate doors — they do not replace hosting.',
    primary: { href: '/institutions', label: 'Institutions' },
    secondary: { href: '/artist-infrastructure', label: 'Artist infrastructure' },
  },
  contact: {
    eyebrow: 'Offering doors',
    title: 'Already know what you need?',
    body: 'Institutional digital systems and incubator teaching have their own pages, with Calendly and contact@dcc.miami.',
    primary: { href: '/institutions', label: 'Institutions' },
    secondary: { href: '/artist-infrastructure', label: 'Artist infrastructure' },
  },
} as const;

export function OfferingDoorsBand({ variant, className }: OfferingDoorsBandProps) {
  const copy = COPY[variant];
  return (
    <section
      className={cn(
        'border-b border-[var(--cdc-border)] bg-white py-10 dark:border-neutral-800 dark:bg-neutral-950 sm:py-12',
        className
      )}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
          {copy.eyebrow}
        </p>
        <h2 className="mt-2 max-w-2xl text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-xl">
          {copy.title}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {copy.body}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <OfferLink
            href={copy.primary.href}
            className="inline-flex rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
          >
            {copy.primary.label}
          </OfferLink>
          <OfferLink
            href={copy.secondary.href}
            className="inline-flex text-sm font-medium text-neutral-700 underline-offset-4 hover:underline dark:text-neutral-300"
          >
            {copy.secondary.label}
          </OfferLink>
          {'tertiary' in copy && copy.tertiary ? (
            <OfferLink
              href={copy.tertiary.href}
              className="inline-flex text-sm font-medium text-neutral-700 underline-offset-4 hover:underline dark:text-neutral-300"
            >
              {copy.tertiary.label}
            </OfferLink>
          ) : null}
        </div>
      </div>
    </section>
  );
}
