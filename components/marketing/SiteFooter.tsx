import Link from 'next/link';
import { marketingHero } from '@/lib/marketing/content';

const footerServices = [
  { href: '/what-we-do', label: 'What We Do' },
  { href: '/audit', label: 'Audit' },
  { href: '/pilots', label: 'Pilots' },
  { href: '/case-studies', label: 'Case Studies' },
];

const footerCompany = [
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="text-sm font-semibold text-neutral-900">Infra24</p>
            <p className="mt-2 max-w-md text-sm font-medium leading-relaxed text-neutral-900">
              {marketingHero.headline}
            </p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-neutral-600">
              {marketingHero.subhead}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              Services
            </p>
            <ul className="mt-3 space-y-2">
              {footerServices.map((l) => (
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
              Company
            </p>
            <ul className="mt-3 space-y-2">
              {footerCompany.map((l) => (
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
        <div className="mt-10 flex flex-col gap-2 border-t border-neutral-100 pt-8 text-xs text-neutral-500 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Infra24. All rights reserved.</span>
          <span className="text-neutral-400">
            <Link href="/platform" className="hover:text-neutral-600">
              Platform login area
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
