import { cn } from '@/lib/utils';

/**
 * Named gradient surfaces for DCC marketing — avoids repeating remote photos.
 * Pair each use with a concrete `alt` string where the block is decorative context.
 */
export type MarketingGradientId =
  | 'stackTeal'
  | 'columnCoral'
  | 'fieldViolet'
  | 'meshSlate'
  | 'pulseMagenta'
  | 'warmAmber'
  | 'deepInk'
  | 'signalCyan'
  | 'roseMist'
  | 'indigoHaze';

const SURFACES: Record<MarketingGradientId, string> = {
  stackTeal:
    'bg-gradient-to-br from-slate-950 via-teal-950/80 to-cyan-950/60',
  columnCoral:
    'bg-gradient-to-tr from-rose-950/90 via-orange-950/50 to-amber-950/40',
  fieldViolet:
    'bg-gradient-to-bl from-fuchsia-950/75 via-violet-950/50 to-slate-950',
  meshSlate:
    'bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-950',
  pulseMagenta:
    'bg-gradient-to-tl from-pink-950/80 via-fuchsia-900/45 to-slate-950',
  warmAmber:
    'bg-gradient-to-br from-amber-950/70 via-yellow-950/35 to-stone-950',
  deepInk:
    'bg-gradient-to-b from-neutral-950 via-slate-950 to-black',
  signalCyan:
    'bg-gradient-to-br from-cyan-950/85 via-teal-900/55 to-slate-950',
  roseMist:
    'bg-gradient-to-br from-rose-900/60 via-neutral-900 to-slate-950',
  indigoHaze:
    'bg-gradient-to-tr from-indigo-950/80 via-blue-950/40 to-slate-950',
};

/** Soft mesh highlight (radial) layered on linear base — use with overflow-hidden. */
const MESH_OVERLAY =
  'before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_80%_60%_at_30%_20%,rgba(255,255,255,0.12),transparent_55%)] before:opacity-90';

export function marketingGradientSurfaceClass(
  id: MarketingGradientId,
  options?: { mesh?: boolean }
): string {
  return cn(SURFACES[id], options?.mesh !== false && MESH_OVERLAY, 'relative');
}
