import type { ReactNode } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { marketingGradientSurfaceClass } from '@/lib/marketing/marketing-gradients'

export type EditorialFigureProps = {
  src?: string
  alt?: string
  caption?: string
  credit?: string
  wide?: boolean
  children?: ReactNode
  className?: string
}

export function EditorialFigure({
  src,
  alt,
  caption,
  credit,
  wide = false,
  children,
  className,
}: EditorialFigureProps) {
  const isSvg = Boolean(src?.toLowerCase().endsWith('.svg'))
  const hasCaption = Boolean(caption || credit)

  return (
    <figure
      data-editorial-figure=""
      data-editorial-wide={wide ? '' : undefined}
      className={cn('editorial-figure', wide && 'editorial-figure--wide', className)}
    >
      {src ? (
        <div className="editorial-figure__media">
          {isSvg ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={alt ?? caption ?? ''} />
          ) : (
            <Image
              src={src}
              alt={alt ?? caption ?? ''}
              width={1600}
              height={900}
              sizes="(max-width: 768px) 100vw, 56rem"
              className="h-auto w-full"
            />
          )}
        </div>
      ) : children ? (
        <div className="editorial-figure__media">{children}</div>
      ) : (
        <div
          className={cn(
            'editorial-figure__empty',
            marketingGradientSurfaceClass('indigoHaze')
          )}
        >
          <p className="editorial-figure__empty-meta">Imagery forthcoming</p>
        </div>
      )}
      {hasCaption ? (
        <figcaption className="editorial-figure__caption">
          {caption ? <p>{caption}</p> : null}
          {credit ? <p className="editorial-figure__credit">{credit}</p> : null}
        </figcaption>
      ) : null}
    </figure>
  )
}
