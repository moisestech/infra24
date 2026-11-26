import { redirect } from 'next/navigation'

type Props = {
  searchParams?: Promise<{ source?: string }>
}

export default async function LegacyArtistIndexRedirect({ searchParams: pendingSearchParams }: Props) {
  const searchParams = await pendingSearchParams
  const params = new URLSearchParams({ pathway: 'index', source: searchParams?.source ?? 'artist-index' })
  redirect(`/dcc/signup?${params.toString()}`)
}
