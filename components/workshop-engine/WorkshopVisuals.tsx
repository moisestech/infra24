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
  className,
}: {
  moduleId?: string
  title: string
  shot: string
  altIntent: string
  aspect?: string
  assetId?: string
  minSize?: string
  className?: string
}) {
  const identity = getModuleIdentity(moduleId ?? '')
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
    />
  )
}
