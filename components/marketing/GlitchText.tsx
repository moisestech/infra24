'use client';

import { type ElementType } from 'react';

import { cn } from '@/lib/utils';

type GlitchTextProps<T extends ElementType = 'span'> = {
  as?: T;
  className?: string;
  children: string;
  /** Occasional idle flicker + stronger burst on hover. */
  interactive?: boolean;
  disabled?: boolean;
};

/**
 * Net-art chromatic flicker (scoped `.cdc-marketing` CSS).
 * Uses text-shadow so multi-line headings still read correctly.
 */
export function GlitchText<T extends ElementType = 'span'>({
  as,
  className,
  children,
  interactive = true,
  disabled = false,
}: GlitchTextProps<T>) {
  const Comp = (as ?? 'span') as ElementType;

  if (disabled || !children) {
    return <Comp className={className}>{children}</Comp>;
  }

  return (
    <Comp
      className={cn(
        'cdc-glitch-text',
        interactive && 'cdc-glitch-text--interactive',
        className
      )}
    >
      {children}
    </Comp>
  );
}
