import { FABRICATION_JOB_STATUSES } from '@/lib/dcc/fabrication/job-status'
import { DCC_JOB_STAGES } from '@/lib/dcc/os-field-map'
import {
  DEFAULT_COMPENSATION_MODEL,
  assertExplicitAccountingCommand,
  can,
  clientJobPhase,
  compensationAmount,
  gitStatusSplitsPayment,
  mapGitJobStatus,
  mapLegacyJobStage,
  toClientJobView,
  toPublicFabricatorProfile,
  toPublicPortfolioItem,
  transitionCompetencyLevel,
  transitionCompetencyStatus,
  transitionEnrollment,
  transitionJob,
  transitionPayment,
  transitionPayout,
  transitionRun,
  type FabricationJob,
  type FabricatorProfile,
  type PersonRef,
  type PortfolioItem,
  type QuoteLine,
} from '@/lib/dcc/fabrication-os'

function keysOf(value: unknown, found = new Set<string>()): Set<string> {
  if (!value || typeof value !== 'object') return found
  if (Array.isArray(value)) {
    for (const entry of value) keysOf(entry, found)
    return found
  }
  for (const [key, entry] of Object.entries(value)) {
    found.add(key)
    keysOf(entry, found)
  }
  return found
}

const person: PersonRef = {
  id: 'per_1',
  fullName: 'Ada Maker',
  email: 'ada@example.com',
  phone: '305-555-0100',
  city: 'Miami',
  neighborhood: 'Little Haiti',
  roles: ['Fabricator'],
  clerkUserId: 'user_secret',
  publicProfileConsent: 'Public Listing OK',
  crmNotes: 'Internal CRM note',
}

const job: FabricationJob = {
  id: 'job_1',
  jobCode: 'DCC-104',
  jobName: 'Heather lighting',
  projectTitle: 'Translucent resin prototype',
  customerId: 'per_client',
  estimatorId: 'per_est',
  operatingStage: 'Quoted',
  serviceIds: [],
  intendedMachineIds: ['mac_1'],
  scope: 'One lighting prototype',
  internalNotes: 'Margin is thin',
  clientNotes: 'Prefer warm white',
  quantity: 1,
  requestedDeadline: '2026-10-01',
  materialSummary: 'Translucent resin',
  processSummary: 'SLA',
  quoteAmount: 625,
  paymentState: 'Pending',
  documentationPermission: false,
  portfolioPermission: false,
  fileReceived: true,
  technicalReview: false,
  materialConfirmation: false,
  prototypeScoping: false,
}

const quoteLine: QuoteLine = {
  id: 'ql_1',
  jobId: 'job_1',
  label: 'Prototype',
  description: 'First article',
  category: 'fabrication',
  quantity: 1,
  unitAmount: 625,
  amount: 625,
  sort: 1,
}

describe('enrollment transitions', () => {
  it('walks the main path and never grants a competency', () => {
    const steps = [
      'Interested',
      'Registered',
      'Payment Pending',
      'Confirmed',
      'Attended',
      'Completed',
    ] as const
    for (let i = 0; i < steps.length - 1; i += 1) {
      const result = transitionEnrollment(steps[i], steps[i + 1])
      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value.status).toBe(steps[i + 1])
        expect(result.value.competencyGranted).toBe(false)
      }
    }
  })

  it('rejects skips, completion cancel, and no-show before confirmation', () => {
    expect(transitionEnrollment('Interested', 'Confirmed').ok).toBe(false)
    expect(transitionEnrollment('Completed', 'Cancelled').ok).toBe(false)
    expect(transitionEnrollment('Payment Pending', 'No Show').ok).toBe(false)
  })

  it('allows cancel before completion and no-show after confirmation', () => {
    expect(transitionEnrollment('Registered', 'Cancelled').ok).toBe(true)
    expect(transitionEnrollment('Confirmed', 'No Show').ok).toBe(true)
    expect(transitionEnrollment('Attended', 'No Show').ok).toBe(true)
  })

  it('refunds only when payment is Paid', () => {
    expect(
      transitionEnrollment('Completed', 'Refunded', { paymentState: 'Pending' }).ok
    ).toBe(false)
    const refunded = transitionEnrollment('Completed', 'Refunded', {
      paymentState: 'Paid',
    })
    expect(refunded.ok).toBe(true)
    if (refunded.ok) expect(refunded.value.competencyGranted).toBe(false)
  })
})

