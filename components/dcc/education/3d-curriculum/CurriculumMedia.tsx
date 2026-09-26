import { Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  getCurriculumAsset,
  type ThreeDCurriculumAsset,
  type ThreeDCurriculumAssetId,
  type ThreeDCurriculumAspectRatio,
} from '@/lib/dcc/education/3d-curriculum'
import {
  getFabricationColor,
  type FabricationColorTokenId,
} from '@/lib/dcc/fabrication/theme'

const ASPECT_CLASS: Record<ThreeDCurriculumAspectRatio, string> = {
  '16/9': 'aspect-video',
  '21/9': 'aspect-[21/9]',
  '4/3': 'aspect-[4/3]',
  '4/5': 'aspect-[4/5]',
  '1/1': 'aspect-square',
}

export function CurriculumMedia({
  assetId,
  colorTokenId = 'slate',
  className,
  priority = false,
}: {
  assetId: ThreeDCurriculumAssetId
  colorTokenId?: FabricationColorTokenId
  className?: string
  priority?: boolean
}) {
  const media = getCurriculumAsset(assetId)
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
        <div className={cn('relative w-full min-w-0 bg-neutral-100', ASPECT_CLASS[media.aspectRatio])}>
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
        <figcaption className="border-t border-[var(--cdc-border)] px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-neutral-500">
          {media.id} · {media.aspectRatio}
        </figcaption>
      </figure>
    )
  }

  return <CurriculumAssetPlaceholder media={media} colorTokenId={colorTokenId} className={className} />
}

export function CurriculumAssetPlaceholder({
  media,
  colorTokenId = 'slate',
  className,
}: {
  media: ThreeDCurriculumAsset
  colorTokenId?: FabricationColorTokenId
  className?: string
}) {
  const color = getFabricationColor(colorTokenId)

  return (
    <figure
      role="img"
      aria-label={`Placeholder: ${media.alt}`}
      className={cn('overflow-hidden rounded-2xl border', color.border, className)}
    >
      <div
        className={cn(
          'relative flex min-h-[12rem] w-full items-center justify-center overflow-hidden bg-gradient-to-br p-5 sm:min-h-[14rem]',
          ASPECT_CLASS[media.aspectRatio],
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
              'mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm',
              color.icon
            )}
          >
            <ImageIcon aria-hidden className="h-7 w-7" />
          </span>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500">
            {media.id}
          </p>
          <p className="mt-2 text-sm font-semibold text-neutral-950 dark:text-neutral-50 md:text-base">
            {media.title}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300 md:text-sm">
            {media.promptPurpose}
          </p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-wide text-neutral-500">
            {media.filename}
          </p>
        </div>
      </div>
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--cdc-border)] bg-white px-3 py-2 text-[11px] uppercase tracking-[0.12em] text-neutral-500 dark:bg-neutral-950">
        <span>Image needed · drop in public/dcc/education/3d-curriculum/</span>
        <span>{media.aspectRatio}</span>
      </figcaption>
    </figure>
  )
}
