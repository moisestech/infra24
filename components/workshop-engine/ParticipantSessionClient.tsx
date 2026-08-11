"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  LivePositionBanner,
  PaceSelector,
} from "@/components/workshop-engine/ParticipantControls";
import {
  BookletReference,
  LearningPromise,
  ModuleHeader,
  SafetyBanner,
} from "@/components/workshop-engine/ModuleChrome";
import { ModuleActivity } from "@/components/workshop-engine/ModuleActivity";
import { KnowledgeCheck } from "@/components/workshop-engine/ParticipantControls";
import { SafetyGate } from "@/components/workshop-engine/SafetyAndTimer";
import { ModuleVisualPlaceholder } from "@/components/workshop-engine/WorkshopVisuals";
import { ModuleLayout } from "@/components/workshop-engine/ModuleLayout";
import { useLiveSessionPolling } from "@/components/workshop-engine/TvPresentationClient";
import {
  weShell,
  weSpace,
  weTouch,
  weType,
} from "@/components/workshop-engine/responsive";
import {
  RESIN_PRINTING_MODULES,
  getResinModuleById,
  getResinModuleNav,
} from "@/lib/workshop-engine/resin-printing";
import type {
  PaceMode,
  WorkshopLiveSession,
  WorkshopModule,
} from "@/lib/workshop-engine/types";
import { cn } from "@/lib/utils";
import { ClipboardList, Eye, Lightbulb, Mic } from "lucide-react";

const PACE_KEY = "infra24-resin-pace";
const SAFETY_KEY = "infra24-resin-safety-gate";

export function ParticipantSessionClient({
  code,
  initialSession,
}: {
  code: string;
  initialSession: WorkshopLiveSession;
}) {
  const { session } = useLiveSessionPolling(code, initialSession);
  const [pace, setPace] = useState<PaceMode>("follow");
  const [selfSlug, setSelfSlug] = useState(RESIN_PRINTING_MODULES[0].slug);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(PACE_KEY) as PaceMode | null;
    if (stored === "follow" || stored === "self-paced") setPace(stored);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(PACE_KEY, pace);
  }, [pace, ready]);

  const liveModule =
    getResinModuleById(session.liveModuleId) ?? RESIN_PRINTING_MODULES[0];
  const viewingSlug = pace === "follow" ? liveModule.slug : selfSlug;
  const currentModule = useMemo(
    () =>
      RESIN_PRINTING_MODULES.find((m) => m.slug === viewingSlug) ?? liveModule,
    [viewingSlug, liveModule],
  );

  useEffect(() => {
    if (pace !== "follow") return;
    if (liveModule.safetyLevel === "required") {
      setSelfSlug(liveModule.slug);
    }
  }, [pace, liveModule]);

  const nav = getResinModuleNav(currentModule.slug);

  function rejoin() {
    setPace("follow");
    setSelfSlug(liveModule.slug);
  }

  return (
    <div className={cn(weShell.width, weShell.pad, weShell.mainPy, weSpace.stack)}>
      <div className="space-y-3 md:space-y-4">
        <p className="text-[10px] font-medium uppercase tracking-wide text-neutral-500 sm:text-xs 2xl:text-sm">
          Session {session.joinCode}
        </p>
        <PaceSelector value={pace} onChange={setPace} />
        {pace === "self-paced" ? (
          <LivePositionBanner
            moduleTitle={liveModule.title}
            onRejoin={rejoin}
          />
        ) : (
          <LivePositionBanner moduleTitle={liveModule.title} />
        )}
      </div>

      <ModuleView
        workshopModule={currentModule}
        liveLabel={pace === "follow" ? "Following live" : "My pace"}
        showSafetyGate={currentModule.safetyLevel === "required"}
      />

      <div
        className={cn(
          "flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 pt-4",
          weType.label,
        )}
      >
        {pace === "self-paced" && nav.prev ? (
          <button
            type="button"
            className={cn(weTouch.button, "underline")}
            onClick={() => setSelfSlug(nav.prev!.slug)}
          >
            ← {nav.prev.title}
          </button>
        ) : (
          <span />
        )}
        {pace === "self-paced" && nav.next ? (
          <button
            type="button"
            className={cn(weTouch.button, "underline")}
            onClick={() => setSelfSlug(nav.next!.slug)}
          >
            {nav.next.title} →
          </button>
        ) : null}
      </div>

      <p className={cn(weType.label, "text-slate-500")}>
        <Link className="underline" href="/workshop/resin-printing">
          Workshop overview
        </Link>
        {" · "}
        Independent navigation never authorizes equipment operation.
      </p>
    </div>
  );
}

