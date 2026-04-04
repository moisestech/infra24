'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CdcMiamiLogo } from '@/components/marketing/cdc/CdcMiamiLogo';
import { navItems } from '@/lib/marketing/content';
import { cn } from '@/lib/utils';

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--cdc-border)] bg-[#fafafa]/95 backdrop-blur supports-[backdrop-filter]:bg-[#fafafa]/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-3 leading-tight"
        >
          <CdcMiamiLogo size="sm" priority className="max-sm:h-7 max-sm:w-[6.25rem]" />
          <div className="min-w-0 flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-neutral-900 md:text-[0.95rem]">
              <span className="sm:hidden">CDC</span>
              <span className="hidden sm:inline">Center of Digital Culture</span>
            </span>
            <span className="text-[10px] font-normal text-neutral-500 group-hover:text-neutral-600">
              Powered by Infra24
            </span>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm text-neutral-600 transition-colors hover:text-neutral-900',
                pathname === item.href && 'font-medium text-neutral-900'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="hidden text-sm text-neutral-600 transition-colors hover:text-neutral-900 sm:inline"
          >
            Contact
          </Link>
          <Link
            href="/grants"
            className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Grants
          </Link>
        </div>
      </div>
      <nav
        className="flex gap-4 overflow-x-auto border-t border-neutral-100 px-4 py-2 md:hidden"
        aria-label="Mobile primary"
      >
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'whitespace-nowrap text-xs text-neutral-600',
              pathname === item.href && 'font-medium text-neutral-900'
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