describe('competency transitions', () => {
  it('requires a verifier at Verified and Active Fabricator', () => {
    expect(transitionCompetencyLevel('Assisted', 'Verified').ok).toBe(false)
    const verified = transitionCompetencyLevel('Assisted', 'Verified', {
      verifiedById: 'per_admin',
      verifiedAt: '2026-09-26',
    })
    expect(verified.ok).toBe(true)
    expect(
      transitionCompetencyLevel('Verified', 'Active Fabricator', {
        verifiedById: 'per_admin',
        verifiedAt: '2026-09-26',
      }).ok
    ).toBe(true)
  })

  it('holds Active Fabricator and returns Needs Reverification only to verified levels', () => {
    expect(
      transitionCompetencyStatus('Active Fabricator', 'Active', 'Needs Reverification')
        .ok
    ).toBe(true)
    expect(
      transitionCompetencyStatus('Active Fabricator', 'Active', 'Inactive').ok
    ).toBe(true)
    expect(
      transitionCompetencyStatus(
        'Active Fabricator',
        'Needs Reverification',
        'Active',
        'Learner'
      ).ok
    ).toBe(false)
    const restored = transitionCompetencyStatus(
      'Active Fabricator',
      'Needs Reverification',
      'Active',
      'Verified'
    )
    expect(restored.ok).toBe(true)
    if (restored.ok) expect(restored.value.level).toBe('Verified')
  })
})

describe('job transitions', () => {
  it('moves one stage at a time', () => {
    expect(transitionJob('New Inquiry', 'Scoped').ok).toBe(true)
    expect(transitionJob('New Inquiry', 'Quoted').ok).toBe(false)
  })

  it('blocks Production Authorized until payment is satisfied', () => {
    expect(
      transitionJob('Payment Pending', 'Production Authorized', {
        paymentState: 'Pending',
      }).ok
    ).toBe(false)
    expect(
      transitionJob('Payment Pending', 'Production Authorized', {
        paymentState: 'Partially Paid',
      }).ok
    ).toBe(false)
    expect(
      transitionJob('Payment Pending', 'Production Authorized', {
        paymentState: 'Partially Paid',
        partialPaymentOverride: true,
      }).ok
    ).toBe(true)
    expect(
      transitionJob('Payment Pending', 'Production Authorized', {
        paymentState: 'Paid',
      }).ok
    ).toBe(true)
    expect(
      transitionJob('Payment Pending', 'Production Authorized', {
        paymentState: 'Waived',
      }).ok
    ).toBe(true)
    expect(
      transitionJob('Payment Pending', 'Production Authorized', {
        paymentState: 'Not Required',
      }).ok
    ).toBe(true)
  })

  it('does not assign anyone when opening fabrication', () => {
    const opened = transitionJob('Production Authorized', 'Open for Fabrication')
    expect(opened).toEqual({ ok: true, value: 'Open for Fabrication' })
  })

  it('declines only before production and resumes a hold', () => {
    expect(transitionJob('Quoted', 'Declined').ok).toBe(true)
    expect(transitionJob('In Production', 'Declined').ok).toBe(false)
    expect(transitionJob('In Production', 'On Hold').ok).toBe(true)
    expect(transitionJob('On Hold', 'Cancelled').ok).toBe(true)
    expect(transitionJob('On Hold', 'Quoted').ok).toBe(false)
    expect(
      transitionJob('On Hold', 'In Production', { resumeTo: 'In Production' }).ok
    ).toBe(true)
  })

  it('projects a client-safe phase', () => {
    expect(clientJobPhase('Quoted')).toBe('Quote / Approval')
    expect(clientJobPhase('Payment Pending')).toBe('Payment')
    expect(clientJobPhase('Open for Fabrication')).toBe('Production Queue')
    expect(clientJobPhase('In Production')).toBe('Fabrication')
    expect(clientJobPhase('Review / QC')).toBe('Quality Review')
    expect(clientJobPhase('Delivered')).toBe('Ready / Delivered')
    expect(clientJobPhase('On Hold', 'In Production')).toBe('Fabrication')
  })
})

