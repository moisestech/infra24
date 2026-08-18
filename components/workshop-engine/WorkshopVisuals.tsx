import type { LucideIcon } from 'lucide-react'
import {
  CircleDot,
  ClipboardCheck,
  Droplets,
  Image as ImageIcon,
  ScanLine,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Workflow,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type {
  ModuleColorTokenClasses,
  ModuleIconKey,
  ModuleMediaPlaceholder,
  ModuleVisualIdentity,
} from '@/lib/workshop-engine/types'
import { getResinModuleById } from '@/lib/workshop-engine/resin-printing'
import {
  DEFAULT_MODULE_VISUAL,
  getColorTokenClasses,
} from '@/lib/workshop-engine/resin-printing/theme'
import { TEACHING_SECTION_ROLES } from '@/lib/workshop-engine/section-roles'

const ICON_REGISTRY: Record<ModuleIconKey, LucideIcon> = {
  'circle-dot': CircleDot,
  sparkles: Sparkles,
  'shield-check': ShieldCheck,
  workflow: Workflow,
  'scan-line': ScanLine,
  sliders: SlidersHorizontal,
  droplets: Droplets,
  search: Search,
  'clipboard-check': ClipboardCheck,
}

export type ResolvedModuleIdentity = ModuleVisualIdentity &
  ModuleColorTokenClasses & {
    Icon: LucideIcon
  }

export function resolveModuleIdentity(
  visual?: ModuleVisualIdentity
): ResolvedModuleIdentity {
  const identity = visual ?? DEFAULT_MODULE_VISUAL
  const classes = getColorTokenClasses(identity.colorTokenId)
  return {
    ...identity,
    ...classes,
    Icon: ICON_REGISTRY[identity.iconKey] ?? CircleDot,
  }
}

/**
 * Resolve visual identity for a curriculum module.
 * Prefers metadata on the workshop module; falls back to default slate token.
 */
export function getModuleIdentity(moduleId: string): ResolvedModuleIdentity {
  const workshopModule = getResinModuleById(moduleId)
  return resolveModuleIdentity(workshopModule?.visual)
}

export function getModulePrimaryMedia(
  moduleId: string
): ModuleMediaPlaceholder | undefined {
  return getResinModuleById(moduleId)?.primaryMedia
}

export function ModuleIcon({
  moduleId,
  className,
}: {
  moduleId: string
  className?: string
}) {
  const identity = getModuleIdentity(moduleId)
  const Icon = identity.Icon
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full',
        identity.icon,
        className
      )}
    >
      <Icon aria-hidden="true" className="h-1/2 w-1/2" strokeWidth={1.8} />
    </span>
  )
}

export function ModulePhaseChip({ moduleId }: { moduleId: string }) {
  const identity = getModuleIdentity(moduleId)
  return (
    <span
      className={cn(
        'inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] sm:px-2.5 sm:py-1 sm:text-[11px] 2xl:px-3 2xl:text-xs',
        identity.chip
      )}
    >
      {identity.phase}
    </span>
  )
}

export function WorkshopImagePlaceholder({
  moduleId,
  title,
  shot,
  altIntent,
  aspect = 'landscape 16:10',
  assetId,
  minSize,
  src,
  caption,
  kind,
  className,
}: {
  moduleId?: string
  title: string
  shot: string
  altIntent: string
  aspect?: string
  assetId?: string
  minSize?: string
  src?: string
  caption?: string
  kind?: 'illustrative' | 'illustration' | 'diagram' | 'photo' | 'placeholder'
  className?: string
}) {
  const identity = getModuleIdentity(moduleId ?? '')
  if (src) {
    return (
      <figure
        className={cn(
          'overflow-hidden rounded-2xl border bg-white',
          identity.border,
          className
        )}
      >
        <div className="relative aspect-[16/10] bg-slate-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={altIntent}
            className="h-full w-full object-contain"
          />
        </div>
        <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 px-4 py-3 text-[11px] uppercase tracking-[0.12em] text-slate-500">
          <span>
            {caption ?? (kind === 'illustrative' ? 'Illustrative placeholder' : title)}
            {minSize ? ` · ${minSize}` : ''}
          </span>
          <span>{aspect}</span>
        </figcaption>
      </figure>
    )
  }
  return (
    <figure
      role="img"
      aria-label={`Image placeholder: ${altIntent}`}
      className={cn(
        'group overflow-hidden rounded-2xl border bg-white',
        identity.border,
        className
      )}
    >
      <div
        className={cn(
          'relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-gradient-to-br p-6',
          identity.gradient
        )}
      >
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              'linear-gradient(rgba(100,116,139,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(100,116,139,.12) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="absolute inset-4 rounded-xl border border-dashed border-slate-500/30" />
        <div className="relative max-w-xs text-center">
          <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow-sm">
            <ImageIcon aria-hidden="true" className="h-5 w-5" />
          </span>
          <p className="mt-3 text-sm font-semibold text-slate-950 md:text-base 2xl:text-lg">
            {title}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600 md:text-sm 2xl:text-base">
            {shot}
          </p>
          {assetId ? (
            <p className="mt-2 font-mono text-[10px] uppercase tracking-wide text-slate-500 md:text-xs 2xl:text-sm">
              {assetId}
            </p>
          ) : null}
        </div>
      </div>
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 px-4 py-3 text-[11px] uppercase tracking-[0.12em] text-slate-500">
        <span>Image needed{minSize ? ` · ${minSize}` : ''}</span>
        <span>{aspect}</span>
      </figcaption>
    </figure>
  )
}

