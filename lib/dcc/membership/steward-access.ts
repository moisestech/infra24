import 'server-only'
import { auth } from '@clerk/nextjs/server'
import { MemberAccessError } from '@/lib/dcc/membership/profile-store'

/**
 * Explicit allowlist of Clerk subject IDs, not emails, user-editable
 * metadata or client-supplied roles. Disabled until staff verification.
 */
export async function requireDccSteward(): Promise<string> {
  const { userId } = await auth()
  if (!userId) throw new MemberAccessError(401,'sign_in_required')
  if (process.env.DCC_STEWARD_REVIEW_ENABLED !== 'true') {
    throw new MemberAccessError(503,'steward_review_not_enabled')
  }
  const ids=(process.env.DCC_STEWARD_CLERK_USER_IDS ?? '')
    .split(',').map(id=>id.trim()).filter(Boolean)
  if (!ids.includes(userId))throw new MemberAccessError(403,'staff_access_required')
  return userId
}
