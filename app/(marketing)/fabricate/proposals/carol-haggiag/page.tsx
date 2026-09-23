import type { Metadata } from 'next'
import { ClientQuestionnaire } from '@/components/dcc/fabrication/proposal/ClientQuestionnaire'
import { ProposalChrome } from '@/components/dcc/fabrication/proposal/ProposalChrome'
import { ProposalMediaFigure } from '@/components/dcc/fabrication/proposal/ProposalMediaFigure'
import {
  ApprovalBlock,
  DocumentationStages,
  MachineNote,
  MaterialDirectionsList,
  NumberedPhaseSteps,
  PaymentTerms,
  PendingQuoteLayers,
  ProcessFlow,
  ProductionNetworkFlow,
  ProjectCredits,
  ProjectGoal,
  ProjectStatus,
  ProposalHero,
  ProposalSection,
  ScopeList,
  SourcePathwaysGrid,
} from '@/components/dcc/fabrication/proposal/modules'
import { getMachineCatalogEntry } from '@/lib/dcc/fabrication'
import {
  CAROL_ATTACHMENT_OPTIONS,
  CAROL_CLIENT_QUESTIONS,
  CAROL_CONFIRMED_INPUTS,
  CAROL_CREDITS,
  CAROL_DOCUMENTATION_STAGES,
  CAROL_FUTURE_SCOPE_EXCLUDED,
  CAROL_MATERIAL_DIRECTIONS,
  CAROL_METAL_CASTING_NOTE,
  CAROL_OBJECT_ANALYSIS,
  CAROL_PHASE_1_STEPS,
  CAROL_PRIOR_METAL_STUDY,
  CAROL_PRODUCTION_NETWORK,
  CAROL_PROPOSAL,
  CAROL_PROJECT_SUMMARY,
  CAROL_PROJECT_THESIS,
  CAROL_QUOTE_LAYERS,
  CAROL_SOURCE_PATHWAYS,
  CAROL_SOURCE_PATHWAY_NOTE,
  CAROL_STATUS_SUBLABEL,
  CAROL_TESTING_FOCUS,
} from '@/lib/dcc/fabrication/proposals/carol-haggiag'

