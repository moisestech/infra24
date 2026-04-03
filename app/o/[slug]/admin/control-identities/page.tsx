import { ControlIdentitiesAdmin } from '@/components/display-admin/ControlIdentitiesAdmin'

export const dynamic = 'force-dynamic'

export default async function OrgControlIdentitiesPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Telegram control identities</h1>
        <ControlIdentitiesAdmin orgSlug={slug} />
      </div>
    </div>
  )
}
