import { redirect } from 'next/navigation'

const DEFAULT_ORG = process.env.NEXT_PUBLIC_WORKSHOP_CATALOG_ORG_SLUG || 'oolite'

/**
 * Short marketing path → org-scoped catalog (single source of truth in DB).
 */
export default function WorkshopsRootRedirect() {
  redirect(`/o/${DEFAULT_ORG}/workshops`)
}
