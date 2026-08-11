"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock3,
  Coffee,
  QrCode,
  Radio,
  TimerOff,
  Users,
} from "lucide-react";
import { SessionJoinCard } from "@/components/workshop-engine/SessionJoinCard";
import { RoomTimer } from "@/components/workshop-engine/SafetyAndTimer";
import {
  getModuleIdentity,
  ModuleIcon,
  ModulePhaseChip,
} from "@/components/workshop-engine/WorkshopVisuals";
import { useLiveSessionPolling } from "@/components/workshop-engine/TvPresentationClient";
import {
  RESIN_PRINTING_MODULES,
  getResinModuleById,
} from "@/lib/workshop-engine/resin-printing";
import type {
  TvScreen,
  WorkshopLiveSession,
} from "@/lib/workshop-engine/types";
import {
  weLayout,
  weShell,
  weTouch,
  weType,
} from "@/components/workshop-engine/responsive";
import { cn } from "@/lib/utils";

async function patchSession(code: string, body: Record<string, unknown>) {
  const res = await fetch(
    `/api/workshop-live-sessions/${encodeURIComponent(code)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  if (!res.ok) throw new Error("Failed to update session");
  const json = (await res.json()) as { session: WorkshopLiveSession };
  return json.session;
}

export function FacilitatorConsole({
  code,
  initialSession,
  origin,
}: {
  code: string;
  initialSession: WorkshopLiveSession;
  origin: string;
}) {
  const { session, setSession, error, refresh } = useLiveSessionPolling(
    code,
    initialSession,
  );
  const [busy, setBusy] = useState(false);
  const liveModule =
    getResinModuleById(session.liveModuleId) ?? RESIN_PRINTING_MODULES[0];
  const moduleIndex = RESIN_PRINTING_MODULES.findIndex(
    (m) => m.id === liveModule.id,
  );

  const apply = useCallback(
    async (body: Record<string, unknown>) => {
      setBusy(true);
      try {
        const next = await patchSession(code, body);
        setSession(next);
      } finally {
        setBusy(false);
      }
    },
    [code, setSession],
  );

  const goModule = useCallback(
    async (index: number, tvScreen: TvScreen = "module") => {
      const target = RESIN_PRINTING_MODULES[index];
      if (!target) return;
      await apply({
        liveModuleId: target.id,
        liveStep: 0,
        tvScreen,
        status: tvScreen === "break" ? "break" : "live",
        startedAt: session.startedAt ?? new Date().toISOString(),
      });
    },
    [apply, session.startedAt],
  );

  const startTimer = useCallback(
    async (minutes: number, label: string) => {
      const ends = new Date(Date.now() + minutes * 60_000).toISOString();
      await apply({ timerEndsAt: ends, timerLabel: label });
    },
    [apply],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        void goModule(
          Math.min(moduleIndex + 1, RESIN_PRINTING_MODULES.length - 1),
        );
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        void goModule(Math.max(moduleIndex - 1, 0));
      }
      if (e.key === " ") {
        e.preventDefault();
        if (session.timerEndsAt) {
          void apply({ timerEndsAt: null, timerLabel: null });
        } else {
          void startTimer(5, "Exercise");
        }
      }
      if (e.key === "j" || e.key === "J")
        void apply({ tvScreen: "join", status: "open" });
      if (e.key === "b" || e.key === "B") {
        void apply({ tvScreen: "break", status: "break" });
        void startTimer(10, "Break");
      }
      if (e.key === "r" || e.key === "R") void apply({ tvScreen: "resources" });
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [apply, goModule, moduleIndex, session.timerEndsAt, startTimer]);

  const joinUrl = `${origin}/session/${session.joinCode}`;
  const presentUrl = `${origin}/present/${session.joinCode}`;
  const facilitateUrl = `${origin}/facilitate/${session.joinCode}`;

  return (
    <div className={cn(weShell.width, weShell.pad, weShell.mainPy, "space-y-6 2xl:space-y-8")}>
      <header className="space-y-2 md:space-y-3">
        <p className="text-[10px] font-medium uppercase tracking-wide text-neutral-500 sm:text-xs 2xl:text-sm">
          Facilitator · {session.joinCode} · {session.status} · TV:{" "}
          {session.tvScreen}
        </p>
        <div className="flex items-center gap-3 md:gap-4">
          <ModuleIcon
            moduleId={liveModule.id}
            className="h-11 w-11 md:h-12 md:w-12 2xl:h-16 2xl:w-16"
          />
          <div>
            <ModulePhaseChip moduleId={liveModule.id} />
            <h1 className={cn(weType.title, "mt-1.5")}>
              {liveModule.order.toString().padStart(2, "0")}. {liveModule.title}
            </h1>
          </div>
        </div>
        <p className={weType.label}>
          Shortcuts: ←/→ modules · Space timer · J join · B break · R resources
        </p>
        {error ? (
          <p className="text-sm text-amber-800 2xl:text-base">{error}</p>
        ) : null}
      </header>

      <SessionJoinCard
        code={session.joinCode}
        joinUrl={joinUrl}
        presentUrl={presentUrl}
        facilitateUrl={facilitateUrl}
      />

      <div className={weLayout.facilitatorGrid}>
        <div className={weLayout.facilitatorMain}>
          <div className="grid gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-2 xl:grid-cols-3 2xl:gap-4">
            {(
              [
                {
                  label: "Previous module",
                  Icon: ChevronLeft,
                  disabled: busy || moduleIndex <= 0,
                  onClick: () => void goModule(moduleIndex - 1),
                  className: "border-slate-300 bg-white",
                },
                {
                  label: "Next module",
                  Icon: ChevronRight,
                  disabled:
                    busy || moduleIndex >= RESIN_PRINTING_MODULES.length - 1,
                  onClick: () => void goModule(moduleIndex + 1),
                  className: "border-slate-300 bg-white",
                },
                {
                  label: "Open join screen",
                  Icon: Users,
                  disabled: busy,
                  onClick: () =>
                    void apply({ tvScreen: "join", status: "open" }),
                  className: "border-cyan-300 bg-cyan-50 text-cyan-950",
                },
                {
                  label: "Break (10:00)",
                  Icon: Coffee,
                  disabled: busy,
                  onClick: () => {
                    void apply({ tvScreen: "break", status: "break" });
                    void startTimer(10, "Break");
                  },
                  className: "border-amber-300 bg-amber-50 text-amber-950",
                },
                {
                  label: "Resource QR",
                  Icon: QrCode,
                  disabled: busy,
                  onClick: () => void apply({ tvScreen: "resources" }),
                  className: "border-indigo-300 bg-indigo-50 text-indigo-950",
                },
                {
                  label: "Start 5:00 timer",
                  Icon: Clock3,
                  disabled: busy,
                  onClick: () => void startTimer(5, "Exercise"),
                  className: "border-slate-300 bg-white",
                },
                {
                  label: "Clear timer",
                  Icon: TimerOff,
                  disabled: busy,
                  onClick: () =>
                    void apply({ timerEndsAt: null, timerLabel: null }),
                  className: "border-slate-300 bg-white",
                },
                {
                  label: "Mark complete",
                  Icon: Radio,
                  disabled: busy,
                  onClick: () =>
                    void apply({
                      tvScreen: "complete",
                      status: "complete",
                      endsAt: new Date().toISOString(),
                    }),
                  className: "border-emerald-900 bg-emerald-900 text-white",
                },
              ] as const
            ).map((action) => {
              const Icon = action.Icon;
              return (
                <button
                  key={action.label}
                  type="button"
                  disabled={action.disabled}
                  onClick={action.onClick}
                  className={cn(
                    weTouch.button,
                    "border disabled:opacity-40",
                    action.className,
                  )}
                >
                  <Icon
                    aria-hidden
                    className="h-4 w-4 shrink-0 2xl:h-5 2xl:w-5"
                  />
                  {action.label}
                </button>
              );
            })}
          </div>

          <RoomTimer endsAt={session.timerEndsAt} label={session.timerLabel} />

          <section className="space-y-2 md:space-y-3">
            <p className="text-sm font-medium text-neutral-950 md:text-base 2xl:text-lg">
              Jump to module
            </p>
            <div className="grid gap-2 sm:grid-cols-2 2xl:gap-3">
              {RESIN_PRINTING_MODULES.map((m, index) => {
                const identity = getModuleIdentity(m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    disabled={busy}
                    onClick={() => void goModule(index)}
                    className={cn(
                      weTouch.button,
                      "justify-start border text-left transition",
                      m.id === liveModule.id
                        ? "border-neutral-950 bg-neutral-950 text-white"
                        : cn("bg-white hover:shadow-sm", identity.border),
                    )}
                  >
                    <ModuleIcon
                      moduleId={m.id}
                      className="h-8 w-8 shrink-0 2xl:h-10 2xl:w-10"
                    />
                    <span>
                      {String(m.order).padStart(2, "0")}. {m.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <aside className={weLayout.facilitatorSide}>
          <section className="rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-950 md:p-5 2xl:p-6 2xl:text-base">
            <p className="inline-flex items-center gap-2 font-medium md:text-base 2xl:text-lg">
              <ClipboardList aria-hidden className="h-4 w-4 md:h-5 md:w-5" />
              Private facilitator notes
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {liveModule.facilitatorNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
            <p className="mt-3 text-sky-900">
              Next physical sample:{" "}
              <span className="font-medium">{liveModule.physicalSample}</span>
            </p>
          </section>
        </aside>
      </div>

      <div className="flex flex-wrap gap-3 text-sm 2xl:text-base">
        <Link className="underline" href="/workshop/resin-printing">
          Workshop hub
        </Link>
        <button
          type="button"
          className="underline"
          onClick={() => void refresh()}
        >
          Refresh now
        </button>
      </div>
    </div>
  );
}
