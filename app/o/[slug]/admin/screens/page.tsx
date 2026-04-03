import { DisplayScreensAdmin } from '@/components/display-admin/DisplayScreensAdmin'

export const dynamic = 'force-dynamic'

export default async function OrgAdminScreensPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Screens &amp; playlists</h1>
        <p className="text-muted-foreground mb-8">
          Display plane setup for smart signs. Mutations are logged to the control audit table. For
          Telegram/OpenClaw, use propose/commit with a service token (see docs).
        </p>
        <DisplayScreensAdmin orgSlug={slug} />
      </div>
    </div>
  )
}
