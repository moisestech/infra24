"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import QRCode from "@/components/ui/QRCode";
import { RoomTimer } from "@/components/workshop-engine/SafetyAndTimer";
import {
  getModuleIdentity,
  ModuleIcon,
  ModulePhaseChip,
} from "@/components/workshop-engine/WorkshopVisuals";
import {
  RESIN_BREAK_MODULE,
  RESIN_PRINTING_MODULES,
  getResinModuleById,
} from "@/lib/workshop-engine/resin-printing";
import type { WorkshopLiveSession } from "@/lib/workshop-engine/types";
import { cn } from "@/lib/utils";

async function fetchSession(code: string): Promise<WorkshopLiveSession | null> {
  const res = await fetch(
    `/api/workshop-live-sessions/${encodeURIComponent(code)}`,
    {
      cache: "no-store",
    },
  );
  if (!res.ok) return null;
  const json = (await res.json()) as { session?: WorkshopLiveSession };
  return json.session ?? null;
}

export function TvPresentationClient({
  code,
  initialSession,
  origin,
}: {
  code: string;
  initialSession: WorkshopLiveSession;
  origin: string;
}) {
  const [session, setSession] = useState(initialSession);
  const [connected, setConnected] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      const next = await fetchSession(code);
      if (cancelled) return;
      if (!next) {
        setConnected(false);
        return;
      }
      setConnected(true);
      setSession(next);
    };
    const id = window.setInterval(poll, 1500);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [code]);

  const liveModule =
    getResinModuleById(session.liveModuleId) ?? RESIN_PRINTING_MODULES[0];
  const identity = getModuleIdentity(liveModule.id);
  const joinUrl = `${origin}/session/${session.joinCode}`;
  const progress = ((liveModule.order + 1) / RESIN_PRINTING_MODULES.length) * 100;

  return (
    <div
      className={cn(
        'relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br text-white',
        identity.tvGlow
      )}
    >
      <div className="absolute inset-x-0 top-0 h-1.5 bg-white/10">
        <div
          className="h-full bg-cyan-300 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="pointer-events-none absolute inset-3 rounded-sm border border-white/10 sm:inset-4 md:inset-6 2xl:inset-8" />
      <header className="flex flex-col gap-4 px-5 pt-6 sm:px-8 sm:pt-8 md:flex-row md:items-start md:justify-between md:gap-6 md:px-10 md:pt-10 lg:px-12 2xl:px-16 2xl:pt-12">
        <div className="flex items-start gap-3 sm:gap-4 md:gap-6">
          <ModuleIcon
            moduleId={liveModule.id}
            className="h-14 w-14 ring-1 ring-white/20 sm:h-16 sm:w-16 md:h-20 md:w-20 2xl:h-24 2xl:w-24"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4">
              <ModulePhaseChip moduleId={liveModule.id} />
              <p className="text-sm uppercase tracking-[0.18em] text-neutral-400 sm:text-lg md:text-2xl md:tracking-[0.2em] 2xl:text-3xl">
                Module {String(liveModule.order).padStart(2, '0')}
              </p>
            </div>
            <h1 className="mt-2 max-w-5xl text-3xl font-semibold leading-tight sm:text-4xl md:mt-3 md:text-6xl lg:text-7xl 2xl:text-8xl">
              {session.tvScreen === 'break'
                ? RESIN_BREAK_MODULE.title
                : liveModule.title}
            </h1>
          </div>
        </div>
        <div className="text-left text-xs text-neutral-400 sm:text-sm md:text-right md:text-sm 2xl:text-base">
          <p className={cn(connected ? 'text-emerald-400' : 'text-amber-300')}>
            {connected ? 'Synced' : 'Reconnecting…'}
          </p>
          <p className="mt-1 font-mono tracking-widest text-neutral-300">
            {session.joinCode}
          </p>
        </div>
      </header>

      <main className="flex flex-1 flex-col justify-center px-5 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10 lg:px-12 2xl:px-16 2xl:py-12">
        {session.tvScreen === 'join' ? (
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:flex-wrap sm:items-center sm:gap-8 md:gap-12">
            <div className="rounded-lg bg-white p-3 sm:p-4">
              <QRCode value={joinUrl} size={220} />
            </div>
            <div>
              <p className="text-xl text-neutral-300 sm:text-2xl md:text-3xl 2xl:text-4xl">
                Scan to join
              </p>
              <p className="mt-3 font-mono text-4xl tracking-[0.2em] sm:text-5xl md:mt-4 md:text-7xl md:tracking-[0.25em] 2xl:text-8xl">
                {session.joinCode}
              </p>
              <p className="mt-4 max-w-xl text-base text-neutral-400 sm:text-xl md:mt-6 md:text-2xl 2xl:text-3xl">
                Choose Follow class or My pace. No account needed.
              </p>
            </div>
          </div>
        ) : null}

        {session.tvScreen === 'break' ? (
          <div className="space-y-6 md:space-y-8">
            <p className="max-w-4xl text-2xl text-neutral-200 sm:text-3xl md:text-4xl 2xl:text-5xl">
              {RESIN_BREAK_MODULE.tvPrompt}
            </p>
            <RoomTimer
              endsAt={session.timerEndsAt}
              label={session.timerLabel}
              large
            />
          </div>
        ) : null}

        {session.tvScreen === 'resources' ? (
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:flex-wrap sm:items-center sm:gap-8 md:gap-12">
            <div className="rounded-lg bg-white p-3 sm:p-4">
              <QRCode
                value={`${origin}/workshop/resin-printing/resources`}
                size={200}
              />
            </div>
            <div>
              <p className="text-3xl font-semibold sm:text-4xl md:text-5xl 2xl:text-6xl">
                Resources
              </p>
              <p className="mt-3 max-w-2xl text-xl text-neutral-300 sm:text-2xl md:mt-4 md:text-3xl 2xl:text-4xl">
                Booklet, checklist, glossary, and follow-up pathway.
              </p>
            </div>
          </div>
        ) : null}

        {session.tvScreen === 'complete' ? (
          <div className="space-y-4 md:space-y-6">
            <p className="text-3xl font-semibold sm:text-4xl md:text-5xl 2xl:text-6xl">
              Session complete
            </p>
            <p className="max-w-3xl text-xl text-neutral-300 sm:text-2xl md:text-3xl 2xl:text-4xl">
              Ready · Repair · Consultation — then book a supervised print
              appointment.
            </p>
          </div>
        ) : null}

        {session.tvScreen === 'module' ? (
          <div className="grid items-center gap-6 md:gap-10 lg:grid-cols-[1fr_auto] lg:gap-12">
            <div className="space-y-4 md:space-y-6 lg:space-y-8">
              <p className="max-w-5xl text-2xl font-medium leading-snug text-neutral-50 sm:text-3xl md:text-5xl lg:text-6xl 2xl:text-7xl">
                {liveModule.tvPrompt}
              </p>
              <p className="max-w-4xl text-lg text-neutral-300 sm:text-xl md:text-3xl 2xl:text-4xl">
                <span className="text-neutral-500">Physical evidence · </span>
                {liveModule.physicalSample}
              </p>
            </div>
            <div className="min-w-0 md:min-w-72">
              <RoomTimer
                endsAt={session.timerEndsAt}
                label={session.timerLabel}
                large
              />
            </div>
          </div>
        ) : null}
      </main>

      <footer className="px-5 pb-6 text-sm text-neutral-500 sm:px-8 sm:text-base md:px-10 md:pb-10 md:text-xl lg:px-12 2xl:px-16 2xl:text-2xl">
        Not certification · Instructor-led equipment · Infra24 workshop engine
      </footer>
    </div>
  )
}

export function useLiveSessionPolling(
  code: string,
  initial: WorkshopLiveSession,
) {
  const [session, setSession] = useState(initial);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const next = await fetchSession(code);
    if (!next) {
      setError("Could not refresh session");
      return null;
    }
    setSession(next);
    setError(null);
    return next;
  }, [code]);

  useEffect(() => {
    const id = window.setInterval(() => {
      void refresh();
    }, 1500);
    return () => window.clearInterval(id);
  }, [refresh]);

  return useMemo(
    () => ({ session, setSession, error, refresh }),
    [session, error, refresh],
  );
}
