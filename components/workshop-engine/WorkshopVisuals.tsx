import type { LucideIcon } from "lucide-react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

export type WorkshopModuleIdentity = {
  phase: string;
  Icon: LucideIcon;
  chip: string;
  icon: string;
  surface: string;
  border: string;
  gradient: string;
  tvGlow: string;
};

const DEFAULT_IDENTITY: WorkshopModuleIdentity = {
  phase: "Workshop",
  Icon: CircleDot,
  chip: "border-slate-200 bg-slate-100 text-slate-800",
  icon: "bg-slate-950 text-white",
  surface: "bg-slate-50",
  border: "border-slate-200",
  gradient: "from-slate-200/80 via-white to-white",
  tvGlow: "from-slate-500/25 via-slate-950 to-slate-950",
};

const MODULE_IDENTITIES: Record<string, WorkshopModuleIdentity> = {
  welcome: {
    phase: "Orientation",
    Icon: CircleDot,
    chip: "border-cyan-200 bg-cyan-50 text-cyan-900",
    icon: "bg-cyan-700 text-white",
    surface: "bg-cyan-50/70",
    border: "border-cyan-200",
    gradient: "from-cyan-100 via-sky-50 to-white",
    tvGlow: "from-cyan-500/30 via-slate-950 to-slate-950",
  },
  "why-resin": {
    phase: "Material fit",
    Icon: Sparkles,
    chip: "border-sky-200 bg-sky-50 text-sky-900",
    icon: "bg-sky-700 text-white",
    surface: "bg-sky-50/70",
    border: "border-sky-200",
    gradient: "from-sky-100 via-cyan-50 to-white",
    tvGlow: "from-sky-500/30 via-slate-950 to-slate-950",
  },
  "safety-zones": {
    phase: "Safety gate",
    Icon: ShieldCheck,
    chip: "border-amber-300 bg-amber-50 text-amber-950",
    icon: "bg-amber-400 text-amber-950",
    surface: "bg-amber-50/80",
    border: "border-amber-300",
    gradient: "from-amber-100 via-orange-50 to-white",
    tvGlow: "from-amber-500/30 via-slate-950 to-slate-950",
  },
  "complete-workflow": {
    phase: "Process map",
    Icon: Workflow,
    chip: "border-blue-200 bg-blue-50 text-blue-900",
    icon: "bg-blue-700 text-white",
    surface: "bg-blue-50/70",
    border: "border-blue-200",
    gradient: "from-blue-100 via-sky-50 to-white",
    tvGlow: "from-blue-500/30 via-slate-950 to-slate-950",
  },
  "file-readiness": {
    phase: "Digital prep",
    Icon: ScanLine,
    chip: "border-teal-200 bg-teal-50 text-teal-900",
    icon: "bg-teal-700 text-white",
    surface: "bg-teal-50/70",
    border: "border-teal-200",
    gradient: "from-teal-100 via-cyan-50 to-white",
    tvGlow: "from-teal-500/30 via-slate-950 to-slate-950",
  },
  "slicer-lab": {
    phase: "Slicer lab",
    Icon: SlidersHorizontal,
    chip: "border-indigo-200 bg-indigo-50 text-indigo-900",
    icon: "bg-indigo-700 text-white",
    surface: "bg-indigo-50/70",
    border: "border-indigo-200",
    gradient: "from-indigo-100 via-blue-50 to-white",
    tvGlow: "from-indigo-500/30 via-slate-950 to-slate-950",
  },
  "print-wash-cure": {
    phase: "Controlled process",
    Icon: Droplets,
    chip: "border-orange-200 bg-orange-50 text-orange-950",
    icon: "bg-orange-600 text-white",
    surface: "bg-orange-50/70",
    border: "border-orange-200",
    gradient: "from-orange-100 via-amber-50 to-white",
    tvGlow: "from-orange-500/30 via-slate-950 to-slate-950",
  },
  "failure-clinic": {
    phase: "Diagnosis",
    Icon: Search,
    chip: "border-rose-200 bg-rose-50 text-rose-950",
    icon: "bg-rose-700 text-white",
    surface: "bg-rose-50/70",
    border: "border-rose-200",
    gradient: "from-rose-100 via-orange-50 to-white",
    tvGlow: "from-rose-500/30 via-slate-950 to-slate-950",
  },
  "project-readiness": {
    phase: "Next step",
    Icon: ClipboardCheck,
    chip: "border-emerald-200 bg-emerald-50 text-emerald-950",
    icon: "bg-emerald-700 text-white",
    surface: "bg-emerald-50/70",
    border: "border-emerald-200",
    gradient: "from-emerald-100 via-teal-50 to-white",
    tvGlow: "from-emerald-500/30 via-slate-950 to-slate-950",
  },
};

