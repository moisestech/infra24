import type { LucideIcon } from 'lucide-react'
import { Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  FABRICATION_CONCEPTUAL_CAPTION,
  getFabricationSectionMedia,
  type FabricationSectionMedia,
  type FabricationSectionMediaId,
} from '@/lib/dcc/fabrication/section-media'
import {
  getFabricationColor,
  type FabricationColorTokenId,
} from '@/lib/dcc/fabrication/theme'

const ASPECT_CLASS: Record<FabricationSectionMedia['aspect'], string> = {
  '16/9': 'aspect-video',
  '21/9': 'aspect-[21/9]',
  '4/5': 'aspect-[4/5]',
  '1/1': 'aspect-square',
}

export function FabricateSectionMedia({
  mediaId,
  colorTokenId = 'slate',
  className,
  priority = false,
}: {
  mediaId: FabricationSectionMediaId
  colorTokenId?: FabricationColorTokenId
  className?: string
  priority?: boolean
}) {
  const media = getFabricationSectionMedia(mediaId)
  const color = getFabricationColor(colorTokenId)

  if (media.src) {
    return (
      <figure
        className={cn(
          'overflow-hidden rounded-2xl border bg-white dark:bg-neutral-950',
          color.border,
          className
        )}
      >
        <div className={cn('relative w-full min-w-0 bg-neutral-100', ASPECT_CLASS[media.aspect])}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={media.src}
            alt={media.alt}
            width={media.width}
            height={media.height}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        {media.caption ? (
          <figcaption className="border-t border-[var(--cdc-border)] px-3 py-2 text-[11px] uppercase tracking-[0.12em] text-neutral-500">
            {media.kind === 'conceptual' &&
            media.caption !== FABRICATION_CONCEPTUAL_CAPTION
              ? `${media.caption} · conceptual`
              : media.caption}
          </figcaption>
        ) : null}
      </figure>
    )
  }

  return (
    <figure
      role="img"
      aria-label={`Placeholder: ${media.alt}`}
      className={cn(
        'overflow-hidden rounded-2xl border',
        color.border,
        className
      )}
    >
      <div
        className={cn(
          'relative flex min-h-[12rem] w-full items-center justify-center overflow-hidden bg-gradient-to-br p-5 sm:min-h-[14rem] md:min-h-[16rem]',
          ASPECT_CLASS[media.aspect],
          color.gradient
        )}
      >
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'linear-gradient(rgba(100,116,139,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(100,116,139,.14) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
          aria-hidden
        />
        <div className="relative max-w-md text-center">
          <span
            className={cn(
              'mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full shadow-sm',
              color.icon
            )}
          >
            <ImageIcon aria-hidden className="h-5 w-5" />
          </span>
          <p className="mt-3 text-sm font-semibold text-neutral-950 dark:text-neutral-50 md:text-base">
            {media.title}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300 md:text-sm">
            {media.shot}
          </p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-wide text-neutral-500">
            {media.fileName}
          </p>
        </div>
      </div>
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--cdc-border)] bg-white px-3 py-2 text-[11px] uppercase tracking-[0.12em] text-neutral-500 dark:bg-neutral-950">
        <span>Image needed · drop in public/dcc/fabrication/</span>
        <span>{media.aspect}</span>
      </figcaption>
    </figure>
  )
}

export function FabricateSectionHeading({
  title,
  description,
  Icon,
  colorTokenId,
}: {
  title: string
  description?: string
  Icon: LucideIcon
  colorTokenId: FabricationColorTokenId
}) {
  const color = getFabricationColor(colorTokenId)
  return (
    <div className="mb-4 md:mb-5">
      <h2
        className={cn(
          'inline-flex items-center gap-2.5 text-[clamp(1.125rem,2vw,1.5rem)] font-semibold tracking-tight',
          color.heading
        )}
      >
        <span
          className={cn(
            'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full md:h-9 md:w-9',
            color.icon
          )}
        >
          <Icon aria-hidden className="h-4 w-4 md:h-5 md:w-5" />
        </span>
        {title}
      </h2>
      {description ? (
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-base">
          {description}
        </p>
      ) : null}
    </div>
  )
}
