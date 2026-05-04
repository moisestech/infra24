import Link from 'next/link';
import { DigitalCultureFooterTicker } from '@/components/marketing/DigitalCultureFooterTicker';
import { CdcMiamiLogo } from '@/components/marketing/cdc/CdcMiamiLogo';
import { dccSiteMeta, marketingFooterBlurb } from '@/lib/marketing/content';

const footerWork = [
  { href: '/programs', label: 'Programs' },
  { href: '/workshops', label: 'Workshops' },
  { href: '/contact/artist-index', label: 'Artist Index' },
  { href: '/network', label: 'Network' },
  { href: '/partners', label: 'Partners' },
  { href: '/grants', label: 'Grants' },
];

const footerOrganization = [
  { href: '/about', label: 'About' },
  { href: '/mission', label: 'Mission' },
  { href: '/who-we-work-with', label: 'Who We Work With' },
  { href: '/projects/public-interfaces', label: 'Public Interfaces' },
  { href: '/newsletter', label: 'Newsletter' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--cdc-border)] bg-white dark:border-neutral-700/80 dark:bg-neutral-950">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link href="/" className="mb-4 inline-block">
              <CdcMiamiLogo size="lg" />
            </Link>
            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{dccSiteMeta.organizationName}</p>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{dccSiteMeta.poweredByLine}</p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {marketingFooterBlurb}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              Work
            </p>
            <ul className="mt-3 space-y-2">
              {footerWork.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              Organization
            </p>
            <ul className="mt-3 space-y-2">
              {footerOrganization.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 text-xs text-neutral-500 dark:text-neutral-400">
          © {new Date().getFullYear()} {dccSiteMeta.organizationName}. All rights reserved.
        </div>
      </div>
      <DigitalCultureFooterTicker />
    </footer>
  );
}
