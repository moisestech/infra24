import { stageForCapacity } from '@/lib/dcc/backoffice/live-status'
import { DCC_JOB_STAGES, DCC_MACHINE_STATUS } from '@/lib/dcc/os-field-map'
import { buildBackOfficeHome } from '@/lib/dcc/fabrication-os/backoffice-home'

const NOW = new Date('2026-09-26T16:00:00-04:00')

describe('back office home', () => {
  it('does not present a missing Airtable connection as zero jobs', () => {
    const model = buildBackOfficeHome({
      jobs: [],
      machines: [],
      operators: [],
      jobsStatus: 'unconfigured',
      machinesStatus: 'unconfigured',
      now: NOW,
    })
    const airtableRows = model.capacity.filter((row) => row.label !== 'Available operators')
    expect(airtableRows.every((row) => row.value === '—')).toBe(true)
    expect(model.capacity.find((row) => row.label === 'Available operators')?.value).toBe('0')
  })

  it('lists open jobs and keeps legacy Paid off the operating stage', () => {
    const model = buildBackOfficeHome({
      jobsStatus: 'records',
      machinesStatus: 'records',
      operators: [{ active: true }, { active: false }],
      now: NOW,
      machines: [
        { id: 'm1', name: 'Saturn', status: DCC_MACHINE_STATUS.offline },
        { id: 'm2', name: 'Prusa', status: DCC_MACHINE_STATUS.operational },
      ],
      jobs: [
        {
          id: 'j1',
          jobName: 'Heather lighting',
          stage: DCC_JOB_STAGES.inquiry,
          dueDate: '2026-09-20',
          machineCount: 0,
        },
        {
          id: 'j2',
          jobName: 'Paid legacy',
          stage: DCC_JOB_STAGES.paid,
          machineCount: 1,
        },
        {
          id: 'j3',
          jobName: 'Week deadline',
          stage: DCC_JOB_STAGES.quoted,
          dueDate: '2026-09-30',
          machineCount: 0,
        },
      ],
    })

    expect(model.today.map((item) => item.title)).toEqual([
      'Heather lighting',
      'Week deadline',
      'Saturn',
    ])
    expect(model.today[0]?.label).toBe('Overdue')
    expect(model.today[0]?.detail).toContain('New Inquiry')
    expect(model.today.some((item) => item.detail.includes('Paid'))).toBe(false)
    expect(model.legacyPaidCount).toBe(1)
    expect(model.thisWeek.map((item) => item.title)).toEqual(['Week deadline'])
    expect(model.capacity.find((row) => row.label === 'Active jobs')?.value).toBe('2')
    expect(model.capacity.find((row) => row.label === 'Available machines')?.value).toBe('1')
    expect(model.capacity.find((row) => row.label === 'Machines down')?.value).toBe('1')
    expect(model.capacity.find((row) => row.label === 'Available operators')?.value).toBe('1')
  })

  it('keeps the operator count when Jobs and Machines are forbidden', () => {
    const model = buildBackOfficeHome({
      jobs: [
        {
          id: 'j-hidden',
          jobName: 'Hidden',
          stage: DCC_JOB_STAGES.inquiry,
          dueDate: '2026-09-26',
          machineCount: 0,
        },
      ],
      machines: [{ id: 'm-hidden', name: 'Hidden', status: DCC_MACHINE_STATUS.offline }],
      operators: [{ active: true }],
      jobsStatus: 'forbidden',
      machinesStatus: 'forbidden',
      now: NOW,
    })

    expect(model.today).toEqual([])
    expect(model.capacity.find((row) => row.label === 'Active jobs')?.value).toBe('—')
    expect(model.capacity.find((row) => row.label === 'Available machines')?.value).toBe('—')
    expect(model.capacity.find((row) => row.label === 'Available operators')?.value).toBe('1')
    expect(model.legacyPaidCount).toBe(0)
  })

  it('keeps live Accepted / Paid open and treats Needs Info as an inquiry', () => {
    expect(stageForCapacity('Needs Info')).toBe(DCC_JOB_STAGES.inquiry)
    expect(stageForCapacity('Accepted / Paid')).toBe(DCC_JOB_STAGES.approved)
    expect(stageForCapacity('Closed / Lost')).toBe(DCC_JOB_STAGES.declined)
  })
})
