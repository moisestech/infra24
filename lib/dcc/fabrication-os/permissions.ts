export const FABRICATION_ROLES = [
  'public',
  'client',
  'fabricator',
  'instructor',
  'estimator',
  'operations',
  'admin',
] as const

export type FabricationRole = (typeof FABRICATION_ROLES)[number]

export const FABRICATION_ACTIONS = [
  'view_public_profile',
  'view_public_class',
  'view_own_client_job',
  'view_own_enrollment',
  'view_own_payment_link',
  'view_costs',
  'view_job_margin',
  'view_internal_notes',
  'view_crm_notes',
  'view_own_payout',
  'view_any_payout',
  'approve_payout',
  'mark_payout_paid',
  'preview_quickbooks',
  'create_quickbooks',
  'update_assigned_run',
  'assign_run',
  'verify_competency',
  'approve_fabricator_profile',
  'record_attendance',
  'edit_job_through_quoted',
] as const

export type FabricationAction = (typeof FABRICATION_ACTIONS)[number]

export type PermissionSubject = {
  actorPersonId?: string
  subjectPersonId?: string
  ownsRecord?: boolean
}

const ROLE_ACTIONS: Record<FabricationRole, readonly FabricationAction[]> = {
  public: ['view_public_profile', 'view_public_class'],
  client: [
    'view_public_profile',
    'view_public_class',
    'view_own_client_job',
    'view_own_enrollment',
    'view_own_payment_link',
  ],
  fabricator: [
    'view_public_profile',
    'view_public_class',
    'view_own_payout',
    'update_assigned_run',
  ],
  instructor: [
    'view_public_profile',
    'view_public_class',
    'record_attendance',
  ],
  estimator: [
    'view_public_profile',
    'view_public_class',
    'view_costs',
    'view_job_margin',
    'view_internal_notes',
    'preview_quickbooks',
    'edit_job_through_quoted',
  ],
  operations: [
    'view_public_profile',
    'view_public_class',
    'view_costs',
    'view_job_margin',
    'view_internal_notes',
    'view_crm_notes',
    'view_any_payout',
    'update_assigned_run',
    'assign_run',
    'record_attendance',
  ],
  admin: [...FABRICATION_ACTIONS],
}

const OWN_RECORD_ACTIONS = new Set<FabricationAction>([
  'view_own_client_job',
  'view_own_enrollment',
  'view_own_payment_link',
  'view_own_payout',
  'update_assigned_run',
  'record_attendance',
])

function owns(subject?: PermissionSubject): boolean {
  if (!subject) return false
  if (subject.ownsRecord === true) return true
  return (
    Boolean(subject.actorPersonId) &&
    subject.actorPersonId === subject.subjectPersonId
  )
}

/**
 * Server-side permission check.
 * Admin and Operations skip ownership.
 * Fabricator run updates, instructor attendance, and client or payout reads require ownership.
 */
export function can(
  role: FabricationRole,
  action: FabricationAction,
  subject?: PermissionSubject
): boolean {
  if (!ROLE_ACTIONS[role].includes(action)) return false
  if (role === 'admin' || role === 'operations') return true
  if (OWN_RECORD_ACTIONS.has(action) && !owns(subject)) return false
  return true
}
