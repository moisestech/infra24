import 'server-only'

/**
 * Cloudinary is the distribution layer for client-approved *public* previews.
 * Original STL / 3MF / source CAD stays in private project storage.
 *
 * A Cloudinary folder is organizational metadata, NOT an ACL.
 * An asset URL under /raw/upload/ can be fetched by anybody who knows it.
 * No URL is returned without explicit, server-configured publication approval.
 */
export const DCC_CLOUDINARY_LIBRARY_ROOT = 'dccmiami/client-projects'
const CLOUD_NAME = 'dck5rzi4h'

const validSlug = (value: string) => /^[a-z0-9-]+$/.test(value)

export function cloudinaryProjectFolders(client: string, project: string) {
  if (!validSlug(client) || !validSlug(project)) return null
  const root = `${DCC_CLOUDINARY_LIBRARY_ROOT}/${client}/${project}`
  return {
    root,
    threeDPreviews: `${root}/3d-previews`,
    approvedMedia: `${root}/approved-media`,
  }
}

/**
 * JSON environment contract:
 * DCC_APPROVED_PUBLIC_GLB_JSON={
 *   "carol-haggiag/octopus":"https://res.cloudinary.com/.../raw/upload/v123.../dccmiami/client-projects/carol-haggiag/octopus/3d-previews/v01.glb"
 * }
 *
 * An admin must record explicit permission before setting this value. Until
 * then the app continues to use its protected same-origin private STL route.
 */
export function getApprovedPublicCloudinaryGlb(client: string, project: string): string | null {
  const folders = cloudinaryProjectFolders(client, project)
  if (!folders) return null
  const raw = process.env.DCC_APPROVED_PUBLIC_GLB_JSON
  if (!raw) return null
  try {
    const entries: unknown = JSON.parse(raw)
    if (!entries || typeof entries !== 'object' || Array.isArray(entries)) return null
    const url = (entries as Record<string, unknown>)[`${client}/${project}`]
    if (typeof url !== 'string') return null
    const parsed = new URL(url)
    if (parsed.protocol !== 'https:' || parsed.hostname !== 'res.cloudinary.com') return null
    const prefix = `/${CLOUD_NAME}/raw/upload/`
    if (!parsed.pathname.startsWith(prefix)) return null
    // Cloudinary versioned delivery URLs may include /v<version>/.
    const path = parsed.pathname.slice(prefix.length).replace(/^v[0-9]+\//, '')
    if (!path.startsWith(`${folders.threeDPreviews}/`)) return null
    if (!path.toLowerCase().endsWith('.glb') || parsed.search || parsed.hash) return null
    return parsed.toString()
  } catch {
    return null
  }
}
