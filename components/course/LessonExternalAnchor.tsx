import { ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = Omit<React.ComponentPropsWithoutRef<'a'>, 'target' | 'rel'> & {
  children: React.ReactNode
}

/** External URLs from lesson chrome — icon + new tab + screen-reader hint. */
export function LessonExternalAnchor({ className, children, title, ...rest }: Props) {
  return (
    <a
      {...rest}
      target="_blank"
      rel="noopener noreferrer"
      title={title ?? 'Opens in a new tab — external site'}
      className={cn('inline-flex max-w-full items-center gap-1.5 align-middle', className)}
    >
      <span className="min-w-0 shrink [overflow-wrap:anywhere]">{children}</span>
      <ExternalLink className="size-3.5 shrink-0 opacity-70" aria-hidden />
      <span className="sr-only"> Opens in a new tab.</span>
    </a>
  )
}
