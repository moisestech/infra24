import type { Metadata } from "next";
import Link from "next/link";
import { StartSessionButton } from "@/components/workshop-engine/StartSessionButton";
import { JoinSessionForm } from "@/components/workshop-engine/JoinSessionForm";
import { WorkshopModuleCard } from "@/components/workshop-engine/SessionJoinCard";
import { WorkshopImagePlaceholder } from "@/components/workshop-engine/WorkshopVisuals";
import { BookOpen, MonitorPlay, Route, ShieldCheck } from "lucide-react";
import {
  RESIN_PRINTING_MODULES,
  RESIN_PRINTING_WORKSHOP,
} from "@/lib/workshop-engine/resin-printing";

export const metadata: Metadata = {
  title: "Intro to 3D Resin Printing for Artists",
  description: RESIN_PRINTING_WORKSHOP.promise,
  alternates: { canonical: "/workshop/resin-printing" },
};

export default function ResinPrintingHubPage() {
  const w = RESIN_PRINTING_WORKSHOP;

  return (
    <div className="space-y-14">
      <section className="grid items-center gap-8 lg:grid-cols-[1.05fr_.95fr]">
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2 text-xs font-medium uppercase tracking-[0.12em] text-slate-600">
            <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1">
              {w.durationMinutes} min
            </span>
            <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1">
              Up to {w.capacity}
            </span>
            <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1">
              Beginner
            </span>
          </div>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.035em] text-slate-950 md:text-6xl md:leading-[1.02]">
            {w.title}
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-slate-700">
            {w.promise}
          </p>
          <p className="max-w-2xl rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950">
            <span className="font-semibold">Workshop boundary:</span>{" "}
            {w.expectationStatement}
          </p>
          <p className="text-sm text-slate-600">
            Facilitators: {w.facilitators.join(" · ")} · One curriculum,
            configured separately for Oolite and DCC.MIAMI at Bakehouse.
          </p>
        </div>
        <WorkshopImagePlaceholder
          moduleId="welcome"
          title={RESIN_PRINTING_WORKSHOP.heroMedia?.title ?? 'Workshop hero image'}
          shot={
            RESIN_PRINTING_WORKSHOP.heroMedia?.shot ??
            'Printer, cured samples, and the staged workflow arranged in the Digital Lab. No people or text.'
          }
          altIntent={
            RESIN_PRINTING_WORKSHOP.heroMedia?.altIntent ??
            'Resin printer and finished artist samples in the workshop space.'
          }
          aspect={RESIN_PRINTING_WORKSHOP.heroMedia?.aspect ?? 'landscape 16:10'}
          assetId={RESIN_PRINTING_WORKSHOP.heroMedia?.assetId}
          minSize={RESIN_PRINTING_WORKSHOP.heroMedia?.minSize}
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-wrap items-end gap-3">
          <StartSessionButton label="Start live session (facilitator)" />
          <Link
            href="/workshop/resin-printing/modules/welcome"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 transition hover:border-slate-950"
          >
            Browse modules
          </Link>
          <JoinSessionForm />
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        {[
          {
            Icon: MonitorPlay,
            title: "Follow the room",
            text: "TV and participant pages stay synchronized with the facilitator.",
          },
          {
            Icon: Route,
            title: "Choose your pace",
            text: "Follow class, move independently, then rejoin the live position.",
          },
          {
            Icon: ShieldCheck,
            title: "Safety remains shared",
            text: "Required safety moments interrupt the flow and stay instructor-led.",
          },
        ].map(({ Icon, title, text }) => (
          <div
            key={title}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <Icon aria-hidden="true" className="h-5 w-5 text-cyan-700" />
            <h2 className="mt-4 font-semibold text-slate-950">{title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              {text}
            </p>
          </div>
        ))}
      </section>

      <section className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">
            Curriculum
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Nine modules, one material workflow
          </h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            Color identifies the kind of attention each module needs; every
            color is paired with an icon and phase label.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {RESIN_PRINTING_MODULES.map((m) => (
            <WorkshopModuleCard
              key={m.id}
              href={`/workshop/resin-printing/modules/${m.slug}`}
              moduleId={m.id}
              order={m.order}
              title={m.title}
              minutes={m.estimatedMinutes}
              promise={m.promise}
              safetyLevel={m.safetyLevel}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Link
          className="group rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-white p-5"
          href="/workshop/resin-printing/venue/oolite"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-800">
            Pilot venue · teal
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-950 group-hover:underline">
            Oolite Digital Lab
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Studio 106 equipment, zones, contacts, and appointment pathway.
          </p>
        </Link>
        <Link
          className="group rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white p-5"
          href="/workshop/resin-printing/venue/bakehouse"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-900">
            DCC.MIAMI · copper
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-950 group-hover:underline">
            Bakehouse configuration
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Same curriculum with venue-specific equipment and safety details.
          </p>
        </Link>
      </section>

      <section className="flex flex-wrap gap-3 border-t border-slate-200 pt-6 text-sm">
        <Link
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 hover:border-slate-950"
          href="/workshop/resin-printing/resources"
        >
          Resources
        </Link>
        <Link
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 hover:border-slate-950"
          href="/workshop/resin-printing/booklet"
        >
          <BookOpen aria-hidden="true" className="h-4 w-4" />
          Booklet
        </Link>
      </section>
    </div>
  );
}
