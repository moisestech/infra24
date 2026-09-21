'use client';

import Image from 'next/image';
import Link from 'next/link';
import { forwardRef } from 'react';
import {
  DCC_MIAMI_LOGO_ALT,
  DCC_MIAMI_LOGO_URL_LIGHT,
  DCC_MIAMI_LOGO_URL_WHITE,
} from '@/lib/marketing/cdc-brand';
import { dccSiteMeta } from '@/lib/marketing/content';
import { cn } from '@/lib/utils';

const sizeClass: Record<'topBar' | 'header' | 'menu' | 'drawer', string> = {
  /** Unified header — centered column, primary wordmark scale */
  topBar: 'h-14 w-[15rem] sm:h-16 sm:w-[15rem]',
  /** Legacy inline bar (unused in two-row header; kept for callers) */
  header: 'h-9 w-[min(100%,13.5rem)] sm:h-11 sm:w-[min(100%,15.5rem)]',
  menu: 'h-9 w-[min(100%,12rem)]',
  drawer: 'h-10 w-[min(100%,14rem)]',
};

const sizesAttr: Record<keyof typeof sizeClass, string> = {
  topBar: '240px',
  header: '(max-width: 640px) 200px, 248px',
  menu: '192px',
  drawer: '224px',
};

/**
 * Header wordmark: horizontally centered box, `object-contain` + `object-center`
 * (theme-aware Cloudinary assets via `dark:` so the mark tracks `html.dark` without a flash).
 * `ref` forwards to the home `Link` for sheet/drawer close.
 */
export const MarketingHeaderCenterLogo = forwardRef<
  HTMLAnchorElement,
  {
    size?: keyof typeof sizeClass;
    className?: string;
    priority?: boolean;
  }
>(function MarketingHeaderCenterLogo({ size = 'header', className, priority = true }, ref) {
  return (
    <Link
      ref={ref}
      href="/"
      className={cn(
        'relative mx-auto block shrink-0 outline-none ring-offset-2 transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[var(--cdc-teal)]',
        sizeClass[size],
        className
      )}
      aria-label={`${dccSiteMeta.organizationName} — home`}
    >
      <Image
        src={DCC_MIAMI_LOGO_URL_LIGHT}
        alt={DCC_MIAMI_LOGO_ALT}
        fill
        sizes={sizesAttr[size]}
        className="object-contain object-center dark:hidden"
        priority={priority}
        fetchPriority={priority ? 'high' : undefined}
        unoptimized
      />
      <Image
        src={DCC_MIAMI_LOGO_URL_WHITE}
        alt=""
        fill
        sizes={sizesAttr[size]}
        className="hidden object-contain object-center dark:block"
        priority={priority}
        fetchPriority={priority ? 'high' : undefined}
        unoptimized
        aria-hidden
      />
    </Link>
  );
});
