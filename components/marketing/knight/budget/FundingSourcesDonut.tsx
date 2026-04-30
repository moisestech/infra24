'use client';

import { useMemo } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';
import { formatUsd, knightBudgetSummary } from '@/lib/marketing/knight-budget';

const KNIGHT_COLOR = '#1d4ed8';
const MATCH_COLOR = '#14b8a6';

type Slice = { name: string; value: number; key: string };

export function FundingSourcesDonut() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const labelColor = isDark ? '#a3a3a3' : '#525252';

  const data: Slice[] = useMemo(
    () => [
      {
        name: 'Knight Foundation',
        value: knightBudgetSummary.knightFoundationAskUsd,
        key: 'knight',
      },
      {
        name: knightBudgetSummary.counterpartLabel,
        value: knightBudgetSummary.counterpartFundingUsd,
        key: 'match',
      },
    ],
    []
  );

  const total = knightBudgetSummary.totalProjectUsd;

  return (
    <div className="h-[280px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={68}
            outerRadius={100}
            paddingAngle={2}
          >
            {data.map((entry) => (
              <Cell
                key={entry.key}
                fill={entry.key === 'knight' ? KNIGHT_COLOR : MATCH_COLOR}
                stroke={isDark ? '#171717' : '#fff'}
                strokeWidth={1}
              />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const p = payload[0].payload as Slice;
              const pct = ((p.value / total) * 100).toFixed(1);
              return (
                <div
                  className={
                    isDark
                      ? 'rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs shadow-lg'
                      : 'rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs shadow-lg'
                  }
                >
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100">{p.name}</p>
                  <p className="mt-0.5 tabular-nums text-neutral-700 dark:text-neutral-300">
                    {formatUsd(p.value)} ({pct}%)
                  </p>
                </div>
              );
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, color: labelColor }}
            formatter={(value) => <span style={{ color: labelColor }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
