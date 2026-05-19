import type { ScenarioQuestion } from '@/lib/ask-the-place/types'
import { cn } from '@/lib/utils'

type SuggestedQuestionsProps = {
  questions: ScenarioQuestion[]
  activeId: string | null
  onSelect: (id: string) => void
}

export function SuggestedQuestions({ questions, activeId, onSelect }: SuggestedQuestionsProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0B1118] p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Suggested questions</p>
      <div className="mt-3 flex flex-col gap-2">
        {questions.map((q) => (
          <button
            key={q.id}
            type="button"
            onClick={() => onSelect(q.id)}
            className={cn(
              'rounded-xl border px-3 py-2.5 text-left text-sm transition-colors',
              activeId === q.id
                ? 'border-teal-400/40 bg-teal-500/10 text-teal-50'
                : 'border-white/[0.06] bg-white/[0.02] text-zinc-300 hover:border-white/15 hover:bg-white/[0.04]'
            )}
          >
            <span className="block text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
              {q.chip}
            </span>
            <span className="mt-1 block leading-snug">{q.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
