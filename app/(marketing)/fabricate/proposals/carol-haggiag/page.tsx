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
  CAROL_CREDITS,
  CAROL_DOCUMENTATION_STAGES,
  CAROL_ESSENTIAL_QUESTION,
  CAROL_FUTURE_SCOPE_EXCLUDED,
  CAROL_MATERIAL_DIRECTIONS,
  CAROL_OBJECT_ANALYSIS,
  CAROL_PHASE_1_STEPS,
  CAROL_PRODUCTION_NETWORK,
  CAROL_PROPOSAL,
  CAROL_PROJECT_SUMMARY,
  CAROL_QUOTE_LAYERS,
  CAROL_SOURCE_PATHWAYS,
  CAROL_SOURCE_PATHWAY_NOTE,
  CAROL_TESTING_FOCUS,
} from '@/lib/dcc/fabrication/proposals/carol-haggiag'

export const metadata: Metadata = {
  title: 'Carol Haggiag — Hand Earring Prototype Study',
  description:
    'A prototype development study exploring digital geometry, resin fabrication, scale and wearability for Carol Haggiag’s sculptural hand earrings.',
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
        <ProjectStatus status={job.status} />
        <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
          Project lead: Moises Sanabria · Creative technology + fabrication advisor
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {media('C_SOURCE_FRONT')}
          {media('C_SOURCE_BACK')}
        </div>
      </ProposalHero>

      <ProposalSection id="object" kicker="02 · The object" title="The object">
        <ProjectGoal>
          <p>{CAROL_PROJECT_SUMMARY}</p>
          <p className="text-neutral-600 dark:text-neutral-400">
            Carol Haggiag · jewelry / sculptural object · prototype development
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
        id="testing"
        kicker="03 · What we’re testing"
        title="What we’re testing"
      >
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Phase 1 should answer whether the hand imagery can become wearable earrings
          while preserving organic surface, elongated fingers, and sculptural character.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          {CAROL_TESTING_FOCUS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </ProposalSection>

      <ProposalSection
        id="material-directions"
        kicker="04 · Material directions"
        title="Material directions"
      >
        <MaterialDirectionsList items={CAROL_MATERIAL_DIRECTIONS} />
        {media('C_MATERIAL_DIRECTION')}
      </ProposalSection>

      <ProposalSection id="on-the-body" kicker="05 · On the body" title="On the body">
        <p>
          Wearability is not only silhouette. Scale, weight, movement, and how the
          earrings relate to the body must be tested — with fingers pointing{' '}
          <strong>down</strong>, as in the reference study below.
        </p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Restrained, statement, and oversized modes in the image are conceptual scale
          studies — not literal approved dimensions.
        </p>
        {media('C_WEARABILITY')}
      </ProposalSection>

      <ProposalSection id="connection" kicker="06 · Connection" title="Connection">
        <p>
          A small attachment loop appears at the wrist in Carol’s references. Strength,
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
        kicker="07 · From image to object"
        title="From image to object"
      >
        <SourcePathwaysGrid
          pathways={CAROL_SOURCE_PATHWAYS}
          note={CAROL_SOURCE_PATHWAY_NOTE}
        />
      </ProposalSection>

      <ProposalSection
        id="first-study"
        kicker="08 · Proposed first study"
        title="Phase 1 · Prototype Development Study"
      >
        <NumberedPhaseSteps steps={CAROL_PHASE_1_STEPS} />
      </ProposalSection>

      <ProposalSection
        id="questions"
        kicker="09 · Questions for Carol"
        title="Questions for Carol"
      >
        <ClientQuestionnaire
          projectLabel={CAROL_PROPOSAL.job.jobNumber}
          questions={CAROL_CLIENT_QUESTIONS}
          highlightQuestion={CAROL_ESSENTIAL_QUESTION}
        />
      </ProposalSection>

      <ProposalSection
        id="environment"
        kicker="10 · Prototype environment"
        title="Prototype environment"
      >
        <p>
          Goal: develop a documented resin workflow that can be safely and repeatably
          operated — prototype infrastructure, not a mature production line.
        </p>
        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
          Potential sequence: validate printer/profile → geometry coupon → one-hand test
          → evaluate → pair.
        </p>
        {machine ? <MachineNote machine={machine} /> : null}
        {media('C_RESIN_WORKFLOW')}
        <div className="mt-6 rounded-2xl border border-[var(--cdc-border)] p-4 text-sm">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
            FDM (conditional)
          </p>
          <p className="mt-2 text-neutral-700 dark:text-neutral-300">
            Potential FDM node at Bakehouse (Augusto) — printer, material, operator,
            and economics remain to be confirmed. Used for physical scale, silhouette,
            and connection position — not final surface detail.
          </p>
        </div>
      </ProposalSection>

      <ProposalSection
        id="whats-next"
        kicker="11 · What could come next"
        title="What could come next"
      >
        <ProcessFlow steps={CAROL_PROPOSAL.processSteps} current="Carol’s vision" />
        <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
          Future branch: final resin, or casting master → specialist caster → metal.
          Metal casting is not a current DCC capability.
        </p>
        <div className="mt-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
            Production network
          </p>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            The project uses appropriate expertise at each stage — not one person
            performing every discipline.
          </p>
          <div className="mt-4">
            <ProductionNetworkFlow nodes={CAROL_PRODUCTION_NETWORK} />
          </div>
        </div>
      </ProposalSection>

      <ProposalSection
        id="documentation"
        kicker="12 · Documentation"
        title="Documentation / project status"
      >
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Living case study — nothing public without Carol’s approval.
        </p>
        <DocumentationStages stages={CAROL_DOCUMENTATION_STAGES} />
        <ProjectCredits credits={CAROL_CREDITS} />
      </ProposalSection>

      <ProposalSection id="price" kicker="13 · Price structure" title="Price structure">
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

      <ProposalSection id="scope" kicker="14 · Scope" title="Scope">
        <ScopeList
          included={CAROL_PROPOSAL.scopeIncluded}
          excluded={[...CAROL_FUTURE_SCOPE_EXCLUDED]}
        />
      </ProposalSection>

      <ProposalSection id="approval" kicker="15 · Next step" title="Next step">
        <ApprovalBlock nextStep={CAROL_PROPOSAL.approvalNextStep} />
      </ProposalSection>
    </ProposalChrome>
  )
}
