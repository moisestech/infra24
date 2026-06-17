'use client';

import type { ServiceModel } from '@/lib/playwire/types';
import { pw } from './playwireTheme';
import { cn } from '@/lib/utils';

type ServiceModelCardProps = {
  model: ServiceModel;
  maturity: number;
};

const copy = {
  managed: {
    title: 'RAMP Managed Service',
    tagline: 'Revenue optimization on autopilot',
    bullets: [
      'Complete ad ops + yield management',
      '24/7 monitoring and price floor strategy',
      'Flex Suite + direct demand access',
      'Full transparency into what we optimize',
    ],
    fit: 'Best when your team wants maximum revenue with minimal ad-stack maintenance.',
  },
  'self-service': {
    title: 'RAMP Self-Service',
    tagline: 'Enterprise control without enterprise complexity',
    bullets: [
      'Full auction visibility and bidder management',
      'Rules-based price floors + ML autopilot',
      'Real-time analytics and API access',
      'Expert support on demand',
    ],
    fit: 'Best when you have technical capacity and want hands-on revenue control.',
  },
} as const;

export function ServiceModelCard({ model, maturity }: ServiceModelCardProps) {
  const c = copy[model];
  return (
    <div className={cn(pw.card, 'p-5')} data-theme="playwire">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className={pw.accent}>Recommended for this publisher</p>
          <h3 className={cn('mt-1 text-lg font-semibold', pw.navy)}>{c.title}</h3>
          <p className={cn('mt-0.5 text-sm', pw.navyMuted)}>{c.tagline}</p>
        </div>
        <span className={pw.badge}>PARMM {maturity.toFixed(1)} / 5</span>
      </div>
      <ul className="mt-4 space-y-2">
        {c.bullets.map((b) => (
          <li key={b} className={cn('flex gap-2 text-sm', pw.navyMuted)}>
            <span className={pw.accent} aria-hidden>
              •
            </span>
            {b}
          </li>
        ))}
      </ul>
      <p className={cn('mt-4 text-sm font-medium', pw.navy)}>{c.fit}</p>
    </div>
  );
}
