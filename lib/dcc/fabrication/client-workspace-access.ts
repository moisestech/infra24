import 'server-only'
import { auth } from '@clerk/nextjs/server'

/**
 * Permission is based on the signed-in Clerk user id, never on a shared
 * proposal password, public URL, folder name or client-submitted slug.
 *
 * Server environment:
 *   DCC_FABRICATE_STAFF_CLERK_USER_IDS=user_abc,user_def
 *   DCC_CLIENT_CLERK_ACCESS_JSON={"carol-haggiag":["user_xyz"]}
 * No defaults. Missing or invalid config denies all access.
 */
function list(value: string | undefined): string[] {
  return (value ?? '').split(',').map((item) => item.trim()).filter(Boolean)
}

function clientAccessMap(value: string | undefined): Record<string, string[]> {
  if (!value) return {}
  try {
    const parsed: unknown = JSON.parse(value)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
    const result: Record<string, string[]> = {}
    for (const [key, users] of Object.entries(parsed)) {
      if (!/^[a-z0-9-]+$/.test(key) || !Array.isArray(users)) return {}
      if (!users.every((user) => typeof user === 'string' && user.startsWith('user_'))) return {}
      result[key] = users
    }
    return result
  } catch {
    return {}
  }
}

async function currentClerkId(): Promise<string | null> {
  try {
    return (await auth()).userId ?? null
  } catch {
    return null
  }
}

export async function hasDccStaffAccess(): Promise<boolean> {
  const id = await currentClerkId()
  return Boolean(id && list(process.env.DCC_FABRICATE_STAFF_CLERK_USER_IDS).includes(id))
}

export async function hasDccClientWorkspaceAccess(clientSlug: string): Promise<boolean> {
  if (!/^[a-z0-9-]+$/.test(clientSlug)) return false
  const id = await currentClerkId()
  if (!id) return false
  if (list(process.env.DCC_FABRICATE_STAFF_CLERK_USER_IDS).includes(id)) return true
  return (clientAccessMap(process.env.DCC_CLIENT_CLERK_ACCESS_JSON)[clientSlug] ?? []).includes(id)
}
