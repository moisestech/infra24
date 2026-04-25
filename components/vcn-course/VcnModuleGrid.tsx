import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { VcnModuleCard } from '@/lib/course/vibe-net-art/modules'

type Props = {
  modules: VcnModuleCard[]
}

export function VcnModuleGrid({ modules }: Props) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">Modules</h2>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Four arcs from orientation to publishing and capstone.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {modules.map((m) => (
          <Card
            key={m.key}
            className={`overflow-hidden border-2 border-neutral-200 dark:border-neutral-800 ${m.accentClass}`}
          >
            <CardHeader className="pb-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                {m.chapterRange}
              </p>
              <CardTitle className="text-xl">{m.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{m.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
