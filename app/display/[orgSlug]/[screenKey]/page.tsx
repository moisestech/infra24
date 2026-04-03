import { DisplayPlayerClient } from '@/app/display/[orgSlug]/[screenKey]/DisplayPlayerClient'

export const dynamic = 'force-dynamic'

export default async function DisplayPlayerPage({
  params,
  searchParams,
}: {
  params: Promise<{ orgSlug: string; screenKey: string }>
  searchParams: Promise<{ token?: string }>
}) {
  const { orgSlug, screenKey } = await params
  const sp = await searchParams
  const token = sp.token ?? null

  return <DisplayPlayerClient orgSlug={orgSlug} screenKey={screenKey} token={token} />
}
