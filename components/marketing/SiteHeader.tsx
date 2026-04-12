'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { CdcMiamiLogo } from '@/components/marketing/cdc/CdcMiamiLogo';
import {
  dccSiteMeta,
  marketingNavSheetFooterHrefs,
  marketingNavSheetGroups,
  navItems,
  publicDigitalMiamiLine,
} from '@/lib/marketing/content';
import { MarketingThemeToggle } from '@/components/marketing/MarketingThemeToggle';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

function navItemByHref(href: string) {
  return navItems.find((item) => item.href === href);
}

export function SiteHeader() {
  const pathname = usePathname();

  const linkClass = (href: string) =>
    cn(
      'block rounded-md px-3 py-2.5 text-sm transition-colors',
      pathname === href
        ? 'bg-neutral-100 font-medium text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100'
        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800/80 dark:hover:text-neutral-100'
    );

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--cdc-border)] bg-[#fafafa]/95 backdrop-blur supports-[backdrop-filter]:bg-[#fafafa]/80 dark:border-neutral-700/80 dark:bg-neutral-950/90 dark:supports-[backdrop-filter]:bg-neutral-950/85">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-3 sm:h-16 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex min-w-0 flex-1 items-center gap-2.5 leading-tight sm:gap-3"
        >
          <CdcMiamiLogo
            size="hero"
            priority
            className="max-sm:h-10 max-sm:w-[9.5rem]"
          />
          <div className="min-w-0 flex flex-col">
            <span className="truncate text-sm font-semibold tracking-tight text-neutral-900 sm:text-[0.95rem] dark:text-neutral-100">
              <span className="sm:hidden">{dccSiteMeta.shortName}</span>
              <span className="hidden sm:inline">{dccSiteMeta.organizationName}</span>
            </span>
          </div>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          <MarketingThemeToggle className="hidden sm:inline-flex" />
          <Link
            href="/grants"
            className="hidden rounded-md bg-neutral-900 px-2.5 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90 sm:inline-flex sm:px-3 sm:text-sm dark:bg-neutral-100 dark:text-neutral-900 dark:hover:opacity-95"
          >
            Grants
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                className="inline-flex h-12 w-12 items-center justify-center rounded-md border border-[var(--cdc-border)] bg-white/80 text-neutral-800 shadow-sm transition-colors hover:bg-white hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cdc-teal)] focus-visible:ring-offset-2 dark:border-neutral-600 dark:bg-neutral-900/80 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:hover:text-white dark:focus-visible:ring-offset-neutral-950"
                aria-label="Open menu"
              >
                <Menu className="h-10 w-10" aria-hidden />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex w-[min(100vw-1rem,20rem)] flex-col border-[var(--cdc-border)] bg-[#fafafa] p-0 sm:max-w-sm dark:border-neutral-700 dark:bg-neutral-950"
            >
              <SheetHeader className="border-b border-[var(--cdc-border)] px-5 pb-4 pt-5 text-left">
                <SheetTitle className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                  Menu
                </SheetTitle>
                <p className="text-xs font-normal font-mono uppercase tracking-[0.18em] text-[var(--cdc-teal)]">
                  {publicDigitalMiamiLine}
                </p>
              </SheetHeader>

              <div className="flex flex-1 flex-col overflow-y-auto px-3 py-4">
                <SheetClose asChild>
                  <Link
                    href="/grants"
                    className="mb-4 block rounded-lg bg-neutral-900 px-4 py-3 text-center text-sm font-medium text-white sm:hidden"
                  >
                    Grants
                  </Link>
                </SheetClose>

                <nav className="space-y-2" aria-label="Primary">
                  {marketingNavSheetGroups.map((group) => (
                    <details
                      key={group.title}
                      className="rounded-lg border border-[var(--cdc-border)] bg-white/90 dark:border-neutral-700 dark:bg-neutral-900/80"
                    >
                      <summary className="cursor-pointer list-none px-3 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500 marker:hidden dark:text-neutral-400 [&::-webkit-details-marker]:hidden">
                        <span className="flex items-center justify-between gap-2">
                          {group.title}
                          <span className="text-neutral-400" aria-hidden>
                            ▾
                          </span>
                        </span>
                      </summary>
                      <ul className="border-t border-neutral-100 px-1 pb-2 pt-1 dark:border-neutral-700">
                        {group.hrefs.map((href) => {
                          const item = navItemByHref(href);
                          if (!item) return null;
                          return (
                            <li key={href}>
                              <SheetClose asChild>
                                <Link href={href} className={linkClass(href)}>
                                  {item.label}
                                </Link>
                              </SheetClose>
                            </li>
                          );
                        })}
                      </ul>
                    </details>
                  ))}
                </nav>

                <div className="mt-4 space-y-1 border-t border-[var(--cdc-border)] pt-4">
                  {marketingNavSheetFooterHrefs.map((href) => {
                    const item = navItemByHref(href);
                    if (!item) return null;
                    return (
                      <SheetClose key={href} asChild>
                        <Link href={href} className={linkClass(href)}>
                          {item.label}
                        </Link>
                      </SheetClose>
                    );
                  })}
                </div>
              </div>

              <div className="mt-auto border-t border-[var(--cdc-border)] px-5 py-4 dark:border-neutral-700">
                <div className="mb-3 flex items-center justify-between gap-2 sm:hidden">
                  <span className="text-[10px] font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                    Appearance
                  </span>
                  <MarketingThemeToggle />
                </div>
                <p className="text-[10px] text-neutral-400 dark:text-neutral-500">{dccSiteMeta.poweredByLine}</p>
                <p className="mt-1 text-[10px] leading-snug text-neutral-500 dark:text-neutral-400">
                  {dccSiteMeta.infra24Descriptor}
                </p>
                <SheetClose asChild>
                  <Link
                    href="/infra24"
                    className="mt-2 inline-block text-xs font-medium text-neutral-700 underline-offset-4 hover:underline dark:text-neutral-300"
                  >
                    Infra24 overview
                  </Link>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
