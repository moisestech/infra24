'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Flag,
  GraduationCap,
  HeartHandshake,
  Info,
  LayoutGrid,
  Mail,
  Menu,
  Share2,
  type LucideIcon,
} from 'lucide-react';
import { MarketingHeaderCenterLogo } from '@/components/marketing/MarketingHeaderCenterLogo';
import {
  dccSiteMeta,
  marketingHeaderApplyCta,
  marketingHeaderNavLeft,
  marketingHeaderNavRight,
  marketingNavSheetFooterHrefs,
  marketingNavSheetGroups,
  navItems,
  type MarketingHeaderNavIconKey,
} from '@/lib/marketing/content';
import { MarketingThemeToggle } from '@/components/marketing/MarketingThemeToggle';
import { cn } from '@/lib/utils';
import Tooltip from '@/components/ui/Tooltip';
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

const marketingHeaderNavIconMap: Record<MarketingHeaderNavIconKey, LucideIcon> = {
  info: Info,
  'layout-grid': LayoutGrid,
  'graduation-cap': GraduationCap,
  flag: Flag,
  'share-2': Share2,
  handshake: HeartHandshake,
  mail: Mail,
};

export function SiteHeader() {
  const pathname = usePathname();

  const sheetLinkClass = (href: string) =>
    cn(
      'block rounded-lg px-4 py-3.5 text-base leading-snug transition-colors',
      pathname === href
        ? 'bg-neutral-100 font-medium text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100'
        : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800/80 dark:hover:text-neutral-100'
    );

  const iconNavLinkClass = (href: string) =>
    cn(
      'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md transition-colors lg:h-11 lg:w-11',
      pathname === href || (href !== '/' && pathname.startsWith(href))
        ? 'bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100'
        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800/80 dark:hover:text-neutral-100'
    );

  const applyBarClass =
    'inline-flex min-h-11 shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-neutral-900 bg-neutral-900 px-2.5 text-[11px] font-semibold text-white transition-opacity hover:opacity-90 dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:opacity-95 sm:px-3 sm:text-xs';

  const headerNavEntries = [...marketingHeaderNavLeft, ...marketingHeaderNavRight] as const;

  const menuButtonClass =
    'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-[var(--cdc-border)] bg-white/80 text-neutral-800 shadow-sm transition-colors hover:bg-white hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cdc-teal)] focus-visible:ring-offset-2 dark:border-neutral-600 dark:bg-neutral-900/80 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:hover:text-white dark:focus-visible:ring-offset-neutral-950';

  return (
    <header
      data-site-header="marketing"
      className="sticky top-0 z-50 border-b border-[var(--cdc-border)] bg-[#fafafa]/95 backdrop-blur supports-[backdrop-filter]:bg-[#fafafa]/80 dark:border-neutral-700/80 dark:bg-neutral-950/90 dark:supports-[backdrop-filter]:bg-neutral-950/85"
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-1.5 gap-y-1 px-3 py-2.5 sm:gap-x-2 sm:px-6 sm:py-3 lg:gap-x-3 lg:px-8">
        <div className="relative z-20 flex min-w-0 items-center justify-start">
          <nav
            className="cdc-font-display hidden min-w-0 items-center gap-0.5 lg:flex"
            aria-label="Site sections"
          >
            {headerNavEntries.map(({ href, label, icon }) => {
              const Icon = marketingHeaderNavIconMap[icon];
              return (
                <Tooltip key={href} content={label} position="bottom">
                  <Link
                    href={href}
                    className={iconNavLinkClass(href)}
                    aria-label={label}
                    aria-current={pathname === href ? 'page' : undefined}
                  >
                    <Icon className="h-5 w-5 shrink-0" aria-hidden />
                  </Link>
                </Tooltip>
              );
            })}
          </nav>
        </div>

        <div className="relative z-10 flex min-w-0 justify-center px-0.5">
          <MarketingHeaderCenterLogo
            size="topBar"
            priority
            className="w-[min(15rem,calc(100vw-4rem))] lg:w-[min(15rem,calc(100vw-11rem))] sm:w-[15rem]"
          />
        </div>

        <div className="relative z-20 flex min-w-0 items-center justify-end gap-1 sm:gap-2">
          <Link href={marketingHeaderApplyCta.href} className={cn(applyBarClass, 'hidden lg:inline-flex')}>
            {marketingHeaderApplyCta.label}
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <button type="button" className={menuButtonClass} aria-label="Open menu" aria-haspopup="dialog">
                <Menu className="h-5 w-5" aria-hidden />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex w-[min(100vw-1.25rem,24rem)] flex-col border-[var(--cdc-border)] bg-[#fafafa] p-0 sm:max-w-md dark:border-neutral-700 dark:bg-neutral-950"
            >
              <SheetHeader className="border-b border-[var(--cdc-border)] px-6 pb-5 pt-6 text-center dark:border-neutral-700">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex w-full justify-center">
                    <SheetClose asChild>
                      <MarketingHeaderCenterLogo size="drawer" priority={false} />
                    </SheetClose>
                  </div>
                  <SheetTitle className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                    Menu
                  </SheetTitle>
                  <p className="cdc-font-mono-accent max-w-full text-[11px] font-normal leading-relaxed tracking-[0.12em] text-neutral-500 dark:text-neutral-400">
                    On smaller screens, Apply and appearance live here; on large screens they stay in the header with icon shortcuts.
                  </p>
                </div>
              </SheetHeader>

              <div className="flex flex-1 flex-col overflow-y-auto px-4 py-5">
                <div className="mb-5 flex flex-col gap-3">
                  <div className="flex flex-col gap-3 lg:hidden">
                    <SheetClose asChild>
                      <Link
                        href={marketingHeaderApplyCta.href}
                        className="block rounded-xl bg-neutral-900 px-4 py-4 text-center text-base font-semibold text-white dark:bg-neutral-100 dark:text-neutral-900"
                      >
                        {marketingHeaderApplyCta.label}
                      </Link>
                    </SheetClose>
                    <div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--cdc-border)] bg-white/90 px-4 py-3 dark:border-neutral-600 dark:bg-neutral-900/80">
                      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                        Appearance
                      </span>
                      <MarketingThemeToggle className="h-11 w-11 shrink-0" />
                    </div>
                  </div>
                  <SheetClose asChild>
                    <Link
                      href="/grants"
                      className="block rounded-xl border border-[var(--cdc-border)] bg-white/90 px-4 py-3.5 text-center text-base font-medium text-neutral-800 dark:border-neutral-600 dark:bg-neutral-900/80 dark:text-neutral-200"
                    >
                      Pilot (Grants)
                    </Link>
                  </SheetClose>
                </div>

                <nav className="space-y-3" aria-label="Primary">
                  {marketingNavSheetGroups.map((group) => (
                    <details
                      key={group.title}
                      className="overflow-hidden rounded-xl border border-[var(--cdc-border)] bg-white/90 dark:border-neutral-700 dark:bg-neutral-900/80"
                    >
                      <summary className="cursor-pointer list-none px-4 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500 marker:hidden dark:text-neutral-400 [&::-webkit-details-marker]:hidden">
                        <span className="flex items-center justify-between gap-2">
                          {group.title}
                          <span className="text-neutral-400" aria-hidden>
                            ▾
                          </span>
                        </span>
                      </summary>
                      <ul className="border-t border-neutral-100 px-2 pb-2 pt-1 dark:border-neutral-700">
                        {group.hrefs.map((href) => {
                          const item = navItemByHref(href);
                          if (!item) return null;
                          return (
                            <li key={href}>
                              <SheetClose asChild>
                                <Link href={href} className={sheetLinkClass(href)}>
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

                <div className="mt-5 space-y-1 border-t border-[var(--cdc-border)] pt-5 dark:border-neutral-700">
                  {marketingNavSheetFooterHrefs.map((href) => {
                    const item = navItemByHref(href);
                    if (!item) return null;
                    return (
                      <SheetClose key={href} asChild>
                        <Link href={href} className={sheetLinkClass(href)}>
                          {item.label}
                        </Link>
                      </SheetClose>
                    );
                  })}
                </div>
              </div>

              <div className="mt-auto border-t border-[var(--cdc-border)] px-6 py-5 dark:border-neutral-700">
                <p className="text-[11px] text-neutral-400 dark:text-neutral-500">{dccSiteMeta.poweredByLine}</p>
                <p className="mt-1.5 text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                  {dccSiteMeta.infra24Descriptor}
                </p>
                <SheetClose asChild>
                  <Link
                    href="/infra24"
                    className="mt-3 inline-block text-sm font-medium text-neutral-700 underline-offset-4 hover:underline dark:text-neutral-300"
                  >
                    Infra24 overview
                  </Link>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>

          <MarketingThemeToggle className="hidden h-11 w-11 shrink-0 lg:inline-flex" />
        </div>
      </div>
    </header>
  );
}
