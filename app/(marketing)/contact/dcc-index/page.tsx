import { redirect } from 'next/navigation'

type Props = {
  searchParams?: { source?: string }
}

export default function LegacyDccIndexRedirect({ searchParams }: Props) {
  const params = new URLSearchParams({ pathway: 'index' })
  if (searchParams?.source) params.set('source', searchParams.source)
  redirect(`/dcc/signup?${params.toString()}`)
}
