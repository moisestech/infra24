"use client";

import QRCode from "@/components/ui/QRCode";
import type { SafetyLevel } from "@/lib/workshop-engine/types";
import {
  getModuleIdentity,
  ModuleIcon,
  ModulePhaseChip,
} from "@/components/workshop-engine/WorkshopVisuals";
import { cn } from "@/lib/utils";

export function SessionJoinCard({
  code,
  joinUrl,
  presentUrl,
  facilitateUrl,
  size = 180,
}: {
  code: string;
  joinUrl: string;
  presentUrl?: string;
  facilitateUrl?: string;
  size?: number;
}) {
  return (
    <div className="rounded-md border border-neutral-200 bg-white p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
        Join session
      </p>
      <p className="mt-2 font-mono text-4xl font-semibold tracking-[0.2em] text-neutral-950">
        {code}
      </p>
      <div className="mt-4 flex flex-wrap items-start gap-6">
        <div className="rounded border border-neutral-200 bg-white p-2">
          <QRCode value={joinUrl} size={size} />
        </div>
        <div className="space-y-2 text-sm text-neutral-700">
          <p>
            Participant join:{" "}
            <a className="underline break-all" href={joinUrl}>
              {joinUrl}
            </a>
          </p>
          {presentUrl ? (
            <p>
              TV present:{" "}
              <a className="underline break-all" href={presentUrl}>
                {presentUrl}
              </a>
            </p>
          ) : null}
          {facilitateUrl ? (
            <p>
              Facilitator:{" "}
              <a className="underline break-all" href={facilitateUrl}>
                {facilitateUrl}
              </a>
            </p>
          ) : null}
          <p className="text-xs text-neutral-500">
            No account required for the pilot.
          </p>
        </div>
      </div>
    </div>
  );
}

export function WorkshopModuleCard({
  href,
  moduleId,
  order,
  title,
  minutes,
  promise,
  safetyLevel,
}: {
  href: string;
  moduleId: string;
  order: number;
  title: string;
  minutes: number;
  promise: string;
  safetyLevel?: SafetyLevel;
}) {
  const identity = getModuleIdentity(moduleId);
  return (
    <a
      href={href}
      className={cn(
        "group relative block overflow-hidden rounded-2xl border bg-white p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2",
        identity.border,
      )}
    >
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-1 bg-gradient-to-r",
          identity.gradient,
        )}
      />
      <div className="flex items-start gap-3">
        <ModuleIcon moduleId={moduleId} className="h-11 w-11" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <ModulePhaseChip moduleId={moduleId} />
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {String(order).padStart(2, "0")} · {minutes} min
            </p>
          </div>
          <h3 className="mt-3 text-lg font-semibold text-slate-950 group-hover:underline group-hover:underline-offset-4">
            {title}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            {promise}
          </p>
          {safetyLevel === "required" ? (
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-amber-900">
              Safety gate required
            </p>
          ) : null}
        </div>
      </div>
    </a>
  );
}
