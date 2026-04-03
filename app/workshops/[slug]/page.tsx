import { redirect } from 'next/navigation'

/**
 * Canonical short path for marketing / Infra24 links.
 * Org-scoped workshop pages remain source of truth at /o/{org}/workshops/{slug}.
 */
const DEFAULT_CATALOG_ORG =
  process.env.NEXT_PUBLIC_WORKSHOP_CATALOG_ORG_SLUG || 'oolite'

export default function WorkshopCatalogRedirectPage({
  params,
}: {
  params: { slug: string }
}) {
  redirect(
    `/o/${DEFAULT_CATALOG_ORG}/workshops/${encodeURIComponent(params.slug)}`
  )
}
