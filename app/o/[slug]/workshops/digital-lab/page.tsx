import { DigitalLabCatalogClient } from '@/components/workshops/digital-lab-catalog/DigitalLabCatalogClient'

export default async function DigitalLabWorkshopsCatalogPage({ params: pendingParams }: {
  params: Promise<{ slug: string }>
}) {
  const params = await pendingParams
  return <DigitalLabCatalogClient slug={params.slug} />
}
