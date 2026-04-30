import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { PageHero, Section } from '@/components/marketing/cdc';
import { AllocationHorizontalBar } from '@/components/marketing/knight/budget/AllocationHorizontalBar';
import { BudgetAllocationStrip } from '@/components/marketing/knight/budget/BudgetAllocationStrip';
import { BudgetCategoryColorLegend } from '@/components/marketing/knight/budget/BudgetCategoryColorLegend';
import { BudgetDetailAccordion } from '@/components/marketing/knight/budget/BudgetDetailAccordion';
import { BudgetEmphasisCallout } from '@/components/marketing/knight/budget/BudgetEmphasisCallout';
import { BudgetKpiCards } from '@/components/marketing/knight/budget/BudgetKpiCards';
import { BudgetPhaseTimeline } from '@/components/marketing/knight/budget/BudgetPhaseTimeline';
import { BudgetSteppedFlow } from '@/components/marketing/knight/budget/BudgetSteppedFlow';
import { BudgetTransparencyCTA } from '@/components/marketing/knight/budget/BudgetTransparencyCTA';
import { FundingSourcesSplitBar } from '@/components/marketing/knight/budget/FundingSourcesSplitBar';
import { KnightAllocationPanel } from '@/components/marketing/knight/budget/KnightAllocationPanel';
import { MatchSourcesPanel } from '@/components/marketing/knight/budget/MatchSourcesPanel';
import { MeasurementDashboardPreview } from '@/components/marketing/knight/budget/MeasurementDashboardPreview';
import { NetworkImpactSection } from '@/components/marketing/knight/budget/NetworkImpactSection';
import { BudgetSectionHeader } from '@/components/marketing/knight/budget/budget-section-meta';
import { KnightPacketBanner } from '@/components/marketing/knight/KnightPacketBanner';
import { KnightPacketNav } from '@/components/marketing/knight/KnightPacketNav';
import { getCdcBreadcrumbs } from '@/lib/cdc/routes';
import { cdcPageMetadata } from '@/lib/cdc/metadata';
import {
  formatUsd,
  knightBudgetComputedTotals,
  knightBudgetHeroIntro,
  knightBudgetNavItems,
  knightBudgetSummary,
} from '@/lib/marketing/knight-budget';
import { knightFoundationLogoSrc } from '@/lib/marketing/knight-packet';

const FundingSourcesDonut = dynamic(
  () =>
    import('@/components/marketing/knight/budget/FundingSourcesDonut').then((m) => ({
      default: m.FundingSourcesDonut,
    })),
  { ssr: false, loading: () => <ChartFallback /> }
);

function ChartFallback() {
  return (
    <div className="flex h-[280px] items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 text-sm text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900/50 dark:text-neutral-400">
      Loading chart…
    </div>
  );
}

function Callout({ children }: { children: ReactNode }) {
  return (
    <blockquote className="mt-6 border-l-4 border-teal-500 pl-4 text-sm font-medium italic leading-relaxed text-neutral-800 dark:border-teal-600 dark:text-neutral-200">
      {children}
    </blockquote>
  );
}

const path = '/knight/budget';

export const metadata: Metadata = cdcPageMetadata(path);

