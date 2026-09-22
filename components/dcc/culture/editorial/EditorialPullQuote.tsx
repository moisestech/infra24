import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type EditorialPullQuoteProps = {
  children: ReactNode
  attribution?: string
  className?: string
}

export function EditorialPullQuote({
  children,
  attribution,
  className,
}: EditorialPullQuoteProps) {
  return (
    <blockquote data-editorial-pullquote className={cn('editorial-pullquote', className)}>
      <div className="editorial-pullquote__body">{children}</div>
      {attribution ? (
        <footer className="editorial-pullquote__attr">{attribution}</footer>
      ) : null}
    </blockquote>
  )
}
