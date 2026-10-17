import type { Metadata } from 'next'
import { ProposalChrome } from '@/components/dcc/fabrication/proposal/ProposalChrome'
import { PilotEstimate } from '@/components/dcc/fabrication/proposal/PilotEstimate'
import {
  ApprovalBlock,
  MachineNote,
  ProcessFlow,
  ProjectGoal,
  ProjectStatus,
  ProposalHero,
  ProposalSection,
  ScopeList,
} from '@/components/dcc/fabrication/proposal/modules'
import { getMachineCatalogEntry } from '@/lib/dcc/fabrication'
import { OSCAR_PROPOSAL } from '@/lib/dcc/fabrication/proposals/oscar-rieveling'
import { OSCAR_PILOT_ESTIMATE } from '@/lib/dcc/fabrication/proposals/pilot-estimates'

export const metadata: Metadata = {
  title: 'Oscar Rieveling — Balcony Display Study · Preliminary Scope',
  description: 'Private preliminary scope for a small balcony-form 3D prototype. No final quote or production approval yet.',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default function OscarRievelingProposalPage() {
  const proposal = OSCAR_PROPOSAL
  const machine = proposal.job.machineId
    ? getMachineCatalogEntry(proposal.job.machineId)
    : undefined

  return (
    <ProposalChrome job={proposal.job} sections={proposal.sections}>
      <ProposalHero
        kicker={proposal.heroKicker}
        title={proposal.heroTitle}
        dek={proposal.heroDek}
      >
        <ProjectStatus status={proposal.job.status} substatus="Awaiting scale, references and usage confirmation" />
      </ProposalHero>

      <ProposalSection id="goal" kicker="02 · Objective" title="What we are making">
        <ProjectGoal>
          <p>{proposal.job.prototypeGoal}</p>
          <p>
            This is a proposed <strong>small display model</strong>, not a working
            building component. A photograph cannot establish hidden geometry,
            measurements or building-code compliance.
          </p>
        </ProjectGoal>
      </ProposalSection>

      <ProposalSection id="plan" kicker="03 · Workflow" title="From photographs to object">
        <ProcessFlow steps={proposal.processSteps} current="REFERENCES" />
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          The first model is a visual interpretation for Oscar to review before
          final slicing. Print complexity and finish remain conditional on the dimensions.
        </p>
      </ProposalSection>

      <ProposalSection id="equipment" kicker="04 · Production environment" title="Machines and materials">
        {machine ? <MachineNote machine={machine} /> : null}
        <ul className="list-disc space-y-2 pl-5">
          {OSCAR_PILOT_ESTIMATE.equipment.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <p className="text-xs text-neutral-500">
          Printer allocation, available filament and whether segmentation is needed are unconfirmed.
        </p>
      </ProposalSection>

      <ProposalSection id="price" kicker="05 · Planning" title="Provisional estimate and timeline">
        <PilotEstimate plan={OSCAR_PILOT_ESTIMATE} />
      </ProposalSection>

      <ProposalSection id="scope" kicker="06 · Limits" title="Scope boundaries">
        <ScopeList included={proposal.scopeIncluded} excluded={proposal.scopeExcluded} />
      </ProposalSection>

      <ProposalSection id="inputs" kicker="07 · Before a fixed quote" title="Information still needed">
        <ul className="list-disc space-y-2 pl-5">
          {proposal.requiredInputs.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          No source file, fabrication schedule, approved material or final dimensions are asserted here.
        </p>
      </ProposalSection>

      <ProposalSection id="approval" kicker="08 · Next step" title="Review and approval">
        <ApprovalBlock nextStep={proposal.approvalNextStep} />
      </ProposalSection>
    </ProposalChrome>
  )
}