export function ModuleView({
  workshopModule,
  liveLabel,
  showSafetyGate,
  showFacilitatorNotes = false,
}: {
  workshopModule: WorkshopModule;
  liveLabel?: string;
  showSafetyGate?: boolean;
  showFacilitatorNotes?: boolean;
}) {
  const main = (
    <>
      <ModuleHeader
        order={workshopModule.order}
        moduleId={workshopModule.id}
        title={workshopModule.title}
        estimatedMinutes={workshopModule.estimatedMinutes}
        liveLabel={liveLabel}
        safetyLevel={workshopModule.safetyLevel}
      />
      <LearningPromise>{workshopModule.promise}</LearningPromise>

      {workshopModule.safetyNote ? (
        <SafetyBanner
          note={workshopModule.safetyNote}
          required={workshopModule.safetyLevel === "required"}
        />
      ) : null}

      {showSafetyGate ? (
        <SafetyGate
          note={
            workshopModule.safetyNote ??
            "Complete the safety check before continuing. Equipment stays instructor-led."
          }
          checklist={
            workshopModule.activity.kind === "checklist"
              ? workshopModule.activity.items
              : [
                  "I will not operate resin equipment independently tonight.",
                  "I know clean zone vs controlled zone.",
                  "I understand uncured resin requires PPE.",
                ]
          }
          storageKey={`${SAFETY_KEY}-${workshopModule.id}`}
        />
      ) : null}

      <ModuleVisualPlaceholder moduleId={workshopModule.id} />

      <section className={weSpace.stackTight}>
        <h2
          className={cn(
            weType.meta,
            "inline-flex items-center gap-2 text-cyan-800",
          )}
        >
          <Eye aria-hidden className="h-3.5 w-3.5 md:h-4 md:w-4" />
          Watch / notice
        </h2>
        <p className={cn(weType.body, "text-slate-800")}>
          {workshopModule.watchNotice}
        </p>
      </section>

      <section className={weSpace.stackTight}>
        <h2
          className={cn(
            weType.meta,
            "inline-flex items-center gap-2 text-indigo-800",
          )}
        >
          <Lightbulb aria-hidden className="h-3.5 w-3.5 md:h-4 md:w-4" />
          Key ideas
        </h2>
        <ul
          className={cn(
            weType.body,
            "list-disc space-y-1.5 pl-5 text-slate-800 md:space-y-2",
          )}
        >
          {workshopModule.keyIdeas.map((idea) => (
            <li key={idea}>{idea}</li>
          ))}
        </ul>
      </section>

      <ModuleActivity activity={workshopModule.activity} />

      {workshopModule.knowledgeCheck ? (
        <KnowledgeCheck
          prompt={workshopModule.knowledgeCheck.prompt}
          options={workshopModule.knowledgeCheck.options}
        />
      ) : null}

      {showFacilitatorNotes ? (
        <aside
          className={cn(
            "rounded-xl border border-sky-200 bg-sky-50 text-sky-950 lg:hidden",
            weSpace.cardPad,
            weType.body,
          )}
        >
          <p className="inline-flex items-center gap-2 font-semibold md:text-lg 2xl:text-xl">
            <Mic aria-hidden className="h-4 w-4 text-sky-800 md:h-5 md:w-5" />
            Facilitator cues
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 md:mt-3">
            {workshopModule.facilitatorNotes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </aside>
      ) : null}
    </>
  );

  const rail = (
    <>
      <section
        className={cn(
          "rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-950",
          weSpace.cardPad,
          weType.body,
        )}
      >
        <p className="inline-flex items-center gap-2 font-semibold">
          <ClipboardList
            aria-hidden
            className="h-4 w-4 shrink-0 text-emerald-800 md:h-5 md:w-5"
          />
          Physical evidence
        </p>
        <p className="mt-1.5 text-emerald-900/90">
          {workshopModule.physicalSample}
        </p>
      </section>

      {workshopModule.bookletRefs.map((ref) => (
        <BookletReference
          key={`${ref.bookletId}-${ref.sectionTitle}-${ref.startPage ?? "x"}`}
          sectionTitle={ref.sectionTitle}
          startPage={ref.startPage}
          endPage={ref.endPage}
          mappingPending={ref.mappingPending}
        />
      ))}

      {showFacilitatorNotes ? (
        <aside
          className={cn(
            "hidden rounded-xl border border-sky-200 bg-sky-50 text-sky-950 lg:block",
            weSpace.cardPad,
            weType.body,
          )}
        >
          <p className="inline-flex items-center gap-2 font-semibold md:text-lg 2xl:text-xl">
            <Mic aria-hidden className="h-4 w-4 text-sky-800 md:h-5 md:w-5" />
            Facilitator cues
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 md:mt-3">
            {workshopModule.facilitatorNotes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </aside>
      ) : null}
    </>
  );

  return (
    <article>
      <ModuleLayout main={<div className={weSpace.stack}>{main}</div>} rail={rail} />
    </article>
  );
}
