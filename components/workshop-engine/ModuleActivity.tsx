'use client'

import { useMemo, useState } from 'react'
import type { Activity, ReadinessResult } from '@/lib/workshop-engine/types'
import { cn } from '@/lib/utils'
import { weType } from '@/components/workshop-engine/responsive'
import { TEACHING_SECTION_ROLES } from '@/lib/workshop-engine/section-roles'
import {
  CheckCircle2,
  FlaskConical,
  GripVertical,
  ListChecks,
  Sparkles,
} from 'lucide-react'

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

const choiceBtn =
  'rounded-lg border px-3 py-2 text-sm transition md:px-4 md:py-2.5 md:text-base 2xl:px-5 2xl:py-3 2xl:text-lg'

function StepChip({ n }: { n: number }) {
  const section = TEACHING_SECTION_ROLES.activity
  return (
    <span
      className={cn(
        'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold md:h-7 md:w-7 md:text-xs',
        section.iconWrap
      )}
      aria-hidden
    >
      {n}
    </span>
  )
}

function ChoiceActivity({ prompt, items }: { prompt: string; items: string[] }) {
  const [picked, setPicked] = useState<string | null>(null)
  return (
    <ActivityShell title="Try it" Icon={Sparkles} prompt={prompt}>
      <div className="flex flex-wrap gap-2 md:gap-3">
        {items.map((item, index) => (
          <button
            key={item}
            type="button"
            onClick={() => setPicked(item)}
            className={cn(
              choiceBtn,
              'inline-flex items-center gap-2',
              picked === item
                ? 'border-violet-900 bg-violet-900 text-white'
                : 'border-slate-300 bg-white text-slate-900 hover:border-slate-500'
            )}
          >
            <StepChip n={index + 1} />
            {item}
          </button>
        ))}
      </div>
      {picked ? (
        <p className={cn(weType.label, 'text-slate-600')}>Selected: {picked}</p>
      ) : null}
    </ActivityShell>
  )
}

function ChecklistActivity({ prompt, items }: { prompt: string; items: string[] }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const done = items.every((item) => checked[item])
  return (
    <ActivityShell title="Try it" Icon={ListChecks} prompt={prompt}>
      <ul className="space-y-2 md:space-y-3">
        {items.map((item, index) => (
          <li key={item}>
            <label
              className={cn(
                'flex cursor-pointer items-start gap-2.5 text-slate-800 md:gap-3',
                weType.body
              )}
            >
              <StepChip n={index + 1} />
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 accent-violet-700 md:h-5 md:w-5"
                checked={Boolean(checked[item])}
                onChange={(e) =>
                  setChecked((prev) => ({ ...prev, [item]: e.target.checked }))
                }
              />
              <span>{item}</span>
            </label>
          </li>
        ))}
      </ul>
      {done ? (
        <p
          className={cn(
            'inline-flex items-center gap-2 text-emerald-800',
            weType.label
          )}
        >
          <CheckCircle2 aria-hidden className="h-4 w-4 md:h-5 md:w-5" />
          Checklist complete.
        </p>
      ) : null}
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
    <ActivityShell title="Try it" Icon={GripVertical} prompt={prompt}>
      <div className="flex flex-wrap gap-2 md:gap-3">
        {remaining.map((item) => {
          const step = items.indexOf(item) + 1
          return (
            <button
              key={item}
              type="button"
              onClick={() => setOrder((prev) => [...prev, item])}
              className={cn(
                choiceBtn,
                'inline-flex items-center gap-2 border-slate-300 bg-white text-slate-900 hover:border-slate-500'
              )}
            >
              <StepChip n={step} />
              {item}
            </button>
          )
        })}
      </div>
      <ol className={cn('space-y-2 text-slate-800', weType.body)}>
        {order.map((item, index) => (
          <li key={item} className="flex items-start gap-2.5">
            <StepChip n={index + 1} />
            <span>{item}</span>
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="text-xs underline md:text-sm 2xl:text-base"
          onClick={() => setOrder([])}
        >
          Reset
        </button>
        {order.length === items.length ? (
          <p
            className={cn(
              weType.label,
              correct ? 'text-emerald-800' : 'text-amber-900'
            )}
          >
            {correct ? 'Order matches the workflow.' : 'Not quite — reset and try again.'}
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
  const [map, setMap] = useState<Record<string, string>>({})
  return (
    <ActivityShell title="Try it" Icon={FlaskConical} prompt={prompt}>
      <ul className="space-y-3 md:space-y-4">
        {items.map((item, index) => (
          <li key={item} className="space-y-2">
            <p
              className={cn(
                'flex items-start gap-2.5 font-medium text-slate-900',
                weType.body
              )}
            >
              <StepChip n={index + 1} />
              <span>{item}</span>
            </p>
            <div className="flex flex-wrap gap-2 pl-8 md:pl-9">
              {labels.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setMap((prev) => ({ ...prev, [item]: label }))}
                  className={cn(
                    'rounded-lg border px-2.5 py-1.5 text-xs md:px-3 md:py-2 md:text-sm 2xl:text-base',
                    map[item] === label
                      ? 'border-violet-900 bg-violet-900 text-white'
                      : 'border-slate-300 bg-white'
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
  const selectedStyle: Record<ReadinessResult, string> = {
    ready: 'border-emerald-800 bg-emerald-800 text-white',
    repair: 'border-amber-800 bg-amber-800 text-white',
    consultation: 'border-rose-800 bg-rose-800 text-white',
  }

  return (
    <ActivityShell title="Exit check" Icon={CheckCircle2} prompt={prompt}>
      <div className="grid gap-2 sm:grid-cols-3 md:gap-3">
        {items.map((item, index) => {
          const key = map[item]
          return (
            <button
              key={item}
              type="button"
              onClick={() => setResult(key)}
              className={cn(
                'rounded-lg border px-3 py-3 text-left text-sm md:px-4 md:py-3.5 md:text-base 2xl:text-lg',
                result === key
                  ? selectedStyle[key]
                  : 'border-slate-300 bg-white'
              )}
            >
              <span className="mb-2 inline-flex">
                <StepChip n={index + 1} />
              </span>
              <span className="mt-1 block">{item}</span>
            </button>
          )
        })}
      </div>
      {result ? (
        <p className={cn(weType.label, 'text-slate-700')}>
          Saved locally as <span className="font-medium">{result}</span>. This is a
          preparation summary, not certification.
        </p>
      ) : null}
    </ActivityShell>
  )
}

function ActivityShell({
  title,
  prompt,
  children,
  Icon = Sparkles,
}: {
  title: string
  prompt: string
  children: React.ReactNode
  Icon?: typeof Sparkles
}) {
  const section = TEACHING_SECTION_ROLES.activity
  return (
    <div
      className={cn(
        'space-y-3 rounded-xl border md:space-y-4 md:p-5 2xl:p-6',
        section.border,
        section.surface,
        'p-4'
      )}
    >
      <p
        className={cn(
          'inline-flex items-center gap-2 text-sm font-semibold md:text-base 2xl:text-lg',
          section.heading
        )}
      >
        <span
          className={cn(
            'inline-flex h-6 w-6 items-center justify-center rounded-full md:h-7 md:w-7',
            section.iconWrap
          )}
        >
          <Icon aria-hidden className="h-3.5 w-3.5 md:h-4 md:w-4" />
        </span>
        {title}
      </p>
      <p className="text-sm leading-relaxed text-slate-700 md:text-base 2xl:text-lg">
        {prompt}
      </p>
      {children}
    </div>
  )
}