describe('run transitions', () => {
  it('follows the print path and pauses back to the prior status', () => {
    expect(transitionRun('Ready', 'Assigned').ok).toBe(true)
    expect(transitionRun('Ready', 'Queued').ok).toBe(false)
    expect(transitionRun('Printing', 'Paused').ok).toBe(true)
    expect(transitionRun('Paused', 'QC', { resumeTo: 'Printing' }).ok).toBe(false)
    expect(transitionRun('Paused', 'Printing', { resumeTo: 'Printing' }).ok).toBe(
      true
    )
  })

  it('keeps failed, cancelled, and reprint required terminal', () => {
    expect(transitionRun('Printing', 'Failed').ok).toBe(true)
    expect(transitionRun('Failed', 'Printing').ok).toBe(false)
    expect(transitionRun('Failed', 'Reprint Required').ok).toBe(false)
    expect(transitionRun('Printing', 'Reprint Required').ok).toBe(true)
    expect(transitionRun('Reprint Required', 'Ready').ok).toBe(false)
    expect(transitionRun('Complete', 'Failed').ok).toBe(false)
    expect(transitionRun('Paused', 'Cancelled').ok).toBe(true)
  })
})

describe('payment transitions', () => {
  it('follows the invoice path and rejects manual Paid when QuickBooks owns the balance', () => {
    expect(transitionPayment('Not Required', 'Pending').ok).toBe(false)
    expect(transitionPayment('Pending', 'Paid').ok).toBe(false)
    expect(transitionPayment('Pending', 'Invoiced').ok).toBe(true)
    expect(transitionPayment('Invoiced', 'Paid').ok).toBe(true)
    expect(
      transitionPayment('Invoiced', 'Paid', {
        quickBooksId: 'inv_1',
      }).ok
    ).toBe(false)
    expect(
      transitionPayment('Invoiced', 'Paid', {
        quickBooksId: 'inv_1',
        adapterConfirmedBalanceZero: true,
      }).ok
    ).toBe(true)
  })

  it('returns Failed to Pending and Paid to Refunded', () => {
    expect(transitionPayment('Pending', 'Failed').ok).toBe(true)
    expect(transitionPayment('Failed', 'Pending').ok).toBe(true)
    expect(transitionPayment('Paid', 'Refunded').ok).toBe(true)
    expect(transitionPayment('Pending', 'Waived').ok).toBe(true)
  })

  it('reconciles only synced rows and only back to the adapter state', () => {
    expect(transitionPayment('Pending', 'Needs Reconciliation').ok).toBe(false)
    expect(transitionPayment('Invoiced', 'Needs Reconciliation').ok).toBe(true)
    expect(
      transitionPayment('Needs Reconciliation', 'Paid', {
        adapterConfirmed: true,
        resumeTo: 'Invoiced',
      }).ok
    ).toBe(false)
    expect(
      transitionPayment('Needs Reconciliation', 'Invoiced', {
        adapterConfirmed: true,
        resumeTo: 'Invoiced',
      }).ok
    ).toBe(true)
  })
})

