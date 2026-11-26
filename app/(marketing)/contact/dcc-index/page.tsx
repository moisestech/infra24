import { redirect } from 'next/navigation'

type Props = {
  searchParams?: Promise<{ source?: string }>
}

export default async function LegacyDccIndexRedirect({ searchParams: pendingSearchParams }: Props) {
  const searchParams = await pendingSearchParams
  const params = new URLSearchParams({ pathway: 'index' })
  if (searchParams?.source) params.set('source', searchParams.source)
  redirect(`/dcc/signup?${params.toString()}`)
}
