'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { DCC_MIAMI_LOGO_ALT, DCC_MIAMI_LOGO_URL } from '@/lib/marketing/cdc-brand';

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
}: {
  className?: string;
  size?: keyof typeof sizeBox;
  priority?: boolean;
}) {
  const sizesAttr =
    size === 'sm'
      ? '120px'
      : size === 'md'
        ? '152px'
        : size === 'lg'
          ? '208px'
          : '240px';

  return (
    <span className={cn('relative inline-block shrink-0', sizeBox[size], className)}>
      <Image
        src={DCC_MIAMI_LOGO_URL}
        alt={DCC_MIAMI_LOGO_ALT}
        fill
        sizes={sizesAttr}
        className="object-contain object-left"
        priority={priority}
      />
    </span>
  );
}