describe('payout transitions', () => {
  it('defaults to a flat task and ignores client revenue unless the model is revenue share', () => {
    expect(DEFAULT_COMPENSATION_MODEL).toBe('Flat Task')
    expect(
      compensationAmount({
        model: 'Flat Task',
        rate: 80,
        hoursOrQuantity: 2,
        clientRevenue: 625,
      })
    ).toEqual({ ok: true, value: 160 })
    expect(
      compensationAmount({
        model: 'Revenue Share',
        rate: 0.2,
        hoursOrQuantity: 1,
      }).ok
    ).toBe(false)
    expect(
      compensationAmount({
        model: 'Revenue Share',
        rate: 0.2,
        hoursOrQuantity: 1,
        clientRevenue: 625,
      })
    ).toEqual({ ok: true, value: 125 })
  })

  it('approves in order and holds only unpaid rows', () => {
    expect(transitionPayout('Not Applicable', 'Estimated').ok).toBe(false)
    expect(transitionPayout('Estimated', 'Approved').ok).toBe(false)
    expect(transitionPayout('Estimated', 'Awaiting Approval').ok).toBe(true)
    expect(transitionPayout('Payable', 'Paid').ok).toBe(true)
    expect(transitionPayout('Paid', 'On Hold').ok).toBe(false)
    expect(transitionPayout('Estimated', 'On Hold').ok).toBe(true)
    expect(
      transitionPayout('On Hold', 'Estimated', { resumeTo: 'Estimated' }).ok
    ).toBe(true)
  })
})

describe('legacy stage map', () => {
  it('maps Airtable stages and refuses to treat Paid as an operating stage', () => {
    expect(mapLegacyJobStage(DCC_JOB_STAGES.inquiry)).toEqual({
      operatingStage: 'New Inquiry',
      createPaymentReference: false,
    })
    expect(mapLegacyJobStage(DCC_JOB_STAGES.approved)?.operatingStage).toBe(
      'Accepted'
    )
    expect(mapLegacyJobStage(DCC_JOB_STAGES.postProcessing)?.operatingStage).toBe(
      'Review / QC'
    )
    expect(mapLegacyJobStage(DCC_JOB_STAGES.paid)).toEqual({
      operatingStage: null,
      createPaymentReference: true,
    })
    expect(mapLegacyJobStage('Not a stage')).toBeNull()
  })

  it('collapses git micro-stages into Scoped and splits accepted-paid', () => {
    expect(mapGitJobStatus('FILE_RECEIVED')).toBe('Scoped')
    expect(mapGitJobStatus('TECHNICAL_REVIEW')).toBe('Scoped')
    expect(mapGitJobStatus('MATERIAL_CONFIRMATION')).toBe('Scoped')
    expect(mapGitJobStatus('PROTOTYPE_SCOPING')).toBe('Scoped')
    expect(mapGitJobStatus('ACCEPTED_PAID')).toBe('Accepted')
    expect(gitStatusSplitsPayment('ACCEPTED_PAID')).toBe(true)
    expect(gitStatusSplitsPayment('QUOTED')).toBe(false)
    for (const status of FABRICATION_JOB_STATUSES) {
      expect(mapGitJobStatus(status)).toEqual(expect.any(String))
    }
  })
})

