'use client';

import Image from 'next/image';
import { useTheme } from '@/contexts/ThemeContext';
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
  const { resolvedTheme } = useTheme();
  const src = resolvedTheme === 'dark' ? DCC_MIAMI_LOGO_URL_WHITE : DCC_MIAMI_LOGO_URL_LIGHT;

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
        src={src}
        alt={DCC_MIAMI_LOGO_ALT}
        fill
        sizes={sizesAttr}
        className={cn('object-contain', objectAlign === 'center' ? 'object-center' : 'object-left')}
        priority={priority}
        unoptimized
      />
    </span>
  );
}
