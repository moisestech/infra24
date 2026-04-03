import Link from 'next/link';
import { CdcMiamiLogo } from '@/components/marketing/cdc/CdcMiamiLogo';
import { cdcSiteMeta, marketingHomeMeta } from '@/lib/marketing/content';

const footerWork = [
  { href: '/programs', label: 'Programs' },
  { href: '/projects', label: 'Projects' },
  { href: '/partners', label: 'Partners' },
  { href: '/grants', label: 'Grants' },
];

const footerOrganization = [
  { href: '/about', label: 'About' },
  { href: '/mission', label: 'Mission' },
  { href: '/infra24', label: 'Infra24' },
  { href: '/journal', label: 'Journal' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link href="/" className="mb-4 inline-block">
              <CdcMiamiLogo size="lg" />
            </Link>
            <p className="text-sm font-semibold text-neutral-900">{cdcSiteMeta.organizationName}</p>
            <p className="mt-1 text-xs text-neutral-500">{cdcSiteMeta.poweredByLine}</p>
            <p className="mt-3 max-w-md text-sm font-medium leading-relaxed text-neutral-900">
              {marketingHomeMeta.title}
            </p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-neutral-600">
              {marketingHomeMeta.description}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              Work
            </p>
            <ul className="mt-3 space-y-2">
              {footerWork.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-neutral-600 hover:text-neutral-900"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              Organization
            </p>
            <ul className="mt-3 space-y-2">
              {footerOrganization.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-neutral-600 hover:text-neutral-900"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-neutral-100 pt-8 text-xs text-neutral-500 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-4 sm:gap-y-2">
          <span>
            © {new Date().getFullYear()} {cdcSiteMeta.organizationName}. All rights reserved.
          </span>
          <span className="flex flex-wrap gap-x-4 gap-y-1 text-neutral-400">
            <Link href="/platform" className="hover:text-neutral-600">
              Platform login area
            </Link>
            <Link href="/llms.txt" className="hover:text-neutral-600">
              For AI assistants
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