export default function KnightBudgetPage() {
  const s = knightBudgetSummary;
  const sc = s.sectionCopy;
  const call = s.sectionCallouts;

  return (
    <>
      <section id="budget-top" className="scroll-mt-28">
        <KnightPacketBanner />
        <PageHero
          eyebrow="Knight pilot packet"
          title={s.framingTitle}
          description={s.framingLead}
          breadcrumbs={getCdcBreadcrumbs(path)}
          titleTone="knight"
          surface="solid"
          foundationLogoSrc={knightFoundationLogoSrc}
          className="border-b border-neutral-200 dark:border-neutral-800"
        />
      </section>

      <KnightPacketNav items={knightBudgetNavItems} />

      <Section
        id="overview"
        className="scroll-mt-24 border-t border-neutral-200/80 bg-white dark:border-neutral-800 dark:bg-neutral-950"
        backdropClassName="bg-[radial-gradient(ellipse_90%_60%_at_100%_-20%,rgba(16,185,129,0.12),transparent_55%)] dark:bg-[radial-gradient(ellipse_90%_60%_at_100%_-20%,rgba(45,212,191,0.12),transparent_55%)]"
      >
        <BudgetSectionHeader sectionKey="overview" eyebrow="Pilot" title="Overview & KPIs" />
        <div className="mt-8 max-w-3xl space-y-4 text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
          <p>{knightBudgetHeroIntro[0]}</p>
          <p>{knightBudgetHeroIntro[1]}</p>
        </div>
        <div className="mt-10">
          <BudgetKpiCards />
        </div>
      </Section>

      <Section
        id="funding"
        className="scroll-mt-24 border-t border-neutral-200/80 bg-[#fafafa] dark:border-neutral-800 dark:bg-neutral-900/40"
        backdropClassName="bg-[radial-gradient(ellipse_80%_50%_at_0%_0%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(ellipse_80%_50%_at_0%_0%,rgba(96,165,250,0.12),transparent_50%)]"
      >
        <BudgetSectionHeader sectionKey="funding" eyebrow="Sources" title={sc.fundingTitle} />
        <div className="mt-6 max-w-3xl space-y-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {sc.fundingBody.map((p, i) => (
            <p key={`funding-${i}`}>{p}</p>
          ))}
        </div>
        <Callout>{call.funding}</Callout>

        <div className="mt-10 space-y-8">
          <FundingSourcesSplitBar />
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">Funding sources</h3>
              <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                Knight Foundation and match / in-kind / other support each represent half of the pilot envelope.
              </p>
              <div className="mt-6">
                <FundingSourcesDonut />
              </div>
              <div className="mt-6 overflow-x-auto rounded-xl border border-neutral-200/90 bg-white text-sm dark:border-neutral-700 dark:bg-neutral-950">
                <table className="w-full min-w-[280px] border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50 text-left dark:border-neutral-700 dark:bg-neutral-900/80">
                      <th className="px-4 py-2 font-medium text-neutral-700 dark:text-neutral-300">Source</th>
                      <th className="px-4 py-2 text-right font-medium text-neutral-700 dark:text-neutral-300">Amount</th>
                      <th className="px-4 py-2 text-right font-medium text-neutral-700 dark:text-neutral-300">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-neutral-100 dark:border-neutral-800">
                      <td className="px-4 py-2 text-neutral-800 dark:text-neutral-200">Knight Foundation request</td>
                      <td className="px-4 py-2 text-right tabular-nums">{formatUsd(s.knightFoundationAskUsd)}</td>
                      <td className="px-4 py-2 text-right tabular-nums">50%</td>
                    </tr>
                    <tr className="border-b border-neutral-100 dark:border-neutral-800">
                      <td className="px-4 py-2 text-neutral-800 dark:text-neutral-200">{s.counterpartLabel}</td>
                      <td className="px-4 py-2 text-right tabular-nums">{formatUsd(s.counterpartFundingUsd)}</td>
                      <td className="px-4 py-2 text-right tabular-nums">50%</td>
                    </tr>
                    <tr className="bg-neutral-50/90 font-medium dark:bg-neutral-900/90">
                      <td className="px-4 py-2 text-neutral-900 dark:text-neutral-100">Total</td>
                      <td className="px-4 py-2 text-right tabular-nums">{formatUsd(s.totalProjectUsd)}</td>
                      <td className="px-4 py-2 text-right tabular-nums">100%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="space-y-6">
              <KnightAllocationPanel />
              <MatchSourcesPanel />
            </div>
          </div>
        </div>
      </Section>

      <Section
        id="allocation"
        className="scroll-mt-24 border-t border-neutral-200/80 bg-white dark:border-neutral-800 dark:bg-neutral-950"
        backdropClassName="bg-[radial-gradient(ellipse_70%_50%_at_100%_100%,rgba(139,92,246,0.1),transparent_55%)] dark:bg-[radial-gradient(ellipse_70%_50%_at_100%_100%,rgba(167,139,250,0.12),transparent_55%)]"
      >
        <BudgetSectionHeader sectionKey="allocation" eyebrow="Allocation" title={sc.allocationTitle} />
        <div className="mt-6 max-w-3xl space-y-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {sc.allocationBody.map((p, i) => (
            <p key={`allocation-${i}`}>{p}</p>
          ))}
        </div>
        <Callout>{call.allocation}</Callout>
        <div className="mt-10">
          <BudgetEmphasisCallout />
        </div>
        <div className="mt-10 space-y-8">
          <BudgetCategoryColorLegend />
          <BudgetAllocationStrip />
          <AllocationHorizontalBar />
        </div>
      </Section>

      <Section
        id="impact-flow"
        className="scroll-mt-24 border-t border-neutral-200/80 bg-[#fafafa] dark:border-neutral-800 dark:bg-neutral-900/40"
        backdropClassName="bg-[radial-gradient(ellipse_80%_45%_at_50%_-10%,rgba(20,184,166,0.11),transparent_55%)] dark:bg-[radial-gradient(ellipse_80%_45%_at_50%_-10%,rgba(45,212,191,0.1),transparent_55%)]"
      >
        <BudgetSectionHeader sectionKey="impactFlow" eyebrow="Theory of change" title={sc.impactFlowTitle} />
        <div className="mt-6 max-w-3xl space-y-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {sc.impactFlowBody.map((p, i) => (
            <p key={`impact-${i}`}>{p}</p>
          ))}
        </div>
        <Callout>{call.impactFlow}</Callout>
        <div className="mt-10">
          <BudgetSteppedFlow />
        </div>
      </Section>

      <Section
        id="network"
        className="scroll-mt-24 border-t border-neutral-200/80 bg-white dark:border-neutral-800 dark:bg-neutral-950"
        backdropClassName="bg-[radial-gradient(ellipse_65%_55%_at_0%_100%,rgba(59,130,246,0.09),transparent_55%)] dark:bg-[radial-gradient(ellipse_65%_55%_at_0%_100%,rgba(96,165,250,0.12),transparent_55%)]"
      >
        <BudgetSectionHeader sectionKey="network" eyebrow="Targets" title={sc.networkTitle} />
        <div className="mt-6 max-w-3xl space-y-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {sc.networkBody.map((p, i) => (
            <p key={`network-${i}`}>{p}</p>
          ))}
        </div>
        <Callout>{call.network}</Callout>
        <div className="mt-10">
          <NetworkImpactSection />
        </div>
      </Section>

      <Section
        id="timeline"
        className="scroll-mt-24 border-t border-neutral-200/80 bg-[#fafafa] dark:border-neutral-800 dark:bg-neutral-900/40"
        backdropClassName="bg-[radial-gradient(ellipse_75%_50%_at_50%_110%,rgba(245,158,11,0.1),transparent_55%)] dark:bg-[radial-gradient(ellipse_75%_50%_at_50%_110%,rgba(251,191,36,0.1),transparent_55%)]"
      >
        <BudgetSectionHeader sectionKey="timeline" eyebrow="Year one" title={sc.timelineTitle} />
        <div className="mt-6 max-w-3xl space-y-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {sc.timelineBody.map((p, i) => (
            <p key={`timeline-${i}`}>{p}</p>
          ))}
        </div>
        <Callout>{call.timeline}</Callout>
        <div className="mt-10">
          <BudgetPhaseTimeline />
        </div>
      </Section>

      <Section
        id="measurement"
        className="scroll-mt-24 border-t border-neutral-200/80 bg-white dark:border-neutral-800 dark:bg-neutral-950"
        backdropClassName="bg-[radial-gradient(ellipse_70%_50%_at_100%_0%,rgba(6,182,212,0.1),transparent_55%)] dark:bg-[radial-gradient(ellipse_70%_50%_at_100%_0%,rgba(34,211,238,0.11),transparent_55%)]"
      >
        <BudgetSectionHeader sectionKey="measurement" eyebrow="Evidence" title={sc.measurementTitle} />
        <div className="mt-6 max-w-3xl space-y-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {sc.measurementBody.map((p, i) => (
            <p key={`measurement-${i}`}>{p}</p>
          ))}
        </div>
        <Callout>{call.measurement}</Callout>
        <div className="mt-8">
          <MeasurementDashboardPreview />
        </div>
      </Section>

      <Section
        id="public-value"
        className="scroll-mt-24 border-t border-neutral-200/80 bg-[#fafafa] dark:border-neutral-800 dark:bg-neutral-900/40"
        backdropClassName="bg-[radial-gradient(ellipse_80%_55%_at_0%_0%,rgba(16,185,129,0.09),transparent_60%)] dark:bg-[radial-gradient(ellipse_80%_55%_at_0%_0%,rgba(52,211,153,0.1),transparent_60%)]"
      >
        <BudgetSectionHeader sectionKey="publicValue" eyebrow="Civic" title={sc.publicValueTitle} />
        <div className="mt-6 max-w-3xl space-y-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {sc.publicValueBody.map((p, i) => (
            <p key={`public-${i}`}>{p}</p>
          ))}
        </div>
        <Callout>{call.publicValue}</Callout>
      </Section>

      <Section
        id="detail"
        className="scroll-mt-24 border-t border-neutral-200/80 bg-white dark:border-neutral-800 dark:bg-neutral-950"
        backdropClassName="bg-[radial-gradient(ellipse_60%_45%_at_50%_50%,rgba(148,163,184,0.12),transparent_65%)] dark:bg-[radial-gradient(ellipse_60%_45%_at_50%_50%,rgba(148,163,184,0.14),transparent_65%)]"
      >
        <BudgetSectionHeader sectionKey="detail" eyebrow="Line items" title={sc.detailTitle} />
        <div className="mt-6 max-w-3xl space-y-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {sc.detailIntro.map((p, i) => (
            <p key={`detail-${i}`}>{p}</p>
          ))}
        </div>
        <blockquote className="mt-6 border-l-4 border-neutral-400 pl-4 text-sm font-medium text-neutral-800 dark:border-neutral-600 dark:text-neutral-200">
          {sc.detailTableQuote}
        </blockquote>
        <p className="mt-4 text-xs text-neutral-600 dark:text-neutral-400">
          Totals stay visible on each category row; expand to see every line item and subtotal table.
        </p>
        <div className="mt-10">
          <BudgetDetailAccordion />
        </div>
        <p className="mt-10 max-w-3xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{s.dataNote}</p>
        <p className="mt-3 max-w-3xl text-sm text-neutral-500 dark:text-neutral-500">
          Rolled totals from line items:{' '}
          <strong className="font-medium text-neutral-800 dark:text-neutral-200">
            {formatUsd(knightBudgetComputedTotals.totalUsd)}
          </strong>{' '}
          pilot /{' '}
          <strong className="font-medium text-neutral-800 dark:text-neutral-200">
            {formatUsd(knightBudgetComputedTotals.knightUsd)}
          </strong>{' '}
          attributed to the Knight ask (aligned with the summary cards).
        </p>
      </Section>

      <Section
        id="closing"
        className="scroll-mt-24 border-t border-neutral-200/80 bg-[#fafafa] dark:border-neutral-800 dark:bg-neutral-900/40"
        backdropClassName="bg-[radial-gradient(ellipse_85%_55%_at_100%_80%,rgba(139,92,246,0.1),transparent_55%)] dark:bg-[radial-gradient(ellipse_85%_55%_at_100%_80%,rgba(167,139,250,0.12),transparent_55%)]"
      >
        <BudgetSectionHeader sectionKey="closing" eyebrow="What’s next" title={sc.closingTitle} />
        <div className="mt-6 max-w-3xl space-y-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {sc.closingBody.map((p, i) => (
            <p key={`closing-${i}`}>{p}</p>
          ))}
        </div>
        <Callout>{call.closing}</Callout>
      </Section>

      <Section
        id="transparency"
        className="scroll-mt-24 border-t border-neutral-200/80 bg-white dark:border-neutral-800 dark:bg-neutral-950"
        backdropClassName="bg-[radial-gradient(ellipse_75%_55%_at_50%_-15%,rgba(20,184,166,0.12),transparent_55%)] dark:bg-[radial-gradient(ellipse_75%_55%_at_50%_-15%,rgba(45,212,191,0.12),transparent_55%)]"
      >
        <BudgetSectionHeader sectionKey="transparency" eyebrow="Packet" title="Built for transparency" />
        <div className="mt-8">
          <BudgetTransparencyCTA />
        </div>
      </Section>

      <Section className="border-t border-neutral-200/80 bg-[#fafafa] pb-16 dark:border-neutral-800 dark:bg-neutral-900/40">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          <Link
            href="/knight"
            className="font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
          >
            ← Back to Knight pilot packet
          </Link>
        </p>
      </Section>
    </>
  );
}
