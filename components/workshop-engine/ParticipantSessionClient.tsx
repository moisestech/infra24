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
import { useLiveSessionPolling } from "@/components/workshop-engine/TvPresentationClient";
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

  // Safety-critical live module interrupts Follow class.
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
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
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

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 pt-4 text-sm">
        {pace === "self-paced" && nav.prev ? (
          <button
            type="button"
            className="underline"
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
            className="underline"
            onClick={() => setSelfSlug(nav.next!.slug)}
          >
            {nav.next.title} →
          </button>
        ) : null}
      </div>

      <p className="text-xs text-neutral-500">
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
  return (
    <article className="space-y-6">
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

      <section className="space-y-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Watch / notice
        </h2>
        <p className="text-neutral-800">{workshopModule.watchNotice}</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Key ideas
        </h2>
        <ul className="list-disc space-y-1 pl-5 text-neutral-800">
          {workshopModule.keyIdeas.map((idea) => (
            <li key={idea}>{idea}</li>
          ))}
        </ul>
      </section>

      <ModuleActivity activity={workshopModule.activity} />

      <section className="rounded-md border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700">
        <span className="font-medium text-neutral-950">
          Physical evidence:{" "}
        </span>
        {workshopModule.physicalSample}
      </section>

      {workshopModule.bookletRefs.map((ref) => (
        <BookletReference
          key={`${ref.bookletId}-${ref.sectionTitle}`}
          sectionTitle={ref.sectionTitle}
          startPage={ref.startPage}
          endPage={ref.endPage}
          mappingPending={ref.mappingPending}
        />
      ))}

      {workshopModule.knowledgeCheck ? (
        <KnowledgeCheck
          prompt={workshopModule.knowledgeCheck.prompt}
          options={workshopModule.knowledgeCheck.options}
        />
      ) : null}

      {showFacilitatorNotes ? (
        <aside className="rounded-md border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-950">
          <p className="font-medium">Facilitator cues</p>
          <ul className="mt-2 list-disc pl-5">
            {workshopModule.facilitatorNotes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </aside>
      ) : null}
    </article>
  );
}
