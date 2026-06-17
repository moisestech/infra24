'use client';

import { useMemo, useState } from 'react';
import type { MetricSnapshot } from '@/lib/playwire/types';
import { adFormats } from '@/lib/playwire/adFormats';
import { adjustMetricsForFormats } from '@/lib/playwire/mockMetrics';
import { pw } from './playwireTheme';
import { cn } from '@/lib/utils';

type RampMetricsDashboardProps = {
  baseMetrics: MetricSnapshot;
  personaName: string;
};

function formatNum(n: number, decimals = 2): string {
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function RampMetricsDashboard({ baseMetrics, personaName }: RampMetricsDashboardProps) {
  const [device, setDevice] = useState<'all' | 'mobile' | 'desktop'>('all');
  const [formats, setFormats] = useState({
    display: true,
    video: false,
    flex: false,
    native: true,
  });

  const metrics = useMemo(() => adjustMetricsForFormats(baseMetrics, formats), [baseMetrics, formats]);

  const deviceMultiplier =
    device === 'mobile' ? metrics.byDevice.mobile / 100 : device === 'desktop' ? metrics.byDevice.desktop / 100 : 1;

  const displayRpm = metrics.rpm * deviceMultiplier;

  const toggleFormat = (key: keyof typeof formats) => {
    setFormats((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (!next.display && !next.video && !next.flex && !next.native) {
        return prev;
      }
      return next;
    });
  };

  return (
    <div data-theme="playwire">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className={cn('text-sm font-medium', pw.navy)}>
          Revenue snapshot — <span className={pw.accent}>{personaName}</span>
        </p>
        <span className={pw.badge}>Real-time (mock)</span>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(['all', 'mobile', 'desktop'] as const).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDevice(d)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition',
              device === d ? pw.accentBg : 'bg-[#e8edf5] text-[#4a5f7f] dark:bg-[#1e2d4a] dark:text-[#94a3b8]',
            )}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <MetricCard label="RPM" value={`$${formatNum(displayRpm)}`} />
        <MetricCard label="CPM" value={`$${formatNum(metrics.cpm)}`} />
        <MetricCard label="Fill rate" value={`${formatNum(metrics.fillRate, 1)}%`} />
        <MetricCard label="Viewability" value={`${formatNum(metrics.viewability, 1)}%`} />
        <MetricCard label="Ad requests" value={formatCompact(metrics.adRequests)} className="col-span-2 sm:col-span-1" />
      </div>

      <div className={cn(pw.card, 'mt-4 p-4')}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className={cn('text-sm font-semibold', pw.navy)}>Format mixer</p>
          <p className={cn('text-xs', pw.navyMuted)}>Toggle formats — illustrative RPM impact</p>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {adFormats.map((f) => {
            const key =
              f.type === 'display'
                ? 'display'
                : f.type === 'video'
                  ? 'video'
                  : f.type === 'flex'
                    ? 'flex'
                    : 'native';
            const active = formats[key];
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => toggleFormat(key)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition',
                  active
                    ? 'border-[#e85d4c] bg-[#e85d4c]/10 text-[#c94a3a] dark:text-[#ff9a8f]'
                    : 'border-[#1a2b4a]/15 text-[#4a5f7f] dark:border-[#2d4a7c]/40 dark:text-[#94a3b8]',
                )}
              >
                {f.name}
              </button>
            );
          })}
        </div>
        <p className={cn('mt-3 text-sm', pw.accent)}>
          +{metrics.revenueLiftPct}% revenue lift vs. baseline (QPT-optimized)
        </p>
        <p className={cn('mt-1 text-xs', pw.navyMuted)}>
          {formatCompact(metrics.priceFloorRules)} active price-floor rules
        </p>
      </div>

      <div className={cn(pw.card, 'mt-4 overflow-hidden')}>
        <p className={cn('border-b border-[#1a2b4a]/8 px-4 py-2 text-xs font-semibold uppercase tracking-wide dark:border-[#2d4a7c]/25', pw.navyMuted)}>
          Bidder breakdown
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[280px] text-left text-sm">
            <thead>
              <tr className={cn('text-xs uppercase', pw.navyMuted)}>
                <th className="px-4 py-2 font-medium">Partner</th>
                <th className="px-4 py-2 font-medium">Share</th>
                <th className="px-4 py-2 font-medium">CPM</th>
              </tr>
            </thead>
            <tbody>
              {metrics.bidders.map((b) => (
                <tr key={b.name} className="border-t border-[#1a2b4a]/5 dark:border-[#2d4a7c]/20">
                  <td className={cn('px-4 py-2 font-medium', pw.navy)}>{b.name}</td>
                  <td className={cn('px-4 py-2 tabular-nums', pw.navyMuted)}>{b.share}%</td>
                  <td className={cn('px-4 py-2 tabular-nums', pw.navy)}>${formatNum(b.cpm)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={cn(pw.card, 'p-3', className)}>
      <p className={pw.metricLabel}>{label}</p>
      <p className={cn(pw.metricValue, 'mt-1')}>{value}</p>
    </div>
  );
}
