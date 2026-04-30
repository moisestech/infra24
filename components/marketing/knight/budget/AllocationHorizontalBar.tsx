'use client';

import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';
import { formatUsd, knightBudgetUseOfFunds, type KnightBudgetUseOfFundsCategory } from '@/lib/marketing/knight-budget';

type Row = {
  id: string;
  shortLabel: string;
  amount: number;
  pct: number;
  fill: string;
  fullName: string;
  description: string;
};

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1)}…`;
}

export function AllocationHorizontalBar() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const axisColor = isDark ? '#737373' : '#a3a3a3';
  const gridColor = isDark ? '#404040' : '#e5e5e5';

  const rows: Row[] = useMemo(() => {
    const sorted = [...knightBudgetUseOfFunds].sort((a, b) => b.amountUsd - a.amountUsd);
    return sorted.map((c) => ({
      id: c.id,
      shortLabel: truncate(c.name, 36),
      amount: c.amountUsd,
      pct: c.percentOfTotal,
      fill: c.color,
      fullName: c.name,
      description: c.description,
    }));
  }, []);

  const total = rows.reduce((a, r) => a + r.amount, 0);

  return (
    <div className="space-y-6">
      <div className="h-[320px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={rows}
            margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 'dataMax']}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              stroke={axisColor}
              tick={{ fill: axisColor, fontSize: 11 }}
            />
            <YAxis
              type="category"
              dataKey="shortLabel"
              width={200}
              tick={{ fill: axisColor, fontSize: 11 }}
              stroke={axisColor}
            />
            <Tooltip
              cursor={{ fill: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const r = payload[0].payload as Row;
                return (
                  <div
                    className={
                      isDark
                        ? 'max-w-xs rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs shadow-lg'
                        : 'max-w-xs rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs shadow-lg'
                    }
                  >
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100">{r.fullName}</p>
                    <p className="mt-1 tabular-nums text-neutral-800 dark:text-neutral-200">
                      {formatUsd(r.amount)} ({r.pct}% of total)
                    </p>
                    <p className="mt-2 leading-relaxed text-neutral-600 dark:text-neutral-400">{r.description}</p>
                  </div>
                );
              }}
            />
            <Bar dataKey="amount" radius={[0, 6, 6, 0]} maxBarSize={28}>
              {rows.map((r) => (
                <Cell key={r.id} fill={r.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          Category detail
        </p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Open a category for supports and outcome. Pilot cost and Knight-attributed portions appear in the tables below (
          {formatUsd(total)} total).
        </p>
        {knightBudgetUseOfFunds.map((cat) => (
          <CategoryDetails key={cat.id} cat={cat} />
        ))}
      </div>
    </div>
  );
}

function CategoryDetails({ cat }: { cat: KnightBudgetUseOfFundsCategory }) {
  return (
    <details className="group rounded-xl border border-neutral-200/90 bg-white open:shadow-sm dark:border-neutral-700 dark:bg-neutral-950/80">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-neutral-900 marker:hidden dark:text-neutral-100 [&::-webkit-details-marker]:hidden">
        <span className="flex min-w-0 items-center gap-2">
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: cat.color }}
            aria-hidden
          />
          <span className="truncate">{cat.name}</span>
        </span>
        <span className="shrink-0 tabular-nums text-neutral-600 dark:text-neutral-400">{formatUsd(cat.amountUsd)}</span>
      </summary>
      <div className="border-t border-neutral-100 px-4 pb-4 pt-2 text-sm dark:border-neutral-800">
        <p className="text-neutral-600 dark:text-neutral-400">{cat.description}</p>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              Supports
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-neutral-700 dark:text-neutral-300">
              {cat.subitems.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              Outcome
            </p>
            <div className="mt-2 space-y-2 text-neutral-700 dark:text-neutral-300">
              {cat.outcomes.map((s) => (
                <p key={s} className="leading-relaxed">
                  {s}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </details>
  );
}