export function ModuleVisualPlaceholder({ moduleId }: { moduleId: string }) {
  const media = getModulePrimaryMedia(moduleId)
  if (!media) return null
  return (
    <WorkshopImagePlaceholder
      moduleId={moduleId}
      title={media.title}
      shot={media.shot}
      altIntent={media.altIntent}
      aspect={media.aspect}
      assetId={media.assetId}
      minSize={media.minSize}
      src={media.src}
      caption={media.caption}
      kind={media.kind}
    />
  )
}

export function WorkshopVideoPlaceholder({
  moduleId,
  title,
  shot,
  assetId,
  aspect = 'landscape 16:9',
  src,
  caption,
  className,
}: {
  moduleId?: string
  title: string
  shot: string
  assetId?: string
  aspect?: string
  src?: string
  caption?: string
  className?: string
}) {
  const identity = getModuleIdentity(moduleId ?? '')
  const section = TEACHING_SECTION_ROLES.video
  const Icon = section.Icon

  if (src) {
    return (
      <figure
        className={cn(
          'overflow-hidden rounded-2xl border bg-white',
          identity.border,
          className
        )}
      >
        <div className="relative aspect-video bg-slate-950">
          <video
            src={src}
            controls
            className="h-full w-full object-contain"
            preload="metadata"
          >
            {title}
          </video>
        </div>
        <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 px-4 py-3 text-[11px] uppercase tracking-[0.12em] text-slate-500">
          <span>{caption ?? title}</span>
          <span>{aspect}</span>
        </figcaption>
      </figure>
    )
  }

  return (
    <figure
      role="img"
      aria-label={`Tutorial video placeholder: ${title}`}
      className={cn(
        'overflow-hidden rounded-2xl border',
        section.border,
        className
      )}
    >
      <div
        className={cn(
          'relative flex aspect-video items-center justify-center overflow-hidden bg-gradient-to-br p-6',
          identity.gradient
        )}
      >
        <div className="absolute inset-0 bg-slate-950/10" aria-hidden />
        <div className="relative max-w-sm text-center">
          <span
            className={cn(
              'mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full shadow-sm',
              section.iconWrap
            )}
          >
            <Icon aria-hidden className="h-6 w-6" />
          </span>
          <p className="mt-3 text-sm font-semibold text-slate-950 md:text-base">
            {title}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600 md:text-sm">
            {shot}
          </p>
          {assetId ? (
            <p className="mt-2 font-mono text-[10px] uppercase tracking-wide text-slate-500">
              {assetId}
            </p>
          ) : null}
        </div>
      </div>
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 bg-white px-4 py-3 text-[11px] uppercase tracking-[0.12em] text-slate-500">
        <span>{caption ?? 'Tutorial video slot'}</span>
        <span>{aspect}</span>
      </figcaption>
    </figure>
  )
}

export function ModuleTutorialVideoSlot({ moduleId }: { moduleId: string }) {
  const video = getResinModuleById(moduleId)?.tutorialVideo
  if (!video) return null
  return (
    <WorkshopVideoPlaceholder
      moduleId={moduleId}
      title={video.title}
      shot={video.shot}
      assetId={video.assetId}
      aspect={video.aspect}
      src={video.src}
      caption={video.caption}
    />
  )
}

/** Compact related visuals from mediaIds (beyond primary). */
export function ModuleRelatedMediaStrip({ moduleId }: { moduleId: string }) {
  const workshopModule = getResinModuleById(moduleId)
  const primaryId = workshopModule?.primaryMedia?.assetId
  const ids = (workshopModule?.mediaIds ?? []).filter((id) => id !== primaryId)
  if (!ids.length) return null
  const identity = getModuleIdentity(moduleId)
  const shown = ids.slice(0, 4)

  return (
    <section
      className={cn(
        'rounded-xl border p-3 md:p-4',
        identity.border,
        identity.surface
      )}
    >
      <p
        className={cn(
          'mb-3 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em]',
          TEACHING_SECTION_ROLES.media.heading
        )}
      >
        <span
          className={cn(
            'inline-flex h-6 w-6 items-center justify-center rounded-full',
            identity.icon
          )}
        >
          <ImageIcon aria-hidden className="h-3.5 w-3.5" />
        </span>
        Related visuals
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:gap-3">
        {shown.map((assetId) => (
          <a
            key={assetId}
            href="/workshop/resin-printing/media"
            className={cn(
              'flex min-h-[4.5rem] flex-col justify-end overflow-hidden rounded-lg border bg-gradient-to-br p-2.5 transition hover:border-slate-400',
              identity.border,
              identity.gradient
            )}
          >
            <span className="font-mono text-[9px] uppercase tracking-wide text-slate-600">
              {assetId}
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