const MODULE_SHOTS: Record<
  string,
  { title: string; shot: string; altIntent: string }
> = {
  welcome: {
    title: "Join screen + teaching kit",
    shot: "Wide room image with both smart TVs, the QR backup card, and cured samples.",
    altIntent:
      "Workshop room prepared for participants with screens and teaching objects.",
  },
  "why-resin": {
    title: "Resin detail comparison",
    shot: "Macro image of two cured art objects showing scale, surface, and fine detail.",
    altIntent: "Close comparison of cured resin prints at two scales.",
  },
  "safety-zones": {
    title: "Clean zone / controlled zone",
    shot: "Straight-on room overview with zone labels, PPE, spill kit, and resin station visible.",
    altIntent:
      "Separated participant and resin-handling areas in the workshop room.",
  },
  "complete-workflow": {
    title: "Five-stage material workflow",
    shot: "Top-down sequence: model, sliced view, supported print, washed part, cured object.",
    altIntent:
      "Five physical and digital stages of the resin printing workflow.",
  },
  "file-readiness": {
    title: "Ready / repair comparison",
    shot: "Annotated render pairing a printable file with thin walls, holes, and trapped cavities.",
    altIntent: "Digital models compared for resin-printing readiness.",
  },
  "slicer-lab": {
    title: "Slicer sequence",
    shot: "Clean screen capture showing orientation, supports, drain holes, and layer preview.",
    altIntent: "A model being prepared in the validated resin slicer.",
  },
  "print-wash-cure": {
    title: "Print / wash / cure stations",
    shot: "Three-part station image photographed from the participant clean-zone viewpoint.",
    altIntent:
      "Instructor-operated resin printer, washing station, and curing station.",
  },
  "failure-clinic": {
    title: "Cured failure specimens",
    shot: "Labeled grid: plate failure, detached supports, white bloom, crack, soft detail.",
    altIntent: "Cured failed prints used as diagnostic teaching samples.",
  },
  "project-readiness": {
    title: "Appointment-ready kit",
    shot: "File checklist, cured sample, labeled USB, and resource QR arranged top-down.",
    altIntent:
      "Materials prepared for a supervised resin-printing appointment.",
  },
};

export function getModuleIdentity(moduleId: string) {
  return MODULE_IDENTITIES[moduleId] ?? DEFAULT_IDENTITY;
}

export function ModuleIcon({
  moduleId,
  className,
}: {
  moduleId: string;
  className?: string;
}) {
  const identity = getModuleIdentity(moduleId);
  const Icon = identity.Icon;
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full",
        identity.icon,
        className,
      )}
    >
      <Icon aria-hidden="true" className="h-1/2 w-1/2" strokeWidth={1.8} />
    </span>
  );
}

export function ModulePhaseChip({ moduleId }: { moduleId: string }) {
  const identity = getModuleIdentity(moduleId);
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em]",
        identity.chip,
      )}
    >
      {identity.phase}
    </span>
  );
}

export function WorkshopImagePlaceholder({
  moduleId,
  title,
  shot,
  altIntent,
  aspect = "landscape 16:10",
  className,
}: {
  moduleId?: string;
  title: string;
  shot: string;
  altIntent: string;
  aspect?: string;
  className?: string;
}) {
  const identity = getModuleIdentity(moduleId ?? "");
  return (
    <figure
      role="img"
      aria-label={`Image placeholder: ${altIntent}`}
      className={cn(
        "group overflow-hidden rounded-2xl border bg-white",
        identity.border,
        className,
      )}
    >
      <div
        className={cn(
          "relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-gradient-to-br p-6",
          identity.gradient,
        )}
      >
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(rgba(100,116,139,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(100,116,139,.12) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute inset-4 rounded-xl border border-dashed border-slate-500/30" />
        <div className="relative max-w-xs text-center">
          <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow-sm">
            <ImageIcon aria-hidden="true" className="h-5 w-5" />
          </span>
          <p className="mt-3 text-sm font-semibold text-slate-950">{title}</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">{shot}</p>
        </div>
      </div>
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 px-4 py-3 text-[11px] uppercase tracking-[0.12em] text-slate-500">
        <span>Image needed</span>
        <span>{aspect}</span>
      </figcaption>
    </figure>
  );
}

export function ModuleVisualPlaceholder({ moduleId }: { moduleId: string }) {
  const shot = MODULE_SHOTS[moduleId];
  if (!shot) return null;
  return <WorkshopImagePlaceholder moduleId={moduleId} {...shot} />;
}
