import Link from 'next/link';
import { knightPacketPartnerTitleHref } from '@/lib/marketing/knight-nav';
import { cn } from '@/lib/utils';

type KnightPartnerTitleLinkProps = {
  variant: 'dcc' | 'knight';
  children: React.ReactNode;
};

const meta = {
  dcc: {
    href: knightPacketPartnerTitleHref.dccIdentity,
    ariaLabel: 'Jump to DCC overview and public identity in this packet',
    ring: 'focus-visible:ring-teal-500/55',
  },
  knight: {
    href: knightPacketPartnerTitleHref.knightNarrative,
    ariaLabel: 'Jump to Knight-aligned narrative section in this packet',
    ring: 'focus-visible:ring-amber-500/55',
  },
} as const;

export function KnightPartnerTitleLink({ variant, children }: KnightPartnerTitleLinkProps) {
  const m = meta[variant];
  return (
    <Link
      href={m.href}
      aria-label={m.ariaLabel}
      className={cn(
        'knight-partner-title-link group relative inline rounded px-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-950',
        m.ring,
        variant === 'dcc' ? 'knight-partner-title-link--dcc' : 'knight-partner-title-link--knight'
      )}
    >
      <span className="knight-partner-title-link__label">{children}</span>
    </Link>
  );
}
