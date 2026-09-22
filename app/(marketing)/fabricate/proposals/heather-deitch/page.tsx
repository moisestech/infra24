import type { Metadata } from 'next'
import { ProposalChrome } from '@/components/dcc/fabrication/proposal/ProposalChrome'
import { ProposalMediaFigure } from '@/components/dcc/fabrication/proposal/ProposalMediaFigure'
import {
  ApprovalBlock,
  ClientInputs,
  FinishCheckpoint,
  MachineNote,
  MaterialCard,
  MaterialPurchaseCard,
  OwnershipNote,
  ClientQuoteBreakdown,
  PaymentTerms,
  ProcessFlow,
  ProjectGoal,
  ProjectStatus,
  ProposalHero,
  ProposalSection,
  PrototypeIteration,
  ScopeList,
  TechnicalSnapshot,
} from '@/components/dcc/fabrication/proposal/modules'
import {
  HEATHER_BASELINE_SLICE,
  HEATHER_LIGHTING_HARDWARE,
  HEATHER_PROPOSAL,
  getMachineCatalogEntry,
  getMaterial,
} from '@/lib/dcc/fabrication'

export const metadata: Metadata = {
  title: HEATHER_PROPOSAL.heroTitle,
  description: HEATHER_PROPOSAL.heroDek,
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

function media(id: string) {
  const slot = HEATHER_PROPOSAL.media.find((item) => item.id === id)
  if (!slot) return null
  return <ProposalMediaFigure slug={HEATHER_PROPOSAL.slug} slot={slot} />
}

export default function HeatherDeitchProposalPage() {
  const job = HEATHER_PROPOSAL.job
  const material = getMaterial(HEATHER_PROPOSAL.materialIds[0] ?? '')
  const machine = job.machineId ? getMachineCatalogEntry(job.machineId) : undefined
  const pricing = HEATHER_PROPOSAL.pricing

  return (
    <ProposalChrome job={job} sections={HEATHER_PROPOSAL.sections}>
      <ProposalHero
        kicker={HEATHER_PROPOSAL.heroKicker}
        title={HEATHER_PROPOSAL.heroTitle}
        dek={HEATHER_PROPOSAL.heroDek}
      >
        <ProjectStatus status={job.status} />
        {media('H_RENDER_001')}
      </ProposalHero>

      <ProposalSection id="project-goal" kicker="02 · Project goal" title="Project goal">
        <ProjectGoal>
          <p>{job.prototypeGoal}</p>
          {job.prototypeDesignation ? (
            <p className="font-medium text-neutral-900 dark:text-neutral-100">
              {job.prototypeDesignation}
            </p>
          ) : null}
          {job.intendedUse ? <p>Intended use: {job.intendedUse}</p> : null}
          {job.quantity ? <p>Quantity: {job.quantity}</p> : null}
        </ProjectGoal>
      </ProposalSection>

      <ProposalSection id="current-file" kicker="03 · Current file" title="Current file">
        <TechnicalSnapshot
          rows={[
            { label: 'File', value: HEATHER_BASELINE_SLICE.file },
            { label: 'Printer', value: HEATHER_BASELINE_SLICE.printer },
            {
              label: 'Layer height',
              value: `${HEATHER_BASELINE_SLICE.layerHeightMm} mm`,
            },
            { label: 'Layers', value: String(HEATHER_BASELINE_SLICE.layers) },
            {
              label: 'Est. resin',
              value: `${HEATHER_BASELINE_SLICE.estimatedResinMl} mL`,
            },
            {
              label: 'Est. mass',
              value: `${HEATHER_BASELINE_SLICE.estimatedMassG} g`,
            },
            {
              label: 'Est. hours',
              value: `${HEATHER_BASELINE_SLICE.estimatedHours} h`,
            },
            { label: 'Supports', value: HEATHER_BASELINE_SLICE.supports },
          ]}
          caveat={HEATHER_BASELINE_SLICE.caveat}
        />
        {media('H_RENDER_002')}
        {media('H_RENDER_003')}
        {media('H_SRC_003')}
      </ProposalSection>

      <ProposalSection
        id="material-light"
        kicker="04 · Material + light"
        title="Material + light"
      >
        {material ? <MaterialCard material={material} /> : null}
        {material ? (
          <MaterialPurchaseCard
            material={material}
            clientSupplied={job.clientSuppliedMaterial}
            note={pricing?.materialNote}
          />
        ) : null}
        {media('H_DIAG_001')}
      </ProposalSection>

      <ProposalSection
        id="lighting-hardware"
        kicker="05 · Lighting hardware"
        title="Lighting hardware / fit"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-neutral-500">
          {HEATHER_LIGHTING_HARDWARE.status}
        </p>
        <p>{HEATHER_LIGHTING_HARDWARE.body}</p>
      </ProposalSection>

      <ProposalSection
        id="production-workflow"
        kicker="06 · Production workflow"
        title="Production workflow"
      >
        <ProcessFlow steps={HEATHER_PROPOSAL.processSteps} current="MATERIAL CONFIRMED" />
        {machine ? <MachineNote machine={machine} /> : null}
        {media('H_DIAG_002')}
      </ProposalSection>

      <ProposalSection
        id="finishing"
        kicker="07 · Finishing"
        title="Finishing checkpoint"
      >
        <FinishCheckpoint>
          <p>
            Prototype 1 is finished to a manufacturer-review checkpoint: support removal
            and surface review. Exhibition finishing is outside this quote.
          </p>
        </FinishCheckpoint>
        {media('H_DIAG_003')}
      </ProposalSection>

      <ProposalSection id="scope" kicker="08 · Scope" title="Scope">
        <ScopeList
          included={HEATHER_PROPOSAL.scopeIncluded}
          excluded={HEATHER_PROPOSAL.scopeExcluded}
        />
      </ProposalSection>

      <ProposalSection
        id="manufacturer-handoff"
        kicker="09 · Manufacturer handoff"
        title="Manufacturer handoff"
      >
        <p>
          Prototype 1 is built for manufacturer review of a translucent lighting part.
          Lighting hardware, drivers, and electrical assembly stay with the client.
        </p>
        <OwnershipNote ownership={job.ownership} />
      </ProposalSection>

      <ProposalSection id="prototype-2" kicker="10 · Prototype 2" title="Prototype 2">
        <PrototypeIteration designation="Prototype 2" inQuote={false}>
          <p>
            A second prototype is not part of this quote. If manufacturer review requires
            a revision, that becomes a separately approved job.
          </p>
        </PrototypeIteration>
      </ProposalSection>

      <ProposalSection id="price" kicker="11 · Price + payment" title="Price + payment">
        {pricing ? (
          <>
            <ClientQuoteBreakdown proposal={HEATHER_PROPOSAL} material={material} />
            <PaymentTerms
              terms={pricing.terms}
              includedAttempts={pricing.includedAttempts}
              reprintNote={pricing.reprintNote}
            />
          </>
        ) : null}
      </ProposalSection>

      <ProposalSection
        id="required-inputs"
        kicker="12 · Required inputs"
        title="Required inputs"
      >
        <ClientInputs items={HEATHER_PROPOSAL.requiredInputs} />
      </ProposalSection>

      <ProposalSection id="approval" kicker="13 · Approval" title="Approval / next step">
        <ApprovalBlock nextStep={HEATHER_PROPOSAL.approvalNextStep} />
      </ProposalSection>
    </ProposalChrome>
  )
}
