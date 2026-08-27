import Link from 'next/link';
import type { ReactNode } from 'react';
import { isExternalHref } from '@/lib/marketing/institutions/shared';

type OfferLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
  'aria-label'?: string;
  'aria-current'?: 'page' | undefined;
};

export function OfferLink({
  href,
  className,
  children,
  'aria-label': ariaLabel,
  'aria-current': ariaCurrent,
}: OfferLinkProps) {
  if (isExternalHref(href)) {
    const mailto = href.startsWith('mailto:');
    return (
      <a
        href={href}
        className={className}
        aria-label={ariaLabel}
        aria-current={ariaCurrent}
        target={mailto ? undefined : '_blank'}
        rel={mailto ? undefined : 'noopener noreferrer'}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} aria-label={ariaLabel} aria-current={ariaCurrent}>
      {children}
    </Link>
  );
}
