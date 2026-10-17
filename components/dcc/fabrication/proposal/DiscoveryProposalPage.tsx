import type { ClientProposal } from '@/lib/dcc/fabrication/schema'
import { ProposalChrome } from '@/components/dcc/fabrication/proposal/ProposalChrome'
import {
  ApprovalBlock,
  PendingQuoteLayers,
  ProcessFlow,
  ProjectGoal,
  ProjectStatus,
  ProposalHero,
  ProposalSection,
  ScopeList,
} from '@/components/dcc/fabrication/proposal/modules'

/** Reusable private page for unpriced discovery-stage fabrication opportunities. */
export function DiscoveryProposalPage({
  proposal,
  substatus,
}: {
  proposal: ClientProposal
  substatus: string
}) {
  const job = proposal.job
  return (
    <ProposalChrome job={job} sections={proposal.sections}>
      <ProposalHero kicker={proposal.heroKicker} title={proposal.heroTitle} dek={proposal.heroDek}>
        <ProjectStatus status={job.status} substatus={substatus} />
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Private scoping brief · No approved price, deposit, machine reservation or production start.
        </p>
      </ProposalHero>

      <ProposalSection id="goal" kicker="02 · Objective" title="What we need to resolve">
        <ProjectGoal>
          <p>{job.prototypeGoal}</p>
          {job.intendedUse ? (
            <p className="text-neutral-600 dark:text-neutral-400">
              Proposed use: {job.intendedUse}
            </p>
          ) : null}
        </ProjectGoal>
      </ProposalSection>

      <ProposalSection id="workflow" kicker="03 · How it works" title="Path from source to prototype">
        <ProcessFlow steps={proposal.processSteps} />
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          This is a proposed workflow, not evidence that any stage has been completed.
          No production equipment is assigned until feasibility and capacity are verified.
        </p>
      </ProposalSection>

      <ProposalSection id="quote" kicker="04 · Transparent pricing" title="What a future quote will cover">
        <PendingQuoteLayers
          layers={proposal.quoteLineItems ?? []}
          intro={proposal.pricing?.terms}
        />
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Amount, deposit and turnaround are pending review of the actual design,
          physical dimensions, material and chosen first-phase goal.
          This page does not accept payment.
        </p>
      </ProposalSection>

      <ProposalSection id="scope" kicker="05 · Boundaries" title="What is and is not included">
        <ScopeList included={proposal.scopeIncluded} excluded={proposal.scopeExcluded} />
      </ProposalSection>

      <ProposalSection id="inputs" kicker="06 · Your input" title="Questions for technical review">
        <ul className="list-disc space-y-2 pl-5">
          {proposal.requiredInputs.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </ProposalSection>

      <ProposalSection id="approval" kicker="07 · Next step" title="From discovery to a fixed quote">
        <ApprovalBlock nextStep={proposal.approvalNextStep} />
      </ProposalSection>
    </ProposalChrome>
  )
}
