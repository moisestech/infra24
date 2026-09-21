'use client';

import Image from 'next/image';
import {
  DCC_MIAMI_LOGO_ALT,
  DCC_MIAMI_LOGO_URL_LIGHT,
  DCC_MIAMI_LOGO_URL_WHITE,
} from '@/lib/marketing/cdc-brand';
import { cn } from '@/lib/utils';

const sizeBox: Record<'sm' | 'md' | 'lg' | 'hero', string> = {
  sm: 'h-8 w-[7.5rem]',
  md: 'h-10 w-[9.5rem]',
  lg: 'h-14 w-[13rem]',
  /** ~2× `sm` — hero visual strip */
  hero: 'h-16 w-[15rem]',
};

export function CdcMiamiLogo({
  className,
  size = 'md',
  priority = false,
  /** `center` for drawer / symmetric layouts; default `left` matches sticky header. */
  objectAlign = 'left',
}: {
  className?: string;
  size?: keyof typeof sizeBox;
  priority?: boolean;
  objectAlign?: 'left' | 'center';
}) {
  const sizesAttr =
    size === 'sm'
      ? '120px'
      : size === 'md'
        ? '152px'
        : size === 'lg'
          ? '208px'
          : '240px';
  const objectClass = cn(
    'object-contain',
    objectAlign === 'center' ? 'object-center' : 'object-left'
  );

  return (
    <span className={cn('relative inline-block shrink-0', sizeBox[size], className)}>
      <Image
        src={DCC_MIAMI_LOGO_URL_LIGHT}
        alt={DCC_MIAMI_LOGO_ALT}
        fill
        sizes={sizesAttr}
        className={cn(objectClass, 'dark:hidden')}
        priority={priority}
        unoptimized
      />
      <Image
        src={DCC_MIAMI_LOGO_URL_WHITE}
        alt=""
        fill
        sizes={sizesAttr}
        className={cn(objectClass, 'hidden dark:block')}
        priority={priority}
        unoptimized
        aria-hidden
      />
    </span>
  );
}
