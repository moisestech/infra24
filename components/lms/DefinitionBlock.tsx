import { cn } from '@/lib/utils'

type DefinitionBlockProps = {
  title: string
  body: string
  quote?: string
  id?: string
  className?: string
}

export function DefinitionBlock({ title, body, quote, id, className }: DefinitionBlockProps) {
  return (
    <section id={id} className={cn('rounded-3xl border border-border bg-card/50 p-6 shadow-sm md:p-8', className)}>
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
      <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">{body}</p>
      {quote ? (
        <blockquote className="mt-5 border-l-4 border-primary pl-4 text-base italic leading-relaxed text-foreground/90">
          {quote}
        </blockquote>
      ) : null}
    </section>
  )
}
