"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  LivePositionBanner,
  PaceSelector,
  KnowledgeCheck,
} from "@/components/workshop-engine/ParticipantControls";
import {
  BookletReference,
  ModuleHeader,
  SafetyBanner,
} from "@/components/workshop-engine/ModuleChrome";
import { ModuleActivity } from "@/components/workshop-engine/ModuleActivity";
import { SafetyGate } from "@/components/workshop-engine/SafetyAndTimer";
import {
  ModuleRelatedMediaStrip,
  ModuleTutorialVideoSlot,
  ModuleVisualPlaceholder,
} from "@/components/workshop-engine/WorkshopVisuals";
import { ModuleLayout } from "@/components/workshop-engine/ModuleLayout";
import {
  DiscussionPrompt,
  FacilitatorCues,
  KeyIdeas,
  LearningOutcome,
  PhysicalEvidence,
  TipCallout,
  WatchNotice,
} from "@/components/workshop-engine/TeachingSurfaces";
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

/**
 * Module anatomy (V02):
 * 1 identity → 2 outcome → 3 safety → 4 visual → 5 watch → 6 ideas →
 * 7 activity → 8 discussion → 9 booklet (rail) → 10 knowledge →
 * 11 physical evidence (rail) → 12 facilitator cues → 13 nav (page-level)
 */
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
        banner={workshopModule.banner}
        bannerPriority
      />
      <LearningOutcome>{workshopModule.promise}</LearningOutcome>

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
      <ModuleTutorialVideoSlot moduleId={workshopModule.id} />
      <WatchNotice>{workshopModule.watchNotice}</WatchNotice>
      <KeyIdeas ideas={workshopModule.keyIdeas} />
      {workshopModule.tips?.length ? (
        <TipCallout tips={workshopModule.tips} />
      ) : null}
      <ModuleRelatedMediaStrip moduleId={workshopModule.id} />
      <ModuleActivity activity={workshopModule.activity} />
      {workshopModule.discussionPrompt ? (
        <DiscussionPrompt prompt={workshopModule.discussionPrompt} />
      ) : null}

      {workshopModule.knowledgeCheck ? (
        <KnowledgeCheck
          prompt={workshopModule.knowledgeCheck.prompt}
          options={workshopModule.knowledgeCheck.options}
        />
      ) : null}

      {showFacilitatorNotes ? (
        <div className="lg:hidden">
          <FacilitatorCues notes={workshopModule.facilitatorNotes} />
        </div>
      ) : null}
    </>
  );

  const rail = (
    <>
      <PhysicalEvidence>{workshopModule.physicalSample}</PhysicalEvidence>
      {workshopModule.bookletRefs.map((ref) => (
        <BookletReference
          key={`${ref.bookletId}-${ref.sectionTitle}-${ref.startPage ?? "x"}`}
          sectionTitle={ref.sectionTitle}
          startPage={ref.startPage}
          endPage={ref.endPage}
          mappingPending={ref.mappingPending}
          status={ref.status}
          note={ref.note}
          pagePreviewHref={ref.pagePreviewHref}
        />
      ))}
      {showFacilitatorNotes ? (
        <div className="hidden lg:block">
          <FacilitatorCues notes={workshopModule.facilitatorNotes} />
        </div>
      ) : null}
    </>
  );

  return (
    <article>
      <ModuleLayout main={<div className={weSpace.stack}>{main}</div>} rail={rail} />
    </article>
  );
}
