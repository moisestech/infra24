import type { DccGraphMode, DccGraphVisibility } from '@/lib/marketing/dcc-crm-graph-types'

/**
 * A private Airtable graph is not the approved public Atlas.
 * Refuse research, combined, admin and internal graph data unless staff has an
 * explicitly configured, authenticated Clerk subject allowlist.
 */
export function mayReadDccCrmGraph(
  mode: DccGraphMode,
  visibility: DccGraphVisibility,
  clerkSubject: string | null,
  env: Pick<NodeJS.ProcessEnv,'DCC_NETWORK_ADMIN_ENABLED'|'DCC_NETWORK_ADMIN_CLERK_USER_IDS'>,
): boolean {
  if (mode === 'active' && visibility === 'public') return true
  if (env.DCC_NETWORK_ADMIN_ENABLED !== 'true' || !clerkSubject) return false
  const allowed=(env.DCC_NETWORK_ADMIN_CLERK_USER_IDS??'')
    .split(',').map(x=>x.trim()).filter(Boolean)
  return allowed.includes(clerkSubject)
}
