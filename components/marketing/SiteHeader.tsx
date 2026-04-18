'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { CdcMiamiLogo } from '@/components/marketing/cdc/CdcMiamiLogo';
import {
  dccSiteMeta,
  marketingHeaderApplyCta,
  marketingHeaderNavLeft,
  marketingHeaderNavRight,
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

  const desktopLinkClass = (href: string) =>
    cn(
      'cdc-font-display whitespace-nowrap rounded-md px-2 py-1.5 text-sm font-medium transition-colors',
      pathname === href
        ? 'text-neutral-900 dark:text-neutral-100'
        : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
    );

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--cdc-border)] bg-[#fafafa]/95 backdrop-blur supports-[backdrop-filter]:bg-[#fafafa]/80 dark:border-neutral-700/80 dark:bg-neutral-950/90 dark:supports-[backdrop-filter]:bg-neutral-950/85">
      <div className="relative mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-3 sm:h-16 sm:px-6 lg:px-8">
        <div className="z-10 flex min-w-0 flex-1 basis-0 items-center gap-2 lg:gap-3">
          <nav className="cdc-font-display hidden min-w-0 items-center gap-x-1 xl:gap-x-3 lg:flex" aria-label="Site sections">
            {marketingHeaderNavLeft.map(({ href, label }) => (
              <Link key={href} href={href} className={desktopLinkClass(href)}>
                {label}
              </Link>
            ))}
          </nav>
          <MarketingThemeToggle className="ml-auto hidden sm:flex lg:hidden" />
        </div>

        <Link
          href="/"
          className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 outline-none ring-offset-2 transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[var(--cdc-teal)]"
          aria-label={`${dccSiteMeta.organizationName} — home`}
        >
          <CdcMiamiLogo size="hero" priority className="h-9 w-auto max-sm:h-8 sm:h-10" />
        </Link>

        <div className="z-10 flex min-w-0 flex-1 basis-0 items-center justify-end gap-2 sm:gap-3">
          <nav
            className="cdc-font-display hidden min-w-0 items-center gap-x-1 xl:gap-x-3 lg:flex"
            aria-label="More pages"
          >
            {marketingHeaderNavRight.map(({ href, label }) => (
              <Link key={href} href={href} className={desktopLinkClass(href)}>
                {label}
              </Link>
            ))}
            <Link
              href={marketingHeaderApplyCta.href}
              className="whitespace-nowrap rounded-full border border-neutral-900 bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:opacity-95"
            >
              {marketingHeaderApplyCta.label}
            </Link>
          </nav>
          <MarketingThemeToggle className="hidden lg:flex" />
          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                className="inline-flex h-12 w-12 items-center justify-center rounded-md border border-[var(--cdc-border)] bg-white/80 text-neutral-800 shadow-sm transition-colors hover:bg-white hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cdc-teal)] focus-visible:ring-offset-2 dark:border-neutral-600 dark:bg-neutral-900/80 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:hover:text-white dark:focus-visible:ring-offset-neutral-950 lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-10 w-10" aria-hidden />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex w-[min(100vw-1rem,20rem)] flex-col border-[var(--cdc-border)] bg-[#fafafa] p-0 sm:max-w-sm dark:border-neutral-700 dark:bg-neutral-950"
            >
              <SheetHeader className="border-b border-[var(--cdc-border)] px-5 pb-4 pt-5 text-center">
                <div className="flex flex-col items-center gap-3">
                  <SheetClose asChild>
                    <Link
                      href="/"
                      className="outline-none ring-offset-2 transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[var(--cdc-teal)]"
                      aria-label={`${dccSiteMeta.organizationName} — home`}
                    >
                      <CdcMiamiLogo size="md" objectAlign="center" className="h-10 w-auto max-w-[min(100%,14rem)]" />
                    </Link>
                  </SheetClose>
                  <SheetTitle className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                    Menu
                  </SheetTitle>
                  <p className="cdc-font-mono-accent max-w-full text-xs font-normal uppercase tracking-[0.18em] text-[var(--cdc-teal)]">
                    {publicDigitalMiamiLine}
                  </p>
                </div>
              </SheetHeader>

              <div className="flex flex-1 flex-col overflow-y-auto px-3 py-4">
                <div className="mb-4 flex flex-col gap-2">
                  <SheetClose asChild>
                    <Link
                      href={marketingHeaderApplyCta.href}
                      className="block rounded-lg bg-neutral-900 px-4 py-3 text-center text-sm font-semibold text-white dark:bg-neutral-100 dark:text-neutral-900"
                    >
                      {marketingHeaderApplyCta.label}
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/grants"
                      className="block rounded-lg border border-[var(--cdc-border)] bg-white/90 px-4 py-2.5 text-center text-sm font-medium text-neutral-800 dark:border-neutral-600 dark:bg-neutral-900/80 dark:text-neutral-200"
                    >
                      Pilot (Grants)
                    </Link>
                  </SheetClose>
                </div>

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
