'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu } from 'lucide-react';
import { MarketingHeaderCenterLogo } from '@/components/marketing/MarketingHeaderCenterLogo';
import { MarketingHeaderSloganBar } from '@/components/marketing/MarketingHeaderSloganBar';
import {
  dccSiteMeta,
  marketingHeaderApplyCta,
  marketingHeaderNavLeft,
  marketingHeaderNavRight,
  marketingNavSheetFooterHrefs,
  marketingNavSheetGroups,
  navItems,
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

/** Mid-width desktop: same destinations as the split bar, for the compact Menu panel. */
const marketingHeaderNavMidMenuLinks = [
  ...marketingHeaderNavLeft,
  ...marketingHeaderNavRight,
] as const;

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

  const desktopMenuPanelLinkClass = (href: string) =>
    cn(
      'cdc-font-display block rounded-md px-3 py-2 text-sm font-medium transition-colors',
      pathname === href
        ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100'
        : 'text-neutral-700 hover:bg-neutral-50 dark:text-neutral-200 dark:hover:bg-neutral-800/80'
    );

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--cdc-border)] bg-[#fafafa]/95 backdrop-blur supports-[backdrop-filter]:bg-[#fafafa]/80 dark:border-neutral-700/80 dark:bg-neutral-950/90 dark:supports-[backdrop-filter]:bg-neutral-950/85">
      <div className="mx-auto grid h-14 max-w-7xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-3 sm:h-16 sm:px-6 lg:gap-3 lg:px-8">
        {/* Left: full nav at 2xl+; compact “Menu” lg–2xl */}
        <div className="flex min-w-0 items-center gap-2 justify-self-start">
          <nav
            className="cdc-font-display hidden min-w-0 items-center gap-x-1 xl:gap-x-3 2xl:flex"
            aria-label="Site sections"
          >
            {marketingHeaderNavLeft.map(({ href, label }) => (
              <Link key={href} href={href} className={desktopLinkClass(href)}>
                {label}
              </Link>
            ))}
          </nav>

          <details className="relative hidden lg:block 2xl:hidden">
            <summary
              className="cdc-font-display flex cursor-pointer list-none items-center gap-1 rounded-md border border-[var(--cdc-border)] bg-white/90 px-3 py-1.5 text-sm font-medium text-neutral-800 shadow-sm marker:hidden hover:bg-white dark:border-neutral-600 dark:bg-neutral-900/80 dark:text-neutral-200 dark:hover:bg-neutral-800 [&::-webkit-details-marker]:hidden"
              aria-label="Open pages menu"
            >
              Menu
              <ChevronDown className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
            </summary>
            <div
              className="absolute left-0 z-50 mt-1 min-w-[14rem] rounded-lg border border-[var(--cdc-border)] bg-white py-1.5 shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
              role="menu"
            >
              <div className="border-b border-neutral-100 px-3 py-3 dark:border-neutral-700">
                <MarketingHeaderCenterLogo size="menu" priority={false} className="mx-auto" />
              </div>
              {marketingHeaderNavMidMenuLinks.map(({ href, label }) => (
                <Link key={href} href={href} className={desktopMenuPanelLinkClass(href)} role="menuitem">
                  {label}
                </Link>
              ))}
              <Link
                href={marketingHeaderApplyCta.href}
                className="cdc-font-display mt-1 block border-t border-neutral-100 px-3 py-2.5 text-sm font-semibold text-neutral-900 dark:border-neutral-700 dark:text-neutral-100"
                role="menuitem"
              >
                {marketingHeaderApplyCta.label}
              </Link>
            </div>
          </details>

          <MarketingThemeToggle className="ml-auto hidden sm:flex lg:hidden" />
        </div>

        {/* Center: wordmark — dedicated component, horizontally centered in column */}
        <div className="relative z-20 flex w-full min-w-0 justify-center justify-self-center">
          <MarketingHeaderCenterLogo size="header" priority />
        </div>

        {/* Right: full nav + Apply at 2xl+; Apply + theme lg–2xl */}
        <div className="flex min-w-0 items-center justify-end justify-self-end gap-2 sm:gap-3">
          <nav
            className="cdc-font-display hidden min-w-0 items-center gap-x-1 xl:gap-x-3 2xl:flex"
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

          <div className="hidden items-center gap-2 lg:flex 2xl:hidden">
            <Link
              href={marketingHeaderApplyCta.href}
              className="whitespace-nowrap rounded-full border border-neutral-900 bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:opacity-95"
            >
              {marketingHeaderApplyCta.label}
            </Link>
          </div>

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
                  <div className="flex w-full justify-center">
                    <SheetClose asChild>
                      <MarketingHeaderCenterLogo size="drawer" priority={false} />
                    </SheetClose>
                  </div>
                  <SheetTitle className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                    Menu
                  </SheetTitle>
                  <p className="cdc-font-mono-accent max-w-full text-[10px] font-normal leading-snug tracking-[0.12em] text-neutral-500 dark:text-neutral-400">
                    Digital taglines rotate in the bar above — same voice, public programs &amp; pilot work in
                    Miami.
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
      <MarketingHeaderSloganBar />
    </header>
  );
}
