'use client'

import type { DccGraphMode } from '@/lib/marketing/dcc-crm-graph-types'
import {
  collectFilterOptions,
  EMPTY_GRAPH_FILTERS,
  type GraphClientFilters,
} from '@/lib/marketing/graph-client-filters'
import type { DccGraphNodeData } from '@/lib/marketing/dcc-crm-graph-types'
import { cn } from '@/lib/utils'

const MODES: { id: DccGraphMode; label: string }[] = [
  { id: 'active', label: 'Active Network' },
  { id: 'research', label: 'Research View' },
  { id: 'combined', label: 'Combined' },
]

type Props = {
  nodes: DccGraphNodeData[]
  mode: DccGraphMode
  filters: GraphClientFilters
  onModeChange?: (mode: DccGraphMode) => void
  onFiltersChange: (filters: GraphClientFilters) => void
  showModeToggle?: boolean
  admin?: boolean
  className?: string
}

function SelectFilter({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (v: string) => void
}) {
  if (!options.length) return null
  return (
    <label className="flex flex-col gap-0.5 text-xs">
      <span className="text-neutral-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs dark:border-neutral-700 dark:bg-neutral-900"
      >
        <option value="">All</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  )
}

export function GraphFilterBar({
  nodes,
  mode,
  filters,
  onModeChange,
  onFiltersChange,
  showModeToggle = true,
  admin = false,
  className,
}: Props) {
  const options = collectFilterOptions(nodes)

  function patch(partial: Partial<GraphClientFilters>) {
    onFiltersChange({ ...filters, ...partial })
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <input
          type="search"
          placeholder="Search name, tags, summary…"
          value={filters.search}
          onChange={(e) => patch({ search: e.target.value })}
          className="w-full max-w-md rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        />
        <div className="flex flex-wrap gap-2">
          {showModeToggle && onModeChange
            ? MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onModeChange(m.id)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-xs font-medium transition',
                    mode === m.id
                      ? 'border-[var(--cdc-teal)] bg-[var(--cdc-teal)]/15 text-neutral-900 dark:text-neutral-100'
                      : 'border-neutral-200 bg-white text-neutral-600 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-300'
                  )}
                >
                  {m.label}
                </button>
              ))
            : null}
          <button
            type="button"
            onClick={() => patch({ filterMiami: !filters.filterMiami })}
            className={cn(
              'rounded-full border px-3 py-1.5 text-xs font-medium transition',
              filters.filterMiami
                ? 'border-[var(--cdc-teal)] bg-[var(--cdc-teal)]/15 text-neutral-900 dark:text-neutral-100'
                : 'border-neutral-200 bg-white text-neutral-600 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-300'
            )}
          >
            Miami
          </button>
          <button
            type="button"
            onClick={() => onFiltersChange(EMPTY_GRAPH_FILTERS)}
            className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-500 dark:border-neutral-600"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        <SelectFilter label="Demo readiness" value={filters.demoReadiness} options={options.demoReadiness} onChange={(v) => patch({ demoReadiness: v })} />
        <SelectFilter label="Constituent label" value={filters.constituentLabel} options={options.constituentLabel} onChange={(v) => patch({ constituentLabel: v })} />
        <SelectFilter label="Miami connection" value={filters.miamiConnectionType} options={options.miamiConnectionType} onChange={(v) => patch({ miamiConnectionType: v })} />
        <SelectFilter label="Node priority" value={filters.nodePriority} options={options.nodePriority} onChange={(v) => patch({ nodePriority: v })} />
        <SelectFilter label="Review status" value={filters.reviewStatus} options={options.reviewStatus} onChange={(v) => patch({ reviewStatus: v })} />
        <SelectFilter label="Practice tag" value={filters.practiceTag} options={options.practiceTags} onChange={(v) => patch({ practiceTag: v })} />
        {admin ? (
          <SelectFilter label="Signup status" value={filters.dccSignupStatus} options={options.dccSignupStatus} onChange={(v) => patch({ dccSignupStatus: v })} />
        ) : null}
      </div>
    </div>
  )
}
