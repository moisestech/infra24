'use client'

import { useMemo, useState } from 'react'
import type { Activity, ReadinessResult } from '@/lib/workshop-engine/types'
import { cn } from '@/lib/utils'

export function ModuleActivity({ activity }: { activity: Activity }) {
  if (activity.kind === 'checklist') {
    return <ChecklistActivity prompt={activity.prompt} items={activity.items} />
  }
  if (activity.kind === 'order') {
    return <OrderActivity prompt={activity.prompt} items={activity.items} />
  }
  if (activity.kind === 'classify') {
    return (
      <ClassifyActivity
        prompt={activity.prompt}
        items={activity.items}
        labels={activity.labels ?? []}
      />
    )
  }
  if (activity.kind === 'readiness') {
    return <ReadinessActivity prompt={activity.prompt} items={activity.items} />
  }
  return <ChoiceActivity prompt={activity.prompt} items={activity.items} />
}

function ChoiceActivity({ prompt, items }: { prompt: string; items: string[] }) {
  const [picked, setPicked] = useState<string | null>(null)
  return (
    <ActivityShell title="Try it" prompt={prompt}>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setPicked(item)}
            className={cn(
              'rounded border px-3 py-2 text-sm',
              picked === item ? 'border-neutral-950 bg-neutral-950 text-white' : 'border-neutral-300 bg-white'
            )}
          >
            {item}
          </button>
        ))}
      </div>
      {picked ? <p className="text-sm text-neutral-600">Selected: {picked}</p> : null}
    </ActivityShell>
  )
}

function ChecklistActivity({ prompt, items }: { prompt: string; items: string[] }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const done = items.every((item) => checked[item])
  return (
    <ActivityShell title="Try it" prompt={prompt}>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item}>
            <label className="flex cursor-pointer items-start gap-2 text-sm text-neutral-800">
              <input
                type="checkbox"
                className="mt-1"
                checked={Boolean(checked[item])}
                onChange={(e) => setChecked((prev) => ({ ...prev, [item]: e.target.checked }))}
              />
              <span>{item}</span>
            </label>
          </li>
        ))}
      </ul>
      {done ? <p className="text-sm text-emerald-800">Checklist complete.</p> : null}
    </ActivityShell>
  )
}

function OrderActivity({ prompt, items }: { prompt: string; items: string[] }) {
  const [order, setOrder] = useState<string[]>([])
  const remaining = items.filter((item) => !order.includes(item))
  const correct = useMemo(
    () => order.length === items.length && order.every((item, i) => item === items[i]),
    [order, items]
  )

  return (
    <ActivityShell title="Try it" prompt={prompt}>
      <div className="flex flex-wrap gap-2">
        {remaining.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setOrder((prev) => [...prev, item])}
            className="rounded border border-neutral-300 bg-white px-3 py-2 text-sm"
          >
            {item}
          </button>
        ))}
      </div>
      <ol className="list-decimal space-y-1 pl-5 text-sm text-neutral-800">
        {order.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
      <div className="flex gap-2">
        <button
          type="button"
          className="text-xs underline"
          onClick={() => setOrder([])}
        >
          Reset
        </button>
        {order.length === items.length ? (
          <p className={cn('text-sm', correct ? 'text-emerald-800' : 'text-amber-900')}>
            {correct ? 'Correct order.' : 'Not quite — reset and try again.'}
          </p>
        ) : null}
      </div>
    </ActivityShell>
  )
}

function ClassifyActivity({
  prompt,
  items,
  labels,
}: {
  prompt: string
  items: string[]
  labels: string[]
}) {
  const [picks, setPicks] = useState<Record<string, string>>({})
  return (
    <ActivityShell title="Try it" prompt={prompt}>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="rounded border border-neutral-200 p-3">
            <p className="text-sm font-medium text-neutral-900">{item}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {labels.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setPicks((prev) => ({ ...prev, [item]: label }))}
                  className={cn(
                    'rounded border px-2 py-1 text-xs',
                    picks[item] === label
                      ? 'border-neutral-950 bg-neutral-950 text-white'
                      : 'border-neutral-300'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </ActivityShell>
  )
}

function ReadinessActivity({ prompt, items }: { prompt: string; items: string[] }) {
  const [result, setResult] = useState<ReadinessResult | null>(null)
  const map: Record<string, ReadinessResult> = {
    [items[0] ?? '']: 'ready',
    [items[1] ?? '']: 'repair',
    [items[2] ?? '']: 'consultation',
  }

  return (
    <ActivityShell title="Exit check" prompt={prompt}>
      <div className="grid gap-2 sm:grid-cols-3">
        {items.map((item) => {
          const key = map[item]
          return (
            <button
              key={item}
              type="button"
              onClick={() => setResult(key)}
              className={cn(
                'rounded-md border px-3 py-3 text-left text-sm',
                result === key
                  ? 'border-neutral-950 bg-neutral-950 text-white'
                  : 'border-neutral-300 bg-white'
              )}
            >
              {item}
            </button>
          )
        })}
      </div>
      {result ? (
        <p className="text-sm text-neutral-700">
          Saved locally as <span className="font-medium">{result}</span>. This is a preparation
          summary, not certification.
        </p>
      ) : null}
    </ActivityShell>
  )
}

function ActivityShell({
  title,
  prompt,
  children,
}: {
  title: string
  prompt: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-3 rounded-md border border-neutral-200 bg-white p-4">
      <p className="font-medium text-neutral-950">{title}</p>
      <p className="text-sm text-neutral-700">{prompt}</p>
      {children}
    </div>
  )
}
