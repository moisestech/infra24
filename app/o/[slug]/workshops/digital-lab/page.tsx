import { DigitalLabCatalogClient } from '@/components/workshops/digital-lab-catalog/DigitalLabCatalogClient'

export default function DigitalLabWorkshopsCatalogPage({
  params,
}: {
  params: { slug: string }
}) {
  return <DigitalLabCatalogClient slug={params.slug} />
}
