import { redirect } from 'next/navigation'

type Props = {
  searchParams?: { source?: string }
}

export default function LegacyArtistIndexRedirect({ searchParams }: Props) {
  const params = new URLSearchParams({ pathway: 'index', source: searchParams?.source ?? 'artist-index' })
  redirect(`/dcc/signup?${params.toString()}`)
}
