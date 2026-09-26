import { DCC_JOB_STAGES, DCC_MACHINE_STATUS } from '@/lib/dcc/os-field-map'
import { mapLegacyJobStage } from '@/lib/dcc/fabrication-os/legacy-map'
import { clientJobPhase } from '@/lib/dcc/fabrication-os/states'
import type { OperatingStage } from '@/lib/dcc/fabrication-os/domain'

export type BackOfficeJobInput = {
  id: string
  jobName: string
  stage: string
  dueDate?: string
  machineCount: number
}

export type BackOfficeMachineInput = {
  id: string
  name: string
  status: string
}

export type BackOfficeTone = 'pending' | 'production' | 'failure' | 'ready' | 'finance'

export type BackOfficeAttention = {
  id: string
  title: string
  detail: string
  tone: BackOfficeTone
  label: string
  href?: string
}

export type BackOfficeCount = {
  label: string
  value: string
  note: string
}

export type TableReadStatus = 'records' | 'unconfigured' | 'forbidden'

export type BackOfficeOperatorInput = {
  active: boolean
}

export type BackOfficeHomeModel = {
  jobsStatus: TableReadStatus
  machinesStatus: TableReadStatus
  today: BackOfficeAttention[]
  thisWeek: BackOfficeAttention[]
  capacity: BackOfficeCount[]
  legacyPaidCount: number
}

const CLOSED_STAGES = new Set<string>([
  DCC_JOB_STAGES.delivered,
  DCC_JOB_STAGES.paid,
  DCC_JOB_STAGES.declined,
  'Documented',
  'Closed / Lost',
])

const ATTENTION_STAGES = new Set<string>([
  DCC_JOB_STAGES.inquiry,
  DCC_JOB_STAGES.quoted,
  DCC_JOB_STAGES.approved,
  DCC_JOB_STAGES.inProduction,
  DCC_JOB_STAGES.postProcessing,
  'New Request',
  'Needs Info',
  'Scoping',
  'Quoted',
  'Accepted / Paid',
  'Open for Fabrication',
  'Claimed / Assigned',
  'Production',
  'Review / Delivery',
])

const PRODUCTION_STAGES = new Set<string>([
  DCC_JOB_STAGES.inProduction,
  DCC_JOB_STAGES.postProcessing,
  'Open for Fabrication',
  'Claimed / Assigned',
  'Production',
  'Review / Delivery',
])

function miamiDate(now: Date): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(now)
}

function addDays(isoDate: string, days: number): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  const utc = new Date(Date.UTC(year, month - 1, day))
  utc.setUTCDate(utc.getUTCDate() + days)
  return utc.toISOString().slice(0, 10)
}

function dueDateOnly(value: string | undefined): string | undefined {
  if (!value) return undefined
  const match = value.match(/^(\d{4}-\d{2}-\d{2})/)
  return match?.[1]
}

function stageLabel(stage: string): { operating: OperatingStage | null; text: string } {
  const mapped = mapLegacyJobStage(stage)
  if (!mapped) return { operating: null, text: stage }
  if (mapped.createPaymentReference) {
    return { operating: null, text: 'Legacy Stage Paid is a payment fact, not an operating stage' }
  }
  return { operating: mapped.operatingStage, text: mapped.operatingStage ?? stage }
}

function toneForStage(stage: string): { tone: BackOfficeTone; label: string } {
  if (stage === 'Accepted / Paid' || stage === DCC_JOB_STAGES.approved) {
    return { tone: 'finance', label: stage === DCC_JOB_STAGES.approved ? 'Accepted' : stage }
  }
  if (PRODUCTION_STAGES.has(stage)) {
    return { tone: 'production', label: stage }
  }
  if (
    stage === 'New Request' ||
    stage === 'Needs Info' ||
    stage === 'Scoping' ||
    stage === 'Quoted'
  ) {
    return { tone: 'pending', label: stage }
  }
  if (stage === DCC_JOB_STAGES.inquiry || stage === DCC_JOB_STAGES.quoted) {
    return { tone: 'pending', label: 'Pending' }
  }
  return { tone: 'pending', label: 'Open' }
}

