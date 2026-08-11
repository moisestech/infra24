"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
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
  const module =
    getResinModuleById(session.liveModuleId) ?? RESIN_PRINTING_MODULES[0];
  const moduleIndex = RESIN_PRINTING_MODULES.findIndex(
    (m) => m.id === module.id,
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
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          Facilitator · {session.joinCode} · {session.status} · TV:{" "}
          {session.tvScreen}
        </p>
        <div className="flex items-center gap-3">
          <ModuleIcon moduleId={module.id} className="h-12 w-12" />
          <div>
            <ModulePhaseChip moduleId={module.id} />
            <h1 className="mt-2 text-3xl font-semibold text-neutral-950">
              {module.order.toString().padStart(2, "0")}. {module.title}
            </h1>
          </div>
        </div>
        <p className="text-sm text-neutral-600">
          Shortcuts: ←/→ modules · Space timer · J join · B break · R resources
        </p>
        {error ? <p className="text-sm text-amber-800">{error}</p> : null}
      </header>

      <SessionJoinCard
        code={session.joinCode}
        joinUrl={joinUrl}
        presentUrl={presentUrl}
        facilitateUrl={facilitateUrl}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <button
          type="button"
          disabled={busy || moduleIndex <= 0}
          onClick={() => void goModule(moduleIndex - 1)}
          className="rounded border border-neutral-300 bg-white px-3 py-2 text-sm disabled:opacity-40"
        >
          Previous module
        </button>
        <button
          type="button"
          disabled={busy || moduleIndex >= RESIN_PRINTING_MODULES.length - 1}
          onClick={() => void goModule(moduleIndex + 1)}
          className="rounded border border-neutral-300 bg-white px-3 py-2 text-sm disabled:opacity-40"
        >
          Next module
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => void apply({ tvScreen: "join", status: "open" })}
          className="rounded border border-neutral-300 bg-white px-3 py-2 text-sm"
        >
          Open join screen
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => {
            void apply({ tvScreen: "break", status: "break" });
            void startTimer(10, "Break");
          }}
          className="rounded border border-neutral-300 bg-white px-3 py-2 text-sm"
        >
          Break (10:00)
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => void apply({ tvScreen: "resources" })}
          className="rounded border border-neutral-300 bg-white px-3 py-2 text-sm"
        >
          Resource QR
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => void startTimer(5, "Exercise")}
          className="rounded border border-neutral-300 bg-white px-3 py-2 text-sm"
        >
          Start 5:00 timer
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => void apply({ timerEndsAt: null, timerLabel: null })}
          className="rounded border border-neutral-300 bg-white px-3 py-2 text-sm"
        >
          Clear timer
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() =>
            void apply({
              tvScreen: "complete",
              status: "complete",
              endsAt: new Date().toISOString(),
            })
          }
          className="rounded border border-neutral-950 bg-neutral-950 px-3 py-2 text-sm text-white"
        >
          Mark complete
        </button>
      </div>

      <RoomTimer endsAt={session.timerEndsAt} label={session.timerLabel} />

      <section className="rounded-md border border-sky-200 bg-sky-50 p-4 text-sm text-sky-950">
        <p className="font-medium">Private facilitator notes</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {module.facilitatorNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
        <p className="mt-3 text-sky-900">
          Next physical sample:{" "}
          <span className="font-medium">{module.physicalSample}</span>
        </p>
      </section>

      <section className="space-y-2">
        <p className="text-sm font-medium text-neutral-950">Jump to module</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {RESIN_PRINTING_MODULES.map((m, index) => {
            const identity = getModuleIdentity(m.id);
            return (
              <button
                key={m.id}
                type="button"
                disabled={busy}
                onClick={() => void goModule(index)}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-3 py-2 text-left text-sm transition",
                  m.id === module.id
                    ? "border-neutral-950 bg-neutral-950 text-white"
                    : cn("bg-white hover:shadow-sm", identity.border),
                )}
              >
                <ModuleIcon moduleId={m.id} className="h-8 w-8" />
                <span>
                  {String(m.order).padStart(2, "0")}. {m.title}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="flex flex-wrap gap-3 text-sm">
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