describe('redaction', () => {
  it('keeps internal notes, costs, and payout fields off the client job', () => {
    const view = toClientJobView(job, [quoteLine])
    expect(view.phase).toBe('Quote / Approval')
    expect(view.clientNotes).toBe('Prefer warm white')
    expect(view.quoteLines).toHaveLength(1)
    const keys = keysOf(view)
    for (const forbidden of [
      'internalNotes',
      'crmNotes',
      'email',
      'phone',
      'payout',
      'expectedAmount',
      'approvedAmount',
      'margin',
      'hourlyRate',
      'costLines',
    ]) {
      expect(keys.has(forbidden)).toBe(false)
    }
  })

  it('publishes an approved fabricator without CRM or pay fields', () => {
    const profile: FabricatorProfile = {
      id: 'fab_1',
      personId: person.id,
      publicName: 'Ada Maker',
      slug: 'ada-maker',
      shortBio: 'Resin and light',
      neighborhood: 'Little Haiti',
      processes: ['SLA'],
      software: ['Blender'],
      availability: 'Available',
      profileStatus: 'Approved',
    }
    const published = toPublicFabricatorProfile({
      profile,
      person,
      competencies: [
        { name: 'Blender', level: 'Learner', status: 'Active' },
        { name: 'SLA', level: 'Verified', status: 'Active' },
        { name: 'FDM', level: 'Active Fabricator', status: 'Inactive' },
      ],
    })
    expect(published?.verifiedCompetencies).toEqual(['SLA'])
    expect(published?.areaLabel).toBe('Little Haiti')
    const keys = keysOf(published)
    for (const forbidden of [
      'crmNotes',
      'email',
      'phone',
      'clerkUserId',
      'payout',
      'expectedAmount',
    ]) {
      expect(keys.has(forbidden)).toBe(false)
    }
  })

  it('hides unapproved profiles, do-not-publish people, and hidden availability', () => {
    const profile: FabricatorProfile = {
      id: 'fab_1',
      personId: person.id,
      publicName: 'Ada Maker',
      slug: 'ada-maker',
      processes: [],
      software: [],
      availability: 'Hidden',
      profileStatus: 'Approved',
    }
    expect(
      toPublicFabricatorProfile({
        profile: { ...profile, profileStatus: 'Opted In' },
        person,
      })
    ).toBeNull()
    expect(
      toPublicFabricatorProfile({
        profile,
        person: { ...person, publicProfileConsent: 'Do Not Publish' },
      })
    ).toBeNull()
    expect(toPublicFabricatorProfile({ profile, person })?.availability).toBe(
      undefined
    )
  })

  it('blocks client work from the public portfolio until permission and approval', () => {
    const item: PortfolioItem = {
      id: 'port_1',
      personId: person.id,
      title: 'Lighting study',
      jobId: job.id,
      runIds: [],
      imageUrls: ['https://cdn.example/light.jpg'],
      collaboratorIds: [],
      visibility: 'Public',
      clientApproved: false,
      featured: false,
    }
    expect(toPublicPortfolioItem(item, true)).toBeNull()
    expect(
      toPublicPortfolioItem({ ...item, clientApproved: true }, false)
    ).toBeNull()
    expect(
      toPublicPortfolioItem({ ...item, clientApproved: true }, true)?.title
    ).toBe('Lighting study')
  })
})

describe('permissions', () => {
  it('keeps finance and other people private', () => {
    expect(can('client', 'view_costs')).toBe(false)
    expect(can('client', 'view_own_client_job', { ownsRecord: false })).toBe(false)
    expect(can('client', 'view_own_client_job', { ownsRecord: true })).toBe(true)
    expect(can('fabricator', 'view_any_payout')).toBe(false)
    expect(can('fabricator', 'view_job_margin')).toBe(false)
    expect(
      can('fabricator', 'view_own_payout', {
        actorPersonId: 'per_a',
        subjectPersonId: 'per_b',
      })
    ).toBe(false)
    expect(
      can('fabricator', 'view_own_payout', {
        actorPersonId: 'per_a',
        subjectPersonId: 'per_a',
      })
    ).toBe(true)
    expect(can('fabricator', 'assign_run')).toBe(false)
    expect(can('estimator', 'preview_quickbooks')).toBe(true)
    expect(can('estimator', 'create_quickbooks')).toBe(false)
    expect(can('estimator', 'approve_payout')).toBe(false)
    expect(can('operations', 'assign_run')).toBe(true)
    expect(can('operations', 'mark_payout_paid')).toBe(false)
    expect(can('operations', 'create_quickbooks')).toBe(false)
    expect(can('instructor', 'view_costs')).toBe(false)
    expect(can('admin', 'mark_payout_paid')).toBe(true)
    expect(can('admin', 'verify_competency')).toBe(true)
    expect(can('public', 'view_crm_notes')).toBe(false)
  })
})

describe('accounting commands', () => {
  it('rejects writes that are not an explicit action', () => {
    expect(() => assertExplicitAccountingCommand('render')).toThrow(
      /explicit command/
    )
    expect(() => assertExplicitAccountingCommand('read')).toThrow(/explicit command/)
    expect(() => assertExplicitAccountingCommand('explicit_action')).not.toThrow()
  })
})
