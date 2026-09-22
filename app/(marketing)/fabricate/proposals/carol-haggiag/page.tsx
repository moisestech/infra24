import type { Metadata } from 'next'
import { ProposalChrome } from '@/components/dcc/fabrication/proposal/ProposalChrome'
import {
  ApprovalBlock,
  ClientInputs,
  PaymentTerms,
  PricingCard,
  ProcessFlow,
  ProjectGoal,
  ProjectStatus,
  ProposalHero,
  ProposalSection,
  PrototypeIteration,
  ScopeList,
} from '@/components/dcc/fabrication/proposal/modules'
import { CAROL_PROPOSAL } from '@/lib/dcc/fabrication'

export const metadata: Metadata = {
  title: CAROL_PROPOSAL.heroTitle,
  description: CAROL_PROPOSAL.heroDek,
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default function CarolHaggiagProposalPage() {
  const job = CAROL_PROPOSAL.job
  const pricing = CAROL_PROPOSAL.pricing

  return (
    <ProposalChrome job={job} sections={CAROL_PROPOSAL.sections}>
      <ProposalHero
        kicker={CAROL_PROPOSAL.heroKicker}
        title={CAROL_PROPOSAL.heroTitle}
        dek={CAROL_PROPOSAL.heroDek}
      >
        <ProjectStatus status={job.status} />
      </ProposalHero>

      <ProposalSection
        id="design-intention"
        kicker="02 · Design intention"
        title="Design intention"
      >
        <ProjectGoal>
          <p>{job.prototypeGoal}</p>
          {job.intendedUse ? <p>Intended use: {job.intendedUse}</p> : null}
        </ProjectGoal>
      </ProposalSection>

      <ProposalSection id="references" kicker="03 · References" title="References">
        <p>
          References have not been received on this page. Sketches, photos, existing
          jewelry, or fit notes will land here when they arrive.
        </p>
      </ProposalSection>

      <ProposalSection
        id="reference-to-cad"
        kicker="04 · Reference → CAD"
        title="Reference → CAD"
      >
        <p>
          CAD is not started. This section is a path after design review — not a model,
          screenshot, or invented file.
        </p>
      </ProposalSection>

      <ProposalSection
        id="wearability"
        kicker="05 · Wearability / fit"
        title="Wearability / fit"
      >
        <p>
          Ear-cuff constraints and whether this is a form study, a fit study, or both
          are still open. Those notes are required before a prototype plan is written.
        </p>
      </ProposalSection>

      <ProposalSection
        id="prototype-material"
        kicker="06 · Prototype material"
        title="Prototype material"
      >
        <p>
          Prototype material is not confirmed on this page. No resin or metal SKU is
          assumed.
        </p>
      </ProposalSection>

      <ProposalSection id="fabrication" kicker="07 · Fabrication" title="Fabrication">
        <ProcessFlow steps={CAROL_PROPOSAL.processSteps} current="REFERENCE / IDEA" />
        <p>
          Fabrication is listed as a later step. It is not quoted and no machine is
          assigned yet.
        </p>
      </ProposalSection>

      <ProposalSection
        id="final-material-path"
        kicker="08 · Final material path"
        title="Final material path"
      >
        <p>
          A later production material may be discussed after Prototype 1. That is a path
          only — not a commitment.
        </p>
      </ProposalSection>

      <ProposalSection id="scope" kicker="09 · Scope" title="Scope">
        <ScopeList
          included={CAROL_PROPOSAL.scopeIncluded}
          excluded={CAROL_PROPOSAL.scopeExcluded}
        />
      </ProposalSection>

      <ProposalSection id="price" kicker="10 · Price" title="Price">
        {pricing ? (
          <>
            <PricingCard
              serviceLabel={pricing.serviceLabel}
              amountUsd={pricing.amountUsd}
              amountStatus={pricing.amountStatus}
              materialNote={pricing.materialNote}
            />
            <PaymentTerms
              terms={pricing.terms}
              includedAttempts={pricing.includedAttempts}
              reprintNote={pricing.reprintNote}
            />
          </>
        ) : (
          <PricingCard
            serviceLabel="Prepare + Fabricate — Prototype 1"
            amountStatus="pending"
          />
        )}
      </ProposalSection>

      <ProposalSection id="revision-path" kicker="11 · Revision path" title="Revision path">
        <PrototypeIteration designation="Revision path" inQuote={false}>
          <p>
            Revision and reprint terms will be agreed after Prototype 1. Unlimited
            revisions are not included.
          </p>
        </PrototypeIteration>
      </ProposalSection>

      <ProposalSection id="approval" kicker="12 · Approval" title="Approval">
        <p>Still needed:</p>
        <ClientInputs items={CAROL_PROPOSAL.requiredInputs} />
        <ApprovalBlock nextStep={CAROL_PROPOSAL.approvalNextStep} />
      </ProposalSection>
    </ProposalChrome>
  )
}
