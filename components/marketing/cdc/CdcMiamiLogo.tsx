'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { CDC_MIAMI_LOGO_ALT, CDC_MIAMI_LOGO_URL } from '@/lib/marketing/cdc-brand';

const sizeBox: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'h-8 w-[7.5rem]',
  md: 'h-10 w-[9.5rem]',
  lg: 'h-14 w-[13rem]',
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
  return (
    <span className={cn('relative inline-block shrink-0', sizeBox[size], className)}>
      <Image
        src={CDC_MIAMI_LOGO_URL}
        alt={CDC_MIAMI_LOGO_ALT}
        fill
        sizes={size === 'sm' ? '120px' : size === 'md' ? '152px' : '208px'}
        className="object-contain object-left"
        priority={priority}
      />
    </span>
  );
}
