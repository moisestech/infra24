import { cn } from '@/lib/utils'
import {
  weSpace,
  weTouch,
  weType,
} from '@/components/workshop-engine/responsive'
import {
  TEACHING_SECTION_ROLES,
  type TeachingSectionRole,
} from '@/lib/workshop-engine/section-roles'
import { ArrowRight } from 'lucide-react'

export function SectionLabel({
  role,
  label,
}: {
  role: TeachingSectionRole
  label?: string
}) {
  const section = TEACHING_SECTION_ROLES[role]
  const Icon = section.Icon
  return (
    <p
      className={cn(
        weType.meta,
        'inline-flex items-center gap-2',
        section.heading
      )}
    >
      <span
        className={cn(
          'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full md:h-7 md:w-7',
          section.iconWrap
        )}
      >
        <Icon aria-hidden className="h-3.5 w-3.5 md:h-4 md:w-4" />
      </span>
      {label ?? section.label}
    </p>
  )
}

export function TeachingPanel({
  role,
  children,
  className,
  label,
}: {
  role: TeachingSectionRole
  children: React.ReactNode
  className?: string
  label?: string
}) {
  const section = TEACHING_SECTION_ROLES[role]
  return (
    <section
      className={cn(
        'rounded-xl border',
        section.border,
        section.surface,
        weSpace.cardPad,
        className
      )}
    >
      <SectionLabel role={role} label={label} />
      <div className="mt-2.5 md:mt-3">{children}</div>
    </section>
  )
}

export function LearningOutcome({ children }: { children: React.ReactNode }) {
  return (
    <TeachingPanel role="outcome">
      <p className={cn(weType.body, 'text-cyan-950')}>{children}</p>
    </TeachingPanel>
  )
}

export function WatchNotice({ children }: { children: React.ReactNode }) {
  return (
    <TeachingPanel role="watch">
      <p className={cn(weType.body, 'text-slate-800')}>{children}</p>
    </TeachingPanel>
  )
}

export function KeyIdeas({ ideas }: { ideas: string[] }) {
  return (
    <TeachingPanel role="ideas">
      <ul
        className={cn(
          weType.body,
          'list-disc space-y-1.5 pl-5 text-slate-800 md:space-y-2'
        )}
      >
        {ideas.map((idea) => (
          <li key={idea}>{idea}</li>
        ))}
      </ul>
    </TeachingPanel>
  )
}

export function TipCallout({ tips }: { tips: string[] }) {
  if (!tips.length) return null
  return (
    <TeachingPanel role="tip" label={tips.length > 1 ? 'Tips' : 'Tip'}>
      <ul
        className={cn(
          weType.body,
          'list-disc space-y-1.5 pl-5 text-amber-950/90 md:space-y-2'
        )}
      >
        {tips.map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ul>
    </TeachingPanel>
  )
}

export function KeyVocab({
  terms,
  glossaryHref = '/workshop/resin-printing/resources#glossary',
}: {
  terms: { term: string; definition: string }[]
  glossaryHref?: string
}) {
  if (!terms.length) return null
  return (
    <TeachingPanel role="vocab">
      <dl className="space-y-3 md:space-y-3.5">
        {terms.map((item) => (
          <div key={item.term}>
            <dt className={cn(weType.label, 'font-semibold text-rose-950')}>
              {item.term}
            </dt>
            <dd className={cn(weType.body, 'mt-0.5 text-slate-800')}>
              {item.definition}
            </dd>
          </div>
        ))}
      </dl>
      <p className={cn(weType.meta, 'mt-3')}>
        <a className="underline underline-offset-2" href={glossaryHref}>
          See glossary
        </a>
      </p>
    </TeachingPanel>
  )
}

export function DiscussionPrompt({ prompt }: { prompt: string }) {
  return (
    <TeachingPanel role="discussion">
      <p className={cn(weType.body, 'text-fuchsia-950/90')}>{prompt}</p>
    </TeachingPanel>
  )
}

export function PhysicalEvidence({ children }: { children: React.ReactNode }) {
  return (
    <TeachingPanel role="evidence">
      <p className={cn(weType.body, 'text-emerald-900/90')}>{children}</p>
    </TeachingPanel>
  )
}

export function FacilitatorCues({ notes }: { notes: string[] }) {
  if (!notes.length) return null
  return (
    <TeachingPanel role="facilitator">
      <ul className={cn(weType.body, 'list-disc space-y-1 pl-5 text-slate-800')}>
        {notes.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
    </TeachingPanel>
  )
}

export function NextStepNav({
  prev,
  next,
}: {
  prev?: { href: string; label: string } | null
  next?: { href: string; label: string } | null
}) {
  return (
    <nav
      className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4"
      aria-label="Module navigation"
    >
      {prev ? (
        <a className={cn(weTouch.button, 'underline')} href={prev.href}>
          ← {prev.label}
        </a>
      ) : (
        <span />
      )}
      {next ? (
        <a className={cn(weTouch.button, 'underline')} href={next.href}>
          {next.label}
          <ArrowRight aria-hidden className="h-4 w-4" />
        </a>
      ) : null}
    </nav>
  )
}
