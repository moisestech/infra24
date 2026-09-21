import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type EditorialDiagramProps = {
  caption?: string
  legend?: string
  /** Accessible plain-language equivalent of the diagram. */
  equivalent?: string
  wide?: boolean
  children: ReactNode
  className?: string
}

export function EditorialDiagram({
  caption,
  legend,
  equivalent,
  wide = true,
  children,
  className,
}: EditorialDiagramProps) {
  return (
    <figure
      data-editorial-diagram=""
      data-editorial-wide={wide ? '' : undefined}
      className={cn('editorial-diagram', wide && 'editorial-diagram--wide', className)}
    >
      <div className="editorial-diagram__canvas">{children}</div>
      {equivalent ? (
        <p className="editorial-diagram__equivalent">
          <span className="editorial-diagram__kicker">Text equivalent</span>
          {equivalent}
        </p>
      ) : null}
      {legend ? <p className="editorial-diagram__legend">{legend}</p> : null}
      {caption ? <figcaption className="editorial-diagram__caption">{caption}</figcaption> : null}
    </figure>
  )
}
