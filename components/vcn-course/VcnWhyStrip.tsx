import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Monitor, Sparkles } from 'lucide-react'

const cards = [
  {
    title: 'Art history through making',
    body: 'Each module pairs reference, context, and a small browser artifact so ideas stay grounded in practice.',
    icon: BookOpen,
  },
  {
    title: 'Browser literacy through art',
    body: 'HTML, CSS, links, motion, and hosting are treated as expressive materials—not only production skills.',
    icon: Monitor,
  },
  {
    title: 'Vibecoding as method',
    body: 'Short loops, clear constraints, and documentation so sketches can grow into portfolio-ready work.',
    icon: Sparkles,
  },
]

export function VcnWhyStrip() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">Why this workshop</h2>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Net art is not only historical — browsers, platforms, and networks still shape how culture moves.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map(({ title, body, icon: Icon }) => (
          <Card key={title} className="border-neutral-200 dark:border-neutral-800">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
