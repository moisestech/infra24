import { DCC_JOB_STAGES } from '@/lib/dcc/os-field-map'
import {
  DCC_COMMERCIAL_STATUS,
  DCC_FULFILLMENT_STATUS,
  DCC_PAYMENT_STATUS,
  inferStateFromLegacyStage,
  jobsV1Fields,
  peopleV1Fields,
  projectLegacyStage,
  resolveJobState,
  servicesV1Fields,
} from '@/lib/dcc/os-v1-schema'

describe('inferStateFromLegacyStage', () => {
  it('maps Approved to active without guessing deposit paid', () => {
    expect(inferStateFromLegacyStage(DCC_JOB_STAGES.approved)).toEqual({
      commercialStatus: DCC_COMMERCIAL_STATUS.active,
      paymentStatus: DCC_PAYMENT_STATUS.none,
      fulfillmentStatus: DCC_FULFILLMENT_STATUS.unscheduled,
    })
  })

  it('maps Paid to closed + paid + delivered', () => {
    expect(inferStateFromLegacyStage(DCC_JOB_STAGES.paid)).toEqual({
      commercialStatus: DCC_COMMERCIAL_STATUS.closed,
      paymentStatus: DCC_PAYMENT_STATUS.paid,
      fulfillmentStatus: DCC_FULFILLMENT_STATUS.delivered,
    })
  })

  it('defaults unknown/blank to Inquiry', () => {
    expect(inferStateFromLegacyStage(undefined).commercialStatus).toBe(
      DCC_COMMERCIAL_STATUS.inquiry
    )
    expect(inferStateFromLegacyStage('Mystery').commercialStatus).toBe(
      DCC_COMMERCIAL_STATUS.inquiry
    )
  })
})

describe('projectLegacyStage', () => {
  it('does not project ready_for_release to Delivered', () => {
    expect(
      projectLegacyStage({
        commercialStatus: DCC_COMMERCIAL_STATUS.active,
        paymentStatus: DCC_PAYMENT_STATUS.paid,
        fulfillmentStatus: DCC_FULFILLMENT_STATUS.readyForRelease,
      })
    ).toBe(DCC_JOB_STAGES.postProcessing)
  })

  it('projects accepted + deposit_due to Quoted', () => {
    expect(
      projectLegacyStage({
        commercialStatus: DCC_COMMERCIAL_STATUS.accepted,
        paymentStatus: DCC_PAYMENT_STATUS.depositDue,
        fulfillmentStatus: DCC_FULFILLMENT_STATUS.unscheduled,
      })
    ).toBe(DCC_JOB_STAGES.quoted)
  })

  it('projects active + unscheduled to Approved', () => {
    expect(
      projectLegacyStage({
        commercialStatus: DCC_COMMERCIAL_STATUS.active,
        paymentStatus: DCC_PAYMENT_STATUS.depositPaid,
        fulfillmentStatus: DCC_FULFILLMENT_STATUS.unscheduled,
      })
    ).toBe(DCC_JOB_STAGES.approved)
  })
})

describe('resolveJobState dual-read', () => {
  it('uses three-dimension fields when Commercial Status is set', () => {
    const state = resolveJobState({
      commercialStatus: DCC_COMMERCIAL_STATUS.quoted,
      paymentStatus: DCC_PAYMENT_STATUS.none,
      fulfillmentStatus: DCC_FULFILLMENT_STATUS.unscheduled,
      stage: DCC_JOB_STAGES.inquiry,
    })
    expect(state.commercialStatus).toBe(DCC_COMMERCIAL_STATUS.quoted)
  })

  it('falls back to Stage when Commercial Status is blank', () => {
    const state = resolveJobState({
      commercialStatus: '',
      stage: DCC_JOB_STAGES.inProduction,
    })
    expect(state.fulfillmentStatus).toBe(DCC_FULFILLMENT_STATUS.inProgress)
  })
})

describe('v1 additive field lists', () => {
  it('does not include Assignment Mode or Base Price', () => {
    const names = [
      ...peopleV1Fields(),
      ...servicesV1Fields(),
      ...jobsV1Fields(),
    ].map((f) => f.name)
    expect(names).not.toContain('Assignment Mode')
    expect(names).not.toContain('Base Price')
    expect(names).not.toContain('Quote Token')
    expect(names).toContain('Client Portal Token')
    expect(names).toContain('DCC App Roles')
  })
})
