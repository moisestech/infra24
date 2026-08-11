import { cn } from '@/lib/utils'
import {
  weSpace,
  weTouch,
  weType,
} from '@/components/workshop-engine/responsive'
import {
  ArrowRight,
  ClipboardList,
  Eye,
  Lightbulb,
  MessagesSquare,
  Mic,
  Sparkles,
} from 'lucide-react'

export function LearningOutcome({ children }: { children: React.ReactNode }) {
  return (
    <p
      className={cn(
        'flex gap-3 rounded-xl border border-cyan-200 bg-cyan-50/60 text-cyan-950',
        weSpace.cardPad,
        weType.body
      )}
    >
      <Sparkles
        aria-hidden
        className="mt-0.5 h-5 w-5 shrink-0 text-cyan-700 md:h-6 md:w-6"
      />
      <span>
        <span className="font-semibold text-slate-950">Learning outcome: </span>
        {children}
      </span>
    </p>
  )
}

export function WatchNotice({ children }: { children: React.ReactNode }) {
  return (
    <section className={weSpace.stackTight}>
      <h2
        className={cn(weType.meta, 'inline-flex items-center gap-2 text-cyan-800')}
      >
        <Eye aria-hidden className="h-3.5 w-3.5 md:h-4 md:w-4" />
        Watch / notice
      </h2>
      <p className={cn(weType.body, 'text-slate-800')}>{children}</p>
    </section>
  )
}

export function KeyIdeas({ ideas }: { ideas: string[] }) {
  return (
    <section className={weSpace.stackTight}>
      <h2
        className={cn(
          weType.meta,
          'inline-flex items-center gap-2 text-indigo-800'
        )}
      >
        <Lightbulb aria-hidden className="h-3.5 w-3.5 md:h-4 md:w-4" />
        Key ideas
      </h2>
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
    </section>
  )
}

export function DiscussionPrompt({ prompt }: { prompt: string }) {
  return (
    <section
      className={cn(
        'rounded-xl border border-violet-200 bg-violet-50 text-violet-950',
        weSpace.cardPad,
        weType.body
      )}
    >
      <p className="inline-flex items-center gap-2 font-semibold">
        <MessagesSquare
          aria-hidden
          className="h-4 w-4 shrink-0 text-violet-700 md:h-5 md:w-5"
        />
        Discussion
      </p>
      <p className="mt-2 text-violet-950/90">{prompt}</p>
    </section>
  )
}

export function PhysicalEvidence({ children }: { children: React.ReactNode }) {
  return (
    <section
      className={cn(
        'rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-950',
        weSpace.cardPad,
        weType.body
      )}
    >
      <p className="inline-flex items-center gap-2 font-semibold">
        <ClipboardList
          aria-hidden
          className="h-4 w-4 shrink-0 text-emerald-800 md:h-5 md:w-5"
        />
        Physical evidence
      </p>
      <p className="mt-1.5 text-emerald-900/90">{children}</p>
    </section>
  )
}

export function FacilitatorCues({ notes }: { notes: string[] }) {
  if (!notes.length) return null
  return (
    <aside
      className={cn(
        'rounded-xl border border-sky-200 bg-sky-50 text-sky-950',
        weSpace.cardPad,
        weType.body
      )}
    >
      <p className="inline-flex items-center gap-2 font-semibold md:text-lg 2xl:text-xl">
        <Mic aria-hidden className="h-4 w-4 text-sky-800 md:h-5 md:w-5" />
        Facilitator cues
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-5 md:mt-3">
        {notes.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
    </aside>
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