export const metadata: Metadata = {
  title: 'Carol Haggiag — Lightweight Earring Prototype Study',
  description:
    'A focused lightweight earring prototype study — preserving texture from Carol’s brass casts while solving for weight, mirrored pair geometry, and wearability.',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

function media(id: string) {
  const slot = CAROL_PROPOSAL.media.find((item) => item.id === id)
  if (!slot) return null
  return <ProposalMediaFigure slug={CAROL_PROPOSAL.slug} slot={slot} />
}

export default function CarolHaggiagProposalPage() {
  const job = CAROL_PROPOSAL.job
  const machine = job.machineId ? getMachineCatalogEntry(job.machineId) : undefined
  const pricing = CAROL_PROPOSAL.pricing

  return (
    <ProposalChrome job={job} sections={CAROL_PROPOSAL.sections}>
      <ProposalHero
        kicker={CAROL_PROPOSAL.heroKicker}
        title={CAROL_PROPOSAL.heroTitle}
        dek={CAROL_PROPOSAL.heroDek}
      >
        <ProjectStatus status={job.status} substatus={CAROL_STATUS_SUBLABEL} />
        <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
          Project lead: Moises Sanabria · Creative technology + fabrication advisor
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {media('C_SOURCE_FRONT')}
          {media('C_SOURCE_BACK')}
        </div>
        <div className="mt-4 max-w-2xl">{media('C_METAL_CAST')}</div>
      </ProposalHero>

      <ProposalSection id="object" kicker="02 · The object" title="The object">
        <ProjectGoal>
          <p className="text-base font-medium text-neutral-900 dark:text-neutral-100">
            {CAROL_PROJECT_THESIS}
          </p>
          <p className="mt-3">{CAROL_PROJECT_SUMMARY}</p>
          <p className="text-neutral-600 dark:text-neutral-400">
            Carol Haggiag · jewelry / sculptural object · lightweight prototype study
          </p>
        </ProjectGoal>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          {Object.entries(CAROL_OBJECT_ANALYSIS).map(([key, value]) => (
            <div
              key={key}
              className="rounded-2xl border border-[var(--cdc-border)] p-4"
            >
              <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                {key}
              </dt>
              <dd className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </ProposalSection>

      <ProposalSection
        id="prior-material-study"
        kicker="03 · Prior material study"
        title={CAROL_PRIOR_METAL_STUDY.heading}
      >
        <p>{CAROL_PRIOR_METAL_STUDY.intro}</p>
        <p className="mt-3 text-sm font-medium text-neutral-800 dark:text-neutral-200">
          {CAROL_PRIOR_METAL_STUDY.shift}
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-3">
          {CAROL_PRIOR_METAL_STUDY.criteria.map((item) => (
            <li
              key={item.label}
              className="rounded-xl border border-[var(--cdc-border)] px-4 py-3"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                {item.label}
              </p>
              <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
                {item.note}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-6 max-w-xl">{media('C_METAL_CAST')}</div>
      </ProposalSection>

      <ProposalSection
        id="testing"
        kicker="04 · What we’re testing"
        title="What we’re testing"
      >
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Prototype 1 should answer whether the form can become wearable earrings
          while preserving texture and sculptural character — with substantially
          less weight than the brass reference.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          {CAROL_TESTING_FOCUS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </ProposalSection>

      <ProposalSection
        id="material-directions"
        kicker="05 · Material directions"
        title="Material directions"
      >
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Resin is one candidate prototype material — not the predetermined solution.
          The first fabrication method will be chosen based on low weight, texture
          fidelity, structural durability, wearability, and practical prototyping cost.
        </p>
        <div className="mt-4">
          <MaterialDirectionsList items={CAROL_MATERIAL_DIRECTIONS} />
        </div>
        <p className="mt-4 rounded-xl border border-[var(--cdc-border)] px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
          {CAROL_METAL_CASTING_NOTE}
        </p>
        {media('C_MATERIAL_DIRECTION')}
      </ProposalSection>

      <ProposalSection id="on-the-body" kicker="06 · On the body" title="On the body">
        <p>
          Wearability is not only silhouette. Scale, weight, movement, and how the
          earrings relate to the body must be tested — with fingers pointing{' '}
          <strong>down</strong>, as in the reference study below.
        </p>
        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
          Target scale: approximately <strong>~2.5 in / ~63.5 mm</strong> — to
          confirm in person. The pair should be <strong>mirrored</strong>.
        </p>
        {media('C_WEARABILITY')}
      </ProposalSection>

      <ProposalSection id="connection" kicker="07 · Connection" title="Connection">
        <p>
          A small attachment loop appears at the wrist in the references. Strength,
          orientation, and hardware must be tested — no option is approved yet.
        </p>
        <ul className="mt-4 space-y-3">
          {CAROL_ATTACHMENT_OPTIONS.map((option) => (
            <li
              key={option.id}
              className="rounded-xl border border-[var(--cdc-border)] px-4 py-3 text-sm"
            >
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                {option.label}
              </span>
              <span className="text-neutral-600 dark:text-neutral-400">
                {' '}
                — {option.note}
              </span>
            </li>
          ))}
        </ul>
        {media('C_ATTACHMENT')}
      </ProposalSection>

      <ProposalSection
        id="image-to-object"
        kicker="08 · From object to prototype"
        title="From object to prototype"
      >
        <SourcePathwaysGrid
          pathways={CAROL_SOURCE_PATHWAYS}
          note={CAROL_SOURCE_PATHWAY_NOTE}
        />
      </ProposalSection>

      <ProposalSection
        id="first-study"
        kicker="09 · Proposed first study"
        title="Phase 1 · Lightweight Earring Prototype Study"
      >
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          A small, bounded first engagement — not a broad development program.
          Prototype 1 is intended to answer the material and wearability question
          before committing to a finished pair.
        </p>
        <div className="mt-4">
          <NumberedPhaseSteps steps={CAROL_PHASE_1_STEPS} />
        </div>
      </ProposalSection>

      <ProposalSection
        id="questions"
        kicker="10 · Open questions"
        title="Open questions"
      >
        <ClientQuestionnaire
          projectLabel={CAROL_PROPOSAL.job.jobNumber}
          confirmedItems={CAROL_CONFIRMED_INPUTS}
          questions={CAROL_CLIENT_QUESTIONS}
        />
      </ProposalSection>

      <ProposalSection
        id="environment"
        kicker="11 · Prototype environment"
        title="Prototype environment"
      >
        <p>
          Goal: produce one focused lightweight prototype using appropriate
          equipment at Bakehouse — method and material chosen after object review.
        </p>
        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
          Resin workflow below is illustrative of one possible path — not a
          predetermined production line.
        </p>
        {machine ? <MachineNote machine={machine} /> : null}
        {media('C_RESIN_WORKFLOW')}
        <div className="mt-6 rounded-2xl border border-[var(--cdc-border)] p-4 text-sm">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
            FDM (conditional)
          </p>
          <p className="mt-2 text-neutral-700 dark:text-neutral-300">
            Potential FDM node at Bakehouse — used for physical scale, silhouette,
            and lightweight study when it answers a specific question.
          </p>
        </div>
      </ProposalSection>

      <ProposalSection
        id="whats-next"
        kicker="12 · What could come next"
        title="What could come next"
      >
        <ProcessFlow steps={CAROL_PROPOSAL.processSteps} current="Carol’s physical cast" />
        <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
          Only if Prototype 1 proves worthwhile — a second refinement or additional
          material study. Metal casting is not the current direction.
        </p>
        <div className="mt-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
            Production network
          </p>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Appropriate expertise at each stage — kept small and focused for this
            first study.
          </p>
          <div className="mt-4">
            <ProductionNetworkFlow nodes={CAROL_PRODUCTION_NETWORK} />
          </div>
        </div>
      </ProposalSection>

      <ProposalSection
        id="documentation"
        kicker="13 · Documentation"
        title="Documentation / project status"
      >
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Living case study — nothing public without Carol’s approval.
        </p>
        <DocumentationStages stages={CAROL_DOCUMENTATION_STAGES} />
        <ProjectCredits credits={CAROL_CREDITS} />
      </ProposalSection>

      <ProposalSection id="price" kicker="14 · Price structure" title="Price structure">
        {pricing ? (
          <>
            <PendingQuoteLayers layers={CAROL_QUOTE_LAYERS} intro={pricing.terms} />
            <PaymentTerms
              terms={pricing.terms}
              includedAttempts={pricing.includedAttempts}
              reprintNote={pricing.reprintNote}
            />
          </>
        ) : null}
      </ProposalSection>

      <ProposalSection id="scope" kicker="15 · Scope" title="Scope">
        <ScopeList
          included={CAROL_PROPOSAL.scopeIncluded}
          excluded={[...CAROL_FUTURE_SCOPE_EXCLUDED]}
        />
      </ProposalSection>

      <ProposalSection id="approval" kicker="16 · Next step" title="Next step">
        <ApprovalBlock nextStep={CAROL_PROPOSAL.approvalNextStep} />
      </ProposalSection>
    </ProposalChrome>
  )
}
