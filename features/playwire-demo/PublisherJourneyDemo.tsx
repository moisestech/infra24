'use client';

import { useCallback, useMemo, useState } from 'react';
import { publisherPersonas } from '@/lib/playwire/publisherPersonas';
import {
  computeParmmMaturity,
  defaultParmmAnswers,
  parmmDimensions,
  recommendServiceModel,
} from '@/lib/playwire/parmmDimensions';
import { metricsByPersona } from '@/lib/playwire/mockMetrics';
import type { JourneyStep, ParmmAnswer, PublisherPersonaId, ParmmScore } from '@/lib/playwire/types';
import { FlexFormatGallery } from './FlexFormatGallery';
import { PublisherFaqPanel } from './PublisherFaqPanel';
import { RampMetricsDashboard } from './RampMetricsDashboard';
import { ServiceModelCard } from './ServiceModelCard';
import { pw } from './playwireTheme';
import { cn } from '@/lib/utils';

const STEPS: { id: JourneyStep; label: string }[] = [
  { id: 'persona', label: 'Publisher' },
  { id: 'parmm', label: 'PARMM' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'faq', label: 'FAQ' },
];

function formatPageviews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M/mo`;
  return `${(n / 1_000).toFixed(0)}K/mo`;
}

export function PublisherJourneyDemo() {
  const [step, setStep] = useState<JourneyStep>('persona');
  const [personaId, setPersonaId] = useState<PublisherPersonaId>('studyHub');
  const [answers, setAnswers] = useState<ParmmAnswer[]>(defaultParmmAnswers);

  const persona = publisherPersonas.find((p) => p.id === personaId)!;
  const maturity = useMemo(() => computeParmmMaturity(answers), [answers]);
  const opsScore = answers.find((a) => a.dimensionId === 'ops-model')?.score;
  const serviceModel = useMemo(
    () => recommendServiceModel(maturity, opsScore),
    [maturity, opsScore],
  );
  const metrics = metricsByPersona[personaId];

  const setScore = useCallback((dimensionId: string, score: ParmmScore) => {
    setAnswers((prev) => prev.map((a) => (a.dimensionId === dimensionId ? { ...a, score } : a)));
  }, []);

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  const goNext = () => {
    const next = STEPS[stepIndex + 1];
    if (next) setStep(next.id);
  };

  const goPrev = () => {
    const prev = STEPS[stepIndex - 1];
    if (prev) setStep(prev.id);
  };

  return (
    <section id="publisher-demo" className="scroll-mt-14 pt-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#e85d4c]">Interactive demo</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950 dark:text-stone-50">
        Publisher questions RAMP would answer
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-stone-600 dark:text-stone-400">
        A concept walkthrough — pick a publisher profile, score maturity (PARMM-lite), explore a mock revenue
        dashboard, and browse the FAQs publishers ask before switching stacks.
      </p>

      <div className={cn('mt-8 p-4 sm:p-6', pw.wrapper)} data-theme="playwire">
        {/* Step indicator */}
        <nav aria-label="Demo steps" className="mb-6 flex flex-wrap gap-2">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStep(s.id)}
              className={cn(
                'flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition',
                step === s.id ? pw.stepActive : i < stepIndex ? pw.stepDone : pw.stepIdle,
              )}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/10 text-[10px]">
                {i + 1}
              </span>
              {s.label}
            </button>
          ))}
        </nav>

        {step === 'persona' && (
          <div>
            <h3 className={cn('text-lg font-semibold', pw.navy)}>Choose a publisher profile</h3>
            <p className={cn('mt-1 text-sm', pw.navyMuted)}>
              Three illustrative verticals — metrics and pain points update downstream.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {publisherPersonas.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPersonaId(p.id)}
                  className={cn(
                    pw.card,
                    'p-4 text-left transition',
                    personaId === p.id && pw.cardActive,
                  )}
                >
                  <p className={cn('text-xs font-semibold uppercase tracking-wide', pw.accent)}>{p.vertical}</p>
                  <p className={cn('mt-1 font-semibold', pw.navy)}>{p.name}</p>
                  <p className={cn('mt-1 text-xs', pw.navyMuted)}>{formatPageviews(p.monthlyPageviews)}</p>
                  <p className={cn('mt-2 text-xs leading-relaxed', pw.navyMuted)}>{p.description}</p>
                  <ul className="mt-2 space-y-1">
                    {p.painPoints.slice(0, 2).map((pain) => (
                      <li key={pain} className={cn('text-xs', pw.navyMuted)}>
                        — {pain}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'parmm' && (
          <div>
            <h3 className={cn('text-lg font-semibold', pw.navy)}>PARMM-lite assessment</h3>
            <p className={cn('mt-1 text-sm', pw.navyMuted)}>
              Six dimensions inspired by Playwire&apos;s Publisher Ad Revenue Maturity Model — rate each 1–5.
            </p>
            <div className="mt-4 space-y-4">
              {parmmDimensions.map((dim) => {
                const score = answers.find((a) => a.dimensionId === dim.id)?.score ?? 3;
                return (
                  <div key={dim.id} className={cn(pw.card, 'p-4')}>
                    <p className={cn('text-xs font-semibold uppercase tracking-wide', pw.accent)}>{dim.label}</p>
                    <p className={cn('mt-1 text-sm font-medium', pw.navy)}>{dim.question}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {([1, 2, 3, 4, 5] as const).map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setScore(dim.id, n)}
                          className={cn(
                            'h-9 w-9 rounded-lg text-sm font-semibold transition',
                            score === n ? pw.accentBg : 'bg-[#e8edf5] text-[#4a5f7f] dark:bg-[#1e2d4a] dark:text-[#94a3b8]',
                          )}
                          aria-label={`${dim.label} score ${n}`}
                        >
                          {n}
                        </button>
                      ))}
                      <span className={cn('ml-2 hidden text-xs sm:inline', pw.navyMuted)}>
                        1 = {dim.lowLabel} · 5 = {dim.highLabel}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6">
              <ServiceModelCard model={serviceModel} maturity={maturity} />
            </div>
          </div>
        )}

        {step === 'dashboard' && (
          <div>
            <h3 className={cn('text-lg font-semibold', pw.navy)}>Mock RAMP revenue dashboard</h3>
            <p className={cn('mt-1 text-sm', pw.navyMuted)}>
              Illustrative real-time metrics for {persona.name} — device tabs, format mixer, bidder table.
            </p>
            <div className="mt-4">
              <RampMetricsDashboard baseMetrics={metrics} personaName={persona.name} />
            </div>
            <div className="mt-6">
              <p className={cn('mb-3 text-sm font-semibold', pw.navy)}>Flex Suite formats</p>
              <FlexFormatGallery />
            </div>
          </div>
        )}

        {step === 'faq' && (
          <div>
            <h3 className={cn('text-lg font-semibold', pw.navy)}>Publisher FAQ</h3>
            <p className={cn('mt-1 text-sm', pw.navyMuted)}>
              Common questions before onboarding — sourced from Playwire&apos;s public publisher positioning.
            </p>
            <div className="mt-4">
              <PublisherFaqPanel />
            </div>
          </div>
        )}

        {/* Nav buttons */}
        <div className="mt-6 flex flex-wrap justify-between gap-3">
          <button
            type="button"
            onClick={goPrev}
            disabled={stepIndex === 0}
            className={cn(
              'rounded-lg border px-4 py-2 text-sm font-medium transition disabled:opacity-40',
              'border-[#1a2b4a]/20 text-[#1a2b4a] dark:border-[#2d4a7c]/40 dark:text-[#e8edf5]',
            )}
          >
            Back
          </button>
          {stepIndex < STEPS.length - 1 ? (
            <button type="button" onClick={goNext} className={cn('rounded-lg px-4 py-2 text-sm font-semibold', pw.accentBg)}>
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setStep('persona')}
              className={cn('rounded-lg px-4 py-2 text-sm font-semibold', pw.accentBg)}
            >
              Restart demo
            </button>
          )}
        </div>

        <p className={pw.disclaimer}>
          Concept demonstration built by Moises Sanabria for application purposes. Not affiliated with or endorsed by
          Playwire. Metrics, UI, and recommendations are illustrative.
        </p>
      </div>
    </section>
  );
}
