import { redirect } from 'next/navigation'

type PageProps = { params: Promise<{ slug: string }> }

/** Alias for the studio residents / artists member directory. */
export default async function OrgResidentsPage({ params }: PageProps) {
  const { slug } = await params
  redirect(`/o/${slug}/artists`)
}
