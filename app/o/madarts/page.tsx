import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { OrganizationPageClient } from '@/components/organization/OrganizationPageClient'

export const metadata: Metadata = {
  title: 'MadArts - Creative Arts Organization',
  description: 'MadArts is a creative organization focused on video performance, digital storytelling, and multimedia arts education.',
  openGraph: {
    title: 'MadArts - Creative Arts Organization',
    description: 'MadArts is a creative organization focused on video performance, digital storytelling, and multimedia arts education.',
    images: [
      {
        url: 'https://res.cloudinary.com/dck5rzi4h/image/upload/v1760055343/smart-sign/orgs/madarts/madarts-logo-pink_nb5pgx.png',
        width: 1200,
        height: 630,
        alt: 'MadArts Logo',
      },
    ],
  },
}

export default async function MadArtsPage() {
  const supabase = getSupabaseAdmin()
  
  // Fetch the MadArts organization
  const { data: organization, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('slug', 'madarts')
    .single()

  if (error || !organization) {
    console.error('Error fetching MadArts organization:', error)
    notFound()
  }

  return (
    <OrganizationPageClient 
      organization={organization}
      initialTab="overview"
    />
  )
}
