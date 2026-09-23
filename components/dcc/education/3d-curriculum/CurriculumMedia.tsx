import { Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  ASSET_PRODUCTION_STATUS_LABEL,
  curriculumAssetObjectPosition,
  getCurriculumAsset,
  isCurriculumAssetRenderable,
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

function ConceptualChip() {
  return (
    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-500">
      Conceptual educational image
    </p>
  )
}

export function CurriculumMedia({
  assetId,
  colorTokenId = 'slate',
  className,
  priority = false,
  variant = 'default',
  showCaption = false,
}: {
  assetId: ThreeDCurriculumAssetId
  colorTokenId?: FabricationColorTokenId
  className?: string
  priority?: boolean
  variant?: 'default' | 'card' | 'qa'
  /** Show production figcaption on detail pages when true. QA variant always shows metadata. */
  showCaption?: boolean
}) {
  const media = getCurriculumAsset(assetId)
  const color = getFabricationColor(colorTokenId)

  if (isCurriculumAssetRenderable(media)) {
    const objectPosition = curriculumAssetObjectPosition(media)
    const showMeta = variant === 'qa' || showCaption

    return (
      <figure
        className={cn(
          'overflow-hidden rounded-2xl border bg-white dark:bg-neutral-950',
          color.border,
          variant === 'card' && 'rounded-b-none border-b-0',
          className
        )}
      >
        <div
          className={cn(
            'relative w-full min-w-0 bg-neutral-100',
            ASPECT_CLASS[media.aspectRatio]
          )}
        >
          {variant === 'qa' ? (
            <span className="absolute left-2 top-2 z-10 rounded-full bg-neutral-950/80 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-white">
              {ASSET_PRODUCTION_STATUS_LABEL[media.productionStatus]}
            </span>
          ) : null}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={media.src}
            alt={media.alt}
            width={media.width}
            height={media.height}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
            style={objectPosition ? { objectPosition } : undefined}
          />
        </div>
        {showMeta ? (
          <figcaption className="border-t border-[var(--cdc-border)] px-3 py-2 dark:bg-neutral-950">
            {variant === 'qa' ? (
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-neutral-500">
                {media.id} · {media.aspectRatio}
                {media.visualVerb ? ` · ${media.visualVerb}` : ''}
              </p>
            ) : (
              <ConceptualChip />
            )}
          </figcaption>
        ) : null}
      </figure>
    )
  }

  return (
    <CurriculumAssetPlaceholder
      media={media}
      colorTokenId={colorTokenId}
      className={cn(variant === 'card' && 'rounded-b-none border-b-0', className)}
      variant={variant}
    />
  )
}

export function CurriculumAssetPlaceholder({
  media,
  colorTokenId = 'slate',
  className,
  variant = 'default',
}: {
  media: ThreeDCurriculumAsset
  colorTokenId?: FabricationColorTokenId
  className?: string
  variant?: 'default' | 'card' | 'qa'
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
        {variant === 'qa' ? (
          <span className="absolute left-2 top-2 z-10 rounded-full bg-neutral-950/80 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-white">
            {ASSET_PRODUCTION_STATUS_LABEL[media.productionStatus]}
          </span>
        ) : null}
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
        {variant === 'qa' ? (
          <span>{ASSET_PRODUCTION_STATUS_LABEL[media.productionStatus]}</span>
        ) : (
          <span>Image needed · update assets.ts</span>
        )}
        <span>{media.aspectRatio}</span>
      </figcaption>
    </figure>
  )
}
