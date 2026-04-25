import type { LucideIcon } from 'lucide-react'
import { FileCode, Image as ImageIcon, Radio } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ChapterLessonSkin, LocalVsLiveState } from '@/lib/course/types'
import { cn } from '@/lib/utils'

const ICONS: Record<LocalVsLiveState['label'], LucideIcon> = {
  local: FileCode,
  documented: ImageIcon,
  live: Radio,
}

const accentMap: Record<LocalVsLiveState['label'], string> = {
  local: 'border-neutral-200/90 bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-900/80',
  documented: 'border-violet-200/90 bg-violet-50/90 dark:border-violet-500/35 dark:bg-violet-950/40',
  live: 'border-[#00A67E]/35 bg-[#C6F7E9]/50 dark:border-[#7CE3C6]/40 dark:bg-[#071A16]/90',
}

function urlChip(label: LocalVsLiveState['label']) {
  if (label === 'local') return 'file:///index.html'
  if (label === 'documented') return 'screenshot / recording'
  return 'https://your-site.example'
}

export type LocalVsLivePreviewProps = {
  title: string
  description: string
  states: LocalVsLiveState[]
  sectionId?: string
  presentation?: ChapterLessonSkin
}

export function LocalVsLivePreview({
  title,
  description,
  states,
  sectionId = 'local-vs-live-preview',
  presentation,
}: LocalVsLivePreviewProps) {
  const publishing = presentation === 'publishing'

  if (publishing) {
    return (
      <section
        id={sectionId}
        className="scroll-mt-28 rounded-[2rem] border border-[#1F8A70]/20 bg-gradient-to-br from-[#F7FFFC] via-white to-white p-6 shadow-sm md:p-8 dark:border-[#7CE3C6]/20 dark:from-[#071A16] dark:via-neutral-950 dark:to-neutral-950"
      >
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#1F8A70] dark:text-[#7CE3C6]">
          Chapter-specific demo
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#071A16] dark:text-[#F7FFFC] md:text-3xl">{title}</h2>
        <p className="mt-4 max-w-3xl leading-7 text-neutral-700 dark:text-neutral-300">{description}</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {states.map((state) => (
            <article
              key={state.label}
              className={cn('rounded-3xl border p-5 shadow-sm', accentMap[state.label])}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-[#00A67E]/25 bg-white/90 px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide text-[#1F8A70] dark:border-[#7CE3C6]/40 dark:bg-[#071A16]/60 dark:text-[#C6F7E9]">
                  {state.label}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400">status</span>
              </div>
              <div className="mt-4 rounded-2xl border border-neutral-200/80 bg-white/90 p-4 shadow-sm dark:border-neutral-600 dark:bg-neutral-950/70">
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-neutral-300 dark:bg-neutral-500" aria-hidden />
                  <span className="h-2 w-2 rounded-full bg-neutral-200 dark:bg-neutral-600" aria-hidden />
                  <span className="h-2 w-2 rounded-full bg-neutral-100 dark:bg-neutral-700" aria-hidden />
                </div>
                <div className="rounded-xl border border-neutral-200 bg-[#F7FFFC] px-3 py-2 font-mono text-[11px] text-neutral-600 dark:border-neutral-600 dark:bg-[#071A16]/80 dark:text-[#C6F7E9]">
                  {urlChip(state.label)}
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-neutral-700 dark:text-neutral-300">{state.body}</p>
            </article>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section
      id={sectionId}
      className="scroll-mt-28 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950"
    >
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
        Publishing & liveness
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-neutral-900 dark:text-neutral-50">{title}</h2>
      <p className="mt-3 max-w-3xl leading-7 text-neutral-700 dark:text-neutral-300">{description}</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {states.map((s) => {
          const Icon = ICONS[s.label]
          return (
            <Card key={s.label} className="border-neutral-200 dark:border-neutral-800">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-[#00A67E]" aria-hidden />
                  <CardTitle className="text-base capitalize">{s.label}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{s.body}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
