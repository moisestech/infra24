import { cn } from '@/lib/utils'

type ChecklistCardProps = {
  title: string
  items: string[]
  className?: string
}

export function ChecklistCard({ title, items, className }: ChecklistCardProps) {
  return (
    <article className={cn('rounded-2xl border border-border bg-background/60 p-5 shadow-sm', className)}>
      <h3 className="text-xl font-medium text-foreground">{title}</h3>
      <ul className="mt-4 space-y-3 text-sm text-foreground/90">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <input type="checkbox" className="mt-1 h-4 w-4 shrink-0 rounded border-border" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}