export function buildBackOfficeHome(input: {
  jobs: readonly BackOfficeJobInput[]
  machines: readonly BackOfficeMachineInput[]
  operators?: readonly BackOfficeOperatorInput[]
  jobsStatus: TableReadStatus
  machinesStatus: TableReadStatus
  now?: Date
}): BackOfficeHomeModel {
  const today = miamiDate(input.now ?? new Date())
  const weekEnd = addDays(today, 7)
  const jobsConnected = input.jobsStatus === 'records'
  const machinesConnected = input.machinesStatus === 'records'

  const todayItems: BackOfficeAttention[] = []
  const weekItems: BackOfficeAttention[] = []
  let activeJobs = 0
  let openProduction = 0
  let legacyPaidCount = 0

  for (const job of jobsConnected ? input.jobs : []) {
    if (job.stage === DCC_JOB_STAGES.paid) legacyPaidCount += 1
    if (!CLOSED_STAGES.has(job.stage)) activeJobs += 1
    if (PRODUCTION_STAGES.has(job.stage)) openProduction += 1

    const due = dueDateOnly(job.dueDate)
    const mapped = stageLabel(job.stage)
    const phase = mapped.operating ? clientJobPhase(mapped.operating) : null
    const { tone, label } = toneForStage(job.stage)
    const machineNote =
      job.stage === DCC_JOB_STAGES.inProduction && job.machineCount === 0
        ? 'No machine linked.'
        : null
    const detail = [mapped.text, phase, machineNote].filter(Boolean).join(' · ')

    if (ATTENTION_STAGES.has(job.stage) || (due && due < today && !CLOSED_STAGES.has(job.stage))) {
      todayItems.push({
        id: job.id,
        title: job.jobName,
        detail: due && due < today ? `${detail} · Due ${due}` : detail,
        tone: due && due < today ? 'failure' : tone,
        label: due && due < today ? 'Overdue' : label,
        href: `/backoffice/jobs/${job.id}`,
      })
    }

    if (due && due >= today && due <= weekEnd && !CLOSED_STAGES.has(job.stage)) {
      weekItems.push({
        id: `${job.id}-due`,
        title: job.jobName,
        detail: `Due ${due}`,
        tone: 'pending',
        label: 'Deadline',
        href: `/backoffice/jobs/${job.id}`,
      })
    }
  }

  for (const machine of machinesConnected ? input.machines : []) {
    if (
      machine.status === DCC_MACHINE_STATUS.maintenance ||
      machine.status === DCC_MACHINE_STATUS.offline
    ) {
      todayItems.push({
        id: machine.id,
        title: machine.name,
        detail: machine.status,
        tone: 'failure',
        label: 'Machine',
      })
    }
  }

  const machineRows = machinesConnected ? input.machines : []
  const availableMachines = machineRows.filter(
    (machine) =>
      machine.status === DCC_MACHINE_STATUS.operational ||
      machine.status === DCC_MACHINE_STATUS.serviceSoon
  ).length
  const occupiedOrDown = machineRows.filter(
    (machine) =>
      machine.status === DCC_MACHINE_STATUS.maintenance ||
      machine.status === DCC_MACHINE_STATUS.offline
  ).length

  const jobValue = (count: number) => (jobsConnected ? String(count) : '—')
  const machineValue = (count: number) => (machinesConnected ? String(count) : '—')
  const availableOperators = (input.operators ?? []).filter((operator) => operator.active).length

  return {
    jobsStatus: input.jobsStatus,
    machinesStatus: input.machinesStatus,
    today: jobsConnected || machinesConnected ? todayItems : [],
    thisWeek: jobsConnected ? weekItems : [],
    legacyPaidCount: jobsConnected ? legacyPaidCount : 0,
    capacity: [
      {
        label: 'Active jobs',
        value: jobValue(activeJobs),
        note: 'Not delivered, paid, or declined',
      },
      {
        label: 'Open production',
        value: jobValue(openProduction),
        note: 'Production, review, or assigned. Requests and quotes stay under active jobs.',
      },
      {
        label: 'Available machines',
        value: machineValue(availableMachines),
        note: 'CRM status, plus active machines in the studio catalog',
      },
      {
        label: 'Machines down',
        value: machineValue(occupiedOrDown),
        note: 'Maintenance or offline',
      },
      {
        label: 'Available operators',
        value: String(availableOperators),
        note: 'Active names in the operator catalog, not a CRM availability field',
      },
    ],
  }
}
