import { fetchAllRecords, type AirtableRecord } from '@/lib/airtable/client'
import { readTable, type TableRead } from '@/lib/dcc/backoffice/table-read'
import { listBookings, type DccBooking } from '@/lib/dcc/bookings'
import { FABRICATION_OPERATORS } from '@/lib/dcc/fabrication/operators'
import { mapLegacyJobStage } from '@/lib/dcc/fabrication-os/legacy-map'
import { listJobs, type DccJob } from '@/lib/dcc/jobs'
import { listPublicMachines, type DccMachine } from '@/lib/dcc/machines'
import { listTransactions, type DccTransaction } from '@/lib/dcc/transactions'
import { DEFAULT_DCC_PEOPLE_FIELD_MAP as PEOPLE } from '@/lib/network-builder/field-map'

export type StaffPerson = {
  id: string
  name: string
  city?: string
  email?: string
  contactCategory?: string
  role?: string
  operatorStage?: string
  lifeOsPersonId?: string
}

export type StaffKind = 'client' | 'fabricator' | 'network'

export type StaffRow = {
  id: string
  title: string
  detail: string
  href?: string
  kind?: StaffKind
}

export function readJobs(): Promise<TableRead<DccJob>> {
  return readTable('Jobs', 'jobs', (conn) => listJobs(conn))
}

export function readMachines(): Promise<TableRead<DccMachine>> {
  return readTable('Machines', 'machines', (conn) => listPublicMachines(conn))
}

export function readBookings(): Promise<TableRead<DccBooking>> {
  return readTable('Bookings', 'bookings', (conn) => listBookings(conn))
}

export function readTransactions(): Promise<TableRead<DccTransaction>> {
  return readTable('Transactions', 'transactions', (conn) => listTransactions(conn))
}

export function readPeople(): Promise<TableRead<StaffPerson>> {
  return readTable('People', 'people', async (conn) => {
    const rows = await fetchAllRecords(conn.baseId, conn.tables.people, conn.apiKey)
    return rows.map(mapPerson)
  })
}

export function activeOperatorCount(): number {
  return FABRICATION_OPERATORS.filter((operator) => operator.active).length
}

export function presentOperators(): StaffRow[] {
  return FABRICATION_OPERATORS.map((operator) => ({
    id: operator.id,
    title: operator.name,
    detail: [
      roleLabel(operator.role),
      operator.capabilities.length > 0 ? operator.capabilities.join(', ') : 'Profile not started',
      operator.active ? null : 'Inactive',
    ]
      .filter(Boolean)
      .join(' · '),
  }))
}

export function presentJob(job: DccJob): StaffRow {
  const mapped = mapLegacyJobStage(job.stage)
  const stage = !mapped
    ? job.stage
    : mapped.createPaymentReference
      ? 'Legacy Stage Paid is a payment fact, not an operating stage'
      : (mapped.operatingStage ?? job.stage)
  return {
    id: job.id,
    title: job.jobName,
    href: `/backoffice/jobs/${job.id}`,
    detail: [
      stage,
      job.dueDate ? `Due ${job.dueDate.slice(0, 10)}` : null,
      job.quoteAmount != null
        ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(job.quoteAmount)
        : null,
    ]
      .filter(Boolean)
      .join(' · '),
  }
}

export function presentMachine(machine: DccMachine): StaffRow {
  return {
    id: machine.id,
    title: machine.name,
    detail: [machine.status, machine.type].filter(Boolean).join(' · '),
  }
}

export function presentPerson(person: StaffPerson): StaffRow {
  const kind = personKind(person)
  const label = kindLabel(kind)
  const role = person.role && person.role.toLowerCase() !== label.toLowerCase() ? person.role : null
  return {
    id: person.id,
    title: person.name,
    kind,
    detail:
      [
        label,
        person.city,
        person.email,
        role,
        person.operatorStage,
        person.lifeOsPersonId ? 'Life OS linked' : null,
      ]
        .filter(Boolean)
        .join(' · ') || 'No email, role, or operator stage',
  }
}

function personKind(person: StaffPerson): StaffKind {
  const role = `${person.role ?? ''} ${person.contactCategory ?? ''}`.toLowerCase()
  if (role.includes('client')) return 'client'
  if (role.includes('fabricat') || role.includes('operator') || role.includes('collaborat') || person.operatorStage) {
    return 'fabricator'
  }
  return 'network'
}

function kindLabel(kind: StaffKind): string {
  if (kind === 'client') return 'Client'
  if (kind === 'fabricator') return 'Fabricator'
  return 'Network'
}

export function presentBooking(booking: DccBooking): StaffRow {
  const when = [booking.start, booking.end].filter(Boolean).join(' – ')
  return {
    id: booking.id,
    title: booking.name,
    detail: [when || 'No time', booking.status].filter(Boolean).join(' · '),
  }
}

export function presentTransaction(tx: DccTransaction): StaffRow {
  const amount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(tx.amount)
  return {
    id: tx.id,
    title: tx.name,
    detail: [amount, tx.direction, tx.type, tx.paymentStatus, tx.date].filter(Boolean).join(' · '),
  }
}

function mapPerson(rec: AirtableRecord): StaffPerson {
  return {
    id: rec.id,
    name: text(rec.fields, 'Name') ?? text(rec.fields, PEOPLE.name) ?? '(unnamed person)',
    city: text(rec.fields, PEOPLE.city) ?? text(rec.fields, 'City'),
    email: text(rec.fields, 'Email') ?? text(rec.fields, PEOPLE.email),
    role: text(rec.fields, 'Role / Title'),
    operatorStage: text(rec.fields, 'Operator Stage'),
    contactCategory: text(rec.fields, PEOPLE.contactCategory),
    lifeOsPersonId: text(rec.fields, 'Life OS Person ID'),
  }
}

function text(fields: Record<string, unknown>, key: string): string | undefined {
  const value = fields[key]
  if (typeof value === 'string' && value.trim()) return value.trim()
  if (Array.isArray(value)) {
    const parts = value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    return parts.length > 0 ? parts.join(', ') : undefined
  }
  return undefined
}

function roleLabel(role: 'project_lead' | 'operator' | 'both'): string {
  if (role === 'project_lead') return 'Project lead'
  if (role === 'operator') return 'Operator'
  return 'Project lead and operator'
}
