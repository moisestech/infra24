import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type EditorialFrameworkProps = {
  title: string
  intro?: string
  status?: string
  kind?: 'proposal' | 'methodology'
  children: ReactNode
  className?: string
}

export function EditorialFramework({
  title,
  intro,
  status,
  kind = 'proposal',
  children,
  className,
}: EditorialFrameworkProps) {
  const kicker = kind === 'methodology' ? 'DCC methodology' : 'DCC proposal'

  return (
    <section
      data-editorial-framework={kind}
      className={cn('editorial-framework', className)}
    >
      <p className="editorial-framework__kicker">{kicker}</p>
      <h3 className="editorial-framework__title">{title}</h3>
      {intro ? <p className="editorial-framework__intro">{intro}</p> : null}
      {status ? <p className="editorial-framework__status">{status}</p> : null}
      <div className="editorial-framework__items">{children}</div>
    </section>
  )
}

type EditorialFrameworkItemProps = {
  title: string
  children: ReactNode
  disclosure?: boolean
}

export function EditorialFrameworkItem({
  title,
  children,
  disclosure = false,
}: EditorialFrameworkItemProps) {
  if (disclosure) {
    return (
      <details className="editorial-framework__item editorial-framework__item--disclosure">
        <summary className="editorial-framework__item-title">{title}</summary>
        <div className="editorial-framework__item-body">{children}</div>
      </details>
    )
  }

  return (
    <div className="editorial-framework__item">
      <h4 className="editorial-framework__item-title">{title}</h4>
      <div className="editorial-framework__item-body">{children}</div>
    </div>
  )
}
