import type {
  ClassSession,
  CompetencyDefinition,
  CourseRef,
  Enrollment,
  FabricationJob,
  FabricationRun,
  FabricatorProfile,
  Machine,
  PaymentReference,
  Payout,
  PersonCompetency,
  PersonRef,
  PortfolioItem,
  QuoteLine,
} from '@/lib/dcc/fabrication-os/domain'

/**
 * Accounting writes happen only from an explicit staff or checkout command.
 * Page render and Airtable reads must pass nothing else.
 */
export type AccountingCommandSource = 'explicit_action'

export function assertExplicitAccountingCommand(
  source: AccountingCommandSource | 'render' | 'read'
): void {
  if (source !== 'explicit_action') {
    throw new Error('Accounting writes require an explicit command')
  }
}

export type InvoicePreviewLine = {
  label: string
  quantity: number
  unitAmount: number
  amount: number
}

export type InvoicePreview = {
  customerName: string
  lines: readonly InvoicePreviewLine[]
  currency: 'USD'
  dueDate?: string
  projectReference?: string
  materialsNote?: string
  laborNote?: string
}

export type ProviderDocument = {
  externalId: string
  documentNumber?: string
}

export type ProviderBalance = {
  externalId: string
  paidAmount: number
  balance: number
}

/**
 * Provider boundary. React components must not call these methods.
 * Implementations call assertExplicitAccountingCommand before a write.
 */
export interface PaymentProviderAdapter {
  previewInvoice(jobId: string): Promise<InvoicePreview>
  createInvoice(
    jobId: string,
    preview: InvoicePreview,
    source: AccountingCommandSource
  ): Promise<ProviderDocument>
  createSalesReceipt(
    input: {
      enrollmentId: string
      amount: number
      providerExternalId: string
    },
    source: AccountingCommandSource
  ): Promise<ProviderDocument>
  pullBalances(externalIds: readonly string[]): Promise<readonly ProviderBalance[]>
}

export interface PeopleRepository {
  getById(id: string): Promise<PersonRef | null>
  linkClerkUser(personId: string, clerkUserId: string): Promise<void>
}

export interface CoursesRepository {
  getBySlug(slug: string): Promise<CourseRef | null>
  list(): Promise<readonly CourseRef[]>
}

export interface SessionsRepository {
  getById(id: string): Promise<ClassSession | null>
  listByCourse(courseSlug: string): Promise<readonly ClassSession[]>
}

export interface EnrollmentsRepository {
  listByPerson(personId: string): Promise<readonly Enrollment[]>
  listBySession(sessionId: string): Promise<readonly Enrollment[]>
}

export interface CompetenciesRepository {
  listDefinitions(): Promise<readonly CompetencyDefinition[]>
  listForPerson(personId: string): Promise<readonly PersonCompetency[]>
}

export interface JobsRepository {
  getById(id: string): Promise<FabricationJob | null>
  listQuoteLines(jobId: string): Promise<readonly QuoteLine[]>
}

export interface RunsRepository {
  listByJob(jobId: string): Promise<readonly FabricationRun[]>
  listByMachine(machineId: string): Promise<readonly FabricationRun[]>
  listByOperator(personId: string): Promise<readonly FabricationRun[]>
}

export interface MachinesRepository {
  getById(id: string): Promise<Machine | null>
  listActive(): Promise<readonly Machine[]>
}

export interface PaymentsRepository {
  listByJob(jobId: string): Promise<readonly PaymentReference[]>
  listByEnrollment(enrollmentId: string): Promise<readonly PaymentReference[]>
}

export interface PayoutsRepository {
  listByPerson(personId: string): Promise<readonly Payout[]>
  listByJob(jobId: string): Promise<readonly Payout[]>
}

export interface PortfolioRepository {
  listByPerson(personId: string): Promise<readonly PortfolioItem[]>
  getPublicProfile(slug: string): Promise<FabricatorProfile | null>
}
